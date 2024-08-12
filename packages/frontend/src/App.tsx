import { useEffect, useState } from "react";
import CreatePoll from "./components/CreatePoll";
import Poll from "./components/Poll";
import myAxios from "./lib/axios";

interface PollOption {
  id: number;
  option: string;
  votes: VoteType[];
  percentage?: number; // optional if percentage is not always present
}

interface PollTypeResponse {
  id: number;
  title: string;
  description: string;
  totalVotes: number;
  options: PollOption[];
}

interface VoteType {
  id: number;
  ipId: number;
  pollId: number;
  optionId: number;
  createdAt: string; // or Date type if preferred
  updatedAt: string; // or Date type if preferred
}

function App() {
  const [polls, setPolls] = useState<PollTypeResponse[] | []>([]);

  async function getPolls() {
    await myAxios.get("/poll/all").then((res) => {
      console.log("🚀 ~ awaitmyAxios.get ~ res:", res);
      setPolls(res.data.data);
    });
  }
  useEffect(() => {
    getPolls();
  }, []);

  return (
    <div>
      <div>
        <CreatePoll />
      </div>
      <div className="text-2xl font-bold my-4">Polls</div>
      <div className="grid grid-cols-3  flex-wrap gap-y-8 gap-x-4">
        {polls.map((poll: PollTypeResponse) => {
          return (
            <Poll
              key={poll.id}
              poll={poll}
              className="w-[400px] min-h-[400px] rounded-md shadow-md  p-8 bg-gradient-to-b from-muted/50 to-muted border "
            >
              <Poll.Heading img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfVDpdwIqq-JPXXlOTDUQwJkZUKQpDYf8JOw&s" />

              <Poll.Title>{poll.title}</Poll.Title>
              <Poll.Chart poll={poll} polls={polls} setPolls={setPolls} />
            </Poll>
          );
        })}
      </div>
    </div>
  );
}

export default App;
