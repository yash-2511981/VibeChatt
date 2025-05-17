import React from 'react'
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


    toast.custom(() => {
        return (
            <div className="bg-gray-700 text-white rounded-lg shadow-xl border border-gray-600 overflow-hidden w-full max-w-sm p-1">
                <span className='text-sm'>New Message</span>
                <div className='p-1 gap-2 flex items-center justify-center'>
                    <div className='text-Start'>
                        <div className='text-sm'>
                            {contact?.firstName && contact?.lastName ?
                                `${contact.firstName} ${contact.lastName}` : `${contact.email}`}
                            <span>({contact.unseenCount})</span>
                        </div>
                        <div className='text-xs'>
                            {contact.lastMessage.fileUrl.split("/").pop().slice(0, 20)}
                        </div>
                    </div>
                </div>
            </div>
        );
    })
}

