import React, { useEffect } from 'react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
  useClerk
} from '@clerk/clerk-react';
import { ShieldCheck, LogIn, UserPlus, LogOut } from 'lucide-react';

export function ClerkNavControls({ hasClerkConfigured }) {
  if (!hasClerkConfigured) {
    return (
      <div className="clerk-pill-status" title="Clerk App: app_2x4ppxeV4SGTzXnsNcxbK8HRpSB">
        <span className="clerk-dot" />
        <span className="clerk-label">Clerk Ready</span>
      </div>
    );
  }

  return (
    <div className="clerk-auth-cluster">
      <SignedOut>
        <SignInButton mode="modal">
          <button type="button" className="btn-clerk-signin">
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button type="button" className="btn-clerk-signup">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </SignUpButton>
      </SignedOut>

      <SignedIn>
        <div className="clerk-user-button-wrap">
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8 rounded-full border border-slate-200'
              }
            }}
          />
        </div>
      </SignedIn>
    </div>
  );
}

export function ClerkSidebarUser({ hasClerkConfigured, fallbackUser, onLogout }) {
  if (!hasClerkConfigured) {
    return null;
  }

  return (
    <SignedIn>
      <ClerkUserProfile />
    </SignedIn>
  );
}

function ClerkUserProfile() {
  const { user } = useUser();
  if (!user) return null;

  return (
    <div className="sidebar-user-footer clerk-authenticated">
      <div className="clerk-avatar-slot">
        <UserButton />
      </div>
      <div className="user-details-text">
        <span className="user-display-name">{user.fullName || user.username || 'Clerk User'}</span>
        <span className="user-email-caption">{user.primaryEmailAddress?.emailAddress || ''}</span>
      </div>
    </div>
  );
}

/**
 * ClerkUserBridge: Syncs active Clerk user and organization ID up to App state
 */
export function ClerkUserBridge({ hasClerkConfigured, onSyncClerkState }) {
  if (!hasClerkConfigured) return null;
  return <ClerkBridgeInternal onSyncClerkState={onSyncClerkState} />;
}

function ClerkBridgeInternal({ onSyncClerkState }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        // Collect organization memberships if any
        const orgMemberships = user.organizationMemberships || [];
        const primaryEmail = user.primaryEmailAddress?.emailAddress || '';
        onSyncClerkState({
          isSignedIn: true,
          user: {
            id: user.id,
            name: user.fullName || user.username || primaryEmail.split('@')[0] || 'Clerk User',
            email: primaryEmail,
            username: user.username || '',
            organizationMemberships: orgMemberships,
            orgId: orgMemberships[0]?.organization?.id || null,
            primaryEmailAddress: user.primaryEmailAddress,
            emailAddresses: user.emailAddresses || []
          },
          signOut: () => signOut()
        });
      } else {
        onSyncClerkState({
          isSignedIn: false,
          user: null,
          signOut: () => signOut()
        });
      }
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
}

