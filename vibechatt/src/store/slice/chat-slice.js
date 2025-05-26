import { channelMessageArrive } from "@/components/ui/NewChannelNotification";
import { newMessageArrive } from "@/components/ui/NewNotification";
import { toast } from "sonner";

export const createChatSlice = (set, get) => ({
    // Existing states
    calldetails: [],
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    allContacts: [],
    isUploading: false,
    isDownload: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    channels: [],

    // Existing methods
    setChannel: (channels) => set({ channels }),
    addChannel: (channel) => {
        const channels = get().channels;
        set({ channels: [channel, ...channels] });
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
        });
    },
    updateMessageStatus: (message) => {
        console.log("updating msg status")
        const index = get().selectedChatMessages.findIndex(msg => msg._id === message._id);
        const messages = get().selectedChatMessages;

        messages[index] = message;

        set({ selectedChatMessages: messages });
    },
    updateCurrentChatMessage: () => {
        set(state => ({
            selectedChatMessages: state.selectedChatMessages.map(msg =>
                msg.status === "recieved" || msg.status === "sent" ? { ...msg, status: "seen" } : msg
            )
        }))
    },
    handleNotificationReply: (contact, type) => {
        set({
            selectedChatType: type,
            selectedChatData: contact,
            selectedChatMessages: []
        })
    },
    addContactsInDmContacts: (message) => {
        const userId = get().userInfo.id;
        const selectId = get().selectedChatData._id
        const fromId = message.sender._id === userId ? message.reciever._id : message.sender._id;
        const fromData = message.sender._id === userId ? message.reciever : message.sender;
        const dmContacts = get().allContacts;
        const data = dmContacts.find((c) => c._id === fromId);
        const index = dmContacts.findIndex((c) => c._id === fromId);

        const { sender, reciever, ...rest } = message
        const lastMessage = {
            ...rest,
            isOwnMessage: sender._id === userId
        }

        if (index !== -1 && index !== undefined) {
            const unseenCount = selectId === fromId ? 0 : data.unseenCount + 1;
            dmContacts.splice(index, 1);
            dmContacts.unshift({ ...data, lastMessage, unseenCount });
        } else {
            const unseenCount = selectId === fromId ? 0 : 1;
            dmContacts.unshift({
                ...fromData,
                lastMessage,
                unseenCount,
            });
        }

        set({ allContacts: dmContacts });
    },
    updateContactStatus: (data) => {
        const contacts = get().allContacts;
        const index = contacts.findIndex((c) => c._id === data._id);
        const userData = contacts.find((c) => c._id === data._id)
        if (index === -1) return;

        contacts[index] = {
            ...userData, ...data
        };

        set({ allContacts: contacts });

        if (get().selectedChatData && get().selectedChatData._id === data._id) {
            set({ selectedChatData: data })
        }
    },
    updateTypingStatus: (data) => {
        const { from, status } = data
        let currentChat = get().selectedChatData;
        const isChatOpen = currentChat._id === from;
        if (isChatOpen) {
            currentChat = {
                ...currentChat, status
            }
            set({ selectedChatData: currentChat })
        }
    },
    updateContactList: (msg) => {
        const { sender, reciever, ...rest } = msg;
        const userId = get().userInfo.id;
        const contactList = get().allContacts;

        const contactInfo = sender._id === userId ? reciever : sender;
        const index = contactList.findIndex((c) => c._id === contactInfo._id);
        let newMessage = null;

        if (index !== -1) {
            const updatedContact = {
                ...contactList[index],
                lastMessage: {
                    ...rest
                },
                unseenCount: contactList[index].unseenCount + 1,
                lastMessageTime: rest.timestamp
            };
            contactList.splice(index, 1);
            contactList.unshift(updatedContact);
            newMessage = updatedContact;
        } else {
            const newContact = {
                ...contactInfo,
                lastMessage: {
                    ...rest,
                    isOwnMessage: userId === sender._id
                },
                lastMessageTime: rest.timestamp,
            };
            contactList.unshift(newContact)
            newMessage = newContact;
        }

        set({ allContacts: contactList });
        newMessageArrive(newMessage, get().handleNotificationReply)
    },
    updateChannelList: (msg) => {
        const userId = get().userInfo.id
        const channelList = get().channels;
        const { sender, channelId, ...rest } = msg
        const index = channelList.findIndex((c) => c._id === channelId);

        if (index !== -1) {
            const updatedChannel = {
                ...channelList[index],
                unseenCount: channelList[index].unseenCount + 1,
                lastMessage: {
                    ...rest,
                    isOwnMessage: sender._id === userId
                },
                lastMessageTime: rest.timestamp
            }

            channelList.splice(index, 1);
            channelList.unshift(updatedChannel);
            set({ channels: channelList })
            channelMessageArrive(updatedChannel, get().handleNotificationReply)
        }
    },
    addChaannelInChannelList: (message) => {
        const userId = get().userInfo.id;
        const channelList = get().channels;
        const { sender, channelId, ...rest } = message
        const index = channelList.findIndex(
            (c) => c._id === channelId
        );
        const data = channelList.find((c) => c._id === channelId);

        if (index !== -1) {
            channelList.splice(index, 1);
            const updatedChannel = {
                ...data,
                unseenCount: 0,
                lastMessage: {
                    ...rest,
                    isOwnMessage: sender._id === userId
                },
                lastMessageTime: rest.timestamp
            }
            channelList.unshift(updatedChannel);
            set({ channels: channelList })
        }
    },
    updateChanelMsg: (id) => {
        const channelList = get().channels;
        const index = channelList.findIndex((c) => c._id === id);
        const data = channelList[index];
        channelList[index] = {
            ...data,
            unseenCount: 0
        }

        set({ channels: channelList });
    }
});