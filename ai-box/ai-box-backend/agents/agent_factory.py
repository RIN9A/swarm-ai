import asyncio
import time
from typing import Any, Dict, List, Optional, TypedDict

from langchain.schema import HumanMessage, SystemMessage
from langchain_ollama import ChatOllama
from langgraph.graph import StateGraph

from agents.tools.base_tools import TOOLS_REGISTRY


class AgentState(TypedDict, total=False):
    input: str
    messages: List[Dict[str, Any]]
    tools: List[str]
    context: Dict[str, Any]
    iterations: int
    logs: List[Dict[str, Any]]
    tool_results: List[Dict[str, Any]]
    output: str


class ConfigurableAgent:
    def __init__(self, config: Dict[str, Any], llm_base_url: str):
        self.config = config
        self.llm_base_url = llm_base_url
        self.tools = self._load_tools(config.get("tools", []))
        self.llm = ChatOllama(model=config.get("model", "llama3.1:8b"), base_url=llm_base_url)
        self.graph = self._build_graph()

    def _load_tools(self, tool_names: List[str]):
        loaded = []
        for name in tool_names:
            tool = TOOLS_REGISTRY.get(name)
            if tool:
                loaded.append(tool)
        return loaded

    def _build_graph(self):
        graph = StateGraph(AgentState)

        async def input_processor(state: AgentState) -> AgentState:
            logs = state.get("logs", [])
            logs.append({"event": "input_received", "input": state["input"]})
            messages = state.get("messages", [])
            system_prompt = self.config.get("system_prompt", "You are an AI agent.")
            if not any(msg.get("role") == "system" for msg in messages):
                messages.append(SystemMessage(content=system_prompt))
            messages.append(HumanMessage(content=state["input"]))
            return {
                **state,
                "messages": messages,
                "logs": logs,
                "iterations": state.get("iterations", 0),
                "tool_results": state.get("tool_results", []),
            }

        async def agent_node(state: AgentState) -> AgentState:
            logs = state.get("logs", [])
            try:
                response = await self.llm.ainvoke(state["messages"])
                content = getattr(response, "content", str(response))
                logs.append({"event": "llm_response", "content": content})
                state["messages"].append(response)
                state["output"] = content
            except Exception as exc:  # pragma: no cover - defensive
                content = f"LLM error: {exc}"
                logs.append({"event": "llm_error", "error": str(exc)})
                state["output"] = content
            state["iterations"] = state.get("iterations", 0) + 1
            return {**state, "logs": logs}

        async def tool_executor(state: AgentState) -> AgentState:
            logs = state.get("logs", [])
            tool_results: List[Dict[str, Any]] = state.get("tool_results", [])
            for tool in self.tools:
                try:
                    result = tool.invoke({"input": state["input"]})  # simple single-input call
                    tool_results.append({"tool": tool.name, "result": result})
                    logs.append({"event": "tool_executed", "tool": tool.name})
                except Exception as exc:  # pragma: no cover
                    logs.append({"event": "tool_error", "tool": tool.name, "error": str(exc)})
            return {**state, "tool_results": tool_results, "logs": logs}

        async def output_formatter(state: AgentState) -> AgentState:
            logs = state.get("logs", [])
            logs.append({"event": "output_ready", "output": state.get("output")})
            return {**state, "logs": logs}

        graph.add_node("input_processor", input_processor)
        graph.add_node("agent", agent_node)
        graph.add_node("tool_executor", tool_executor)
        graph.add_node("output_formatter", output_formatter)

        graph.set_entry_point("input_processor")
        graph.add_edge("input_processor", "agent")
        graph.add_edge("agent", "tool_executor")
        graph.add_edge("tool_executor", "output_formatter")
        graph.set_finish_point("output_formatter")

        return graph.compile()

    async def execute(self, user_input: str, context: Optional[Dict[str, Any]] = None):
        start = time.time()
        initial_state: AgentState = {
            "input": user_input,
            "messages": [],
            "tools": self.config.get("tools", []),
            "context": context or {},
            "iterations": 0,
            "logs": [],
            "tool_results": [],
        }
        result_state: AgentState = await self.graph.ainvoke(initial_state)
        duration_ms = int((time.time() - start) * 1000)
        return {
            "output": result_state.get("output", ""),
            "status": "completed",
            "logs": result_state.get("logs", []),
            "tool_results": result_state.get("tool_results", []),
            "execution_time": duration_ms,
            "iterations": result_state.get("iterations", 0),
        }

