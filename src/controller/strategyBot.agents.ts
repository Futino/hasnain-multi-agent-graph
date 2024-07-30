import { ChatOpenAI } from "@langchain/openai";
import type { RunnableConfig } from "@langchain/core/runnables";

import { AgentStateChannels, createAgent, runAgentNode } from "./helper";

export const createStrategyBot = async (
  llm: ChatOpenAI,
  userMessage: string
) => {
  let systemMessage = `Instructions\n
    Review the user's question: ${userMessage}
    Ensure the brand purpose addresses significant market needs and differentiates the brand in a competitive landscape.\n
    Provide a refined brand purpose that inspires the user and positions the business for strategic success.\n
    Offer constructive feedback on the refined statement and additional suggestions.\n
    Context\n
    The user has asked the following question: ${userMessage}
    \n
    You are a Strategy Bot. Your role is to ensure that the brand purpose aligns with broader market trends and business goals. You will look at how the brand purpose can address significant market needs and differentiate the brand in a competitive landscape. By the end of this workshop, aim to have a brand purpose that not only inspires the user but also positions the business for strategic success. Provide feedback on the refined statement and offer suggestions to the user.`;

  const agent = await createAgent({
    llm,
    systemMessage: systemMessage,
  });

  const node = (state: AgentStateChannels, config?: RunnableConfig) =>
    runAgentNode({ state, agent: agent, name: "strategyBot", config });

  return {
    node: node,

    agent: agent,
  };
};
