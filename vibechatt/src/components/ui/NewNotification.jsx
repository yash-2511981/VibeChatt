import React from 'react'
import { IoFolder, IoMic, IoNotifications, IoText } from 'react-icons/io5'
import { MdMessage } from 'react-icons/md'
import { toast } from 'sonner'
// const contact = {
//     email:
//         "nihal@gmail.com",
//     firstName:
//         "Nihal",
//     lastActive:
//         "Tue May 13 2025 22:02:07 GMT+0530 (India Standard Time)",
//     lastMessage:
//         { timestamp: '2025-05-16T17:48:59.707Z', status: 'seen', messageType: 'audio', fileUrl: 'uploads/files/1747417739468/voice-message.wav', isOwnMessage: true },
//     lastMessageTime:
//         "2025-05-16T17:48:59.707Z",
//     lastName:
//         "Singh",
//     status:
//         "online",
//     theme:
//         2,
//     unseenCount:
//         4,
//     _id:
//         "6805f93381ca1bf6f4bb775c"
// }

export const newMessageArrive = (contact) => {
    console.log(contact)

    const showMessage = (message) => {
        if (message.messageType === "audio") {
            return (
                <>
                    <IoMic className='mr-1 ml-0 text-purple-300' />
                    {message.fileUrl.split("/").pop().slice(0, 20)}
                </>
            )
        } else if (message.messageType === "file") {
            return (
                <>
                    <IoFolder className='mr-1 ml-0 text-purple-300' />
                    {message.fileUrl.split("/").pop().slice(0, 20)}
                </>
            )
        } else if (message.messageType === "text") {
            return (
                <>
                    <MdMessage className='mr-1 ml-0 text-purple-300' />
                    {message.content.length > 20 ? `${message.content.slice(0, 20)}...` : `${message.content}`}
                </>
            )
        }
    }

    toast.custom((t) => {
        return (
            <div className="bg-gray-800 text-gray-100 rounded-lg shadow-xl border border-gray-700 overflow-hidden w-60 flex items-center p-2">
                <div className='relative'>
                    <IoNotifications className='text-3xl text-purple-400' />
                    <span className='absolute top-[-3px] right-0 bg-purple-600 rounded-full h-4 w-4 flex items-center justify-center text-[10px] text-white font-medium'>{contact.unseenCount}</span>
                </div>

                <div className='ml-3 flex-1'>
                    <div className='text-Start'>
                        <div className='text-sm font-medium'>
                            {contact?.firstName && contact?.lastName ?
                                `${contact.firstName} ${contact.lastName}` : `${contact.email}`}
                        </div>
                        <div className='text-xs flex items-center text-gray-300 mt-0.5'>
                            {showMessage(contact.lastMessage)}
                        </div>
                    </div>
                </div>

                <div className='ml-2 pl-2 cursor-pointer text-xs text-purple-400 hover:text-purple-300 font-medium border-l border-gray-600 h-6 flex items-center transition-colors duration-150'>
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

