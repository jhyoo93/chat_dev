import { create } from 'zustand';

interface UserState {
  username: string;
  setUsername: (username: string) => void;
}

const useUserStore = create<UserState>((set) => ({
  username: '',
  setUsername: (username) => set({ username }),
}));

export default useUserStore;
