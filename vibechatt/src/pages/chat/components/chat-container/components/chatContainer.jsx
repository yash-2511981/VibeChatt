import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store"
import { GET_CHANNEEL_MSG, GET_CHAT_MESSAGES, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react"
import { MdFolderZip } from 'react-icons/md'
import { IoMdArrowRoundDown } from 'react-icons/io'
import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

const MessageContainer = () => {
  const scrollRef = useRef();
  const containerRef = useRef();
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const { userInfo, selectedChatType, selectedChatData, selectedChatMessages, setSelectedChatMessage, setDownloadProgress, setIsDownloading } = useAppStore()

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
        const response = await apiClient.get(`${GET_CHANNEEL_MSG}/${selectedChatData._id}`,{ withCredentials: true })

        if (response.status === 200 && response.data.messages) {
          setSelectedChatMessage(response.data.messages)
        }
      } catch (error) {
        console.log(error.message)
      }
    }

    if (selectedChatData?._id) {
      if (selectedChatType === "contact") getMessages();
      if (selectedChatType === "channel") getChannelMsg();
    }
  }, [selectedChatType, selectedChatData, setSelectedChatMessage]) // Removed

  // Handle scrolling when messages change
  useEffect(() => {
    if (!isManualScrolling && scrollRef.current) {
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
    })
  };

  //fuction for checking the message is image type or not
  const checkImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/
    return imageRegex.test(filePath);
  }

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
              ? "bg-[#8417ff]/5 text-[#8427ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
              {message.content}
            </div>
          )
        }
        {
          message.messageType === "file" && (
            <div className={`${message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8427ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/20"} border inline-block p-2 rounded my-1 max-w-[50%] break-words`}
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
                  </div>)
                  :
                  (<div className="flex items-center justify-center gap-3">
                    <span className="text-white/8 text-sm bg-black/20 rounded-full p-3"
                    >
                      <MdFolderZip />
                    </span>
                    <span>{message.fileUrl.split("/").pop()}</span>
                    <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                      onClick={() => downloadFile(message.fileUrl)}>
                      <IoMdArrowRoundDown className="text-3xl" />
                    </span>
                  </div>)
              }
            </div>
          )
        }
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    )
  }

  const renderChannelMsg = (message) => {
    return (
      <div className={`mt-5 ${message.sender._id !== userInfo.id ? "text-left" : "text-right"}`}>
        {
          message.messageType === "text" && (
            <div className={`${message.sender._id === userInfo.id
              ? "bg-[#8417ff]/5 text-[#8427ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-10`}>
              {message.content}
            </div>
          )
        }
        {
          message.messageType === "file" && (
            <div className={`${message.sender._id === userInfo.id
              ? "bg-[#8417ff]/5 text-[#8427ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/20"} border inline-block p-2 rounded my-1 max-w-[50%] break-words`}
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
                  </div>)
                  :
                  (<div className="flex items-center justify-center gap-3">
                    <span className="text-white/8 text-sm bg-black/20 rounded-full p-3"
                    >
                      <MdFolderZip />
                    </span>
                    <span>{message.fileUrl.split("/").pop()}</span>
                    <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                      onClick={() => downloadFile(message.fileUrl)}>
                      <IoMdArrowRoundDown className="text-3xl" />
                    </span>
                  </div>)
              }
            </div>
          )
        }
        {
          message.sender._id !== userInfo.id ?
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
              <span className="text-ss text-white/60">
                {moment(message.timestamp).format("LT")}
              </span>
            </div>
            ) :
            (
              <div className="text-ss text-white/60">
                {moment(message.timestamp).format("LT")}
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
      className="flex-1 overflow-y-auto custom-scrollbar p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full"
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