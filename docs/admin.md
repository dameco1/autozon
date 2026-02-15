# Admin Command Center

## Overview

The Admin Command Center (`/admin`) is a role-protected dashboard for monitoring and managing all platform activity. Only users with the `admin` role in the `user_roles` table can access it.

## Security Architecture

### Role-Based Access Control (RBAC)

- **`user_roles` table**: Stores role assignments separately from `profiles` to prevent privilege escalation
- **`app_role` enum**: `admin`, `moderator`, `user`
- **`has_role()` function**: A `SECURITY DEFINER` function that checks roles without triggering RLS recursion
- **Admin RLS policies**: Added to `cars`, `profiles`, `offers`, `notifications`, `car_views`, `car_shortlists` — granting full SELECT access and DELETE on `cars` for admin role

### Access Control Flow

```
User logs in → useAdminAuth hook → Query user_roles table
                                         ↓
                                   Has admin role?
                                  /              \
                                Yes               No
                                 ↓                 ↓
                          Show Admin UI     Redirect to /dashboard
```

### Navbar Integration

The `useIsAdmin()` hook performs a lightweight role check. If the user is an admin, a 🛡️ Admin button appears in the navbar (desktop and mobile).

## Dashboard Tabs

### 1. Overview (`AdminOverview.tsx`)
- **Total Users** — count from `profiles`
- **Total Cars** — count from `cars` (all statuses)
- **Active Negotiations** — count of `offers` with status `pending`
- **Paid Placements** — count of `cars` where `placement_paid = true`
- **Signup Chart** — 7-day sparkline using Recharts `AreaChart`

### 2. Cars (`AdminCarsTable.tsx`)
- Full table of ALL cars across all users
- **Columns**: make/model/year, price, fair value, status, placement, created date
- **Actions**: 
  - Inline status change (available → sold → suspended)
  - Delete car
  - View detail (opens `/car/:id` in new tab)
- **Filters**: Search by make/model, filter by status

### 3. Users (`AdminUsersTable.tsx`)
- All profiles with name, city, country, join date
- Read-only (no delete from frontend for safety)

### 4. Negotiations (`AdminNegotiations.tsx`)
- All offers across the platform
- **Columns**: offer amount, counter amount, agreed price, round/max, status, date
- Read-only monitoring view

### 5. Activity (`AdminActivityFeed.tsx`)
- Merged feed from 3 sources:
  - Recent notifications (all users)
  - Recent car views
  - Recent car shortlists
- Sorted by most recent, capped at 50 items
- Icons: 🔔 notifications, 👁️ views, ⭐ shortlists

## File Structure

```
src/
  hooks/
    useAdminAuth.ts          # Role check + redirect (useAdminAuth + useIsAdmin)
  pages/
    AdminDashboard.tsx       # Main admin page with tabbed layout
  components/
    admin/
      AdminOverview.tsx      # KPI cards + signup chart
      AdminCarsTable.tsx     # All cars table with actions
      AdminUsersTable.tsx    # All users table
      AdminNegotiations.tsx  # All offers table
      AdminActivityFeed.tsx  # Recent activity stream
```

## Database Objects

### Table: `user_roles`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK → `auth.users(id)` ON DELETE CASCADE |
| `role` | `app_role` enum | `admin`, `moderator`, `user` |
| — | — | UNIQUE(user_id, role) |

### Function: `has_role(uuid, app_role) → boolean`
- `SECURITY DEFINER` — bypasses RLS
- Used in all admin RLS policies
- `STABLE` — safe for query optimization

## Phase 2 Roadmap

| Feature | Phase | Description |
|---|---|---|
| Dealer approvals | V1 | Approve/reject dealer network applications |
| KYC review queue | V1.5 | Review seller identity/ownership verification |
| Content moderation | V1 | Flag/approve car descriptions and photos |
| Revenue analytics | V2 | Stripe revenue dashboard, commission tracking |
| User roles management | V2 | Promote/demote moderators from the UI |
| Audit log | V2 | Track all admin actions (who did what, when) |
| Platform health | V3 | Error rates, API latency, AI usage metrics |
