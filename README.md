# 🏍️ Fake Rider Motorparts - Appointment System Setup

This application is built with Vanilla HTML/JS and uses **Supabase** for Backend-as-a-Service (Auth, Database, RLS).

## 🚀 Supabase Setup Instructions

Follow these steps to get the backend running:

### 1. Create a Supabase Project
- Go to [Supabase.com](https://supabase.com) and create a new project.
- Once created, go to **Project Settings > API**.
- Copy your `Project URL` and `Anon Key`.

### 2. Configure Database Schema
- Open the **SQL Editor** in your Supabase Dashboard.
- Copy the contents from `/database_setup.sql` (found in this project).
- Paste it into the SQL Editor and click **Run**.
- This will create:
  - `profiles` table (for roles)
  - `services` table (pre-populated with sample services)
  - `appointments` table
  - **RLS Policies** to keep data secure.
  - A **Database Trigger** that automatically creates a profile when a user signs up.

### 3. Connect the App
- Open `/supabase.js` in this project.
- Replace the placeholders with your actual keys:
  ```javascript
  const SUPABASE_URL = 'https://your-project.supabase.co';
  const SUPABASE_ANON_KEY = 'your-anon-key';
  ```

### 4. Upload Assets
- Upload your logo image and rename it to `logo.png` in the root directory. This will be used in the navbar and login/register pages.

### 5. Enable Authentication
- Go to **Authentication > Providers** in Supabase.
- Ensure **Email/Password** is enabled.
- (Optional) Disable "Confirm Email" if you want to test login immediately after registration without verifying email.

---

## 🛠️ Roles and Access

- **Customer:** Default role. Can book services, view their own history, and receive notes from mechanics.
- **Admin/Staff:** Can view all scheduled jobs, update status (Pending -> In Progress -> Completed), and add staff notes for customers.
- **To make a user an Admin:** 
  - Manually update their `role` to 'admin' in the `profiles` table via the Supabase Table Editor.

## ✨ Styling Features
- **Sporty Theme:** Uses #FFC107 (Yellow) and #000000 (Black).
- **Responsive:** Mobile-first design for riders booking on the go.
- **Real-time:** Ready for Supabase Realtime if you decide to extend the dashboard.
