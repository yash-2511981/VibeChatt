import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store"
import { GET_CHANNEEL_MSG, GET_CHAT_MESSAGES, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react"
import { MdFolderZip } from 'react-icons/md'
import { IoMdArrowRoundDown } from 'react-icons/io'
import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { checkImage, getColor } from "@/lib/utils";
import { BiCheck, BiCheckDouble } from "react-icons/bi";
import MessageReciept from "@/components/ui/MessageReciept";

const MessageContainer = () => {
  const scrollRef = useRef();
  const containerRef = useRef();
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const { userInfo, selectedChatType, selectedChatData, selectedChatMessages, setSelectedChatMessage, setDownloadProgress, setIsDownloading, updateMessageStatus, updateCurrentChatMessage } = useAppStore()

  //states to manage the image click and download
  const [showImage, setShowImage] = useState(undefined);
  const [imageUrl, setImageUrl] = useState("")



  // Fetch messages when chat changes
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(GET_CHAT_MESSAGES, { id: selectedChatData._id }, { withCredentials: true })

        if (response.status === 200 && response.data.messages) {
          setSelectedChatMessage(response.data.messages)
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    const getChannelMsg = async () => {
      try {
        const response = await apiClient.get(`${GET_CHANNEEL_MSG}/${selectedChatData._id}`, { withCredentials: true })

        if (response.status === 200 && response.data.messages) {
          setSelectedChatMessage(response.data.messages)
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    if (selectedChatData._id && selectedChatType) {
      if (selectedChatType === "contact") { getMessages(); };
      if (selectedChatType === "channel") { getChannelMsg(); };

    }
  }, [selectedChatType, selectedChatData, updateMessageStatus, updateCurrentChatMessage]) // Removed

  // Handle scrolling when messages change
  useEffect(() => {
    if (scrollRef.current && !isManualScrolling) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages, isManualScrolling])

  // Detect manual scrolling by user
  const handleScroll = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    setIsManualScrolling(!isNearBottom);
  };

  //function for rendering all the messasges
  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {
            selectedChatType === "contact" && renderDmMsg(message)
          }
          {
            selectedChatType === "channel" && renderChannelMsg(message)
          }
        </div>
      )
    });
  };


  //this function for handling download file event
  const downloadFile = async (url) => {
    setIsDownloading(true);
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: data => {
        setDownloadProgress(Math.round((100 * data.loaded) / data.total))
      }
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop())
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob)
    setIsDownloading(false)
    setDownloadProgress(0);
  }

  const renderDmMsg = (message) => {
    return (
      <div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"}`}>
        {
          message.messageType === "text" && (
            <div className={`${message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8427ff]/90 border-[#8417ff]/50 text-left"
              : "bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/20"} border inline-block rounded my-1 max-w-[50%] min-w-[15%] xl:min-w-[10%] lg:min-w-[15%] break-words px-1`}>
              <div className="flex flex-col h-full">
                <div className="w-full pr-4 pl-1 pt-1">
                  {message.content}
                </div>
                <div className={`text-[10px] text-gray-600 flex text-end justify-end items-center w-full pr-1 mb-1`}>
                  <span>
                    {moment(message.timestamp).format("LT")}
                  </span>
                  {message.sender === userInfo.id && < MessageReciept status={message.status} />}
                </div>
              </div>
            </div>
          )
        }
        {
          message.messageType === "file" && (
            <div className={`${message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8427ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/20"} border inline-block p-2 rounded my-1 max-w-[50%] break-words `}
            >
              {
                checkImage(message.fileUrl) ?
                  (<div className="relative" onClick={() => {
                    setShowImage(true);
                    setImageUrl(message.fileUrl);
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadFile(message.fileUrl);
                      }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-black/60 p-3 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    >
                      <IoMdArrowRoundDown className="text-white text-xl " />
                    </button>
                    <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} />
                    <div className={`text-[10px] text-white/ flex items-end justify-end absolute bottom-1 right-0`}>
                      <span className="text-white/100">
                        {moment(message.timestamp).format("LT")}
                      </span>
                      {message.sender === userInfo.id && <span className="ml-1">
                        {message.status == "sent" && <BiCheck className="text-[13px] text-white/100" />}
                        {message.status == "recieved" && <BiCheckDouble className="text-[13px] text-white/100" />}
                        {message.status == "seen" && <BiCheckDouble className="text-[13px] text-[#34B7F1]" />}
                      </span>}
                    </div>
                  </div>)
                  :
                  (
                    <div>
                      <div className="flex items-center justify-center gap-3 p-2 bg-black/20 rounded-lg">
                        <span className="text-white/8 text-sm bg-black/20 rounded-full p-3 ml-1"
                        >
                          <MdFolderZip />
                        </span>
                        <span>{message.fileUrl.split("/").pop()}</span>
                        <span className="bg-black/20 p-3 text-xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 md:text-2xl"
                          onClick={() => downloadFile(message.fileUrl)}>
                          <IoMdArrowRoundDown className="md:text-2xl" />
                        </span>
                      </div>
                      <div className={`text-[10px] text-gray-600 flex items-center justify-end h-[15px]`}>
                        <span>
                          {moment(message.timestamp).format("LT")}
                        </span>
                        {message.sender === userInfo.id && <MessageReciept status={message.status} />}
                      </div>
                    </div>
                  )
              }
            </div>
          )
        }
        {
          message.messageType === "audio" && (
            <div className={`${message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8427ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/20"} border inline-block p-2 rounded my-1 max-w-[50%] break-words`}>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 p-1">
                  <div className="flex-shrink-0">
                    <button
                      className="bg-black/20 p-2 rounded-full hover:bg-black/30 transition-all duration-300"
                      onClick={() => downloadFile(message.fileUrl)}
                    >
                      <IoMdArrowRoundDown className="text-lg" />
                    </button>
                  </div>
                  <div className="flex-grow">
                    <audio
                      controls
                      className="max-w-full h-8"
                      src={`${HOST}/${message.fileUrl}`}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
                <div className={`text-[10px] text-gray-600 flex items-center justify-end h-[15px] mt-1`}>
                  <span>
                    {moment(message.timestamp).format("LT")}
                  </span>
                  {message.sender === userInfo.id && <MessageReciept status={message.status} />}
                </div>
              </div>
            </div>
          )
        }
      </div>
    )
  }

  const renderChannelMsg = (message) => {
    return (
      <div className={`mt-5 ${message.sender._id !== userInfo.id ? "text-left" : "text-right"}`}>
        {
          message.messageType === "text" && (
            <div className={`${message.sender._id === userInfo.id
              ? "bg-[#8417ff]/5 text-[#8427ff]/90 border-[#8417ff]/50 text-left"
              : "bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/20"} border inline-block rounded my-1 ml-10 max-w-[50%] min-w-[15%] xl:min-w-[10%] lg:min-w-[15%] break-words px-1`}>
              <div className="flex flex-col h-full">
                <div className="w-full pr-4 pl-1 pt-1">
                  {message.content}
                </div>
                <div className={`text-[10px] text-gray-600 flex text-end justify-end items-center w-full pr-1 mb-1`}>
                  <span>
                    {moment(message.timestamp).format("LT")}
                  </span>
                  {message.sender._id === userInfo.id && <span className="ml-1">
                    {message.status == "sent" && <BiCheck className="text-[13px]" />}
                  </span>}
                </div>
              </div>
            </div>
          )
        }
        {
          message.messageType === "file" && (
            <div className={`${message.sender._id === userInfo.id
              ? "bg-[#8417ff]/5 text-[#8427ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/20"} border inline-block p-2 rounded my-1 ml-10 max-w-[50%] break-words`}
            >
              {
                checkImage(message.fileUrl) ?
                  (<div className="relative" onClick={() => {
                    setShowImage(true);
                    setImageUrl(message.fileUrl);
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadFile(message.fileUrl);
                      }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-black/60 p-3 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    >
                      <IoMdArrowRoundDown className="text-white text-3xl" />
                    </button>
                    <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} />
                    <div className={`text-[10px] text-white/ flex items-end justify-end absolute bottom-1 right-0`}>
                      <span className="text-white/100">
                        {moment(message.timestamp).format("LT")}
                      </span>
                      {message.sender._id === userInfo.id && <span className="ml-1">
                        {message.status == "sent" && <BiCheck className="text-[13px] text-white/100" />}
                        {message.status == "recieved" && <BiCheckDouble className="text-[13px] text-white/100" />}
                        {message.status == "seen" && <BiCheckDouble className="text-[13px] text-[#34B7F1]" />}
                      </span>}
                    </div>
                  </div>)
                  :
                  (<div>
                    <div className="flex items-center justify-center gap-3 p-2 bg-black/20 rounded-lg">
                      <span className="text-white/8 text-sm bg-black/20 rounded-full p-3 ml-1"
                      >
                        <MdFolderZip />
                      </span>
                      <span>{message.fileUrl.split("/").pop()}</span>
                      <span className="bg-black/20 p-3 text-xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 md:text-2xl"
                        onClick={() => downloadFile(message.fileUrl)}>
                        <IoMdArrowRoundDown className="md:text-2xl" />
                      </span>
                    </div>
                    <div className={`text-[10px] text-gray-600 flex items-center justify-end h-[15px]`}>
                      <span>
                        {moment(message.timestamp).format("LT")}
                      </span>
                      {message.sender._id === userInfo.id && <span className="ml-1">
                        {message.status == "sent" && <BiCheck className="text-[13px]" />}
                      </span>}
                    </div>
                  </div>)
              }
            </div>
          )
        }
        {
          message.sender._id !== userInfo.id &&
          (<div className="flex items-center justify-start gap-3">
            <Avatar className='h-8 w-8 rounded-full overflow-hidden'>
              {message.sender.image && (<AvatarImage src={`${HOST}/${message.sender.image}`} alt="profile" className='object-cover w-full h-full bg-black' />)}
              <AvatarFallback className={`uppercase h-8 w-8 text text-lg flex items-center justify-center rounded-full ${getColor(message.sender.theme)}`}>
                {message.sender.firstName ?
                  message.sender.firstName.split("").shift() :
                  message.sender.email.split("").shift()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
          </div>
          )
        }
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto custom-scrollbar p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[70vw] w-full"
    >
      {renderMessages()}
      <div ref={scrollRef} />
      {
        showImage &&
        <div className="fixed z-1000 top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg  flex-col">
          <div>
            <button className='bg-gray-900 p-3 rounded-full  hover:bg-gray-700 transition-all duration-300 cursor-pointer my-2'>
              <RiCloseFill className='text-xl' onClick={() => {
                setShowImage(false)
                setImageUrl("")
              }} />
            </button>
          </div>
          <div>
            <img src={`${HOST}/${imageUrl}`} className="h-[80vh] w-full bg-cover" />
          </div>
        </div>
      }
    </div>
  )
}

export default MessageContainer