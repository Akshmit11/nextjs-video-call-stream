import MeetingType from "@/components/shared/MeetingType"
import Link from "next/link"

const Home = () => {
  return (
    <div className="flex flex-col gap-2 items-center">
      <MeetingType />
      <Link href={'/upcoming-meetings'} className="mt-2 bg-black hover:bg-black/85 text-white py-2 px-4 rounded-md text-[15px]">
        <h1>Upcoming Meetings</h1>
      </Link>
    </div>
  )
}

export default Home