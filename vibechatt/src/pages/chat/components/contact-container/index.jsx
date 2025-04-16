import { useEffect } from "react"
import Logo from "./components/logo"
import NewDm from "./components/newdm"
import ProfileInfo from "./components/profileInfo"
import Title from "./components/title"
import { apiClient } from "@/lib/api-client"
import { GET_ALL_CONTACTS } from "@/utils/constants"
import { useAppStore } from "@/store"
import ContactList from "@/components/ui/contact-list"

const ContactsContainer = () => {
  const { setContactList, allContacts } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS, { withCredentials: true })

      if (response.status === 200) {
        console.log(response.data.contacts)
        setContactList(response.data.contacts)
      }
    };

    getContacts();
  }, [])
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
        <div className="max-h-[30vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={allContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
        </div>
      </div>
      <ProfileInfo />
    </div>
  )
}

export default ContactsContainer




