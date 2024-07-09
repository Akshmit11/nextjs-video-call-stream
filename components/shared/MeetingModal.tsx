import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

interface MeetingModalProps {
  title?: string;
  children?: ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  triggerTitle?: string
}

const MeetingModal = ({
  title,
  children,
  handleClick,
  buttonText,
  triggerTitle
}: MeetingModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild className="mt-4">
        <Button>{triggerTitle || "Schedule A Meeting"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title || "Schedule A Meeting"}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">{children}</div>
        <DialogFooter>
          <Button onClick={handleClick}>
            {buttonText || "Schedule Meeting"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
