import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { SEND_FILE_MSG } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react"
import { GrAttachment } from 'react-icons/gr'
import { IoMic, IoSend, IoStop } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { toast } from "sonner";

const MessageBar = () => {
    const emojiRef = useRef();
    const fileInputRef = useRef();
    const socket = useSocket();
    const { selectedChatType, selectedChatData, userInfo, setUploadProgress, setIsUploading } = useAppStore()
    const [message, setMessage] = useState("");
    const [openEmojiPicker, setEmojiPicker] = useState(false)

    //states for audio recording
    const [isRecording, setisRecording] = useState(false);
    const [audioBlob, setaudioBlob] = useState();
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

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

        if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
                sender: userInfo.id,
                content: message,
                reciever: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined
            });
        } else if (selectedChatType === "channel") {
            socket.emit("send-channel-msg", {
                sender: userInfo.id,
                content: message,
                messageType: "text",
                fileUrl: undefined,
                channelId: selectedChatData._id
            })
        }

        setMessage("")
    }

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji)
    }

    const attachmentClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleAttachMentChange = async (event) => {
        try {
            const file = event.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                setIsUploading(true)
                const response = await apiClient.post(SEND_FILE_MSG, formData, {
                    withCredentials: true, onUploadProgress: data => {
                        setUploadProgress(Math.round((100 * data.loaded) / data.total))
                    }
                })

                if (response.status === 200 && response.data) {
                    setIsUploading(false)
                    if (selectedChatType === "contact") {
                        socket.emit("sendMessage", {
                            sender: userInfo.id,
                            content: undefined,
                            reciever: selectedChatData._id,
                            messageType: "file",
                            fileUrl: response.data
                        });
                    } else if (selectedChatType === "channel") {
                        socket.emit("send-channel-msg", {
                            sender: userInfo.id,
                            content: message,
                            messageType: "file",
                            fileUrl: response.data,
                            channelId: selectedChatData._id
                        })
                    }

                }
            }
        } catch (error) {
            console.log(error)
            setIsUploading(false)
        }

    }

    const startAudioRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream)
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data)
                }
            }

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
                setaudioBlob(audioBlob);
                sendAudioMessage(audioBlob)

                stream.getTracks().forEach(track => track.stop());
            }

            mediaRecorderRef.current.start();
            setisRecording(true)
        } catch (error) {
            toast.error("something went wrong try again later")
        }
    }

    const stopAudioRecording = () => {
        if (mediaRecorderRef && isRecording) {
            mediaRecorderRef.current.stop();
            setisRecording(false)
        }
    }

    const sendAudioMessage = async (audioBlob) => {
        try {
            //creating generic filename
            const audioFile = new File([audioBlob], "voice-message.wav", { type: 'audio/wav' });

            //creating form data and appending audio file in it
            const formData = new FormData()
            formData.append("file", audioFile);

            setIsUploading(true);

            const response = await apiClient.post(SEND_FILE_MSG, formData, {
                withCredentials: true,
                onUploadProgress: data => {
                    setUploadProgress(Math.round((100 * data.loaded) / data.total))
                }
            })

            if (response.status === 200 && response.data) {
                console.log(response.data)
                setIsUploading(false)
                if (selectedChatType === "contact") {
                    socket.emit("sendMessage", {
                        sender: userInfo.id,
                        content: undefined,
                        reciever: selectedChatData._id,
                        messageType: "audio", // Using "audio" type
                        fileUrl: response.data
                    });
                } else if (selectedChatType === "channel") {
                    socket.emit("send-channel-msg", {
                        sender: userInfo.id,
                        content: undefined,
                        messageType: "audio", // Using "audio" type
                        fileUrl: response.data,
                        channelId: selectedChatData._id
                    });
                }
            }
        } catch (error) {
            setIsUploading(false)
            toast.error("something went wrong try again later")
        }
    }

    const handleButtonClick = () => {
        if (isRecording) {
            stopAudioRecording()
        } else if (message.length === 0) {
            startAudioRecording()
        } else {
            handelSendMsg();
        }
    }

    return (
        <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6" >
            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
                <input type="text" className="flex-1 p-5 bg-transperent rounded-md focus:border-none focus:outline-none " placeholder="Type message" value={message} onChange={(e) => setMessage(e.target.value)} disabled={isRecording} />
                <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={attachmentClick}>
                    <GrAttachment className="text-2xl" />
                </button>
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachMentChange} disabled={isRecording} />
                <div className="relative">
                    <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={() => setEmojiPicker(true)}>
                        <RiEmojiStickerLine className="text-2xl" />
                    </button>
                    <div className="absolute bottom-16 right-0" ref={emojiRef}>
                        <EmojiPicker theme="dark" open={openEmojiPicker} onEmojiClick={handleAddEmoji} />
                    </div>
                </div>
            </div>
            <button className='bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
                onClick={handleButtonClick}>
                {isRecording ? <IoStop className="text-2xl" /> : message.length === 0 ? <IoMic className="text-2xl" /> : <IoSend className="text-2xl" />}
            </button>
        </div>
    )
}

export default MessageBar
