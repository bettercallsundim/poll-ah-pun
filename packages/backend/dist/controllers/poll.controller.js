"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVotes = exports.vote = exports.getPolls = exports.createPoll = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const db_1 = __importDefault(require("../db"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
exports.createPoll = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, options } = req.body;
        const ip = req.clientIp;
        if (ip) {
            let existsIp = yield db_1.default.iP.findUnique({
                where: {
                    ip,
                },
            });
            if (!existsIp) {
                existsIp = yield db_1.default.iP.create({
                    data: {
                        ip: ip,
                    },
                });
            }
            if (existsIp) {
                // Create the poll
                const newPoll = yield db_1.default.poll.create({
                    data: {
                        title,
                        description,
                        authorId: existsIp.id,
                        options: {
                            create: options.map((option) => ({
                                option,
                            })),
                        },
                    },
                    include: {
                        options: true,
                    },
                });
                res.status(201).json({ data: newPoll });
            }
        }
        else {
            throw new errorHandler_1.default(400, "error.message");
        }
    }
    catch (error) {
        console.log("🚀 ~ error:", error);
        throw new errorHandler_1.default(400, "error.message");
    }
}));
exports.getPolls = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const polls = yield db_1.default.poll.findMany({
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
            const percentage = totalVotes === 0 ? 0 : (optionVotes / totalVotes) * 100;
            return Object.assign(Object.assign({}, option), { percentage });
        });
        return Object.assign(Object.assign({}, poll), { totalVotes, options: optionsWithPercentages });
    });
    res.status(200).json({ data: result });
}));
exports.vote = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pollId, optionId } = req.params;
    const ip = req.clientIp;
    if (!pollId || !optionId || !ip) {
        res.status(400).json({ error: "pollId, optionId, and ip are required." });
    }
    else {
        try {
            // Check if the IP exists
            let existsIp = yield db_1.default.iP.findUnique({
                where: {
                    ip: ip,
                },
            });
            // If the IP does not exist, create it
            if (!existsIp) {
                existsIp = yield db_1.default.iP.create({
                    data: {
                        ip: ip,
                    },
                });
            }
            // Create the vote
            const newVote = yield db_1.default.vote.create({
                data: {
                    ipId: existsIp.id,
                    pollId: +pollId,
                    optionId: +optionId,
                },
            });
            res.status(201).json({ data: newVote });
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .json({ error: "An error occurred while creating the vote." });
        }
    }
}));
exports.getAllVotes = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const votes = yield db_1.default.vote.findMany({
            include: {
                ip: true,
                poll: true,
                option: true,
            },
        });
        res.status(200).json(votes);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "An error occurred while retrieving the votes." });
    }
}));
