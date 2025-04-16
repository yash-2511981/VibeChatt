import { useAppStore } from "@/store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contact-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container/chatcontainer";

const Chat = () => {
    const navigate = useNavigate();
    const { userInfo, selectedChatType, isUploading,
        isDownload,
        fileUploadProgress,
        fileDownloadProgress } = useAppStore()

    useEffect(() => {
        if (!userInfo.profileSetup) {
            toast("please complete the profile setup")
            navigate("/profile")
        }
    }, [])

    return (
        <div className="flex h-[100vh] text-white overflow-hidden">
            {
                isUploading && <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-balck/80 flex items-center justify-center flex-col  gap-5 backdrop-blur-lg">
                    <h5 className="text-5xl animate-pulse">Uploading File</h5>
                    {fileUploadProgress}%
                </div>
            }

            {
                isDownload && <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-balck/80 flex items-center justify-center flex-col  gap-5 backdrop-blur-lg">
                    <h5 className="text-5xl animate-pulse">Downloading File</h5>
                    {fileDownloadProgress}%
                </div>
            }
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
