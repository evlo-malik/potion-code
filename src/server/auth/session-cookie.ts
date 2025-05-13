import { cookies } from 'next/headers';

import { env } from '@/env';

export const SESSION_COOKIE_NAME = 'session';

const getDomainFromUrl = (url: string) => {
  if (env.NEXT_PUBLIC_ENVIRONMENT === 'production') {
    const parts = url.split('.');

    return parts.length > 1 ? `.${parts.slice(-2).join('.')}` : undefined;
  }

  return;
};

export const createSessionCookie = (sessionToken: string, expiresAt: Date) => {
  return {
    attributes: {
      domain: getDomainFromUrl(env.NEXT_PUBLIC_SITE_URL),
      expires: expiresAt,
      httpOnly: true,
      path: '/',
      sameSite:
        env.NEXT_PUBLIC_ENVIRONMENT === 'development'
          ? ('lax' as const)
          : ('none' as const),
      secure: env.NEXT_PUBLIC_ENVIRONMENT === 'production',
    },
    name: SESSION_COOKIE_NAME,
    value: sessionToken,
  };
};

export const setSessionCookie = async (
  sessionToken: string,
  expiresAt: Date
) => {
  const cookie = createSessionCookie(sessionToken, expiresAt);

  (await cookies()).set(cookie.name, cookie.value, cookie.attributes);
};

export const createBlankSessionCookie = () => {
  return {
    attributes: {
      domain: getDomainFromUrl(env.NEXT_PUBLIC_SITE_URL),
      httpOnly: true,
      maxAge: 0,
      path: '/',
      sameSite: env.NEXT_PUBLIC_ENVIRONMENT === 'development'
        ? ('lax' as const)
        : ('none' as const),
      secure: env.NEXT_PUBLIC_ENVIRONMENT === 'production',
    },
    name: SESSION_COOKIE_NAME,
    value: '',
  };
};

export const deleteSessionCookie = async () => {
  const cookie = createBlankSessionCookie();

  (await cookies()).set(cookie.name, cookie.value, cookie.attributes);
};
