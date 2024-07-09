"use client";

import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const call = useCall();

  if (!call) {
    throw new Error("useCall must be used within a StreamCall component.");
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
      <VideoPreview className="w-[700px] h-[400px] bg-gray-200 rounded-lg flex items-center justify-center" />
      <div className="flex h-16 items-center justify-center gap-3 text-white">
        <label className="flex items-center justify-center gap-2 font-medium text-black">
          <input
            type="checkbox"
            checked={isMicCamToggleOn}
            onChange={(e) => setIsMicCamToggleOn(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={() => {
          call.join();
          setIsSetupComplete(true);
        }}
      >
        Join meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;
