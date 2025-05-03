import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import Lottie from 'react-lottie';
import { animationDefaultOptions, getColor } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import { HOST, SEARCH_CONTACT } from '@/utils/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/store';

const NewDm = () => {
    const { setSelectedChatType, setSelectedChatData } = useAppStore();
    const [openNewContactModal, setOpenNewContactModal] = useState(false)
    const [searchedContact, setSearchedContact] = useState([]);

    const searchContact = async (value) => {
        try {
            if (value.length > 0) {
                const response = await apiClient.post(SEARCH_CONTACT, { value }, { withCredentials: true })
                if (response.status === 200 && response.data.contacts) {
                    setSearchedContact(response.data.contacts)
                }
            } else {
                setSearchedContact([])
            }
        } catch (error) {
            console.log(error)
        }
    }


    const selectNewContact = (contact) => {
        setOpenNewContactModal(false);
        setSearchedContact([])
        setSelectedChatType("contact")
        setSelectedChatData(contact)
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaSearch className='text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300' onClick={() => setOpenNewContactModal(true)} />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Search User</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Select Contact</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="search contact" className="rounded-lg bg-[#2c2e3b] border-none" onChange={(e) => searchContact(e.target.value)} />
                    </div>

                    {
                        searchedContact.length > 0 &&
                        (
                            <ScrollArea className="h-[250px]">
                                {
                                    searchedContact.map((contact) => (
                                        <div key={contact._id} className='flex gap-3 items-center cursor-pointer mt-2' onClick={() => selectNewContact(contact)}>
                                            <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
                                                {contact.image ?
                                                    (<AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className='object-cover w-full h-full bg-black' />) :
                                                    (
                                                        <div className={`uppercase h-12 w-12   text text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(contact.theme)}`}>
                                                            {contact.firstName ?
                                                                contact.firstName.split("").shift() :
                                                                contact.email.split("").shift()}
                                                        </div>
                                                    )}
                                            </Avatar>
                                            <div className='flex flex-col items-start justify-start gap-1'>
                                                <span>
                                                    {
                                                        contact.firstName && contact.lastName ?
                                                            `${contact.firstName} ${contact.lastName}` : contact.email
                                                    }
                                                </span>
                                                <span className='text-xs text-gray-300'>
                                                    {
                                                        contact.email
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </ScrollArea>
                        )
                    }


                    {
                        searchedContact.length <= 0 && (<div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center  duration-1000 transition-all mt-5">
                            <Lottie
                                isClickToPauseDisabled={true}
                                height={100}
                                width={100}
                                options={animationDefaultOptions}
                            />

                            <div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center'>
                                <h3 className='poppins-medium'>
                                    Hi <span className='text-purple-500'> ! </span>
                                    Search new <span className='text-purple-500'>Contacts </span>
                                </h3>
                            </div>
                        </div>)
                    }
                </DialogContent>
            </Dialog>

        </>
    )
}

export default NewDm
