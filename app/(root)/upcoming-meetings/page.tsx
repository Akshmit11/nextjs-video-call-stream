import CallList from "@/components/shared/CallList"

const UpcomingMeetings = () => {
  
  return (
    <div className="w-full h-full flex flex-col items-center gap-2">
      <h1>Upcoming Meetings</h1>
      <CallList />
    </div>
  )
}

export default UpcomingMeetings