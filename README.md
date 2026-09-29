# Post Composer Pro — Social Media Management SaaS

> **Tagline:** One workspace. Every social channel. Complete content control.

Post Composer Pro is a production-style, multi-tenant Social Media Management SaaS MVP designed for businesses, creators, startups, agencies, and marketing teams to orchestrate social media content, editorial reviews, automated scheduling, and performance analytics from a single unified workspace.

Built with **React, Vite, JavaScript**, and structured around a dual-tier storage architecture (**RFC-4180 CSV Engine for ₹0 offline development/Demo Mode** and **Supabase PostgreSQL with Row Level Security for production scale**).

---

## 1. Product Overview

Post Composer Pro bridges the gap between individual post creation and enterprise social operations:

- **Unified Multi-Channel Publishing:** Support for **Instagram, Facebook, LinkedIn, X (Twitter), and YouTube** (TikTok strictly excluded).
- **Workspace Isolation:** True multi-tenant workspace architecture (e.g. `Hostego`, `Personal Brand`, `Client Alpha`) with isolated posts, assets, campaigns, and team members.
- **Enterprise Approval Workflow:** Creator drafts $\rightarrow$ Submit for review $\rightarrow$ Manager approval $\rightarrow$ Automated scheduling $\rightarrow$ Publication.
- **Controlled Character Validation:** Real-time character limits enforcement (X: 280, LinkedIn: 3000, Instagram: 2200, Facebook: 5000, YouTube: 5000).
- **Zero-Budget Demo Mode:** Complete simulation of account connection, scheduling, publishing queue, and analytics telemetry without requiring paid external API credentials.
- **Strict Token Security:** React interfaces never display or expose raw OAuth tokens; tokens are presented as sanitized previews (`••••••••••••••••`).

---

## 2. Supported Platforms & Character Limits

| Platform | Channel Type | Limit | Warning Threshold | Media Support |
| :--- | :--- | :--- | :--- | :--- |
| **Instagram** | Photo, Carousel & Reel Captions | **2,200 chars** | 150 chars remaining | Images, Videos |
| **Facebook** | Page Posts & Community Updates | **5,000 chars** | 250 chars remaining | Images, Links, Videos |
| **LinkedIn** | Professional Articles & Updates | **3,000 chars** | 200 chars remaining | Images, Documents, Videos |
| **X (Twitter)** | Real-time Micro-broadcasts | **280 chars** | 25 chars remaining | Images, Polls, Videos |
| **YouTube** | Community Posts & Descriptions | **5,000 chars** | 200 chars remaining | Community Images, Videos |

*(Note: TikTok is strictly excluded across the entire codebase, UI, and documentation).*

---

## 3. Technology Stack & Architecture

```
                    POST COMPOSER PRO
                      (React + Vite)
                            │
                            ▼
                    Vercel / Cloudflare
                            │
                            ▼
                     Service Layer
         (postService, socialService, teamService)
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
    CSV Repository Layer           Supabase Repository Layer
(Safe RFC-4180 Local Engine)        (PostgreSQL + RLS Auth + Storage)
  - users.csv                        - auth.users
  - posts.csv                        - public.workspaces
  - drafts.csv                       - public.social_accounts
  - workspaces.csv                   - public.posts
  - social_accounts.csv              - public.media
  - audit_logs.csv                   - public.audit_logs
```

- **Frontend Core:** React 18, Vite 6, Modern JavaScript (ES Modules).
- **Design System:** Executive Classic Light Theme (solid surfaces, pure white `#ffffff` cards, soft neutral off-white `#f8fafc` background, crisp borders `#e2e8f0`, deep slate typography `#0f172a`, royal blue accents `#2563eb`, zero glassmorphism, zero neon glows).
- **Icons:** Lucide React.
- **Persistence (Development / Demo):** Local RFC-4180 compliant CSV parser and serializer with CSV inspector and direct file exports.
- **Persistence (Production Ready):** Supabase PostgreSQL schema with Row Level Security (RLS) policies and encrypted server-side token management.

---

## 4. Key SaaS Modules

### A. Post Composer & Live Preview
- Controlled React textarea component synchronized live with platform rules.
- Real-time character counter and remaining character indicator with warning thresholds.
- Rich utility toolbar:
  - `+ Media`: Attach assets from the Media Library.
  - `+ Hashtag`: Select curated or custom hashtag groups from the Hashtag Vault.
  - `+ Mention`: Insert handle mentions.
  - `+ Tag`: Assign organizational campaign tags.
  - `+ Location`: Append location pins.
  - `+ CTA`: Add Call-to-Action buttons.
  - `Emoji`: Quick inline curated emoji picker.
- Live sticky mockups for all 5 platforms labeled `Preview — Simulation`.

### B. Editorial Approval Workflow & Publishing Queue
- Creator drafts and submits content for review.
- Managers and Admins can **Approve**, **Reject**, or **Request Changes** with editorial feedback comments.
- Publishing queue tracks real-time dispatch statuses: `Draft`, `Pending Review`, `Approved`, `Scheduled`, `Publishing`, `Published`, `Failed`, `Cancelled`.

### C. Content Calendar
- Multi-view calendar supporting **Month**, **Week**, **Day**, and **List** formats.
- Visual status cards filtered by channel and date with instant `Publish Now` (Demo) or reschedule options.

### D. Media Library & Storage Metering
- Digital asset management for images and videos with storage utilization progress bars.
- Storage MB tracked and enforced based on workspace subscription tier.

### E. Social Channel Connection & Token Security
- Dedicated Social Accounts manager for Instagram, Facebook, LinkedIn, X, and YouTube.
- Simulates OAuth connection in Demo Mode with follower metrics.
- Token preview displays sanitized `••••••••••••••••` mask with zero client-side credential exposure.

### F. Multi-Workspace & Team Governance
- Multi-tenant workspace switcher (`Hostego`, `Personal Brand`, `Client Alpha`).
- Role-Based Access Control (RBAC): `Owner`, `Admin`, `Manager`, `Editor`, `Creator`, `Viewer`.
- Invites and team member capacity enforced against active plan limits.

### G. Subscription Tiers & Resource Quotas
- 4 Standard SaaS plans:
  1. **Free** ($0/mo): 1 workspace, 2 social accounts, 10 scheduled posts, 1 team member, 50 MB storage.
  2. **Starter** ($19/mo): 2 workspaces, 5 social accounts, 50 scheduled posts, 3 team members, 500 MB storage.
  3. **Professional** ($49/mo - Popular): 5 workspaces, 15 social accounts, 250 scheduled posts, 10 team members, 5 GB storage, Approval Workflow.
  4. **Business** ($149/mo): 25 workspaces, 50 social accounts, 1,000 scheduled posts, 50 team members, 50 GB storage, Full Audit Logging.
- Quota meters calculate real-time usage and restrict actions when limits are reached.

### H. Multi-Channel Performance Analytics
- Telemetry for **Reach, Impressions, Engagement Rate, Likes, Comments, Shares, and Clicks**.
- Channel share breakdown and 7d/30d/90d historical trends.
- Distinctly labeled `Demo Analytics — Simulated Environment`.

### I. Compliance Audit Log
- Immutable chronological log recording `User`, `Action`, `Resource`, `WorkspaceId`, and `Timestamp`.

### J. CSV Database Inspector
- Developer and demo inspector supporting all 8 datasets (`users`, `posts`, `drafts`, `workspaces`, `accounts`, `campaigns`, `media`, `audit_logs`).
- Raw RFC-4180 CSV code view, single-click CSV downloads, and seed reset.

---

## 5. Folder Structure

```text
react-post-composer-validation/
├── .env.example                       # Documented environment variables template
├── .gitignore                         # Strict exclusion of .env and secrets
├── index.html                         # Entry HTML
├── package.json                       # Dependencies & scripts
├── vite.config.js                     # Vite build configuration
├── README.md                          # SaaS Documentation
│
├── src/
│   ├── constants/
│   │   ├── platformRules.js           # Centralized limits for IG, FB, LI, X, YT
│   │   └── subscriptionPlans.js       # Free, Starter, Professional, Business limits
│   │
│   ├── providers/
│   │   ├── BaseSocialProvider.js      # Base provider abstraction
│   │   ├── MetaProvider.js            # Instagram & Facebook Graph API & demo
│   │   ├── LinkedInProvider.js        # LinkedIn Community API & demo
│   │   ├── XProvider.js               # X API v2 & demo
│   │   └── YouTubeProvider.js         # YouTube Data API v3 & demo
│   │
│   ├── repositories/
│   │   ├── csvRepository.js           # Local RFC-4180 CSV tables (workspaces, media, etc.)
│   │   └── supabaseRepository.js      # Production PostgreSQL schema & RLS policies
│   │
│   ├── services/
│   │   ├── authService.js             # User authentication & sessions
│   │   ├── workspaceService.js        # Multi-workspace isolation & switching
│   │   ├── postService.js             # Posts, drafts, approvals & scheduling
│   │   ├── socialService.js           # Account connections & masked tokens
│   │   ├── mediaService.js            # Storage MB metering & assets
│   │   ├── campaignService.js         # Campaigns, hashtag groups & tags
│   │   ├── analyticsService.js        # Telemetry KPIs & channel share
│   │   ├── teamService.js             # Team collaborators & RBAC
│   │   ├── subscriptionService.js     # Plan quota calculation & upgrades
│   │   └── notificationService.js     # In-app notification center
│   │
│   ├── components/
│   │   ├── Sidebar.jsx                # Collapsible SaaS navigation sidebar
│   │   ├── TopNavbar.jsx              # Global search, notifications & quick create
│   │   ├── Dashboard.jsx              # Executive welcome dashboard
│   │   ├── PostComposer.jsx           # Controlled composer with rich toolbars
│   │   ├── PostPreview.jsx            # Live mockups for all 5 networks
│   │   ├── CalendarView.jsx           # Month/Week/List editorial calendar
│   │   ├── PostsManager.jsx           # Publishing queue & approval workflow
│   │   ├── DraftsManager.jsx          # Drafts repository with search & duplicate
│   │   ├── MediaLibrary.jsx           # Asset manager with storage meters
│   │   ├── SocialAccountsManager.jsx  # Connected channels & masked credentials
│   │   ├── CampaignsManager.jsx       # Marketing campaigns & hashtag vaults
│   │   ├── AnalyticsView.jsx          # Engagement charts & channel share
│   │   ├── TeamManager.jsx            # Team members & role permission governance
│   │   ├── BillingView.jsx            # Usage quotas & tier upgrade cards
│   │   ├── AuditLogView.jsx           # Chronological security audit logs
│   │   ├── CsvDatabaseView.jsx        # Development CSV inspector (8 datasets)
│   │   ├── WorkspaceModal.jsx         # Multi-workspace switcher & creator
│   │   ├── UpgradeModal.jsx           # Tier selection & simulation modal
│   │   ├── AddMediaModal.jsx          # Media attachment modal
│   │   ├── HashtagsModal.jsx          # Hashtag groups insertion modal
│   │   ├── TagsModal.jsx              # Content tagging modal
│   │   ├── LocationCtaModal.jsx       # Location pin and CTA insertion modal
│   │   ├── ScheduleModal.jsx          # Date & time scheduling modal
│   │   └── AuthModal.jsx              # User login & registration modal
│   │
│   ├── utils/
│   │   ├── csvStorage.js              # RFC-4180 CSV parser & serializer
│   │   └── validation.js              # Platform limit helper
│   │
│   ├── App.jsx                        # Root SaaS controller & state conductor
│   ├── index.css                      # Executive Classic Light Theme stylesheet
│   └── main.jsx                       # React DOM entry
```

---

## 6. Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Shavitjnr/react-post-composer-validation.git

# Navigate into the project directory
cd react-post-composer-validation

# Install dependencies
npm install

# Run the local development server
npm run dev
```

The application will start at `http://localhost:5173`.

### Production Build
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 7. Demo Mode vs. Production Mode

| Capability | Demo Mode (Default, ₹0 Cost) | Production Mode |
| :--- | :--- | :--- |
| **Infrastructure Cost** | **₹0 (Free / Local / Offline)** | Supabase Free/Pro tier |
| **Authentication** | Demo session + RFC-4180 CSV users | Supabase Auth (bcrypt hashed passwords) |
| **Data Storage** | Local RFC-4180 CSV persistence | Supabase PostgreSQL + Row Level Security |
| **Media Storage** | Local simulated asset URLs | Supabase S3-compatible Storage Bucket |
| **Social API Connections** | Simulated connection with masked token | Live OAuth 2.0 PKCE flow |
| **Publishing** | Simulated release with audit trail | Live API dispatch to Meta, LinkedIn, X, YT |
| **Status Labeling** | `Demo Mode — Simulated` | `Live Production` |
| **Token Exposure** | `••••••••••••••••` (Zero exposure) | Encrypted server-side storage |

---

## 8. Environment Variables Setup

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configured variables:
```env
# Application URL
APP_URL=http://localhost:5173

# Supabase Production Backend
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Social API Credentials (Optional in Demo Mode)
META_APP_ID=
META_APP_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
X_CLIENT_ID=
X_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## 9. Security & Compliance Rules

1. **Zero Secret Leakage:** No API secrets or tokens are ever exposed to the client or committed to GitHub.
2. **Password Protection:** Plaintext passwords are never stored in production; production uses Supabase Auth.
3. **Workspace Isolation:** All queries filter on `workspace_id` to prevent cross-tenant data leaks.
4. **Transparent Simulation:** Demo Mode publishing is clearly flagged and never falsely represented as a live platform broadcast.

---

## 10. Product Roadmap

- **Phase 1 (Complete):** Core MVP with multi-workspace support, 5 platforms, controlled composer, character validation, drafts, calendar, scheduling, media, campaigns, team, billing quotas, and audit logs.
- **Phase 2 (Upcoming):** Supabase live database sync, Stripe/Razorpay automated subscription webhook integration.
- **Phase 3:** Automated AI post generation and hashtag recommendation assistant.
- **Phase 4:** White-label agency client portals with custom subdomains.
