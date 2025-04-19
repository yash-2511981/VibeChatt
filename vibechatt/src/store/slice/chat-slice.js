export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    allContacts: [],
    isUploading: false,
    isDownload: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    channels: [],
    setChannel: (channels) => set({ channels }),
    addChannel: (channel) => {
        const channels = get().channels;
        set({ channels: [channel, ...channels] })
    },
    setIsUploading: (isUploading) => set({ isUploading }),
    setIsDownloading: (isDownload) => set({ isDownload }),
    setUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
    setDownloadProgress: (fileDownloadProgress) => set({ fileDownloadProgress }),
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
    },
    addChaannelInChannelList: (message) => {
        const channels = get().channels;
        const data = channels.find((c) => c._id === message.channelId);
        const index = channels.findIndex(
            (c) => c._id === message.channelId
        );
        
        if (index !== -1 && index !== undefined) {
            channels.splice(index, 1);
            channels.unshift(data);
        }
    },
    addContactsInDmContacts: (message) => {
        const userId = get().userInfo.id;
        const fromId = message.sender._id === userId ? message.reciever._id : message.sender._id;
        const fromData = message.sender._id === userId ? message.reciever : message.sender;
        const dmContacts = get().allContacts;
        const data = dmContacts.find((c)=> c._id === fromId);
        const index = dmContacts.findIndex((c)=> c._id === fromId);
        
        if(index !== -1 && index !== undefined){
            dmContacts.splice(index,1);
            dmContacts.unshift(data);
        }else{
            dmContacts.unshift(fromData);
        }

        set({allContacts:dmContacts})
    },
})