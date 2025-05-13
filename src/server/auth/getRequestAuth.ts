import type { NextRequest } from 'next/server';

import { CookieNames } from '@/lib/storage/cookies';
import { SESSION_COOKIE_NAME } from '@/server/auth/session-cookie';

import { type AuthUser, getAuthUser } from './getAuthUser';
import { type AuthSession, validateSessionToken } from './lucia';

export const getRequestAuth = async (
  request: NextRequest
): Promise<{
  session: AuthSession | null;
  user: AuthUser | null;
}> => {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
  const devUser = request.cookies.get(CookieNames.devUser)?.value;

  if (!sessionToken) {
    return { session: null, user: null };
  }

  const { session, user } = await validateSessionToken(sessionToken);

  return {
    session,
    user: getAuthUser(user, devUser),
  };
};
