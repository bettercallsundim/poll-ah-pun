import myAxios from "@/lib/axios";
import { AnimatePresence, motion } from "framer-motion";

const options = [
  {
    option: "The first option",
    votes: 10,
  },
  {
    option: "The first option",
    votes: 30,
  },
  {
    option: "The first option",
    votes: 50,
  },
  {
    option: "The first option",
    votes: 70,
  },
];
const BarChart = ({ poll, polls, setPolls }) => {
  async function handleVote(option, ind) {
    console.log(option, "hiiiii");
    await myAxios
      .post("/poll/vote/" + poll.id + "/" + option.id)
      .then((res) => {
        console.log(res);
        setPolls((prev) => {
          const newPolls = [...prev];
          const newPollIndex = newPolls.findIndex((p) => p.id == poll.id);
          let newPoll = newPolls[newPollIndex];
          console.log("🚀 ~ setPolls ~ newPoll:", newPoll);
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
              <span>{parseInt(option.percentage).toFixed(2)}%</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BarChart;
