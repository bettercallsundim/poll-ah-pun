import { IP, Option, Poll, Vote } from "@prisma/client";

export type IPoll = Poll;
export type IIP = IP;
export type IOption = Option;
export type IVote = Vote;

export function greet() {
  console.log("Hello from the backend!");
}
