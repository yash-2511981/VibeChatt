import { useAppStore } from "@/store";
import { useEffect } from "react";

const Profile = () => {
    const {userInfo} = useAppStore()
    return (
        <div>
            <h1>{userInfo.id}</h1>
        </div>
    )
}

export default Profile
