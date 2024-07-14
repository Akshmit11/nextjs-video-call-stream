"use client";

import {
  Call,
  DeviceSettings,
  MemberResponse,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";

const MeetingSetup = ({
  setIsSetupComplete,
  participantsCount,
  members,
  call,
}: {
  setIsSetupComplete: (value: boolean) => void;
  participantsCount: number;
  members: MemberResponse[] | undefined;
  call: Call;
}) => {
  const [isMicCamToggleOn, setIsMicCamToggleOn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [readyParticipants, setReadyParticipants] = useState(0);

  const { user, isLoaded } = useUser();
  useEffect(() => {
    const updateReadiness = async () => {
      if (members) {
        try {
          const currentUser = members.find(member => member.user_id === user?.id);
          if (currentUser) {
            await call.updateCallMembers({
              update_members: [
                {
                  user_id: currentUser.user_id,
                  custom: { ready: isReady },
                },
              ],
            });
          }
        } catch (error) {
          console.log("Error updating member readiness:", error);
        }
      }
    };

    updateReadiness();
  }, [isReady, call, members]);

  useEffect(() => {
    const checkReadiness = async () => {
      if (members) {
        try {
          const { members } = await call.queryMembers({});
          const readyCount = members.filter((member: any) => member.custom.ready).length;
          setReadyParticipants(readyCount);

          if (readyCount === 2) {
            call.join();
            setIsSetupComplete(true);
          }
        } catch (error) {
          console.log("Error querying members:", error);
        }
      }
    };

    const intervalId = setInterval(checkReadiness, 1000);
    return () => clearInterval(intervalId);
  }, [call, setIsSetupComplete, members]);

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
      {participantsCount < 2 ? (
        <h1>Waiting for other participant...</h1>
      ) : (
        <Button
          className={`rounded-md bg-green-500 px-4 py-2.5 ${isReady && 'bg-black text-white'}`}
          onClick={() => {
            setIsReady((prev) => !prev);
          }}
        >
          {isReady ? 'Cancel Ready' : 'Ready'}
        </Button>
      )}
    </div>
  );
};

export default MeetingSetup;
