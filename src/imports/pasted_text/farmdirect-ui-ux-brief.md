Create a complete, polished, modern web application UI/UX for a Smart India Hackathon software project called **FarmDirect**.

**Tagline:** “From Farm to Buyer, Direct.”

FarmDirect is a digital marketplace that directly connects farmers/FPOs with buyers such as individual customers, restaurants, hotels, grocery stores, hostels, canteens, retailers and other bulk buyers.

The application should look like a realistic startup product and a professional hackathon prototype. It must be visually impressive but simple enough to implement later using React + Vite + Supabase.

DO NOT create a complicated enterprise system.
DO NOT add unnecessary features.
Prioritize a complete working user journey and clean UI.

---

# 1. BRAND IDENTITY

Application name:
**FarmDirect**

Tagline:
**From Farm to Buyer, Direct.**

Brand personality:

* Trustworthy
* Fresh
* Agricultural
* Modern
* Transparent
* Simple
* Technology-enabled
* Farmer-friendly

Visual concept:
Combine agriculture, direct trade, technology and trust.

Use subtle agricultural visual elements such as:

* Leaf
* Farm
* Crop
* Produce
* Location
* Delivery
* Direct connection

Avoid making the design look childish or overly rural.
It should feel like a modern technology startup focused on agriculture.

---

# 2. COLOR SYSTEM

Use this exact color palette:

Primary Farm Green:
#2E7D32

Secondary Fresh Green:
#66BB6A

Background Warm Cream:
#F7F8F2

White:
#FFFFFF

Dark Charcoal Text:
#1F2937

Warning Amber:
#F59E0B

Error Red:
#DC2626

Use green mainly for:

* Primary buttons
* Active navigation
* Important highlights
* Verified indicators
* Agriculture-related visual elements

Use warm cream/light backgrounds for sections instead of making everything pure white.

Maintain strong contrast and accessibility.

---

# 3. TYPOGRAPHY

Use **Inter** throughout the application.

Typography hierarchy:

H1:
32–40px
Bold

H2:
24–30px
Bold/Semibold

H3:
20–24px
Semibold

Body:
14–16px

Small text:
12–13px

Buttons:
14–16px
Semibold

Keep typography clean and highly readable.

---

# 4. DESIGN STYLE

Create a modern SaaS/startup-style interface.

Use:

* Rounded cards
* Soft shadows
* Large whitespace
* Clean icons
* High-quality agricultural product images
* Consistent spacing
* Clear hierarchy
* Modern navigation bars
* Green accent colors
* Simple charts
* Status badges
* Product cards

Avoid:

* Excessive gradients
* Too many colors
* Crowded layouts
* Huge decorative illustrations
* Complicated dashboards
* Excessive animations

The interface should look realistic enough that an SIH judge could imagine it as a real product.

---

# 5. RESPONSIVE DESIGN

Design primarily for desktop/web application.

Use:

* Desktop layout
* Tablet-friendly structure
* Responsive cards
* Responsive navigation

Use a consistent max-width content area.

---

# 6. USER ROLES

Design the application around these roles:

### Farmer

Farmers can:

* Create profile
* Add produce
* Manage products
* Set quantity and price
* View orders
* Accept/reject orders
* Update order status
* View sales
* View smart price recommendations

### Buyer

Buyers can:

* Browse marketplace
* Search produce
* Filter products
* Compare farmers
* View farmer profiles
* Add products to cart
* Checkout
* Place orders
* Track orders
* Review farmers

### Bulk Buyer

Bulk buyers are a buyer type.

They can:

* Post bulk requirements
* Specify product
* Quantity
* Maximum price
* Required date
* Location
* Find matching farmers

### Admin

Admin can:

* View users
* Manage farmers
* Manage products
* View orders
* View analytics
* Verify farmers

---

# 7. MAIN NAVIGATION

## Farmer navigation

Dashboard
Products
Orders
Insights
Profile

## Buyer navigation

Home
Marketplace
Orders
Favorites
Profile

Include a prominent action:
**Post Bulk Requirement**

## Admin navigation

Dashboard
Farmers
Products
Orders
Analytics

---

# 8. AUTHENTICATION

Create these screens:

### Screen 1 — Splash Screen

Show:
FarmDirect logo

Tagline:
“From Farm to Buyer, Direct.”

Small agricultural illustration.

Then transition to Login.

---

### Screen 2 — Login

Title:
“Welcome to FarmDirect”

Subtitle:
“Connect directly with farmers and fresh produce.”

Fields:

* Mobile Number / Email
* Password

Buttons:

* Login
* Create Account

Include:
“Continue as Demo User”

Small text:
“New to FarmDirect? Create an account”

Clean and simple design.

---

### Screen 3 — Role Selection

Title:
“How do you want to use FarmDirect?”

Create three cards:

1. Farmer
   “Sell your produce directly”

2. Buyer
   “Buy fresh produce directly”

3. Bulk Buyer
   “Source produce in large quantities”

Each card should have:

* Icon
* Title
* Description
* Select button

---

# 9. FARMER EXPERIENCE

## Screen 4 — Farmer Dashboard

Header:
“Good morning, Ravi 👋”

Show:

* Farm name
* Verification badge
* Location

Main statistics:

Total Sales
₹42,500

Active Products
8

Pending Orders
4

Rating
4.8 ⭐

Main section:
“Your Products”

Product cards showing:

* Tomato
* Quantity
* Price
* Quality
* Status

Primary button:
**+ Add Product**

Insight card:
“Smart Price Recommendation”

Example:
Tomato
Current price: ₹28/kg
Recommended range: ₹27–₹30/kg

Small explanation:
“Based on recent marketplace demand and listing trends.”

Another card:
“Today's Demand”

Tomato demand:
High

Use a simple chart.

---

# 10. FARMER PROFILE

## Screen 5 — Farmer Profile

Show:

Profile photo/avatar

Ravi Kumar

Verified Farmer ✓

Farm:
Green Valley Farm

Location:
Doddaballapur

Experience:
8 years

Rating:
4.8 ⭐

Products:
8

Total Sales:
₹1.2L

About Farmer section.

Verification section:
“Identity Verified”
“Farm Details Verified”

Show verification badges.

---

# 11. ADD PRODUCT

## Screen 6 — Add Product

Title:
“Add New Produce”

Fields:

Product Name
Category
Quantity
Unit
Price per kg
Quality
Harvest Date
Location
Product Image

Example values:

Product:
Tomato

Quantity:
500

Unit:
kg

Price:
₹28/kg

Quality:
Grade A

Harvest Date:
18 Sep 2026

Location:
Doddaballapur

Add image button.

Primary button:
**Publish Product**

Secondary:
Save Draft

After publishing show:
“Your product is now live on the marketplace.”

---

# 12. FARMER PRODUCTS

## Screen 7 — My Products

Title:
“My Products”

Tabs:

All
Active
Low Stock
Sold Out

Each product card shows:

Image
Product name
Quantity
Price
Quality
Status
Harvest date

Actions:
Edit
Manage Stock
View

Primary button:

* Add Product

---

# 13. FARMER ORDERS

## Screen 8 — Farmer Orders

Title:
“Orders”

Tabs:

Pending
Accepted
Preparing
Completed

Order cards show:

Order ID
Buyer name
Product
Quantity
Total amount
Order date
Status

Example:

Order #FD1024

Buyer:
Green Leaf Restaurant

Tomato
300 kg

₹8,400

Status:
Pending

Button:
View Order

---

# 14. FARMER ORDER DETAILS

## Screen 9 — Farmer Order Details

Show:

Order #FD1024

Buyer:
Green Leaf Restaurant

Product:
Tomato

Quantity:
300 kg

Price:
₹28/kg

Total:
₹8,400

Delivery location:
Bengaluru

Order date:
20 Sep 2026

Payment:
Demo Payment Confirmed

Status timeline:

Order Placed
↓
Accepted
↓
Preparing
↓
In Transit
↓
Delivered

Primary button:
**Accept Order**

Secondary:
Reject

After acceptance:
Show:
“Order accepted successfully.”

Allow status progression:
Preparing
In Transit
Delivered

---

# 15. BUYER HOME

## Screen 10 — Buyer Home

Header:
“Fresh produce, directly from farmers.”

Search bar:
“Search tomatoes, onions, potatoes…”

Location:
📍 Bengaluru

Hero section:

“Fresh from local farms”

Subtitle:
“Buy directly from verified farmers.”

CTA:
**Explore Marketplace**

Show categories:

Vegetables
Fruits
Grains
Pulses
Organic

Section:
“Fresh Near You”

Product cards.

Example:
Tomatoes
₹28/kg
500 kg available
Doddaballapur
4.8 ⭐
Verified Farmer

Show:
“12 km away”

---

# 16. MARKETPLACE

## Screen 11 — Marketplace

Title:
“Marketplace”

Large search bar.

Filters:

Category
Price
Distance
Quality
Availability
Harvest Date

Sort:
Price
Distance
Newest
Popular

Product cards should show:

Product image
Tomato
₹28/kg
500 kg available
Grade A
Harvested 18 Sep
Doddaballapur
12 km away

Farmer:
Ravi Kumar ✓

Rating:
4.8 ⭐

Button:
View Details

Button:
Add to Cart

---

# 17. SEARCH RESULTS

## Screen 12 — Search Results

Search:
“Tomato”

Heading:
“Tomato available from 8 farmers”

Show multiple farmer/product cards.

Example:

Ravi Kumar
₹28/kg
500 kg
12 km
4.8 ⭐

Priya Farms
₹30/kg
350 kg
18 km
4.7 ⭐

Green Valley Farm
₹27/kg
700 kg
25 km
4.6 ⭐

Allow comparison visually.

Include:
“Compare Prices”

---

# 18. PRODUCT DETAILS

## Screen 13 — Product Details

Large product image.

Product:
Fresh Tomatoes

Price:
₹28/kg

Available:
500 kg

Quality:
Grade A

Harvest date:
18 Sep 2026

Location:
Doddaballapur

Distance:
12 km

Farmer:
Ravi Kumar ✓ Verified

Rating:
4.8 ⭐

Show quantity selector:

− 1 + kg

Buttons:

**Add to Cart**
**Buy Now**

Sections:

About this produce
Quality information
Harvest information
Farmer information

Show transparent product information clearly.

---

# 19. FARMER PROFILE FROM BUYER VIEW

## Screen 14 — Farmer Profile

Show:

Ravi Kumar ✓ Verified

Farm:
Green Valley Farm

Location:
Doddaballapur

Rating:
4.8 ⭐

Products:
8

Completed Orders:
124

About

Verification badges.

Products from this farmer.

---

# 20. CART

## Screen 15 — Cart

Title:
“Your Cart”

Product card:

Tomatoes
Ravi Kumar
500 kg available

Quantity:
10 kg

Price:
₹280

Quantity controls.

Order summary:

Subtotal
₹280

Delivery
₹40

Total
₹320

Primary button:
**Proceed to Checkout**

---

# 21. CHECKOUT

## Screen 16 — Checkout

Title:
“Checkout”

Sections:

Delivery Address

Payment Method

Order Summary

Example address:
Bengaluru, Karnataka

Payment options:

* UPI
* Card
* Cash on Delivery

For prototype, payment can be simulated.

Primary button:
**Place Order**

Show:
“Demo payment — no real money will be charged.”

---

# 22. ORDER CONFIRMATION

## Screen 17 — Order Confirmation

Large success icon.

Title:
“Order Placed Successfully!”

Order ID:
#FD1024

Product:
Tomato

Quantity:
10 kg

Total:
₹320

Estimated delivery:
Tomorrow

Buttons:

**Track Order**

**Continue Shopping**

---

# 23. ORDER TRACKING

## Screen 18 — Order Tracking

Title:
“Track Your Order”

Order:
#FD1024

Product:
Tomato

Farmer:
Ravi Kumar ✓

Create a clean horizontal/vertical progress timeline:

✓ Order Placed

✓ Accepted

● Preparing

○ In Transit

○ Delivered

Show current status clearly.

Show:

Farmer location
Delivery destination

For prototype, do not implement real GPS tracking.

Use a simple illustrative map/location card.

Button:
**Confirm Delivery**

---

# 24. REVIEW

## Screen 19 — Review

Title:
“How was your experience?”

Show farmer:

Ravi Kumar

Rating selector:
★★★★★

Comment box:
“Share your experience…”

Button:
**Submit Review**

After submission:
“Thank you for your feedback!”

---

# 25. BULK BUYER

## Screen 20 — Post Bulk Requirement

Title:
“Post Bulk Requirement”

Subtitle:
“Tell farmers what you need.”

Fields:

Product
Quantity
Maximum Price
Required Date
Delivery Location

Example:

Product:
Tomato

Quantity:
300 kg

Maximum Price:
₹30/kg

Required Date:
25 Sep 2026

Location:
Bengaluru

Button:
**Find Matching Farmers**

---

# 26. BULK MATCHING

## Screen 21 — Matching Farmers

Title:
“Matching Farmers”

Subtitle:
“Farmers matching your requirement”

Show farmer cards.

Example:

Ravi Kumar ✓
Tomato
500 kg available
₹28/kg
12 km away
4.8 ⭐

Match indicators:

✓ Quantity available
✓ Price within budget
✓ Nearby
✓ Required date available

Show a simple:
“92% Match”

Do not make this look like a complex AI dashboard.

Keep it understandable.

Button:
**Contact / Order**

---

# 27. ADMIN DASHBOARD

## Screen 22 — Admin Dashboard

Title:
“Admin Dashboard”

Statistics:

Total Farmers
1,248

Active Products
3,820

Orders
8,540

Total Marketplace Value
₹24.5L

Charts:

Orders over time

Product categories

Marketplace activity

Sections:

Recent Farmers

Recent Orders

Verification Requests

Use clean dashboard cards.

---

# 28. SMART INSIGHTS

Add a simple farmer insights section.

Title:
“Smart Market Insights”

Cards:

Smart Price Recommendation

Tomato

Current:
₹28/kg

Recommended:
₹27–₹30/kg

Demand:
High

Another card:

Demand Forecast

Tomato demand expected to increase.

Important:
This is a prototype visualization.
Do not claim that a real advanced AI model is implemented.

---

# 29. COMPONENT SYSTEM

Create reusable components/components library.

Buttons:

* Primary
* Secondary
* Outline
* Danger
* Icon

Cards:

* Product Card
* Farmer Card
* Order Card
* Statistic Card
* Insight Card
* Bulk Requirement Card

Badges:

* Verified
* Available
* Low Stock
* Pending
* Accepted
* Preparing
* In Transit
* Delivered
* Cancelled

Inputs:

* Text input
* Dropdown
* Date picker
* Number input
* Search
* Quantity selector

Navigation:

* Top navigation
* Sidebar
* Mobile navigation

---

# 30. PROTOTYPE NAVIGATION

Connect the screens so the main demo journey works.

Main flow:

Splash
→ Login
→ Role Selection

Farmer journey:

Role Selection
→ Farmer Dashboard
→ Add Product
→ Publish Product
→ My Products
→ Farmer Orders
→ Order Details
→ Accept Order
→ Preparing
→ In Transit
→ Delivered

Buyer journey:

Role Selection
→ Buyer Home
→ Marketplace
→ Search Tomato
→ Product Details
→ Add to Cart
→ Cart
→ Checkout
→ Order Confirmation
→ Order Tracking
→ Review

Bulk buyer journey:

Buyer Home
→ Post Bulk Requirement
→ Matching Farmers
→ Farmer Profile/Product
→ Order

Create clickable prototype interactions for:

* Primary buttons
* Navigation items
* Product cards
* Add to cart
* Checkout
* Place order
* Accept order
* Track order
* Review
* Bulk matching

---

# 31. IMPORTANT DEMO JOURNEY

The most important prototype flow is:

FARMER:

Login
→ Farmer Dashboard
→ Add Product
→ Tomato
→ 500 kg
→ ₹28/kg
→ Grade A
→ Publish

BUYER:

Login
→ Marketplace
→ Search Tomato
→ See Ravi Kumar's product
→ Product Details
→ Add 10 kg to Cart
→ Checkout
→ Place Order

FARMER:

Farmer Orders
→ View Order
→ Accept

BUYER:

Order Tracking
→ Preparing
→ In Transit
→ Delivered
→ Review

Make sure this journey is visually obvious and easy to demonstrate to SIH judges.

---

# 32. FIGMA FILE STRUCTURE

Create these Figma pages:

01 — Design System
02 — Authentication
03 — Farmer
04 — Buyer
05 — Bulk Buyer
06 — Admin
07 — Prototype Flow

Within Design System include:

* Colors
* Typography
* Buttons
* Cards
* Inputs
* Badges
* Icons
* Navigation
* Spacing

---

# 33. DESIGN PRIORITY

Do NOT spend excessive time designing every possible screen.

Prioritize these screens first:

1. Login
2. Farmer Dashboard
3. Add Product
4. Marketplace
5. Product Details
6. Cart
7. Checkout
8. Farmer Order Details
9. Order Tracking

These screens must look highly polished and consistent.

---

# 34. FINAL DESIGN REQUIREMENT

The final Figma design should communicate this simple story:

**Farmers list fresh produce → Buyers discover directly → Buyers compare transparent prices → Buyers order → Farmers accept → Order is tracked → Buyer reviews.**

The application should visually communicate:

Direct Farmer-to-Buyer
+
Transparent Pricing
+
Verified Farmers
+
Fresh Produce
+
Bulk Buying
+
Smart Market Insights
+
Order Tracking

Make the result feel like a real startup product that could be presented at Smart India Hackathon.

Use realistic but fictional demo data only.

Do not claim government verification, real-time GPS, real payment processing, or advanced AI unless specifically marked as prototype/future functionality.
