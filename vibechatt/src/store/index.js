import { create } from "zustand";
import { createAuthSlice } from "./slice/authslice";
import { createChatSlice } from "./slice/chat-slice";

export const useAppStore = create()((...a)=>({
    ...createAuthSlice(...a),
    ...createChatSlice(...a),
}))