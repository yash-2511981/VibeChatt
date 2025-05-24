import MessageBar from "./components/MessageBar"
import ChatHeader from "./components/chatHeader"
import MessageContainer from "./components/chatContainer"
import { useEffect } from "react"
import { useSocket } from "@/context/SocketContext"
import { useAppStore } from "@/store"

const ChatContainer = () => {
  const { userInfo, selectedChatData } = useAppStore();
  const socket = useSocket();

  useEffect(() => {
    socket.emit("update-unseen-msg", {
      user1: userInfo.id,
      user2: selectedChatData._id
    })
  }, [])

  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  )
}

export default ChatContainer
