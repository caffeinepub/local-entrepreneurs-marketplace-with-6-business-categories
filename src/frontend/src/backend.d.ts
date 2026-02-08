import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductListing {
    id: bigint;
    name: string;
    description: string;
    entrepreneurId: bigint;
    creatorPrincipal: Principal;
    category: ProductCategory;
    price: bigint;
}
export interface ProductInquiry {
    id: bigint;
    customerName: string;
    customerContact: string;
    productId: bigint;
    entrepreneurId: bigint;
    message: string;
}
export interface EntrepreneurProfile {
    id: bigint;
    contact: string;
    businessName: string;
    description: string;
    creatorPrincipal: Principal;
    category: ProductCategory;
}
export interface ProductCategory {
    id: bigint;
    name: string;
    description: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateProduct(entrepreneurId: bigint, name: string, description: string, price: bigint, categoryId: bigint): Promise<ProductListing>;
    createOrUpdateProfile(businessName: string, contact: string, categoryId: bigint, description: string): Promise<EntrepreneurProfile>;
    createProductInquiry(productId: bigint, entrepreneurId: bigint, customerName: string, customerContact: string, message: string): Promise<ProductInquiry>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<ProductCategory>>;
    getInquiriesByEntrepreneur(entrepreneurId: bigint): Promise<Array<ProductInquiry>>;
    getProduct(productId: bigint): Promise<ProductListing>;
    getProductsByCategory(categoryId: bigint): Promise<Array<ProductListing>>;
    getProductsByEntrepreneur(entrepreneurId: bigint): Promise<Array<ProductListing>>;
    getProfile(profileId: bigint): Promise<EntrepreneurProfile>;
    getProfilesByCategory(categoryId: bigint): Promise<Array<EntrepreneurProfile>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeMarketplace(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
