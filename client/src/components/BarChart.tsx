import myAxios from "@/lib/axios";
import { AnimatePresence, motion } from "framer-motion";

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
const BarChart = ({
  poll,
  setPolls,
}: {
  poll: PollTypeResponse;
  polls: PollTypeResponse[];
  setPolls: React.Dispatch<React.SetStateAction<PollTypeResponse[]>>;
}) => {
  async function handleVote(option: unknown, ind: number) {
    console.log(option, "hiiiii");
    await myAxios
      // @ts-expect-error gonna fix this later
      .post("/poll/vote/" + poll.id + "/" + option.id)
      .then((res) => {
        console.log(res);
        setPolls((prev) => {
          const newPolls = [...prev];
          const newPollIndex = newPolls.findIndex((p) => p.id == poll.id);
          const newPoll: PollTypeResponse = newPolls[newPollIndex];
          console.log("🚀 ~ setPolls ~ newPoll:", newPoll);
          // @ts-expect-error gonna fix this later
          newPoll.options[ind].votes.push({});
          newPoll.totalVotes += 1;
          newPoll.options.forEach((option, ind) => {
            newPoll.options[ind].percentage = Math.round(
              (option.votes.length / newPoll.totalVotes) * 100
            );
          });
          newPolls[newPollIndex] = newPoll;
          return newPolls;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div>
      <AnimatePresence>
        {poll?.options?.map((option, ind) => (
          <motion.div
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            }}
            transition={{
              duration: 0.25,
            }}
            className="mb-4 cursor-pointer rounded p-2"
            onClick={() => handleVote(option, ind)}
            key={option.id}
          >
            <div>
              {ind + 1}. {option.option}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="w-full rounded-lg   border border-blue-400 mx-2">
                <motion.div
                  className="bg-blue-500 h-8 text-white font-sembold flex rounded-lg  items-center justify-center #px-4 mr-2"
                  initial={{ width: 0, opacity: 0 }}
                  exit={{ width: 0, opacity: 0 }}
                  animate={{
                    width: `${option.percentage}%`,
                    opacity: 1,
                  }}
                  transition={{
                    delay: 0.5,
                    duration: 0.5,
                  }}
                ></motion.div>
              </div>
              {/* @ts-expect-error gonna fix this later */}
              <span>{parseInt(option.percentage).toFixed(2)}%</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BarChart;
