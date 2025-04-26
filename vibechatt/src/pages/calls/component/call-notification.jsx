import React, { useEffect, useRef } from 'react';
import { useAppStore } from '@/store';
import { useSocket } from '@/context/SocketContext';
import { Phone, User, X } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { HOST } from '@/utils/constants';
import { getColor } from '@/lib/utils';

const CallNotification = () => {
  const { type, endCall, setCallStatus, setcallUIState, from, to } = useAppStore();
  const socket = useSocket();

  const handleReject = () => {
    console.log(from, to)
    socket.emit("call-rejected", {
      from: to.id,
      to: from.id,
    })
    endCall();
  }

  const handleAccept = () => {
    setCallStatus("ongoing");
    setcallUIState("fullscreen");
    socket.emit("call-accepted", {
      from: to.id,
      to: from.id
    })
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 animate-fade-in">
      <div className="bg-blue-600 p-3 text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 animate-pulse" />
          <span className="font-medium">Incoming Call</span>
        </div>
      </div>

      <div className="p-4 flex items-center">
        <div className="bg-gray-100 rounded-full p-3 mr-3">
          <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
            {from.image ?
              (<AvatarImage src={`${HOST}/${from.image}`} alt="profile" className='object-cover w-full h-full bg-black' />) :
              (
                <div className={`uppercase h-12 w-12 text-3xl border-[1px] flex items-center justify-center text-center rounded-full ${getColor(from.theme)}`}>
                  {to.firstName ?
                    to.firstName.split("").shift() :
                    to.email.split("").shift()}
                </div>
              )}
          </Avatar>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{`${from.firstName} ${from.lastName}`}</h3>
        </div>
      </div>

      <div className="flex border-t border-gray-100">
        <button
          onClick={handleReject}
          className="flex-1 py-3 bg-white hover:bg-red-50 text-red-600 font-medium transition-colors flex items-center justify-center space-x-1"
        >
          <X className="h-4 w-4" />
          <span>Decline</span>
        </button>
        <div className="w-px bg-gray-100"></div>
        <button
          onClick={handleAccept}
          className="flex-1 py-3 bg-white hover:bg-green-50 text-green-600 font-medium transition-colors flex items-center justify-center space-x-1"
        >
          <Phone className="h-4 w-4" />
          <span>Accept</span>
        </button>
      </div>
    </div>
  );
};

export default CallNotification;