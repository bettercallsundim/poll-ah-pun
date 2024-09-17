import React, { createContext } from "react";

import BarChart from "./BarChart";
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
const PollContext = createContext<PollTypeResponse | undefined>(undefined);
// function GetPollContext() {
//   return useContext(PollContext);
// }
const Poll = ({
  children,
  poll,
  ...props
}: {
  children: React.ReactNode;
  poll: PollTypeResponse;
  [key: string]: unknown;
}) => {
  return (
    <PollContext.Provider value={poll}>
      <div {...props}>{children}</div>
    </PollContext.Provider>
  );
};

Poll.Heading = () => {
  return (
    <div className="flex items-center gap-x-4 mb-6">
      <img
        className="w-16 h-16 rounded-full"
        src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${new Date().toISOString()}`}
        alt=""
      />
      <span>Anonymus Member</span>
    </div>
  );
};

Poll.Title = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-xl font-bold mb-4">{children}</div>;
};

Poll.Chart = ({
  poll,
  polls,
  setPolls,
}: {
  poll: PollTypeResponse;
  polls: PollTypeResponse[];
  setPolls: React.Dispatch<React.SetStateAction<PollTypeResponse[]>>;
}) => {
  return <BarChart poll={poll} polls={polls} setPolls={setPolls} />;
};

export default Poll;
