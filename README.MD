# NeighboFix

NeighboFix is a role-based home services platform designed for customers, providers, and admins. It streamlines service booking, management, and communication in a professional and user-friendly interface.

## 🔐 Role-Based Access

### 👤 Customer
- View and book services with verified/non-verified provider tags.
- Filter services by category or other options.
- View profile, recent bookings, and all bookings.
- Chat with service providers.
- Create service reviews.
- Cancel booked jobs.
- Add favorite services.
- Receive real-time notifications.

### 🧑‍🔧 Provider
- Create and manage services.
- View all and recent bookings.
- Accept or reject bookings.
- View analytics: completed jobs, revenue.
- See customer feedback (anonymous).
- Earnings view (Cash and Card - via Razorpay).
- Real-time notifications from customers and admin.

### 🛠 Admin
- View total earnings with 15% commission per booking.
- Access admin dashboard with:
  - Monthly earnings analytics.
  - Provider earnings breakdown.
  - Overview and recent transactions.
- View and respond to contact messages using Nodemailer.
- Verify/unverify providers.
- Role-based access and control.

## ✨ Features Overview

- 🔄 **Role-based authentication** (JWT-secured).
- 💳 **Razorpay Integration** for **card** payments.
- 💬 **Messaging system** for customer-provider communication.
- 🧾 **Invoice generation** after service completion.
- 📈 **Analytics dashboard** for both Admin and Providers.
- 🧠 **Smart service filtering**.
- 📩 **Notification system**.
- ⚡ Fully responsive UI.

## 💳 Payment Methods

- ✅ **Cash** on service completion.
- ✅ **Card Payments** via **[Razorpay](https://razorpay.com)** (Tested & Live Ready):
  - 🔐 Secure checkout interface.
  - 🧾 Auto-generates **transaction ID**.
  - 📄 Automatically creates **invoice** and calculates **commission (15%)** for admin.



## 📂 Folder Structure
```
project-root/
├── backend/
├── frontend/
```

## 🚀 Deployment
- Frontend hosted on Vercel.
- Backend hosted on Render.
- Razorpay used for secure card payments (Test Mode)



## 📬 Contact
For support, email: aringale17@gmail.com

---

© 2025 NeighboFix. All rights reserved. All rights are owned and maintained by the creator.
