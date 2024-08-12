import express from "express";
import {
  createPoll,
  getAllVotes,
  getPolls,
  vote,
} from "../controllers/poll.controller";

const router = express.Router();

// poll routes
router.post("/create", createPoll);
router.get("/all", getPolls);
router.get("/vote/all", getAllVotes);
router.post("/vote/:pollId/:optionId", vote);

export default router;
