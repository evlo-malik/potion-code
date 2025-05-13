'use client';

import { useEffect } from 'react';

import { LoginModal } from '@/components/auth/login-modal';
import { VersionHistoryModal } from '@/components/context-panel/version-history/version-history-modal';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { DiscardModal } from '@/components/modals/discard-modal';
import { createPushModal } from '@/components/modals/push-modal';
import {
  useAppSet,
  useAppState,
  useAppValue,
} from '@/components/providers/app-provider';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { useMounted } from '@/registry/default/hooks/use-mounted';

import { ExportDialog } from '../navbar/export-dialog';
import { ImportDialog } from '../navbar/import-dialog';
import { SettingsModal } from '../settings/settings-modal';

export const {
  ModalProvider,
  popAllModals,
  popModal,
  pushModal,
  useOnPushModal,
} = createPushModal({
  modals: {
    Confirm: { Component: ConfirmModal, Wrapper: AlertDialog as any },
    Discard: { Component: DiscardModal, Wrapper: AlertDialog as any },
    Export: ExportDialog,
    Import: ImportDialog,
    Login: LoginModal,
    Settings: SettingsModal,
    VersionHistory: VersionHistoryModal,
  },
});

export const StaticModalProvider = () => {
  const isStatic = useAppValue('isStatic');

  if (!isStatic) return null;

  return <ModalProvider />;
};

function DynamicModal() {
  const mounted = useMounted();
  const setIsDynamic = useAppSet('isDynamic');

  useEffect(() => {
    if (mounted) {
      setIsDynamic(true);
    }
  }, [mounted, setIsDynamic]);

  return <ModalProvider />;
}

export const DynamicModalProvider = () => {
  const [isStatic, setIsStatic] = useAppState('isStatic');

  useEffect(() => {
    setIsStatic(false);
  }, [setIsStatic]);

  if (isStatic) return null;

  return <DynamicModal />;
};
