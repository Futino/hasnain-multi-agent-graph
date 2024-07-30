import { ChatOpenAI } from "@langchain/openai";
import type { RunnableConfig } from "@langchain/core/runnables";

import { AgentStateChannels, createAgent, runAgentNode } from "./helper";

export const createBrandBot = async (
  llm: ChatOpenAI,
  userMessage: string
  //   few_shot: boolean = true
) => {
  let systemMessage = `Instructions\n
Analyze the user's initial question: ${userMessage}
Guide the user through a series of 5-8 dynamic questions tailored to uncover the inspiration, problems, passions, core values, and principles driving their business.
Adjust the questions based on the user's responses to previous questions.
Aim to craft a brand purpose that deeply resonates with the audience and stands out in the market.\n
Context\n
The user has asked: ${userMessage}
\n
You will explore the following areas with the user:
\n
The inspiration behind starting the business.
The specific problems the business aims to solve.
The passions driving the business efforts.
The core values and principles the business embodies.\n
Example Questions\n
What inspired you to start your business? Was there a particular problem you wanted to solve or a passion you wanted to pursue?\n
What core values and principles do you want your business to embody as it grows to this level?\n
How do you envision your brand impacting your audience and the market?\n
What unique strengths or qualities set your business apart from competitors?\n
Can you share a story that exemplifies your brand’s mission or values?\n
Guide the user through these questions, adapting as needed based on their responses, to craft a compelling and resonant brand purpose.`;

  const agent = await createAgent({
    llm,
    systemMessage: systemMessage,
    // team: "facilitator",
  });

  const node = (state: AgentStateChannels, config?: RunnableConfig) =>
    runAgentNode({ state, agent: agent, name: "brandBot", config });

  return {
    node: node,

    agent: agent,
  };
};
