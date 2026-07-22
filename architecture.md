The AEGIS project operates as a full-stack, enterprise-grade multi-agent artificial intelligence ecosystem built with a decoupled architecture consisting of a **FastAPI/Python backend** and a **Next.js frontend**.

### 1. High-Level Architecture & Communication Flow

The system is designed to process user prompts, intelligently route tasks across a specialized team of 27 autonomous AI agents, leverage a Retrieval-Augmented Generation (RAG) knowledge base, and stream responses back to the interactive user interface in real-time.

* **The Frontend Layer:** Built within a Next.js App Router environment using TypeScript and Tailwind CSS, the application manages client-side authentication states, layout views, and real-time dashboard components (such as the `AgentOrchestratorDashboard`, `ExecutionGrid`, and `AgentChatWidget`) via a global `AppContext`.
* **The API Gateway / Backend Layer:** Powered by FastAPI, the backend handles incoming HTTP requests and WebSocket connections through isolated, modular routers (`auth.py`, `chat.py`, `ingest.py`, `dashboard.py`, `notifications.py`, `payments.py`, and `agents.py`). It enforces strict security, tenant isolation, and cryptographic webhook validations.

### 2. The Multi-Agent Routing Mechanics

At the center of the backend logic is the agent architecture, which coordinates 27 specialized agents grouped into specific domains: Core Engineering, Planning and Management, Business and Support, Specialized Utilities, and the Skill-Creator Suite.

* **The Orchestrator (`orchestrator.py`):** When a user submits a prompt, it hits the `OrchestratorAgent`. The orchestrator analyzes the intent of the prompt using an intelligent JSON-returning LLM call. It then decomposes the request into an execution plan and selects between one and three relevant specialized agents (e.g., routing financial queries to the `FinanceAgent` or legal queries to the `LegalAgent`).
* **Concurrent Execution:** Once the target agents are selected, the orchestrator executes their tasks concurrently using Python's `asyncio.gather`. Each agent utilizes its specialized system prompt (inherited from `base.py`) to process its subtask, invoking external tools or retrieving context as needed.
* **Aggregation:** The orchestrator compiles the results from all executing agents, packages them along with system metrics (such as active providers and execution plans), and returns a unified response payload back to the client interface.

### 3. LLM Provider Fallback & Multi-Tier Routing

Prompt processing and text generation are managed by the multi-tier LLM provider system (`llm_provider.py`), which implements a resilient fallback chain:

* **Priority Queue:** The system attempts to route calls sequentially through configured high-performance providers: first **NVIDIA NIM**, then **Groq**, and finally **Hugging Face Serverless**.
* **Model Tiers:** Prompts are categorized into "fast" or "smart" model tiers depending on computational requirements (e.g., utilizing larger models like Llama 3.3 70B for deep reasoning or smaller models for rapid classification).
* **Graceful Degradation:** If API keys are missing, rate limits (429) are hit, or providers experience downtime, the system automatically falls back down the chain, eventually dropping into a contextual mock generator to ensure the application never crashes.

### 4. Vector Storage and Retrieval-Augmented Generation (RAG)

To maintain organizational memory and allow agents to reference external documentation, AEGIS integrates a vector storage architecture powered by **Qdrant** (`qdrant_service.py`):

* **Ingestion Pipeline:** Files uploaded through the `ingest.py` router are parsed, split into text chunks, and converted into dense vector embeddings (using Hugging Face embedding models or deterministic fallbacks).
* **Vector Upsertion:** These vectors are tagged with rich metadata (source files, page numbers, text segments) and upserted into a centralized Qdrant collection named `aegis_knowledge`.
* **Semantic Similarity Search:** During user interactions, queries are embedded and matched against the vector database using cosine similarity. The retrieved context chunks are then injected into the agent's prompt context, allowing the LLM to ground its responses in factual documents with proper citations.
