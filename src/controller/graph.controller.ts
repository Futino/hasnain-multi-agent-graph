import { END, START, StateGraph } from "@langchain/langgraph";

import type { ChatOpenAI } from "@langchain/openai";
import { AgentStateChannels, agentStateChannels } from "./helper";
import { createFacilitator } from "./facilitator.agent";
import { createBrandBot } from "./brandBot.controller";
import { createSubvisor } from "./subvisor.agent";
import { RunnableConfig } from "@langchain/core/runnables";
import { createStrategyBot } from "./strategyBot.agents";
import { createSupervisor } from "./supervisor.agent";

const IntelliagentGraph = async (
  llm: ChatOpenAI,
  userMessage: string
): Promise<StateGraph<AgentStateChannels, unknown, string>> => {
  const options = ["reiterate", END];
  
  const facilitator = await createFacilitator(llm, userMessage);
  const brandBot = await createBrandBot(llm, userMessage);
  const strategyBot = await createStrategyBot(llm, userMessage);
  const subvisor = await createSubvisor(llm, userMessage);
  const supervisor = await createSupervisor(llm, options);

  // create graph
  const workflow = new StateGraph<AgentStateChannels, unknown, string>({
    channels: agentStateChannels,
  })

    .addNode("facilitatorBot", facilitator.node)
    .addNode("brandBot", brandBot.node)
    .addNode("strategyBot", strategyBot.node)
    .addNode("subvisor", subvisor.node)
    .addNode("supervisor", supervisor)

    //add edges
    .addConditionalEdges(START, Routers)
    .addEdge("facilitatorBot", "subvisor")
    .addEdge("strategyBot", "subvisor")
    .addEdge("brandBot", "subvisor")
    .addEdge("subvisor", "supervisor")
    .addConditionalEdges("supervisor", (x: AgentStateChannels) =>
      x.next == "reiterate"
        ? ["facilitatorBot", "brandBot", "strategyBot"]
        : END
    );
  return workflow;
};
export default IntelliagentGraph;

// Multi route
const Routers = async (state: AgentStateChannels, config?: RunnableConfig) => {
  return ["facilitatorBot", "brandBot", "strategyBot"];
};
