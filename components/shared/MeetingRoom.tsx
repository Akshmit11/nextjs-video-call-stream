"use client";

import { cn } from "@/lib/utils";
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  useParticipantViewContext,
} from "@stream-io/video-react-sdk";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, LayoutList } from "lucide-react";
import EndCallButton from "./EndCallButton";
import Loading from "./Loading";
import { useUser } from "@clerk/nextjs";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const router = useRouter();

  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();

  const { user } = useUser();
  
  const CustomParticipantViewUIBar = () => {
    const { participant } = useParticipantViewContext();
  
    return (
      <div className="bar-participant-name">
        {participant.name}
      </div>
    );
  };
  
  const CustomParticipantViewUISpotlight = () => {
    const { participant } = useParticipantViewContext();
  
    return (
      <div className="spotlight-participant-name">
        {participant.name}
      </div>
    );
  };

  const CustomParticipantViewUI = () => {
    const { participant } = useParticipantViewContext();
  
    return (
      <div className="participant-name">{participant.name}</div>
    );
  };


  if (callingState !== CallingState.JOINED) return <Loading />;

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative flex-1 w-screen">
      <div className="flex w-full items-center text-white gap-4">
        <PaginatedGridLayout ParticipantViewUI={CustomParticipantViewUI} />
      </div>

      <div className="fixed bottom-0 left-0 flex w-full items-center justify-center gap-5 flex-wrap bg-black">
        <CallControls onLeave={() => router.push(`/`)} />
        {/* <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu> */}
        {/* <CallStatsButton /> */}
        {/* <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] ">
            <Users size={20} className="text-white" />
          </div>
        </button> */}
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
