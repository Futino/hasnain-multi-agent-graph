import { JsonOutputToolsParser } from "langchain/output_parsers";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

import { Runnable, type RunnableConfig } from "@langchain/core/runnables";
import { AgentStateChannels } from "./helper";

export const createSupervisor = async (llm: ChatOpenAI, options: string[]) => {
  // prompt template
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Given the conversation above, should the answer need to be reiterated to the agents to get improved answer or should it be passed to user?
      "__end__" means the user should act next.
			Answer in ONE WORD by selecting one of the following options:  {options}
			`,
    ],
  ]);

  // pass options info
  const formattedPrompt = await prompt.partial({
    options: options.join(", "),
  });

  const chain = formattedPrompt.pipe(llm);

  const node = (state: AgentStateChannels, config?: RunnableConfig) =>
    supervisorNode({ state, chain, name: "supervisor", config });

  return node;
};

const supervisorNode = async (props: {
  state: AgentStateChannels;
  chain: Runnable;
  name: string;
  config?: RunnableConfig;
}) => {
  const { state, config, chain, name } = props;

  const res = await chain.invoke(state, config);
// condition for user should act next or agent
  return {
    next: res.content,
  };
};
