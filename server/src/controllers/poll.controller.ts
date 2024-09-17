import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import db from "../db";
import OhError from "../utils/errorHandler";

export const createPoll = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, options } = req.body;
      const ip = req.clientIp;
      if (ip) {
        let existsIp = await db.iP.findUnique({
          where: {
            ip,
          },
        });
        if (!existsIp) {
          existsIp = await db.iP.create({
            data: {
              ip: ip,
            },
          });
        }
        if (existsIp) {
          // Create the poll
          let newPoll = await db.poll.create({
            data: {
              title,
              description,
              authorId: existsIp.id,
              options: {
                create: options.map((option: any) => ({
                  option,
                })),
              },
            },
            include: {
              options: {
                include: {
                  votes: true, // Include votes for each option
                },
              },
              author: true,
              votes: true, // This includes votes for the poll itself, but it's redundant in this case
            },
          });

          res.status(201).json({
            data: {
              ...newPoll,
              options: newPoll.options.map((option) => ({
                ...option,
                percentage: 0,
              })),
              totalVotes: 0,
            },
          });
        }
      } else {
        throw new OhError(400, "error.message");
      }
    } catch (error) {
      console.log("🚀 ~ error:", error);
      throw new OhError(400, "error.message");
    }
  }
);

export const getPolls = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const polls = await db.poll.findMany({
      include: {
        options: {
          include: {
            votes: true, // Include votes for each option
          },
        },
        author: true,
        votes: true, // This includes votes for the poll itself, but it's redundant in this case
      },
    });

    const result = polls.map((poll) => {
      // Total votes in the poll
      const totalVotes = poll.votes.length;

      // Map each option with its vote percentage
      const optionsWithPercentages = poll.options.map((option) => {
        const optionVotes = option.votes.length;
        const percentage =
          totalVotes === 0 ? 0 : (optionVotes / totalVotes) * 100;
        return {
          ...option,
          percentage,
        };
      });

      return {
        ...poll,
        totalVotes,
        options: optionsWithPercentages,
      };
    });

    res.status(200).json({ data: result });
  }
);

export const vote = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { pollId, optionId } = req.params;
    const ip = req.clientIp;

    if (!pollId || !optionId || !ip) {
      res.status(400).json({ error: "pollId, optionId, and ip are required." });
    } else {
      try {
        // Check if the IP exists
        let existsIp = await db.iP.findUnique({
          where: {
            ip: ip,
          },
        });

        // If the IP does not exist, create it
        if (!existsIp) {
          existsIp = await db.iP.create({
            data: {
              ip: ip,
            },
          });
        }

        // Create the vote
        const newVote = await db.vote.create({
          data: {
            ipId: existsIp.id,
            pollId: +pollId,
            optionId: +optionId,
          },
        });

        res.status(201).json({ data: newVote });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ error: "An error occurred while creating the vote." });
      }
    }
  }
);

export const getAllVotes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const votes = await db.vote.findMany({
        include: {
          ip: true,
          poll: true,
          option: true,
        },
      });
      res.status(200).json(votes);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving the votes." });
    }
  }
);
