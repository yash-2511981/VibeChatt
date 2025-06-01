import { useSocket } from '@/context/SocketContext';
import { useAppStore } from '@/store';
import { useState } from 'react';
import { MdDelete } from "react-icons/md";
import { RiEditBoxLine } from "react-icons/ri";

// Edit Component - Only for text messages
export const EditMessage = ({ message, onEdit }) => {
    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit && onEdit(message);
    };

    return (
        <div className="flex items-center justify-center h-full w-full py-[2px] group-hover:bg-black/5 rounded transition-colors">
            <RiEditBoxLine
                className="text-lg cursor-pointer text-gray-600 hover:text-blue-600 hover:scale-110 transition-all duration-200"
                onClick={handleEdit}
                title="Edit message"
            />
        </div>
    );
};

// Delete Component - For all message types
export const DeleteMessage = ({ message, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = (e) => {
        e.stopPropagation();
        if (showConfirm) {
            onDelete && onDelete(message);
            setShowConfirm(false);
        } else {
            setShowConfirm(true);
            // Auto-hide confirmation after 3 seconds
            setTimeout(() => setShowConfirm(false), 3000);
        }
    };

    const handleCancel = (e) => {
        e.stopPropagation();
        setShowConfirm(false);
    };

    if (showConfirm) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full py-[2px] bg-red-500/10 rounded backdrop-blur-sm">
                <div className="text-[10px] text-red-600 font-medium mb-1 whitespace-nowrap">Delete?</div>
                <div className="flex gap-1">
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 text-white text-[10px] px-2 py-1 rounded transition-colors"
                    >
                        Yes
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-gray-500 hover:bg-gray-600 text-white text-[10px] px-2 py-1 rounded transition-colors"
                    >
                        No
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-full w-full py-[2px] group-hover:bg-black/5 rounded transition-colors">
            <MdDelete
                className="text-lg cursor-pointer text-gray-600 hover:text-red-600 hover:scale-110 transition-all duration-200"
                onClick={handleDelete}
                title="Delete message"
            />
        </div>
    );
};

// Combined Edit and Delete Component - For text messages
export const EditAndDeleteMessage = ({ message }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const { setIsMsgEditng, setEditMessage, setMessage, selectedChatData, userInfo, selectedChatType } = useAppStore();
    const socket = useSocket();

    const handleEdit = (e) => {
        e.stopPropagation();
        setIsMsgEditng(true);
        setEditMessage(message);
        setMessage(message.content)
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (showConfirm) {
            if (selectedChatType === "contact") {
                socket.emit("deleteMessage", {
                    msgId: message._id,
                    to: selectedChatData._id,
                    from: userInfo.id
                })
            } else {
                socket.emit("deleteChannelMessage", {
                    msgId: message._id,
                    to: selectedChatData._id,
                    from: userInfo.id
                })
            }
            setShowConfirm(false);
            setEditMessage(null)
            setIsMsgEditng(false)
        } else {
            setShowConfirm(true);
            setTimeout(() => setShowConfirm(false), 3000);
        }
    };

    const handleCancel = (e) => {
        e.stopPropagation();
        setShowConfirm(false);
    };

    if (showConfirm) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full py-[2px] bg-red-500/10 rounded backdrop-blur-sm">
                <div className="text-[10px] text-red-600 font-medium mb-1 whitespace-nowrap">Delete?</div>
                <div className="flex gap-1">
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 text-white text-[10px] px-2 py-1 rounded transition-colors"
                    >
                        Yes
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-gray-500 hover:bg-gray-600 text-white text-[10px] px-2 py-1 rounded transition-colors"
                    >
                        No
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-between h-full w-full py-[2px] group-hover:bg-black/5 rounded transition-colors">
            <RiEditBoxLine
                className="text-lg cursor-pointer text-gray-600 hover:text-blue-600 hover:scale-110 transition-all duration-200"
                onClick={handleEdit}
                title="Edit message"
            />
            <MdDelete
                className="text-lg cursor-pointer text-gray-600 hover:text-red-600 hover:scale-110 transition-all duration-200"
                onClick={handleDelete}
                title="Delete message"
            />
        </div>
    );
};