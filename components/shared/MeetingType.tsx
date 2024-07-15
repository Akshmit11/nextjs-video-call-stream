"use client";

import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CreateMeetingComponent from "./CreateMeetingComponent";
import MeetingModal from "./MeetingModal";
import ReactDatePicker from "react-datepicker";
import { Input } from "../ui/input";

const MeetingType = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  
  const [callDetail, setCallDetail] = useState<Call>();

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({
          title: "Please Select a Date and Time",
          variant: "destructive",
        });
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create new call");

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description =
        values.description ||
        `Video Call With Expert #${Math.random().toFixed(2)}`;
      
      await call.getOrCreate({
        members_limit: 2,
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
          members: [
            { user_id: "user_2j8iHLXTYFHiNRcrZGJAEC2EG75" },
            { user_id: "user_2iwnXBrcJozloonMEv5qmxo7G4v" },
          ],
          settings_override: {
            limits: {
              max_duration_seconds: 3600,
              max_participants: 2,
            },
          },
        },
      });

      setCallDetail(call);
      // console.log(call);
      if (
        values.dateTime.toISOString() === new Date(Date.now()).toISOString()
      ) {
        router.push(`/meeting/${call.id}`);
      }

      toast({
        title: "Meeting Created",
      });
    } catch (error) {
      console.log("error creating meeting>>>", error);
      toast({
        title: "Failed Setting Up A Meeting",
        variant: "destructive",
      });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;

  return (
    <div className="flex flex-col items-center">
      <CreateMeetingComponent createMeeting={createMeeting} />
      
      {!callDetail ? (
        <MeetingModal handleClick={createMeeting}>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded-md border p-2"
              preventOpenOnFocus
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          title="Meeting Created"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: "Link Copied" });
          }}
          buttonText="Copy Meeting Link"
        />
      )}

      <MeetingModal
        title="Join Meeting"
        buttonText="Join"
        handleClick={() => router.push(values.link)}
        triggerTitle={`Join Meeting`}
      >
        <Input
          placeholder="Meeting link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className=""
        />
      </MeetingModal>
    </div>
  );
};

export default MeetingType;
