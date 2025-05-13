import type { LayoutProps } from '@/lib/navigation/next-types';

import { getCookie } from 'cookies-next/server';
import { cookies } from 'next/headers';

import { Main } from '@/app/(dynamic)/(main)/main';
import { AIProvider } from '@/components/ai/ai-provider';
import { isAuth } from '@/components/auth/rsc/auth';
import { DocumentPlate } from '@/components/editor/providers/document-plate';
import { PublicPlate } from '@/components/editor/providers/public-plate';
import { Panels } from '@/components/layouts/panels';
import { RightPanelType } from '@/hooks/useResizablePanel';

export default async function MainLayout({ children }: LayoutProps) {
  const session = await isAuth();

  const PlateProvider = session ? DocumentPlate : PublicPlate;

  const navCookie = await getCookie('nav', { cookies });
  const rightPanelTypeCookie = await getCookie('right-panel-type', {
    cookies,
  });

  const initialLayout = navCookie
    ? JSON.parse(navCookie)
    : { leftSize: 300, rightSize: 240 };

  const initialRightPanelType = rightPanelTypeCookie
    ? JSON.parse(rightPanelTypeCookie)
    : RightPanelType.comment;

  return (
    <div className="flex h-full min-h-dvh dark:bg-[#1F1F1F]">
      <PlateProvider>
        <AIProvider>
          <Panels
            initialLayout={initialLayout}
            initialRightPanelType={initialRightPanelType}
          >
            <Main>{children}</Main>
          </Panels>
        </AIProvider>
      </PlateProvider>
    </div>
  );
}
