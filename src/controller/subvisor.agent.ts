import { ChatOpenAI } from "@langchain/openai";
import type { RunnableConfig } from "@langchain/core/runnables";

import { AgentStateChannels, createAgent, runAgentNode } from "./helper";

export const createSubvisor = async (llm: ChatOpenAI, userMessage: string) => {
  let systemMessage = `Instructions
      Analyze the user's question: ${userMessage}\n
      Review the responses from the agents: facilitatorBot, brandBot, and strategyBot.
      Choose the most relevant parts of each response, combine them only when necessary, and edit for coherence and alignment with the user's question.
      Ignore any responses that do not contribute to answering the question effectively.
      Ensure the final response is clear, concise, and directly addresses the user's query.
      Context
      The user has asked the following question: ${userMessage}\n
      these are the response from different agents: {State}
      \n
      Responses from agents:
      \n
      facilitatorBot
      brandBot
      strategyBot
      Don't mention the name of the agents in the response,  
      Provide a well-crafted response that uses the best information from the agents to give the user a proper and comprehensive answer to their question.`;

  const agent = await createAgent({
    llm,
    systemMessage,
  });

  const node = (state: AgentStateChannels, config?: RunnableConfig) =>
    runAgentNode({ state, agent: agent, name: "subvisor", config });

  return {
    node: node,
    agent: agent,
  };
};
