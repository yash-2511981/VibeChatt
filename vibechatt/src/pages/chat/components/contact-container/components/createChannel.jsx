import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import { CREATE_CHANNEL, GET_ALL_CONTACTS_FOR_CHANNEL, HOST } from '@/utils/constants';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import MultipleSelector from '@/components/ui/multiselectComponent';

const CreateChannels = () => {
    const { setSelectedChatType, setSelectedChatData, addChannel, } = useAppStore();
    const [opneChannelModal, setOpenChannelModal] = useState(false)
    const [searchedContact, setSearchedContact] = useState([]);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([])
    const [channelName, setChannelName] = useState("")

    useEffect(() => {

        const searchContact = async () => {
            try {
                const response = await apiClient.get(GET_ALL_CONTACTS_FOR_CHANNEL, { withCredentials: true })
                setAllContacts(response.data.contacts)
            } catch (error) {
                console.log(error)
            }
        }
        searchContact();
    }, []);


    const createChannle = async () => {
        try {
            const response = await apiClient.post(CREATE_CHANNEL,
                { name: channelName, members: selectedContacts.map((contact) => contact.value) },
                { withCredentials: true }
            )
            if(response.status === 200){
                setChannelName("");
                setSelectedContacts([]);
                setOpenChannelModal(false);
                addChannel(response.data.channel)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className='text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300' onClick={() => setOpenChannelModal(true)} />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Create New Group</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={opneChannelModal} onOpenChange={setOpenChannelModal}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Please fill up the details for new group</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="channel name" className="rounded-lg bg-[#2c2e3b] border-none" onChange={(e) => setChannelName(e.target.value)} value={channelName} />
                    </div>
                    <div>
                        <MultipleSelector
                            className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                            defaultOptions={allContacts}
                            placeholder="search contacts"
                            value={selectedContacts}
                            onChange={setSelectedContacts}
                            emptyIndicator={
                                <p className='text-center text-lg leading-10 text-gray-600'>No Result found</p>
                            }

                        />
                    </div>
                    <div>
                        <Button className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={createChannle}>Create Group
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default CreateChannels

