import { useAppStore } from "@/store"
import { Avatar, AvatarImage } from "./avatar";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";

const ContactList = ({ contacts, isChannel = false }) => {
    const { setSelectedChatType, setSelectedChatData, selectedChatData, selectedChatType } = useAppStore();

    const handleClick = (contact) => {
        if (isChannel) setSelectedChatType("channel");
        else setSelectedChatType("contact");

        if (selectedChatData && selectedChatData._id !== contact._id)
            console.log("i am in")
        setSelectedChatData(contact);
    }

    return (
        <div className="mt-5">
            {
                contacts.map((contact) => (
                    <div key={contact._id} className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#8417ff] hover:bg-[#8417ff]" : "hover:bg-[#f1f1f111]"}`} onClick={() => handleClick(contact)}>
                        <div className="flex gap-5 items-center justify-start text-neautral-300">
                            {!isChannel &&
                                (
                                    <>
                                        <Avatar className='h-10 w-10 rounded-full overflow-hidden'>
                                            {contact.image ?
                                                (<AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className='object-cover w-full h-full bg-black' />) :
                                                (
                                                    <div className={`uppercase h-10 w-10   text text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(contact.theme)}`}>
                                                        {contact.firstName ?
                                                            contact.firstName.split("").shift() :
                                                            contact.email.split("").shift()}
                                                    </div>
                                                )}
                                        </Avatar>
                                    </>
                                )
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default ContactList
