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

const ContactsContainer = () => {
  const { setContactList, allContacts, channels, setChannel } = useAppStore();

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
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2  border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDm />
        </div>
        <div className="max-h-[30vh] overflow-auto custom-scrollbar">
          <ContactList contacts={allContacts}/>
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannels />
        </div>
        <div className="max-h-[40vh] overflow-auto  custom-scrollbar">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  )
}

export default ContactsContainer




