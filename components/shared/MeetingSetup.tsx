'use client'

import { useCall, VideoPreview } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

const MeetingSetup = () => {
  const call = useCall();

  if (!call) {
    throw new Error(
      'useCall must be used within a StreamCall component.',
    );
  }
  const [isMicCamToggleOn, setIsMicCamToggleOn] = useState(false);
  useEffect(() => {
    if (isMicCamToggleOn) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamToggleOn, call.camera, call.microphone]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3">
      <h1 className="text-xl underline">Setup</h1>
      <VideoPreview />
    </div>
  );
};

export default MeetingSetup;
