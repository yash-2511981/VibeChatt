import React from 'react'
import { IoMdSend } from 'react-icons/io'
import { IoChatbubble, IoChatbubblesOutline, IoMic, IoNotifications, IoNotificationsCircleOutline, IoNotificationsOffCircleOutline, IoNotificationsOutline, IoSendOutline, IoSendSharp, IoText } from 'react-icons/io5'
import { MdDoorbell, MdSend, MdSendToMobile } from 'react-icons/md'
import { RiBellFill, RiNotification2Fill, RiNotification2Line } from 'react-icons/ri'
import { toast } from 'sonner'
const contact = {
    email:
        "nihal@gmail.com",
    firstName:
        "Nihal",
    lastActive:
        "Tue May 13 2025 22:02:07 GMT+0530 (India Standard Time)",
    lastMessage:
        { timestamp: '2025-05-16T17:48:59.707Z', status: 'seen', messageType: 'audio', fileUrl: 'uploads/files/1747417739468/voice-message.wav', isOwnMessage: true },
    lastMessageTime:
        "2025-05-16T17:48:59.707Z",
    lastName:
        "Singh",
    status:
        "online",
    theme:
        2,
    unseenCount:
        4,
    _id:
        "6805f93381ca1bf6f4bb775c"
}

export const newMessageArrive = () => {


    toast.custom((t) => {
        return (
            <div className="bg-gray-700 text-white rounded-lg shadow-xl border border-gray-600 overflow-hidden w-55 flex items-center p-1">
                <div className='relative'>
                    <IoNotifications className='text-3xl' />
                    <span className='absolute top-[-3px] right-0 bg-green-500 rounded-full h-4 w-4 flex items-center justify-center'>{contact.unseenCount}</span>
                </div>
                <div className=' ml-2 gap-2 flex items-center justify-center'>
                    <div className='text-Start'>
                        <div className='text-sm'>
                            {contact?.firstName && contact?.lastName ?
                                `${contact.firstName} ${contact.lastName}` : `${contact.email}`}
                        </div>
                        <div className='text-xs flex items-center'>
                            <IoMic className='mr-1 ml-0' />
                            {contact.lastMessage.fileUrl.split("/").pop().slice(0, 20)}
                        </div>
                    </div>
                </div>
                <div className='ml-4 cursor-pointer text-[10px] text-purple-790'>
                    Reply
                </div>
            </div>
        );
    }, {
        duration: 3000,
        position: 'top-right',
        closeButton: true
    })
}

