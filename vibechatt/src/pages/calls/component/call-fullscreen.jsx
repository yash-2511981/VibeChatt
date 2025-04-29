import { useAppStore } from "@/store";
import { VideoCallScreen } from "./VIdeoCallScreen";
import { VoiceCallScreen } from "./VoiceCallScreen";

export const FullscreenCall = () => {
    const { type } = useAppStore();
    if (type === "videocall") return <VideoCallScreen />
    if (type === "voicecall") return <VoiceCallScreen />
    return null
};