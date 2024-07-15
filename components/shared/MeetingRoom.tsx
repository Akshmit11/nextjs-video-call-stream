"use client";

import { useUser } from "@clerk/nextjs";
import {
  CallControls,
  CallingState,
  MemberResponse,
  PaginatedGridLayout,
  SpeakerLayout,
  useCall,
  useCallStateHooks,
  useParticipantViewContext,
  type VideoPlaceholderProps,
} from "@stream-io/video-react-sdk";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import Loading from "./Loading";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = ({
  members,
}: {
  members: MemberResponse[] | undefined;
}) => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const { user } = useUser();
  const call = useCall();
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [callDuration, setCallDuration] = useState<number>(0);
  if (!call)
    throw new Error(
      "useStreamCall must be used within a StreamCall component."
    );

  const CustomParticipantViewUI = () => {
    const { participant } = useParticipantViewContext();

    return (
      <div className="bg-black rounded-md">
        <h1 className="z-[999] text-white absolute bottom-1 left-1 capitalize">
          {user?.fullName}
        </h1>
      </div>
    );
  };

  const CustomVideoPlaceholder = ({ style }: VideoPlaceholderProps) => {
    const { participant } = useParticipantViewContext();

    return (
      <div className="video-placeholder" style={style}>
        <img src={participant.image} alt={participant.name} />
      </div>
    );
  };

  const handleLeaveCall = async () => {
    try {
      if (timer) {
        clearTimeout(timer);
        setTimer(null);
      }

      if (user) {
        await call.updateCallMembers({
          remove_members: [user.id],
        });
      }
      await call.endCall();
      toast({
        title: "Meeting Ended",
        description: `${callDuration} seconds`,
      });

      router.push("/");
    } catch (error) {
      console.error("Error leaving call:", error);
    }
  };

  const startTimer = () => {
    let startTime = Date.now();
    setTimer(
      setInterval(() => {
        setCallDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000)
    );
  };

  useEffect(() => {
    if (callingState === CallingState.JOINED) {
      startTimer();
    } else {
      if (timer) {
        clearTimeout(timer);
        setTimer(null);
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
        setTimer(null);
      }
    };
  }, [callingState]);

  useEffect(() => {
    const handleParticipantLeave = (event: any) => {
      // Access call duration when participant leaves
      console.log(`Call duration: ${callDuration} seconds`);
      handleLeaveCall();
    };

    call.on("participantLeft", handleParticipantLeave);

    return () => {
      call.off("participantLeft", handleParticipantLeave);
    };
  }, [call, callDuration]);

  if (callingState !== CallingState.JOINED) return <Loading />;

  return (
    <section className="relative flex-1 w-screen h-full flex items-center justify-center">
      <div className="absolute top-4 right-4 z-999 bg-gray-800 text-white p-2 rounded">
        Call Duration: {Math.floor(callDuration / 60)}:
        {("0" + (callDuration % 60)).slice(-2)}
      </div>

      <div className="text-white w-screen p-4">
        <div className="md:hidden w-full">
          <SpeakerLayout
            participantsBarLimit={2}
            ParticipantViewUIBar={() => {
              const { participant } = useParticipantViewContext();
              return (
                <div className="bg-black rounded-md">
                  <h1 className="z-[999] text-white absolute bottom-1 left-1 capitalize">
                    {user?.fullName}
                  </h1>
                </div>
              );
            }}
            ParticipantViewUISpotlight={() => {
              const { participant } = useParticipantViewContext();
              return (
                <div className="bg-black rounded-md">
                  <h1 className="z-[999] text-white absolute bottom-1 left-1 capitalize">
                    {user?.fullName}
                  </h1>
                </div>
              );
            }}
          />
        </div>
        <div className="hidden md:flex">
          <PaginatedGridLayout
            pageArrowsVisible={false}
            ParticipantViewUI={CustomParticipantViewUI}
          />
        </div>
      </div>

      <div className="absolute bottom-0 md:bottom-1 w-full md:w-fit md:rounded-full bg-[#004AAD] px-4 flex items-center justify-center flex-wrap">
        <CallControls onLeave={handleLeaveCall} />
      </div>
    </section>
  );
};

export default MeetingRoom;
