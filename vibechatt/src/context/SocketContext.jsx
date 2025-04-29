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
    const { userInfo, setFrom, setTo, setcallUIState, endCall, setCallStatus, setCallType, setUser } = useAppStore();

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
                    return; // Exit early if no chat is selected
                }

                // Check if the message belongs to the current chat
                const isChatMember =
                    // Compare _id properties as they're the ones with values
                    (msg.sender && selectedChatData._id === msg.sender._id) ||
                    (msg.reciever && selectedChatData._id === msg.reciever._id);

                if (isChatMember) {
                    addMessage(msg);
                }
                addContactsInDmContacts(msg)
            });

            socket.current.on("recieve-channel-message", (msg) => {
                console.log(msg);
                const { selectedChatType, selectedChatData, addMessage, addChaannelInChannelList } = useAppStore.getState();

                if (selectedChatType !== undefined && selectedChatData._id === msg.channelId) {
                    addMessage(msg)
                }
                addChaannelInChannelList(msg)
            })


            socket.current.on('incomingCall', async (data) => {
                const {to,from,type,} = data;
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

            socket.current.on()

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