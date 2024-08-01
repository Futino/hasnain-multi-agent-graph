import { JsonOutputToolsParser } from "langchain/output_parsers";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { Runnable, type RunnableConfig } from "@langchain/core/runnables";


export const createSupervisor = async (llm: ChatOpenAI, options: string[]) => {
  // prompt template
  let prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Given the conversation above, should the answer need to be reiterated to the agents to get improved answer or should it be passed to user?
      "__end__" means the user should act next.
			Answer in ONE WORD by selecting one of the following options:  {options}
			`,
    ],
  ]);

  // pass options info
  prompt = await prompt.partial({
    options: options.join(", "),
  });

  const outputSchema = z.object({
    next: z.string().describe("The selected answer from the options"),
  });

  const chain = prompt.pipe(llm.withStructuredOutput(outputSchema));

  return chain;
};

