import { useUser, useClerk } from "@clerk/react";
import { trpc } from "@/lib/trpc";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  // Clerk handles redirects via <SignedIn> / <SignedOut> mostly,
  // but we keep the options signature for compatibility.
  const { redirectOnUnauthenticated = false, redirectPath = "/sign-in" } =
    options ?? {};

  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  // Fetch our DB user via tRPC to get app-specific data like role
  const meQuery = trpc.auth.me.useQuery(undefined, {
    enabled: !!isSignedIn,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loading = !isLoaded || (isSignedIn && meQuery.isLoading);
  const isAuthenticated = isSignedIn && Boolean(meQuery.data);
  const dbUser = meQuery.data ?? null;

  // Manual redirect fallback if needed
  if (
    typeof window !== "undefined" &&
    redirectOnUnauthenticated &&
    !loading &&
    !isAuthenticated &&
    window.location.pathname !== redirectPath
  ) {
    window.location.href = redirectPath;
  }

  return {
    user: dbUser,
    loading,
    error: meQuery.error ?? null,
    isAuthenticated,
    refresh: () => meQuery.refetch(),
    logout: () => signOut({ redirectUrl: redirectPath }),
  };
}
