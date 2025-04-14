import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/store'
import { HOST } from '@/utils/constants';
import { RiCloseFill } from 'react-icons/ri'

const ChatHeader = () => {
  const { closeChat, selectedChatData } = useAppStore();
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-5">
      <div className="flex gap-5 items-center ">
        <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
          {selectedChatData.image ?
            (<AvatarImage src={`${HOST}/${selectedChatData.image}`} alt="profile" className='object-cover w-full h-full bg-black' />) :
            (
              <div className={`uppercase h-12 w-12   text text-5xl border-[1px] flex items-center justify-center rounded-full ${selectedChatData.theme}`}>
                {selectedChatData.firstName ?
                  selectedChatData.firstName.split("").shift() :
                  selectedChatData.email.split("").shift()}
              </div>
            )}
        </Avatar>
        <div className="flex flex-col items-start justify-start h-full">
          <span>
            {
              selectedChatData.firstName && selectedChatData.lastName ?
                `${selectedChatData.firstName} ${selectedChatData.lastName}` : selectedChatData.email
            }
          </span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-5">
        <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
          <RiCloseFill className='text-3xl' onClick={closeChat} />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader
