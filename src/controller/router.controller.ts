// This file is not been used, just for routing dynamically
import { JsonOutputToolsParser } from "langchain/output_parsers";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

export const createRouter = async (
  llm: ChatOpenAI,
  members: string[],
  roles: { [agent: string]: { tasks: string } }
) => {
  // prompt template
  let prompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder("message"),
    [
      "system",
      `Given the conversation above, who should talk to the user next?
			Answer can be an array, with one options or multiple by selecting the following options:  {members}
			Examples:-
			User: hey, hii hello, 
			Answer: facilitatorBot

			User: What inspired you to start your business?..., OR ,I am confused..., OR ,I need your help with (proceeds to ask a question or a query about wellness)..., etc.
			Answer: brandBot

			User: 
			Answer: strategyBot

			NOTE: '...' means the user may nor may not continue the sentence or say something similar to the topic. do not mistake this as an input.
			`,
    ],
  ]);

  prompt = await prompt.partial({
    members: members.join(", "),
    roles: JSON.stringify(roles),
  });

  const outputSchema = z.object({
    route: z.string().array().describe("The selected answer from the options"),
  });

  const chain = prompt.pipe(llm.withStructuredOutput(outputSchema));

  return chain;
};
