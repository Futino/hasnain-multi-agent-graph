import { Request, Response } from "express";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { StateGraph } from "@langchain/langgraph";
import IntelliagentGraph from "./graph.controller";
import { AgentStateChannels, AnyMessage } from "./helper";
import { HumanMessage } from "@langchain/core/messages";
dotenv.config();

export const chatAgent = async (req: Request, res: Response) => {
  const llm = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.5,
    apiKey: process.env.OPENAI_API_KEY,
  });
  let userMessage = req.body.userMessage;
  let workflow: StateGraph<AgentStateChannels, unknown, string> =
    await IntelliagentGraph(llm, userMessage);
  const graph = workflow.compile();

  // Invoke the graph
  const baseResult = await graph.invoke({
    message: [new HumanMessage({ content: userMessage })],
  });
  console.log("Base Result: ", baseResult);
  res.json(baseResult);
};
