import os, asyncio
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langgraph.graph import StateGraph, END
from pydantic import BaseModel
from langchain_core.output_parsers import PydanticOutputParser
from dotenv import load_dotenv
import os

load_dotenv()  # loads .env variables

print("OPENAI_API_KEY =", os.getenv("OPENAI_API_KEY"))  # optional check
print("SENDGRID_API_KEY =", os.getenv("SENDGRID_API_KEY"))


class EmailOutput(BaseModel):
    subject: str
    body: str

parser = PydanticOutputParser(pydantic_object=EmailOutput)

SYSTEM_PROMPT = """You generate personalized cold emails based on the subject and details provided by the user.
Write clear, concise, human-sounding emails that feel natural and tailored to the recipient.
Use a simple structure: hook → value → relevance → CTA.
Keep it short and avoid fluff, clichés, and generic templates.
Do NOT hallucinate facts, do NOT invent recipient details, and do NOT mention AI or internal reasoning.
Adapt tone based on user instructions (professional, friendly, casual, direct).
Your output must be a complete cold email ready to send"""


llm = ChatOpenAI(
    model="openai/gpt-oss-20b:free",
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
    
    
)

async def llm_node(state):
    response = await llm.ainvoke(state["messages"])
    return {"messages": state["messages"] + [response]}

graph = StateGraph(dict)
graph.add_node("llm", llm_node)
graph.set_entry_point("llm")
graph.add_edge("llm", END)
app = graph.compile()

async def run_graph(user_message, history):
    messages = [SystemMessage(content=SYSTEM_PROMPT)]

    for h in history:
        if h["role"] == "user":
            messages.append(HumanMessage(content=h["content"]))
        else:
            messages.append(AIMessage(content=h["content"]))

    # Add format instructions so LLM outputs JSON
    format_instructions = parser.get_format_instructions()
    messages.append(HumanMessage(content=f"{user_message}\n\n{format_instructions}"))

    result = await app.ainvoke({"messages": messages})
    return result["messages"][-1].content

def chatbot(user_message, history):
    return asyncio.run(run_graph(user_message, history))
