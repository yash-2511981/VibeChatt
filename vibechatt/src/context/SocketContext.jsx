import { useAppStore } from '@/store'
import { HOST } from '@/utils/constants'
import { createContext, useContext, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userInfo, setFrom, setTo, setcallUIState, endCall, setCallStatus, setCallType, setUser, updateContactStatus, updateMessageStatus, updateCurrentChatMessage, updateContactList, updateTypingStatus } = useAppStore();

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
                const { selectedChatType, selectedChatData, addMessage, addContactsInDmContacts } = useAppStore.getState();

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
                const { selectedChatType, selectedChatData, addMessage, addChaannelInChannelList, updateChannelList } = useAppStore.getState();

                if (selectedChatType !== undefined && selectedChatData._id === msg.channelId) {
                    addMessage(msg)
                    addChaannelInChannelList(msg)
                } else {
                    updateChannelList(msg);
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