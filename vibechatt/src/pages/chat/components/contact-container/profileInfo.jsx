import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppStore } from '@/store'
import { HOST } from '@/utils/constants';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import { FaEdit } from 'react-icons/fa';

const ProfileInfo = () => {
    const { userInfo } = useAppStore();
    return (
        <div className='absolute bottom-0 h-16 flex items-center justify-between px-4 w-full bg-[#2a2b33]'>
            <div className="flex gap-3 items-center justify-center">
                <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
                    {userInfo.image ?
                        (<AvatarImage src={`${HOST}/${userInfo.image}`} alt="profile" className='object-cover w-full h-full bg-black' />) :
                        (
                            <div className={`uppercase h-12 w-12   text text-5xl border-[1px] flex items-center justify-center rounded-full ${userInfo.theme}`}>
                                {userInfo.firstName ?
                                    userInfo.firstName.split("").shift() :
                                    userInfo.email.split("").shift()}
                            </div>
                        )}
                </Avatar>
                <div className='flex flex-col justify-center'>
                    <div className='text-xl text-white'>
                        {
                            userInfo.firstName && userInfo.lastName ?
                                `${userInfo.firstName} ${userInfo.lastName}` : ""
                        }
                    </div>
                    <div className='text-xs text-gray-400'>
                        {
                            userInfo.email ?
                                `${userInfo.email}` : ""
                        }
                    </div>
                </div>
            </div>
            <div className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FaEdit className='text-xl text-gray-300'/>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Edit Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}

export default ProfileInfo
