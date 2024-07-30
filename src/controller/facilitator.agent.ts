import { ChatOpenAI } from "@langchain/openai";
import type { RunnableConfig } from "@langchain/core/runnables";

import { AgentStateChannels, createAgent, runAgentNode } from "./helper";

export const createFacilitator = async (
  llm: ChatOpenAI,
  userMessage: string
) => {
  let systemMessage = `Instructions\n
Start by welcoming the participants.
Explain the importance of a well-defined brand purpose, highlighting that it goes beyond making a profit and serves as the core reason for the business's existence.
Introduce Brand Bot and Strategy Bot, explaining their roles in guiding through activities and discussions to uncover and refine the brand purpose.
You may call Strategy Bot for alignment and review the final brand purpose statement provided by the user.\n
Context
The user's question is: ${userMessage}
\n
Welcome, everyone! We're thrilled to have you join us for today's brand purpose workshop. The goal of this session is to help you articulate a clear and compelling brand purpose. A well-defined brand purpose is more than just a statement; it's the core reason your business exists beyond making a profit. It serves as a guiding light for your brand's mission, values, and strategies, creating a deeper connection with your audience.
\n
Let me introduce our key facilitators for today's workshop: Brand Bot and Strategy Bot. Together, they will guide you through a series of engaging activities and insightful discussions to uncover and refine your brand purpose.
\n
Feel free to call Strategy Bot for alignment and review your final brand purpose statement to ensure it aligns with your overall strategy.`;

  const agent = await createAgent({
    llm,
    systemMessage: systemMessage,
  });

  const node = (state: AgentStateChannels, config?: RunnableConfig) =>
    runAgentNode({ state, agent: agent, name: "facilitatorBot", config });

  return {
    node: node,

    agent: agent,
  };
};
