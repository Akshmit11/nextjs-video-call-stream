"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"

const CreateMeetingComponent = () => {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast()
  const client = useStreamVideoClient();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setCallDetails] = useState<Call>()

  const createMeeting = async () => {
    if(!client || !user) return;

    try {

      if(!values.dateTime) {
        toast({
          title: "Please Select a Date and Time",
          variant: "destructive"
        });
        return;
      }

        const id = crypto.randomUUID();
        const call = client.call('default', id);

        if(!call) throw new Error("Failed to create new call");

        const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
        const description = values.description || 'Video Call With Expert';
        await call.getOrCreate({
          data: {
            starts_at: startsAt,
            custom: {
              description,
            }
          }
        });

        setCallDetails(call);

        if(!values.description) {
          router.push(`/meeting/${call.id}`)
        }

        toast({
          title: "Meeting Created",
        });

    } catch (error) {
        console.log("error creating meeting>>>",error)
        toast({
          title: "Failed Setting Up A Meeting",
          variant: "destructive"
        })
    }

  }

  return (
    <div>
      <Button onClick={createMeeting}>Create A Meeting</Button>
    </div>
  );
};

export default CreateMeetingComponent;
