import { useAppStore } from "@/store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Chat = () => {
    const navigate = useNavigate();
    const { userInfo } = useAppStore()

    useEffect(() => {
        if (!userInfo.profileSetup) {
            toast("please complete the profile setup")
            navigate("/profile")
        }
    }, [])
    return (
        <div>
            <h1>{userInfo.id}</h1>
        </div>
    )
}

export default Chat
