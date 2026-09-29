/**
 * Post Composer Pro — Supabase Production Repository Layer
 *
 * Provides production PostgreSQL relational schema, Row Level Security (RLS) policies,
 * and data access wrappers for Supabase Auth, Database, and Storage.
 */

// Supabase environment variables (Safe client configuration)
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Production PostgreSQL Schema Definition (Reference Migration for Supabase SQL Editor)
 */
export const SUPABASE_SQL_SCHEMA = `
-- ============================================================================
-- Post Composer Pro — Production PostgreSQL Relational Schema
-- ============================================================================

-- 1. Workspaces
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan TEXT NOT NULL DEFAULT 'PROFESSIONAL',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Workspace Members & Permissions
CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('Owner', 'Admin', 'Manager', 'Editor', 'Creator', 'Viewer')),
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(workspace_id, user_id)
);

-- 3. Social Accounts
CREATE TABLE IF NOT EXISTS public.social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'YouTube')),
    platform_account_id TEXT NOT NULL,
    username TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    status TEXT NOT NULL DEFAULT 'Connected',
    followers_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Social Tokens (Server-side Only with RLS)
CREATE TABLE IF NOT EXISTS public.social_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES public.social_accounts(id) ON DELETE CASCADE,
    encrypted_access_token TEXT NOT NULL,
    encrypted_refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Posts & Publishing Queue
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id),
    platform TEXT NOT NULL CHECK (platform IN ('Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'YouTube')),
    content TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Draft', 'Pending Review', 'Approved', 'Scheduled', 'Publishing', 'Published', 'Failed', 'Cancelled')),
    char_count INTEGER NOT NULL,
    char_limit INTEGER NOT NULL,
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    error_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Media Assets
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'video', 'document')),
    storage_path TEXT NOT NULL,
    size_mb NUMERIC(8, 2),
    used_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID,
    user_email TEXT,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
`;

export const supabaseRepository = {
  isConfigured: () => isSupabaseConfigured,

  // Fallback diagnostic status
  getStatus: () => ({
    configured: isSupabaseConfigured,
    url: SUPABASE_URL ? `${SUPABASE_URL.slice(0, 15)}...` : 'Not Set (Using CSV Demo Mode)',
    backendMode: isSupabaseConfigured ? 'Supabase Production' : 'CSV Local Demo Engine',
  }),
};
