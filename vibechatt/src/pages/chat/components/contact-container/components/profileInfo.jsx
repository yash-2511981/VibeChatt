import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store'
import { HOST, LOGOUT } from '@/utils/constants';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import { FaEdit } from 'react-icons/fa';
import { IoPowerSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';


const ProfileInfo = () => {
    const navigate = useNavigate()
    const { userInfo, setUserInfo } = useAppStore();

    const logout = async () => {
        try {
            const resposne = await apiClient.post(LOGOUT, {}, { withCredentials: true })

            if (resposne.status === 200) {
                setUserInfo(null);
                navigate("/auth")
            }
        } catch (error) {
            console.log(error)
        }
    }

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
                    <div className='text-sm text-white'>
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
                            <FaEdit className='text-xl text-gray-300' onClick={() => navigate("/profile")} />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Edit Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoPowerSharp className='text-xl text-gray-300' onClick={logout} />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Logout</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}

export default ProfileInfo
