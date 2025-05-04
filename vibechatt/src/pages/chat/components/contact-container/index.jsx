import { useEffect, useState } from "react"
import Logo from "./components/logo"
import NewDm from "./components/newdm"
import ProfileInfo from "./components/profileInfo"
import Title from "./components/title"
import { apiClient } from "@/lib/api-client"
import { GET_ALL_CHANNELS, GET_ALL_CONTACTS } from "@/utils/constants"
import { useAppStore } from "@/store"
import ContactList from "@/components/ui/contact-list"
import CreateChannels from "./components/createChannel"
import { HiDotsVertical } from 'react-icons/hi'


const ContactsContainer = () => {
  const { setContactList, allContacts, channels, setChannel } = useAppStore();
  const [listdisplay, setlistdisplay] = useState("contacts");

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS, { withCredentials: true })

      if (response.status === 200) {
        setContactList(response.data.contacts)
      }
    };

    const getChannels = async () => {
      const response = await apiClient.get(GET_ALL_CHANNELS, { withCredentials: true })

      if (response.status === 200) {
        setChannel(response.data.channels)
      }
    };
    getChannels();

    getContacts();

  }, [setChannel, setContactList])

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[25vw] bg-[#1b1c24] border-r-2  border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center justify-start pr-10">
          <span onClick={() => setlistdisplay("contacts")} className={`${listdisplay === 'contacts' ? "bg-green-500 text-white" : "bg-gray-700 text-neutral-400"} ml-2 p-2 rounded-full cursor-pointer transition-all duration-300`}>
            <Title text="Chats" />
          </span>
          <span onClick={() => setlistdisplay("groups")} className={`${listdisplay === 'groups' ? "bg-green-500 text-white" : "bg-gray-700 text-neutral-400"} ml-2 p-2 rounded-full cursor-pointer transition-all duration-300`}>
            <Title text="Groups" />
          </span>
        </div>
        <div className="text-xl mr-5 text-center transition-all duration-300">
          {
            listdisplay === "contacts" ?
              <NewDm /> :
              <CreateChannels />
          }
        </div>
      </div>
      <div className="mt-5">
        {
          listdisplay === "contacts" ?
            <div className="overflow-auto custom-scrollbar mx-2 rounded-lg  py-2">
              <ContactList contacts={allContacts} />
            </div>
            :
            <div className="overflow-auto custom-scrollbar mx-2 rounded-lg  py-2">
              <ContactList contacts={channels} isChannel={true} />
            </div>
        }
      </div>
      <ProfileInfo />
    </div>
  )
}

export default ContactsContainer




