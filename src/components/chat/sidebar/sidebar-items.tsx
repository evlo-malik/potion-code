'use client';

import type { Chat } from '@/components/ai/utils/ai.types';

import { AnimatePresence, motion } from 'framer-motion';

import { SidebarItem } from '@/components/chat/sidebar/sidebar-item';

interface SidebarItemsProps {
  chats?: Chat[];
}

export function SidebarItems({ chats }: SidebarItemsProps) {
  if (!chats?.length) return null;

  return (
    <AnimatePresence>
      {chats.map(
        (chat, index) =>
          chat && (
            <motion.div
              key={chat?.id}
              exit={{
                height: 0,
                opacity: 0,
              }}
            >
              <SidebarItem chat={chat} index={index}>
                {' '}
                {/* <SidebarActions
                  chat={chat}
                  removeChat={removeChat}
                  shareChat={shareChat}
                /> */}
              </SidebarItem>
            </motion.div>
          )
      )}
    </AnimatePresence>
  );
}
