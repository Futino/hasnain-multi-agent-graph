import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { END, type StateGraphArgs } from "@langchain/langgraph";
import type {
  AIMessage,
  FunctionMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";

import type { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { StructuredTool } from "@langchain/core/tools";
import { Runnable, type RunnableConfig } from "@langchain/core/runnables";

import { convertToOpenAITool } from "@langchain/core/utils/function_calling";

export async function createAgent({
  llm,
  systemMessage,
}: {
  llm: ChatOpenAI;
  systemMessage: string;
}): Promise<Runnable> {
  let prompt = ChatPromptTemplate.fromMessages([
    ["system", systemMessage],
    new MessagesPlaceholder("State"),
    
  ]);

  return prompt.pipe(llm);
}
type AgentNodeProps = {
  state: AgentStateChannels;
  config?: RunnableConfig;
  agent: Runnable;
  name: string;
};
export async function runAgentNode(props: AgentNodeProps) {
  const { state, agent, name, config } = props;
  console.log(state, "&*&%$%%$%$%state");
  let result = await agent.invoke(
    { State: JSON.stringify(state.llmState) },
    config
  );
  result.name = name;

  state.llmState.push({ name: name, solution: result.content });

  return {
    message: [result],
  };
}

export type AnyMessage =
  | ToolMessage
  | AIMessage
  | HumanMessage
  | FunctionMessage
  | SystemMessage;

export interface AgentStateChannels {
  message: AnyMessage[];
  next: string;
  route: string[];
  llmState: Record<string, any>[];
}
// times:string,output:string
// This defines the object that is passed between each node
// in the graph. We will create different nodes for each agent and tool
export const agentStateChannels: StateGraphArgs<AgentStateChannels>["channels"] =
  {
    message: {
      value: (x?: AnyMessage[], y?: AnyMessage[]) => (x ?? []).concat(y ?? []),
      default: () => [] as AnyMessage[],
    },
    next: {
      value: (x?: string, y?: string) => y ?? x ?? END,
      default: () => END,
    },
    route: {
      value: (x?: string[], y?: string[]) => y ?? x ?? [],
      default: () => [],
    },
    llmState: {
      value: (x?: [], y?: []) => y ?? x ?? [{}],
      default: () => [],
    },
  };
