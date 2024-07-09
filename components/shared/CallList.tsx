"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useGetCalls } from "@/hooks/useGetCalls";
import { Call } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import Loading from "./Loading";

const CallList = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { upcomingCalls, isLoading } = useGetCalls();

  if (isLoading) return <Loading />;

  return (
    <div className="w-full">
      {upcomingCalls && upcomingCalls.length > 0 ? (
        <div className="flex w-full gap-2 justify-center flex-wrap">
          {upcomingCalls.map((meeting: Call) => (
            <Card className="w-1/4" key={(meeting as Call).id}>
              <CardHeader>
                <CardTitle className="line-clamp-1">
                  {(meeting as Call).state?.custom?.description ||
                    "Problem Title"}
                </CardTitle>
                <CardDescription>
                  {(meeting as Call).state?.startsAt?.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex gap-2 justify-end">
                <Button
                  className="bg-blue-700"
                  onClick={() =>
                    router.push(`/meeting/${(meeting as Call).id}`)
                  }
                >
                  Start
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                        (meeting as Call).id
                      }`
                    );
                    toast({
                      title: "Link Copied",
                    });
                  }}
                >
                  Copy Link
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <h1>No Upcoming Calls</h1>
        </div>
      )}
    </div>
  );
};

export default CallList;
