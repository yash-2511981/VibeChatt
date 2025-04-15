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
    const { userInfo } = useAppStore();

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
                const { selectedChatType, selectedChatData, addMessage } = useAppStore.getState();
                
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