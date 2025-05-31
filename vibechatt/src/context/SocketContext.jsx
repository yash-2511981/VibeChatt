import { useAppStore } from '@/store'
import { HOST } from '@/utils/constants'
import { createContext, useContext, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { toast } from 'sonner'

const SocketContext = createContext(null)

export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userInfo, setFrom, setTo, setcallUIState, endCall, setCallStatus, setCallType, setUser, updateContactStatus, updateMessageStatus, updateCurrentChatMessage, updateContactList, updateTypingStatus, updateMessageInMessagesList, deleteMessageFromChat } = useAppStore();

    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id }
            });

            socket.current.on("connect", () => {
                console.log("connected to socket")
            })

            socket.current.on("recieveMessage", (msg) => {
                const { selectedChatType, selectedChatData, addMessage, addContactsInDmContacts, userInfo } = useAppStore.getState();
                if (msg.sender._id === userInfo.id) {
                    msg = { ...msg, canEdit: true }
                }

                if (!selectedChatData || selectedChatType === undefined) {
                    updateContactList(msg);
                    return;
                }

                const isChatMember =
                    // Compare _id properties as they're the ones with values
                    (msg.sender && selectedChatData._id === msg.sender._id) ||
                    (msg.reciever && selectedChatData._id === msg.reciever._id);

                if (isChatMember) {
                    if (selectedChatData._id === msg.sender._id) {
                        socket.current.emit("msg-seen", {
                            messageId: msg._id,
                            sender: msg.sender._id
                        })
                    }
                    addMessage(msg);
                    addContactsInDmContacts(msg)
                } else {
                    updateContactList(msg)
                }
            });

            socket.current.on("recieve-channel-message", (msg) => {
                const { selectedChatType, selectedChatData, addMessage, addChaannelInChannelList, updateChannelList, userInfo } = useAppStore.getState();
                console.log(msg)
                if (msg.sender._id === userInfo.id) msg = { ...msg, canEdit: true }

                if (selectedChatType !== undefined && selectedChatData._id === msg.channelId) {
                    addMessage(msg)
                    addChaannelInChannelList(msg)
                } else {
                    updateChannelList(msg);
                }
            })

            socket.current.on("recievedEditMsg", ({ chatId, messageId, content }) => {
                const { selectedChatData } = useAppStore.getState();

                if (selectedChatData._id === chatId) {
                    updateMessageInMessagesList(messageId, content);
                }
            })

            socket.current.on("deleteMsg", ({ chatId, id }) => {
                const { selectedChatData } = useAppStore.getState();

                if (selectedChatData._id === chatId) {
                    deleteMessageFromChat(id);
                }
            })


            socket.current.on('incomingCall', (data) => {
                const { to, from, type, } = data;
                setCallType(type)
                setFrom(from);
                setTo(to)
                setUser(from);
                setcallUIState("incoming");
            });

            socket.current.on('callAccepted', async (data) => {
                setCallStatus("ongoing");
                setcallUIState("fullscreen");
            });

            socket.current.on('call-rejected', () => {
                endCall();
            });

            socket.current.on("contact-update", (data) => {
                updateContactStatus(data);
            })

            socket.current.on("status-changed", (data) => {
                updateTypingStatus(data);
            })

            socket.current.on("msg-seen", (data) => {
                const { reciever } = data
                const { selectedChatData } = useAppStore.getState();
                if (selectedChatData && selectedChatData._id === reciever) {
                    updateMessageStatus(data);
                }
            })

            socket.current.on("update-current-chat-msg", (data) => {
                const { selectedChatData } = useAppStore.getState();
                const { id } = data;
                if (selectedChatData && selectedChatData._id === id) {
                    updateCurrentChatMessage()
                }
            })

            socket.current.on("error", ({ message }) => {
                toast.error(message)
            })

            return () => {
                socket.current.disconnect()
                socket.current.off('callEnded')
                socket.current.off('incomingCall')
                socket.current.off('callAccepted')
            };
        }
    }, [userInfo])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
};