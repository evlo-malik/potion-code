'use client';

import * as React from 'react';

import type { Chat } from '@/components/ai/utils/ai.types';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icons } from '@/components/ui/icons';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/registry/default/potion-ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/registry/default/potion-ui/tooltip';

interface SidebarItemProps {
  chat: Chat;
  children: React.ReactNode;
  index: number;
}

export function SidebarItem({ chat, children, index }: SidebarItemProps) {
  const pathname = usePathname();

  const isActive = pathname === chat.path;
  const [newChatId, setNewChatId] = useLocalStorage('newChatId', null);
  const shouldAnimate = index === 0 && isActive && newChatId;

  if (!chat?.id) return null;

  return (
    <motion.div
      className="relative h-8"
      animate={shouldAnimate ? 'animate' : undefined}
      initial={shouldAnimate ? 'initial' : undefined}
      transition={{
        duration: 0.25,
        ease: 'easeIn',
      }}
      variants={{
        animate: {
          height: 'auto',
          opacity: 1,
        },
        initial: {
          height: 0,
          opacity: 0,
        },
      }}
    >
      <div className="absolute top-1 left-2 flex size-6 items-center justify-center">
        {chat.sharePath ? (
          <Tooltip delayDuration={1000}>
            <TooltipTrigger
              className="focus:bg-muted focus:ring-1 focus:ring-ring"
              tabIndex={-1}
            >
              <Icons.user className="mt-1 mr-2 text-zinc-500" />
            </TooltipTrigger>
            <TooltipContent>This is a shared chat.</TooltipContent>
          </Tooltip>
        ) : (
          <Icons.message className="mt-1 mr-2 text-zinc-500" />
        )}
      </div>
      <Link
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'group w-full px-8 transition-colors hover:bg-zinc-200/40 dark:hover:bg-zinc-300/10',
          isActive && 'bg-zinc-200 pr-16 font-semibold dark:bg-zinc-800'
        )}
        href={chat.path}
      >
        <div
          className="relative max-h-5 flex-1 overflow-hidden break-all text-ellipsis select-none"
          title={chat.title}
        >
          <span className="whitespace-nowrap">
            {shouldAnimate ? (
              chat.title.split('').map((character, index) => (
                <motion.span
                  key={index}
                  onAnimationComplete={() => {
                    if (index === chat.title.length - 1) {
                      setNewChatId(null);
                    }
                  }}
                  animate={shouldAnimate ? 'animate' : undefined}
                  initial={shouldAnimate ? 'initial' : undefined}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.25,
                    ease: 'easeIn',
                    staggerChildren: 0.05,
                  }}
                  variants={{
                    animate: {
                      opacity: 1,
                      x: 0,
                    },
                    initial: {
                      opacity: 0,
                      x: -100,
                    },
                  }}
                >
                  {character}
                </motion.span>
              ))
            ) : (
              <span>{chat.title}</span>
            )}
          </span>
        </div>
      </Link>
      {isActive && <div className="absolute top-1 right-2">{children}</div>}
    </motion.div>
  );
}
