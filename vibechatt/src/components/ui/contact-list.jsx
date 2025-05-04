import { useAppStore } from "@/store"
import { Avatar, AvatarImage } from "./avatar";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";

const ContactList = ({ contacts, isChannel = false }) => {
    const { setSelectedChatType, setSelectedChatData, selectedChatData, setSelectedChatMessage } = useAppStore();

    const handleClick = (contact) => {
        if (isChannel) setSelectedChatType("channel")
        else setSelectedChatType("contact")
        setSelectedChatData(contact);
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessage([])
        }

    }

    return (
        <div className="mt-2  flex flex-col">
            {
                contacts.map((contact) => (
                    <div key={contact._id} className={`mx-5 mb-1 p-2 transition-all duration-300 cursor-pointer rounded-lg ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#8417ff] hover:bg-[#8417ff]" : "hover:bg-[#f1f1f111]"}`} onClick={() => handleClick(contact)}>
                        <div className="flex gap-5 items-center justify-start text-neautral-300">
                            {!isChannel &&
                                (
                                    <>
                                        <Avatar className='h-10 w-10 rounded-full overflow-hidden'>
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
                            {
                                isChannel ? (<span className="">{contact.name}</span>) :
                                    (<span className="d-flex relative">{`${contact.firstName} ${contact.lastName} `}
                                        <span className="absolute  h-2 w-2 rounded-full bg-green-500" hidden={contact.status !== "online"}></span>
                                    </span>)
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default ContactList
