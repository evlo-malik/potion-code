import { cache } from 'react';

import { cookies } from 'next/headers';

import { CookieNames } from '@/lib/storage/cookies';
import { type AuthUser, getAuthUser } from '@/server/auth/getAuthUser';
import { type AuthSession, validateSessionToken } from '@/server/auth/lucia';
import { SESSION_COOKIE_NAME } from '@/server/auth/session-cookie';

export const auth = cache(
  async (): Promise<{
    session: AuthSession | null;
    user: AuthUser | null;
  }> => {
    const c = await cookies();

    const sessionToken = c.get(SESSION_COOKIE_NAME)?.value ?? null;
    const devUser = c.get(CookieNames.devUser)?.value;

    if (!sessionToken) {
      return { session: null, user: null };
    }

    const { session, user } = await validateSessionToken(sessionToken);

    return {
      session,
      user: getAuthUser(user, devUser),
    };
  }
);

export const isAuth = async () => {
  const { session } = await auth();

  return !!session;
};

export const isNotAuth = async () => {
  const { session } = await auth();

  return !session;
};

export const authOnly = async <T extends (...args: any) => any>(
  callback: T
) => {
  if (await isAuth()) {
    return callback();
  }
};
