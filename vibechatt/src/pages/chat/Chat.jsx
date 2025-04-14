import { useAppStore } from "@/store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contact-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container/chatcontainer";

const Chat = () => {
    const navigate = useNavigate();
    const { userInfo,selectedChatType,selectedChatData} = useAppStore()

    useEffect(() => {
        if (!userInfo.profileSetup) {
            toast("please complete the profile setup")
            navigate("/profile")
        }
    }, [])

    return (
        <div className="flex h-[100vh] text-white overflow-hidden">
            <ContactsContainer />
            {
                selectedChatType === undefined ?
                    <EmptyChatContainer /> :
                    <ChatContainer />
            }

        </div>
    )
}

export default Chat
