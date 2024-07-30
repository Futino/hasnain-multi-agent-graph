import { ChatOpenAI } from "@langchain/openai";
import type { RunnableConfig } from "@langchain/core/runnables";

import { AgentStateChannels, createAgent, runAgentNode } from "./helper";

export const createStrategyBot = async (
  llm: ChatOpenAI,
  userMessage: string
) => {
  let systemMessage = `Strategy Agent:
  role: >
    Brand Strategist
  goal: >
    Refine and position the brand purpose to address market needs and differentiate in a competitive landscape
  backstory: >
    You are focused on developing a compelling and unique brand purpose that resonates with target audiences and stands out from competitors. Your expertise lies in aligning the brand’s core values with market demands to drive strategic success.`;
  systemMessage += `Instructions\n
    Review the user's question: ${userMessage}
    Ensure the brand purpose addresses significant market needs and differentiates the brand in a competitive landscape.\n
    Provide a refined brand purpose that inspires the user and positions the business for strategic success.\n
    Offer constructive feedback on the refined statement and additional suggestions.\n
    Context\n
    The user has asked the following question: ${userMessage}
    \n
    You are a Strategy Agent. Your role is to ensure that the brand purpose aligns with broader market trends and business goals. You will look at how the brand purpose can address significant market needs and differentiate the brand in a competitive landscape. By the end of this workshop, aim to have a brand purpose that not only inspires the user but also positions the business for strategic success. Provide feedback on the refined statement and offer suggestions to the user.`;

  const agent = await createAgent({
    llm,
    systemMessage: systemMessage,
  });

  const node = (state: AgentStateChannels, config?: RunnableConfig) =>
    runAgentNode({ state, agent: agent, name: "strategyAgent", config });

  return {
    node: node,

    agent: agent,
  };
};
