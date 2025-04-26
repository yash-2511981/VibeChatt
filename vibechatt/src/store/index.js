import { create } from "zustand";
import { createAuthSlice } from "./slice/authslice";
import { createChatSlice } from "./slice/chat-slice";
import createCallSlice from "./slice/call-slice";

export const useAppStore = create()((...a)=>({
    ...createAuthSlice(...a),
    ...createChatSlice(...a),
    ...createCallSlice(...a),
}))

export const initializeSocketInStore = (socketInstance) => {
    useAppStore.setState({ socket: socketInstance });
  };