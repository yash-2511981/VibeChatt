import { useAppStore } from "@/store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Chat = () => {
    const {userInfo} = useAppStore()
    return (
        <div>
            <h1>{userInfo.id}</h1>
        </div>
    )
}

export default Chat
