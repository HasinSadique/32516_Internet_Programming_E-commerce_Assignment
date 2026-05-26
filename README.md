[Visit the live site](https://autotechsolutions.vercel.app/)

# AutoTech Solutions

AutoTech Solutions is an online e-commerce platform offering automotive electronics such as speakers, dashcams, and stereo monitors (including android and tesla-style players). Previously, the business managed orders and records using paperwork, which led to frequent mistakes and inefficiency. This website was created to digitize the order process, reduce human error, and allow customers to place orders online with cash on delivery.

---

## Steps to Run the Application Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/HasinSadique/32516_Internet_Programming_E-commerce_Assignment.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env.local` file in the root and add:
     ```
     MONGODB_URI = Added in canvas submission comments
     MONGODB_DB = Added in canvas submission comments
     ADMIN_USERNAME = Added in canvas submission comments
     ADMIN_PASSWORD = Added in canvas submission comments
     JWT_SECRET = Added in canvas submission comments
     ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser and navigate to**
   http://localhost:3000/

---

## React Components Overview

The application is architected using React components, each handling a specific piece of the UI or logic. Key components include:

- **Header:** Displays the main site navigation and brand logo, with navigation for users and quick cart access.
- **NavDrawer / CartDrawer:** Offer slide-out panels for navigation or cart details on mobile and desktop.
- **CustomerAuthNav:** Manages customer login/logout navigation and authentication state.
- **ProductList / ProductCard:** Renders a list of products and their individual info on the shop page.
- **Cart:** Handles the shopping cart UI and cash on delivery checkout process.
- **OrderHistory:** Lets users view their past orders and statuses.
- **AdminOrdersPanel:** Allows admins to manage, filter, and update all customer orders easily.
- **AdminLogoutButton:** Securely logs out an admin from the panel.
- **Reusable Inputs/Forms:** Modular form inputs for login, registration, and filtering.

---

## Key React Features Used

- **React Hooks:** Heavily utilizes `useState` for component state, `useEffect` for side effects and data fetching, and `useMemo` for optimized derived data (e.g., order sorting/filtering).
- **Context API:** The cart logic is global using a custom `CartContext` hook, allowing cart access and updates from any component.
- **Client-Side Routing:** Next.js `Link` component for navigation and fast user experience.
- **Dynamic Rendering:** Components render UI based on auth state, user role (admin/user), and live fetched data.
- **Conditional Rendering:** Responsive UI uses conditional logic to show loading states, errors, or empty states as appropriate.

---

## Technical Stack

- **Frontend:** Next.js, React.js
- **Database:** MongoDB
- **Authentication:** Bcrypt password hashing, JWT-based sessions logins
- **Styling:** Tailwind CSS
- **Routing:** Next.js App Router
- **Data:** Products and Orders stored in MongoDB
- **Deployment:** Vercel

---

## Features

- Responsive design for mobile and desktop
- Product search & filtering
- Shopping cart and cash on delivery checkout
- Admin Panel to manage products, orders and customer profiles
- Order history and tracking for customers
- Easy navigation

---

## Folder Structure

- `src/app`: All main pages and routes
- `src/components`: Reusable React components
- `src/lib`: Helper functions and logic

---

## Challenges Overcome

Developing this website required careful handling of data interaction between frontend and backend, as well as role-based UI for admins vs. customers. Managing responsive layouts for varying devices and reliable order tracking were also challenging. Implementing secure authentication and efficient state management with React hooks improved overall reliability and performance. The end result is a robust and modern solution, eliminating paperwork and reducing errors for the organization and its customers.
