export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    allContacts: [],
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessage: (selectedChatMessages) => set({ selectedChatMessages }),
    closeChat: () => set({ selectedChatData: undefined, selectedChatType: undefined, selectedChatMessages: [] }),
    setContactList: (allContacts) => set({ allContacts }),
    addMessage: (msg) => {
        const selectedChatMessages = get().selectedChatMessages;
        const selectedChatType = get().selectedChatType;

        set({
            selectedChatMessages: [
                ...selectedChatMessages, {
                    ...msg,
                    reciever: selectedChatType === "channel" ? msg.reciever : msg.reciever._id,
                    sender: selectedChatType === "channel" ? msg.sender : msg.sender._id
                }
            ]
        })
    }
})