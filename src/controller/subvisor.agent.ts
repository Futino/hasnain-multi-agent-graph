import { ChatOpenAI } from "@langchain/openai";
import type { RunnableConfig } from "@langchain/core/runnables";

import { AgentStateChannels, createAgent, runAgentNode } from "./helper";

export const createSubvisor = async (llm: ChatOpenAI, userMessage: string) => {
  let systemMessage = `Subvisor Agent:
  role: >
    Analyzer
  goal: >
    Review the responses from the agents: facilitatorBot, brandBot, and strategyBot. Understand the user's message and select the most suitable response that effectively answers the user's query.
  backstory: >
    You are proficient in analyzing and understanding various agent responses. Your skill lies in evaluating the relevance and effectiveness of each response to ensure that the user's query is addressed accurately and comprehensively. You prioritize clear and precise answers, ignoring any responses that do not contribute to the user's question.`;
  systemMessage += `Instructions
      Analyze the user's question: ${userMessage}\n
      Review the responses from the agents: facilitatorBot, brandBot, and strategyBot.
      Understand the user message and Pick the most suited response from the listed agents, which betters gives answer to the user's query.
      Ignore any responses that do not contribute to answering the question effectively.\n
      Context:
      The user has asked the following question: ${userMessage}\n
      Responses from agents: {State}
      \n
      Don't mention the name of the agents in the response
      `;

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
