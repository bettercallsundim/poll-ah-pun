import { Poll as PollType } from "@prisma/client";
import React, { createContext, useContext } from "react";

import BarChart from "./BarChart";

const PollContext = createContext<PollType | undefined>(undefined);
function GetPollContext() {
  return useContext(PollContext);
}
const Poll = ({
  children,
  poll,
  ...props
}: {
  children: React.ReactNode;
  poll: PollType;
}) => {
  return (
    <PollContext.Provider value={poll}>
      <div {...props}>{children}</div>
    </PollContext.Provider>
  );
};

Poll.Heading = ({ img }: { img: string }) => {
  return (
    <div className="flex items-center gap-x-4 mb-6">
      <img className="w-16 h-16 rounded-full" src={img} alt="" />
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
  poll: PollType;
  polls: PollType[];
  setPolls: React.Dispatch<React.SetStateAction<PollType[]>>;
}) => {
  return <BarChart poll={poll} polls={polls} setPolls={setPolls} />;
};

export default Poll;
