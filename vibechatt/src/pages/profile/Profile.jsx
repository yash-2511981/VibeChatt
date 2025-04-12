import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { useState } from "react";
import { IoArrowBack } from 'react-icons/io5'
import { FaTrash, FaPlus } from 'react-icons/fa'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { UPDATE_PROFILE_ROUTE } from "@/utils/constants";

const Profile = () => {
    const { userInfo, setUserInfo } = useAppStore()
    const [userDet, setUserDet] = useState({ firstName: "", lastName: "", theme: 0 });
    const [hovered, setHovered] = useState(false);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDet((prevData) => ({
            ...prevData, [name]: value
        }))
    }

    const handleThemChange = (e) => {
        const { name, value } = e.currentTarget.dataset
        setUserDet((prevData) => ({
            ...prevData, [name]: value
        }))
    }


    const validateUserDet = () => {
        if (!userDet.firstName || userDet.firstName.length == 0) {
            toast.error("First Name is required")
            return false;
        }
        if (!userDet.lastName || userDet.lastName.length == 0) {
            toast.error("Last Name is required")
            return false;
        }

        return true;
    }
    const saveChanges = async () => {
        if (validateUserDet()) {
            try {
                const response = await apiClient.post(UPDATE_PROFILE_ROUTE, userDet, { withCredentials: true });
                if(response.status === 200 && response.data){
                    setUserInfo({...response.data});
                    console.log(response.data)
                    toast.success("profile updated successfully")
                }
            } catch (error) {
                console.log(error)
            }
        }
    }


    return (
        <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
            <div className="flex flex-col gap-10 w-[80vw] md:w-max">
                <div>
                    <IoArrowBack className="text-4xl lg:text-5xl text-white/90" />
                </div>
                <div className="grid grid-cols-2">
                    <div className="h-full w-32 md:w-48 md:h-48 relative flex items-center  justify-center" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                        <Avatar className='h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden' >
                            {userDet.image ? (<AvatarImage src={userDet.image} alt="profile" className='object-cover w-full h-full bg-black' />) :
                                (
                                    <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(userDet.theme)}`}>
                                        {userDet.firstName ?
                                            userDet.firstName.split("").shift() :
                                            userInfo.email.split("").shift()}
                                    </div>
                                )}
                        </Avatar>
                        {
                            hovered && (<div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                {
                                    userDet.image ? <FaTrash className="text-white text-3xl cursor-pointer" /> : <FaPlus className="text-white text-3xl cursor-pointer" />
                                }
                            </div>
                            )}
                    </div>
                    {/* <input name="email" type="text" name="" id="" /> */}
                    <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
                        <div className="w-full">
                            <Input placeholder="Email" name="email" type="email" disabled value={userInfo.email} className='rounded-lg p-6 bg-[#2c2e3b] border-none' />
                        </div>
                        <div className="w-full">
                            <Input placeholder="First Name" name="firstName" type="text" value={userDet.firstName} className='rounded-lg p-6 bg-[#2c2e3b] border-none' onChange={handleInputChange} />
                        </div>
                        <div className="w-full">
                            <Input placeholder="Last Name" name="lastName" type="text" value={userDet.lastName} className='rounded-lg p-6 bg-[#2c2e3b] border-none' onChange={handleInputChange} />
                        </div>
                        <div className="w-full flex gap-5">
                            {
                                colors.map((color, index) => (
                                    <div
                                        data-name="theme"
                                        data-value={index}
                                        className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 
                                    ${userDet.theme === index ? "outline outline-white/75 outline-2" : ""}`}
                                        name="theme" key={index}
                                        onClick={handleThemChange}>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={saveChanges}>
                        Save
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Profile
