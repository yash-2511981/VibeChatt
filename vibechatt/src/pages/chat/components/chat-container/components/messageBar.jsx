import { useSocket } from "@/context/SocketContext";
import { useAppStore } from "@/store";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react"
import { GrAttachment } from 'react-icons/gr'
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {
    const emojiRef = useRef();
    const socket = useSocket();
    const { selectedChatType, selectedChatData, userInfo } = useAppStore()
    const [message, setMessage] = useState("");
    const [openEmojiPicker, setEmojiPicker] = useState(false)


    useEffect(() => {
        function handleClickedOutside(event) {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmojiPicker(false)
            }
        }

        document.addEventListener('mousedown', handleClickedOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickedOutside)
        }
    }, [emojiRef])

    const handelSendMsg = async () => {
        if (!socket) {
            console.error("Socket connection not established");
            return;
        }

        if (selectedChatType === "chat") {
            socket.emit("sendMessage", {
                sender: userInfo.id,
                content: message,
                reciever: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined
            });
        }
    }

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji)
    }

    return (
        <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6" >
            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
                <input type="text" className="flex-1 p-5 bg-transperent rounded-md focus:border-none focus:outline-none " placeholder="Type message" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
                    <GrAttachment className="text-2xl" />
                </button>
                <div className="relative">
                    <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={() => setEmojiPicker(true)}>
                        <RiEmojiStickerLine className="text-2xl" />
                    </button>
                    <div className="absolute bottom-16 right-0" ref={emojiRef}>
                        <EmojiPicker theme="dark" open={openEmojiPicker} onEmojiClick={handleAddEmoji}
                            autoFocusSearch={false} />
                    </div>
                </div>
            </div>
            <button className='bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={handelSendMsg}>
                <IoSend className="text-2xl" />
            </button>
        </div>
    )
}

export default MessageBar
