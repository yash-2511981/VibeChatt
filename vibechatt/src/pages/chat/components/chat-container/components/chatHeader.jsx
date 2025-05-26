import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useSocket } from '@/context/SocketContext';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store'
import { HOST } from '@/utils/constants';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { IoCall, IoVideocam } from 'react-icons/io5';
import { RiCloseFill, RiXingLine } from 'react-icons/ri';


const ChatHeader = () => {
  const { closeChat, selectedChatData, updateTypingStatus, selectedChatType, setCallType, setcallUIState, userInfo, setFrom, setTo, setUser } = useAppStore();
  const socket = useSocket();
  const [status, setstatus] = useState();

  const Calling = async (e) => {
    const type = e.currentTarget.getAttribute('name');
    setUser({
      id: selectedChatData._id,
      firstName: selectedChatData.firstName,
      lastName: selectedChatData.lastName,
      theme: selectedChatData.theme,
      image: selectedChatData.image
    })
    setCallType(type)
    setcallUIState("outgoing")
    setFrom(userInfo);
    setTo({
      id: selectedChatData._id,
      firstName: selectedChatData.firstName,
      lastName: selectedChatData.lastName,
      theme: selectedChatData.theme,
      image: selectedChatData.image
    })

    if (!socket) return;
    socket.emit("outgoingCall", {
      from: userInfo,
      to: {
        id: selectedChatData._id,
        firstName: selectedChatData.firstName,
        lastName: selectedChatData.lastName,
        theme: selectedChatData.theme,
        image: selectedChatData.image
      },
      type
    })
  }

  const formatLastActive = (lastActive) => {
    const now = moment();
    const last = moment(lastActive);
    const diffInHr = now.diff(last, "hours");
    const diffInDay = now.diff(last, "days");

    if (diffInHr < 24) {
      return last.fromNow();
    } else if (diffInDay < 7) {
      return last.format("dddd h:mm A");
    } else {
      return last.format("MMM D, h:mm A");
    }
  }

  useEffect(() => {
    const handleStatusChange = () => {
      if (selectedChatData.status === "online" || selectedChatData.status === "Typing") {
        console.log("online")
        setstatus(selectedChatData.status)
      } else {
        console.log("")
        const lastActive = formatLastActive(selectedChatData.lastActive);
        setstatus(lastActive)
      }
    }
    handleStatusChange();
  }, [selectedChatData])



  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-5">
      <div className="flex gap-5 items-center ">
        {
          selectedChatType === "contact" ?
            <Avatar className='h-12 w-12 rounded-full overflow-hidden flex items-center justify-center'>
              {selectedChatData.image ?
                (<AvatarImage src={`${HOST}/${selectedChatData.image}`} alt="profile" className='object-cover w-full h-full bg-black' />) :
                (
                  <div className={`uppercase h-12 w-12 text-4xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.theme)}`}>
                    {selectedChatData.firstName ?
                      selectedChatData.firstName.split("").shift() :
                      selectedChatData.email.split("").shift()}
                  </div>
                )}
            </Avatar> :
            <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">#</div>
        }
        <div className="flex flex-col items-start justify-start h-full">
          <span>
            {selectedChatType === "channel" && selectedChatData.name}
            {
              selectedChatData.firstName && selectedChatData.lastName ?
                `${selectedChatData.firstName} ${selectedChatData.lastName}` : selectedChatData.email
            }
          </span>
          <div>
            {
              selectedChatType === "contact" ? (
                <span className='text-neutral-500'>
                  {status === "Typing" ? `${status}....` : `${status}`}
                </span>
              ) : (
                <div className='text-neutral-500'>
                  {selectedChatData.admin._id !== userInfo.id && `${selectedChatData.admin.firstName} ${selectedChatData.admin.lastName}, `}
                  {selectedChatData.members
                    .filter(member => userInfo.id !== member._id)
                    .map((member, index, arr) => (
                      <span key={member._id}>
                        {`${member.firstName} ${member.lastName}${index < arr.length - 1 ? ',' : ''} `}
                      </span>
                    ))}
                </div>
              )
            }
          </div>
        </div>
      </div>
      {
        <div className='flex items-center justify-end w-[150px] lg:w-[0px] transition-all duration-300'>
          {selectedChatType === "contact" &&
            (<div className='mr-5 gap-10 flex items-center justify-between'>
              <div className="flex items-center justify-end gap-5">
                <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
                  <IoVideocam className='text-3xl' onClick={(e) => Calling(e)} name='videocall' />
                </button>
              </div>
              <div className="flex items-center justify-end gap-5">
                <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
                  <IoCall className='text-3xl' onClick={(e) => Calling(e)} name='voicecall' />
                </button>
              </div>
            </div>
            )}
          <div className="flex items-center justify-end gap-5">
            <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
              <RiCloseFill className='text-3xl' onClick={closeChat} />
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default ChatHeader
