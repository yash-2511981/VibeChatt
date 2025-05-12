import { useAppStore } from '@/store'
import React from 'react'
import { BiCheck, BiCheckDouble } from 'react-icons/bi'

const MessageReciept = ({ status }) => {
    return (
        <span className="text-gray-600">
            {status == "sent" && <BiCheck className="text-[13px]" />}
            {status == "recieved" && <BiCheckDouble className="text-[13px]" />}
            {status == "seen" && <BiCheckDouble className="text-[13px] text-[#34B7F1]" />}
        </span>
    )
}

export default MessageReciept
