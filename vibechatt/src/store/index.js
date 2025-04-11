import { create } from "zustand";
import { createAuthSlice } from "./slice/authslice";

export const useAppStore = create()((...a)=>({
    ...createAuthSlice(...a),
}))