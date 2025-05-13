import { AuthProviderClient } from '@/components/auth/auth-provider-client';

import { auth } from './auth';

export async function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, user } = await auth();

  return (
    <AuthProviderClient session={session} user={user}>
      {children}
    </AuthProviderClient>
  );
}
