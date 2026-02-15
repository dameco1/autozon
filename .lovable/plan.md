

# Admin Command Center

## Overview
A protected admin dashboard at `/admin` where you can monitor and manage all platform activity. Secured via a role-based access control system — only users with the `admin` role can access it.

## Security Architecture

A `user_roles` table will store admin assignments separately from profiles (preventing privilege escalation). A `has_role()` security-definer function will power all RLS policies. Admin-specific RLS policies will grant read/write access across tables for users with the `admin` role.

Your user account will be seeded as the first admin.

## Phase 1 — What Gets Built Now (MVP Admin)

### 1. Overview Dashboard
- Total users (profiles count)
- Total cars listed (all statuses)
- Total active negotiations
- Revenue from placements (count of placement_paid = true)
- New signups over last 7/30 days
- Activity sparkline charts using Recharts

### 2. Car Management
- Table of ALL cars across all users (not just your own)
- Columns: make/model/year, owner email, price, fair value, status, placement, created date
- Actions: delete car, change status (available/sold/suspended), view detail
- Search and filter by make, status, owner

### 3. User Management
- Table of all profiles with email (from auth metadata), name, city, country, signup date
- View user's listed cars and activity
- No ability to delete users from frontend (safety measure — done via backend only)

### 4. Negotiation Monitor
- Table of all offers across the platform
- Columns: buyer, seller, car, amount, counter amount, round, status, date
- Read-only view for monitoring (no admin intervention in negotiations yet)

### 5. Activity Feed
- Recent notifications across all users (last 50)
- Recent car views and shortlists
- Provides a real-time pulse of platform activity

## Phase 2 — Future Additions (Aligned with Roadmap)

| Feature | Roadmap Phase | Description |
|---|---|---|
| Dealer approvals | V1 | Approve/reject dealer network applications |
| KYC review queue | V1.5 | Review seller identity/ownership verification documents |
| Financing oversight | V2 | Monitor financing applications, partner performance |
| Content moderation | V1 | Flag/approve car descriptions and photos |
| Revenue analytics | V2 | Stripe revenue dashboard, commission tracking |
| Platform health | V3 | Error rates, API latency, AI usage metrics |
| User roles management | V2 | Promote/demote moderators from the UI |
| Audit log | V2 | Track all admin actions (who deleted what, when) |

## Technical Plan

### Database Changes

1. **Create `user_roles` table** with enum (`admin`, `moderator`, `user`)
2. **Create `has_role()` security-definer function** for safe RLS checks
3. **Add admin-level RLS policies** on `cars`, `profiles`, `offers`, `notifications`, `car_views`, `car_shortlists` tables — allowing SELECT for admin role, and DELETE on `cars` for admin role
4. **Seed your user as admin** (you'll need to provide your user ID or we use the first registered user)

### Frontend Changes

1. **New page**: `src/pages/AdminDashboard.tsx` — tabbed layout with Overview, Cars, Users, Negotiations, Activity sections
2. **New route**: `/admin` in `App.tsx` (protected)
3. **New hook**: `src/hooks/useAdminAuth.ts` — checks `user_roles` table, redirects non-admins
4. **New components**:
   - `src/components/admin/AdminOverview.tsx` — stats cards + charts
   - `src/components/admin/AdminCarsTable.tsx` — sortable/filterable car table
   - `src/components/admin/AdminUsersTable.tsx` — user profiles list
   - `src/components/admin/AdminNegotiations.tsx` — offers monitor
   - `src/components/admin/AdminActivityFeed.tsx` — recent platform activity
5. **Navbar update**: Show "Admin" link when user has admin role

### Edge Function (Optional)

An `admin-stats` edge function could aggregate counts server-side for performance, but for MVP we'll query directly from the client using admin RLS policies — simpler and sufficient at current scale.

### File Structure

```text
src/
  hooks/
    useAdminAuth.ts          # Role check + redirect
  pages/
    AdminDashboard.tsx       # Main admin page with tabs
  components/
    admin/
      AdminOverview.tsx      # KPI cards + charts
      AdminCarsTable.tsx     # All cars table with actions
      AdminUsersTable.tsx    # All users table
      AdminNegotiations.tsx  # All offers table
      AdminActivityFeed.tsx  # Recent activity stream
```

### Estimated Scope
- 1 database migration (roles table + function + policies)
- 6 new frontend files
- 2 modified files (App.tsx route, Navbar.tsx admin link)

