"use client";

import Loading from "@/components/shared/Loading";
import MeetingRoom from "@/components/shared/MeetingRoom";
import MeetingSetup from "@/components/shared/MeetingSetup";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { MemberResponse, StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Meeting = () => {
  const { id } = useParams();
  const { user, isLoaded } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(id);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [members, setMembers] = useState<MemberResponse[]>();

  useEffect(() => {
    const checkParticipants = async () => {
      if (call) {
        try {
          const { members } = await call.queryMembers({});
          setParticipantsCount(members.length);
          setMembers(members);
        } catch (error) {
          console.log("Error querying members:", error);
        }
      }
    };

    const intervalId = setInterval(checkParticipants, 1000);
    return () => clearInterval(intervalId);
  }, [call]);

  if (!isLoaded || isCallLoading) return <Loading />;

  return (
    <div>
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete && call ? (
            <MeetingSetup
              setIsSetupComplete={setIsSetupComplete}
              participantsCount={participantsCount}
              members={members}
              call={call}
            />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </div>
  );
};

export default Meeting;
