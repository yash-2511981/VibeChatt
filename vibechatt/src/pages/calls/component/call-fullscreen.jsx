import React, { useEffect, useRef } from 'react';
import {
    IoCall,
    IoVideocam,
    IoMic,
    IoMicOff,
    IoVideocamOff
} from 'react-icons/io5';
import { useAppStore } from '@/store';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { HOST } from '@/utils/constants';
import { formatTime, getColor } from '@/lib/utils';
import { useSocket } from '@/context/SocketContext';

export const FullscreenCall = () => {
    const {
        type,
        userInfo,
        localStream,
        remoteStream,
        micOnn,
        videoOnn,
        setMicOnn,
        setVideoOnn,
        callDuration,
        endCall,
        callStatus,
        from,
        to
    } = useAppStore();
    const socket = useSocket();

    const localRef = useRef(null);
    const remoteRef = useRef(null);

    useEffect(() => {
        if (localRef.current && localStream) {
            localRef.current.srcObject = localStream;
        }
        if (remoteRef.current && remoteStream) {
            remoteRef.current.srcObject = remoteStream;
        }
    }, [localStream, remoteStream]);

    useEffect(() => {
        let interval;
        if (callStatus === 'ongoing') {
            interval = setInterval(() => {
                useAppStore.getState().updateCallDuration();
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [callStatus]);

    const endCurrentCall = () => {

        let touser = from.id !== userInfo.id ? from.id : to.id
        let fromuser = from.id !== userInfo.id ? to.id : from.id
        socket.emit("call-ended", {
            from: fromuser,
            to: touser
        })
        endCall();
    }

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <div className="flex-1 relative">
                {type === 'videocall' && remoteStream ? (
                    type === "videocall" ?
                        <video ref={remoteRef} autoPlay playsInline className="w-full h-full object-cover" /> : <audio ref={remoteRef} autoPlay playsInline />
                ) : (
                    <div className="h-full flex flex-col gap-3 items-center justify-center text-white text-xl">

                        <Avatar className='h-50 w-50 rounded-full overflow-hidden'>
                            {to.image ?
                                (<AvatarImage src={`${HOST}/${to.image}`} alt="profile" className='object-cover w-full h-full bg-black' />) :
                                (
                                    <div className={`uppercase h-50 w-50 text-[150px] border-[1px] flex items-center justify-center text-center rounded-full ${getColor(to.theme)}`}>
                                        {to.firstName ?
                                            to.firstName.split("").shift() :
                                            to.email.split("").shift()}
                                    </div>
                                )}
                        </Avatar>

                        <div>
                            <p className='text-xl text-white'>{`${to.firstName} ${to.lastName}`}</p>
                        </div>

                        <div>
                            {callStatus == "ongoing" ? formatTime(callDuration) : callStatus}
                        </div>
                    </div>
                )}

                (
                <div className="absolute bottom-4 right-4 w-32 h-48">
                    <video ref={localRef} autoPlay playsInline className="w-full h-full object-cover rounded" />
                </div>
                )
            </div>
            <div className="bg-gray-800 text-white p-4 flex justify-center gap-8">
                {callStatus === 'ongoing' &&
                    <>
                        <button className={`p-3 rounded-full h-12 w-12 lg:text-2xl ${micOnn ? 'bg-gray-700' : 'bg-red-600'}`}>
                            {micOnn ? <IoMicOff className='text-2xl' /> : <IoMic className='text-2xl' />}
                        </button>


                        {type == "videocall" && <button className={`p-3 rounded-full lg:text-2xl ${videoOnn ? 'bg-gray-700' : 'bg-red-600'}`}>
                            {videoOnn ? <IoVideocamOff className='text-2xl' /> : <IoVideocam className='text-2xl' />}
                        </button>
                        }
                    </>
                }
                <button className="p-3 bg-red-600 rounded-full h-12 w-12  lg:text-2xl text-xl flex items-center justify-center shadow-lg">
                    <IoCall onClick={endCurrentCall} />
                </button>
            </div>
        </div>
    );
};