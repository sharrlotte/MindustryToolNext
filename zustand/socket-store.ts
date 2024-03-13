import SocketClient from '@/types/data/SocketClient';
import { create } from 'zustand';

export type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

type SocketStore = {
  socket?: SocketClient;
  setSocket: (socket: SocketClient) => void;
  authState: AuthState;
  setAuthState: (state: AuthState) => void;
};

const useSocketStore = create<SocketStore>((set) => ({
  socket: undefined,
  setSocket: (socket: SocketClient) => set({ socket }),
  authState: 'loading',
  setAuthState: (authState) => set({ authState }),
}));

export default useSocketStore;
