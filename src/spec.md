# Specification

## Summary
**Goal:** Build a v1 local entrepreneurs marketplace where customers can browse ~6 business categories and products, and entrepreneurs can sign in to manage seller profiles, product listings, and customer inquiries.

**Planned changes:**
- Create a Motoko backend data model and APIs for categories (~6 initialized), seller profiles, product listings, and inquiries (interest/order requests), with stable storage persistence.
- Add Internet Identity authentication for entrepreneur-only actions (create/update seller profile; create/update/delete products; view/resolve inquiries) while keeping browsing public.
- Build customer-facing pages: home (purpose + hero), category list/navigation, product browsing with category filter, product detail, and seller profile with that seller’s products.
- Build an entrepreneur dashboard to manage seller profile fields (business name, description, category, contact info) and product fields (title, description, category, price, optional image URL), plus inquiry listing and “resolved” status.
- Apply a cohesive, responsive visual theme (English UI text) with a non-blue/purple primary look and consistent layout across screens.
- Include generated static brand assets (logo + hero illustration) stored in `frontend/public/assets/generated` and referenced by the frontend.

**User-visible outcome:** Visitors can browse categories, sellers, and products and submit interest messages on product pages; entrepreneurs can sign in with Internet Identity to publish and manage their storefront, listings, and handle customer inquiries.
