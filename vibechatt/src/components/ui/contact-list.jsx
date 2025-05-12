import { useAppStore } from "@/store"
import { Avatar, AvatarImage } from "./avatar";
import { checkImage, getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";
import { useSocket } from "@/context/SocketContext";
import MessageReciept from "./MessageReciept";
import moment from "moment";
import { MdCameraAlt, MdFolder } from "react-icons/md";

const ContactList = ({ contacts, isChannel = false }) => {
    const { setSelectedChatType, setSelectedChatData, selectedChatData, setSelectedChatMessage, userInfo } = useAppStore();
    const socket = useSocket();

    const handleClick = (contact) => {
        if (isChannel) {
            setSelectedChatType("channel")
            setSelectedChatData(contact);
        } else {
            setSelectedChatType("contact")
            setSelectedChatData(contact);
            socket.emit("update-unseen-msg", {
                user1: userInfo.id,
                user2: contact._id
            })
        }
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessage([])
        }
    }

    return (
        <div className="mt-2  flex flex-col">
            {
                contacts.map((contact) => (
                    <div key={contact._id} className={`mx-2 mb-1 p-2 transition-all duration-300 cursor-pointer rounded-lg ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#f1f1f111] hover:bg-[#f1f1f111]" : "hover:bg-[#f1f1f111]"}`} onClick={() => handleClick(contact)}>
                        <div className="flex gap-3 items-center justify-between text-neautral-300">
                            {!isChannel &&
                                (
                                    <>
                                        <Avatar className='h-10 w-10 rounded-full overflow-hidden flex items-center justify-center'>
                                            {contact.image ?
                                                (<AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className='object-cover w-full h-full bg-black' />) :
                                                (
                                                    <div className={`uppercase h-10 w-10 text-3xl border-[1px] flex items-center justify-center rounded-full ${selectedChatData && selectedChatData._id === contact._id ? "border-white " : getColor(contact.theme)}`}>
                                                        {contact.firstName ?
                                                            contact.firstName.split("").shift() :
                                                            contact.email.split("").shift()}
                                                    </div>
                                                )}

                                        </Avatar>
                                    </>
                                )
                            }
                            {
                                isChannel &&
                                (
                                    <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">#</div>
                                )
                            }
                            <div className="flex flex-col items-start w-[70%]">
                                {
                                    isChannel ? (<span className="">{contact.name}</span>) :
                                        (<span className="d-flex relative ">{`${contact.firstName} ${contact.lastName} `}
                                            <span className="absolute h-2 w-2 rounded-full bg-green-500" hidden={contact.status !== "online"}></span>
                                        </span>)
                                }
                                {contact.lastMessage !== null &&
                                    <div className="flex items-center justify-between">
                                        {
                                            contact.lastMessage.isOwnMessage && <MessageReciept status={contact.lastMessage.status} />
                                        }
                                        <span className="text-gray-500 text-xs flex items-center gap-1">
                                            {(() => {
                                                const isText = contact.lastMessage.messageType === "text";
                                                const fileName = contact.lastMessage.fileUrl?.split("/").pop() || "";

                                                const content = isText
                                                    ? contact.lastMessage.content
                                                    : fileName;

                                                const truncated = content.length < 20 ? content : `${content.slice(0, 20)} ...`;

                                                // Use your existing checkImage function
                                                const icon = !isText
                                                    ? checkImage(fileName)
                                                        ? <MdCameraAlt className="text-lg" />
                                                        : <MdFolder className="text-lg" />
                                                    : null;

                                                return (
                                                    <>
                                                        {truncated}
                                                        {icon}
                                                    </>
                                                );
                                            })()}
                                        </span>


                                    </div>
                                }
                            </div>
                            <div className="flex flex-col justify-between items-end w-[30%]">
                                <div className="h-5">
                                    {
                                        contact.unseenCount > 0 && <span className="rounded-lg bg-green-500 flex items-center justify-center px-1 text-[12px]" >{contact.unseenCount}</span>
                                    }
                                </div>
                                {
                                    contact.lastMessage !== null &&
                                    <span className="text-gray-500 text-xs mt-1">
                                        {moment(contact.lastMessage.timestamp).format("LT")}
                                    </span>
                                }
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default ContactList
