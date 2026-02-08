import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  public type UserProfile = {
    name : Text;
    email : Text;
  };

  public type ProductCategory = {
    id : Nat;
    name : Text;
    description : Text;
  };

  module Category {
    public func compare(category1 : ProductCategory, category2 : ProductCategory) : Order.Order {
      Nat.compare(category1.id, category2.id);
    };
  };

  public type EntrepreneurProfile = {
    id : Nat;
    creatorPrincipal : Principal;
    businessName : Text;
    contact : Text;
    category : ProductCategory;
    description : Text;
  };

  public type ProductListing = {
    id : Nat;
    creatorPrincipal : Principal;
    entrepreneurId : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : ProductCategory;
  };

  public type ProductInquiry = {
    id : Nat;
    productId : Nat;
    entrepreneurId : Nat;
    customerName : Text;
    customerContact : Text;
    message : Text;
  };

  // Marketplace state
  var nextProfileId = 0;
  var nextProductId = 0;
  var nextInquiryId = 0;

  let productCategories = Map.empty<Nat, ProductCategory>();
  let entrepreneurProfiles = Map.empty<Nat, EntrepreneurProfile>();
  let productListings = Map.empty<Nat, ProductListing>();
  let productInquiries = Map.empty<Nat, ProductInquiry>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management (Required by instructions)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Categories Management (Public)
  public query ({ caller }) func getCategories() : async [ProductCategory] {
    productCategories.values().toArray().sort();
  };

  // Entrepreneur Profile Management
  public shared ({ caller }) func createOrUpdateProfile(businessName : Text, contact : Text, categoryId : Nat, description : Text) : async EntrepreneurProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only entrepreneurs can manage profiles");
    };

    let category = switch (productCategories.get(categoryId)) {
      case (null) { Runtime.trap("Category not found") };
      case (?c) { c };
    };

    let profile : EntrepreneurProfile = {
      id = nextProfileId;
      creatorPrincipal = caller;
      businessName;
      contact;
      category;
      description;
    };

    entrepreneurProfiles.add(nextProfileId, profile);
    nextProfileId += 1;
    profile;
  };

  public query ({ caller }) func getProfile(profileId : Nat) : async EntrepreneurProfile {
    switch (entrepreneurProfiles.get(profileId)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getProfilesByCategory(categoryId : Nat) : async [EntrepreneurProfile] {
    let filtered = entrepreneurProfiles.values().filter(
      func(profile) { profile.category.id == categoryId }
    );
    filtered.toArray();
  };

  // Product Listings Management
  public shared ({ caller }) func createOrUpdateProduct(entrepreneurId : Nat, name : Text, description : Text, price : Nat, categoryId : Nat) : async ProductListing {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only entrepreneurs can manage products");
    };

    // Only allow product creation if the caller is the controller of the entrepreneur profile
    let entrepreneur = switch (entrepreneurProfiles.get(entrepreneurId)) {
      case (null) { Runtime.trap("Entrepreneur not found") };
      case (?v) { v };
    };

    if (caller != entrepreneur.creatorPrincipal) {
      Runtime.trap("Unauthorized: Only the entrepreneur creator can add products");
    };

    let category = switch (productCategories.get(categoryId)) {
      case (null) { Runtime.trap("Category not found") };
      case (?v) { v };
    };

    let product : ProductListing = {
      id = nextProductId;
      creatorPrincipal = caller;
      entrepreneurId;
      name;
      description;
      price;
      category;
    };

    productListings.add(nextProductId, product);
    nextProductId += 1;
    product;
  };

  public query ({ caller }) func getProduct(productId : Nat) : async ProductListing {
    switch (productListings.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getProductsByEntrepreneur(entrepreneurId : Nat) : async [ProductListing] {
    let filtered = productListings.values().filter(
      func(product) { product.entrepreneurId == entrepreneurId }
    );
    filtered.toArray();
  };

  public query ({ caller }) func getProductsByCategory(categoryId : Nat) : async [ProductListing] {
    let filtered = productListings.values().filter(
      func(product) { product.category.id == categoryId }
    );
    filtered.toArray();
  };

  // Product Inquiries (Customer Interest)
  // Allows unauthenticated users (guests) to submit inquiries per implementation plan
  public shared ({ caller }) func createProductInquiry(productId : Nat, entrepreneurId : Nat, customerName : Text, customerContact : Text, message : Text) : async ProductInquiry {
    // Verify product exists
    switch (productListings.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {};
    };

    // Verify entrepreneur exists
    switch (entrepreneurProfiles.get(entrepreneurId)) {
      case (null) { Runtime.trap("Entrepreneur not found") };
      case (?_) {};
    };

    let inquiry : ProductInquiry = {
      id = nextInquiryId;
      productId;
      entrepreneurId;
      customerName;
      customerContact;
      message;
    };

    productInquiries.add(nextInquiryId, inquiry);
    nextInquiryId += 1;
    inquiry;
  };

  // Only the entrepreneur who owns the profile can view their inquiries
  public query ({ caller }) func getInquiriesByEntrepreneur(entrepreneurId : Nat) : async [ProductInquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view inquiries");
    };

    // Verify the caller owns this entrepreneur profile
    let entrepreneur = switch (entrepreneurProfiles.get(entrepreneurId)) {
      case (null) { Runtime.trap("Entrepreneur not found") };
      case (?v) { v };
    };

    if (caller != entrepreneur.creatorPrincipal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view inquiries for your own business");
    };

    let filtered = productInquiries.values().filter(
      func(inquiry) { inquiry.entrepreneurId == entrepreneurId }
    );
    filtered.toArray();
  };

  // Marketplace Initialization (Admin Only)
  public shared ({ caller }) func initializeMarketplace() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize the marketplace");
    };

    // Seed categories
    let categories = List.fromArray<ProductCategory>([
      { id = 0; name = "Fashion & Accessories"; description = "Clothing, jewelry, bags, and other fashion products" },
      { id = 1; name = "Handmade Crafts"; description = "Artisanal products, home decor, DIY items" },
      { id = 2; name = "Food & Beverages"; description = "Homemade food, snacks, beverages" },
      { id = 3; name = "Beauty & Personal Care"; description = "Cosmetics, skincare, personal care products" },
      { id = 4; name = "Art & Design"; description = "Paintings, sculptures, graphic design services" },
      { id = 5; name = "Technology & Gadgets"; description = "Electronic products, tech accessories, software services" },
    ]);

    categories.forEach(
      func(category) {
        productCategories.add(category.id, category);
      }
    );
  };
};
