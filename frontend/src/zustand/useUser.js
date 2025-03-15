import { create } from "zustand";
// zustand is used for global state management

const useChat = create((set) => ({
  branchId: "",
  setBranchId: (branchId) => set({ branchId }),
}));

export default useChat;
