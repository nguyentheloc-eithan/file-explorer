import { create } from 'zustand';

interface ITriggerRefresh {
  refreshHome: boolean;
  setRefreshHome: (isRefresh: boolean) => void;

  refreshRecent: boolean;
  setRefreshRecent: (isRefresh: boolean) => void;

  refreshStarred: boolean;
  setRefreshStarred: (isRefresh: boolean) => void;

  refreshTrash: boolean;
  setRefreshTrash: (isRefresh: boolean) => void;
}

export const useTriggerRefresh = create<ITriggerRefresh>((set) => ({
  refreshHome: false,
  setRefreshHome: (isRefresh) => set({ refreshHome: isRefresh }),

  refreshRecent: false,
  setRefreshRecent: (isRefresh) => set({ refreshRecent: isRefresh }),

  refreshStarred: false,
  setRefreshStarred: (isRefresh) => set({ refreshStarred: isRefresh }),

  refreshTrash: false,
  setRefreshTrash: (isRefresh) => set({ refreshTrash: isRefresh }),
}));
export const refreshHandler = (ak: string) => {
  const {
    setRefreshHome,
    setRefreshRecent,
    setRefreshStarred,
    setRefreshTrash,
  } = useTriggerRefresh.getState();

  switch (ak) {
    case 'home':
      setRefreshHome(true);
      break;
    case 'recent':
      setRefreshRecent(true);
      break;
    case 'starred':
      setRefreshStarred(true);
      break;
    case 'trash':
      setRefreshTrash(true);
      break;
    default:
      console.warn(`Invalid refresh key: ${ak}`);
  }
};
