# SaaS Architecture Overview

## Tables

| -------------------- |
| onboarding |
| projects |
| organizations |
| organization_members |
| organization_invites |

### onboarding

| column_name | data_type |
| ----------- | --------- |
| id          | uuid      |
| client_id   | uuid      |
| data        | jsonb     |
| status      | text      |

### projects

| column_name     | data_type |
| --------------- | --------- |
| client_id       | uuid      |
| created_by      | uuid      |
| organization_id | uuid      |
| id              | uuid      |
| manager_id      | uuid      |
| name            | text      |
| description     | text      |

### organizations

| column_name | data_type                |
| ----------- | ------------------------ |
| id          | uuid                     |
| created_at  | timestamp with time zone |
| name        | text                     |

### organization_members

| column_name     | data_type                |
| --------------- | ------------------------ |
| id              | uuid                     |
| organization_id | uuid                     |
| user_id         | uuid                     |
| created_at      | timestamp with time zone |
| role            | text                     |

### organization_invites

| column_name     | data_type                |
| --------------- | ------------------------ |
| id              | uuid                     |
| organization_id | uuid                     |
| expires_at      | timestamp with time zone |
| created_at      | timestamp with time zone |
| invited_by      | uuid                     |
| email           | text                     |
| role            | text                     |
| token           | text                     |

## Auth Flow

1. User signs up using Supabase Auth.
2. After signup, an organization is created.
3. User is inserted into members table as owner.
4. On login, user session is validated using Supabase session.

## Invite Flow

1. Owner creates invite.
2. Invite stored in invites table with token.
3. User clicks invite link.
4. Token is validated.
5. User inserted into members table.
6. Invite marked as used.

## Row Level Security (RLS)

### organization_invites

Policies:

1. admins can manage invites (ALL)

Admins (users with role = 'admin' in organization_members) can:

- create invites
- update invites
- delete invites
- read invites

Condition:
User must belong to the same organization and have role = admin.

2. anyone can read invite by token (SELECT)

Public users can read an invite record only when:

- token IS NOT NULL

Used for invite acceptance flow (unauthenticated access via token link).

---

### projects

Policies:

1. admins and managers can create projects (INSERT)

Users can create projects if:

- they belong to the organization
- their role is either 'admin' or 'manager'

2. org members can access projects (ALL)

Any organization member can:

- read projects
- update projects
- delete projects

Condition:
User must be present in organization_members for the same organization_id.

---

### organizations

RLS is currently disabled.

Policies:

- allow org creation during signup (INSERT)
- org members can read org (SELECT)

Meaning:

- Any authenticated user can create an organization during onboarding.
- Only organization members can read organization data.

---

### organization_members

RLS is currently disabled.

This table is accessible via Data API.

Used internally to:

- determine roles
- validate access for projects and invites
