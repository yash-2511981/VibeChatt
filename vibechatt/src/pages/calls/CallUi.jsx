import { useAppStore } from "@/store";
import CallNotification from "./component/call-notification";
import { FullscreenCall } from "./component/call-fullscreen";

export const CallUI = () => {
  const { callUIState } = useAppStore();
  if (callUIState === 'incoming' || callUIState === 'outgoing') return <CallNotification />;
  if (callUIState === 'fullscreen') return <FullscreenCall />;
  return null;
};
