import type { AIActions } from '@/components/ai/utils/ai.types';

import { useActions, useAIState, useUIState } from 'ai/rsc';

export const useMyActions = () => {
  const actions = useActions<AIActions>();
  // const documentAction = useDocumentAction()
  //
  // Object.keys(actions).forEach(key => {
  //   const action = actions[key]
  //   actions[key] = async (...args: any[]) => {
  //     // TODO: only if document is open
  //     documentAction()
  //     action(...args)
  //   }
  // })

  return actions;
};

export const useMyUIState = () => {
  return useUIState<AIActions>();
};

export const useMyAIState = () => {
  return useAIState<AIActions>();
};
