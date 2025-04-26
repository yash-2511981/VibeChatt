import { useAppStore } from "@/store";
import CallNotification from "./component/call-notification";
import { FullscreenCall } from "./component/call-fullscreen";
import { useEffect } from "react";

export const CallUI = () => {
  const { callUIState } = useAppStore();

  useEffect(() => {

  }, [callUIState])


  if (callUIState === 'notification') return <CallNotification />;
  if (callUIState === 'fullscreen') return <FullscreenCall />;
  return null;
};
