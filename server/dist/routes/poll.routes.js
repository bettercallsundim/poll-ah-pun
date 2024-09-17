"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const poll_controller_1 = require("../controllers/poll.controller");
const router = express_1.default.Router();
// poll routes
router.post("/create", poll_controller_1.createPoll);
router.get("/all", poll_controller_1.getPolls);
router.get("/vote/all", poll_controller_1.getAllVotes);
router.post("/vote/:pollId/:optionId", poll_controller_1.vote);
exports.default = router;
