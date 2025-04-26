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
    const { userInfo,setFrom,setTo,setcallUIState,endCall,setCallStatus} = useAppStore();

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
                // Get latest state when the message is received
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

            // Call-related event handlers
            socket.current.on('incomingCall', (data) => {
                setFrom(data.to);
                setTo(data.from)
                setcallUIState("notification");

            });

            socket.current.on('incomingVideoCall', (data) => {
                setcallUIState("notification");
                setCaller(data.from)
            });

            socket.current.on('callAccepted', (data) => {
                setCallStatus("ongoing");
            });

            socket.current.on('callRejected', () => {
                endCall();
            });

            socket.current.on('callEnded', () => {
                endCall();
            });

            socket.current.on('callFailed', (data) => {
                console.error("Call failed:", data.message);
                endCall();
            });

            // In your socket event setup:
            socket.current.on('iceCandidate', (data) => {
                console.log("Received ICE candidate from peer");
                handleRemoteICECandidate(data);
            });

            return () => {
                socket.current.disconnect()
            };
        }
    }, [userInfo])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
};