"use client";

import { Button } from "../ui/button";

const CreateMeetingComponent = ({ createMeeting }: { createMeeting: () => void}) => {

  return (
    <div>
      <Button onClick={createMeeting}>Create A Meeting</Button>
    </div>
  );
};

export default CreateMeetingComponent;
