# AEGIS System Architecture & Code Coverage Report

## System Architecture Overview

### High-Level Architecture
The AEGIS (Autonomous Enterprise Growth Intelligence System) operates as a full-stack, enterprise-grade multi-agent artificial intelligence ecosystem with a decoupled architecture consisting of:
- **Frontend Layer**: Next.js App Router with TypeScript and Tailwind CSS
- **Backend Layer**: FastAPI/Python backend with modular API routers
- **AI Agent Layer**: 27 specialized AI agents organized into functional domains
- **Data Layer**: Vector storage (Qdrant), relational databases (PostgreSQL/Supabase), and caching (Redis)
- **AI/ML Layer**: Multi-tier LLM provider system with fallback mechanisms
- **Infrastructure**: Monitoring, observability, and deployment infrastructure

### Detailed Architecture Components

#### 1. Frontend Layer (`/frontend`)
- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Huly design system
- **State Management**: React Context API via `AppContext`
- **Key Components**:
  - `AgentOrchestratorDashboard`: Main dashboard for agent orchestration
  - `ExecutionGrid`: Visualizes agent execution workflows
  - `AgentChatWidget`: Real-time chat interface with AI agents
  - Authentication flows and organization management interfaces
  - Module-specific dashboards (CRM, Marketing, Finance, etc.)

#### 2. Backend Layer (`/backend`)
- **Framework**: FastAPI
- **Language**: Python 3.12+
- **API Structure**: Modular API routers organized by functionality:
  - `auth.py`: Authentication, OAuth, MFA, RBAC, Organizations
  - `chat.py`: Real-time chat endpoints with WebSocket support
  - `ingest.py`: Document ingestion and processing pipelines
  - `dashboard.py`: Dashboard metrics and analytics endpoints
  - `notifications.py`: Notification delivery systems
  - `payments.py`: Payment processing and subscription management
  - `agents.py`: Agent orchestration and task delegation endpoints
  - `dashboard.py`: Administrative dashboard endpoints
- **Middleware**: CORS, authentication, request logging, error handling

#### 3. AI Agent System (`/backend/agents`)
The core intelligence of AEGIS consists of 27 specialized agents organized into domains:

##### Core Engineering Agents
- **CEO Agent**: Strategic decision-making and business orchestration
- **Planning Agent**: Strategic planning and roadmap creation
- **Research Agent**: Deep research and information synthesis
- **Analytics Agent**: Data analysis and insight generation
- **Finance Agent**: Financial analysis, forecasting, and reporting
- **HR Agent**: Human resources, recruitment, and personnel management
- **Legal Agent**: Legal research, contract analysis, and compliance
- **Marketing Agent**: Campaign strategy, content creation, and market analysis

##### Specialized Utility Agents
- **Skill Creator Agent**: Creates custom agent skills and capabilities
- **Workflow Agent**: Automates business processes and workflows
- **Document Intelligence Agent**: Document processing, extraction, and summarization
- **Meeting Intelligence Agent**: Meeting transcription, summarization, and action items
- **Customer Intelligence Agent**: Customer behavior analysis and segmentation

##### Business & Support Agents
- **Sales Agent**: Lead generation, opportunity management, and sales forecasting
- **Support Agent**: Customer service automation and ticket resolution
- **Operations Agent**: Process optimization and operational efficiency
- **Product Agent**: Product development and feature prioritization
- **Growth Agent**: Growth hacking, user acquisition, and retention strategies

#### 4. Agent Orchestration (`/backend/agents/base.py` and `/backend/agents/orchestrator.py`)
- **BaseAgent Class**: Provides common functionality for all agents including:
  - LLM provider integration with fallback mechanisms
  - Memory management (short-term and long-term)
  - Tool usage framework
  - Error handling and logging
- **OrchestratorAgent**: Central coordinator that:
  1. Analyzes user prompts to determine intent
  2. Decomposes complex requests into subtasks
  3. Selects appropriate specialized agents (1-3 agents per task)
  4. Executes agent tasks concurrently using `asyncio.gather`
  5. Aggregates results and returns unified response to frontend

#### 5. LLM Provider System (`/backend/llm_provider.py`)
Multi-tier fallback system for language model processing:
- **Priority Queue**: NVIDIA NIM → Groq → Hugging Face Serverless
- **Model Tiers**: 
  - Fast Tier: Smaller models for classification and simple tasks
  - Smart Tier: Larger models (Llama 3.3 70B) for complex reasoning
- **Graceful Degradation**: Automatic fallback when APIs are unavailable or rate-limited
- **Contextual Mock Generator**: Fallback that provides contextual responses when all providers fail

#### 6. Retrieval-Augmented Generation (RAG) System (`/backend/qdrant_service.py`)
- **Vector Database**: Qdrant for high-performance vector similarity search
- **Embedding Models**: Hugging Face BGE embeddings with deterministic fallbacks
- **Ingestion Pipeline**: 
  1. Document processing (PDF, DOCX, TXT, etc.)
  2. Text chunking with overlap preservation
  3. Vector embedding generation
  4. Metadata tagging (source, timestamp, document type)
  5. Upsertion to Qdrant collection `aegis_knowledge`
- **Retrieval Mechanism**:
  1. Query embedding generation
  2. Cosine similarity search against knowledge base
  3. Context injection into agent prompts with source citations

#### 7. Data Storage Layer
- **Primary Database**: PostgreSQL/Supabase for relational data (users, organizations, documents, etc.)
- **Cache Layer**: Redis for session management and temporary caching
- **Vector Store**: Qdrant for semantic search and knowledge retrieval
- **File Storage**: Integrated with Supabase storage for document uploads

#### 8. Infrastructure & Observability
- **Monitoring**: LangSmith for LLM operations tracing
- **Metrics**: Prometheus + Grafana for system metrics
- **Logging**: Structured logging with OpenTelemetry integration
- **Deployment**: Containerized with Docker, orchestrated via docker-compose

### Communication Flow

1. **User Interaction**: User interacts with Next.js frontend (chat, dashboard, etc.)
2. **API Request**: Frontend sends HTTP/WebSocket request to FastAPI backend
3. **Authentication**: Request authenticated via JWT/OAuth middleware
4. **Routing**: Request directed to appropriate API router (chat, agents, etc.)
5. **Orchestration**: For agent-related requests, OrchestratorAgent processes the request:
   - Intent analysis using LLM
   - Task decomposition and agent selection
   - Concurrent agent execution via asyncio
   - Context retrieval from Qdrant vector store
   - Result aggregation and formatting
6. **Response**: Unified response sent back to frontend
7. **Real-time Updates**: WebSocket connections maintain live updates for ongoing processes

## Code Coverage Explanation

### Current Testing Status
As of the current repository state, the project has:
- **Backend Tests**: Located in `/backend/tests/` directory with unit tests for:
  - Authentication module (`test_auth.py`)
  - Agent orchestrator (`test_agents_orchestrator.py`)
  - Specialized agents (`test_agents_specialized.py`)
  - Configuration and configuration loading
- **Frontend Tests**: Limited frontend testing currently implemented
- **Integration Tests**: Basic API endpoint testing

### Test Framework
- **Backend**: Pytest framework with async support for FastAPI endpoints
- **Frontend**: Jest testing framework (configured but limited test coverage)
- **Mocking**: pytest-mock for mocking external dependencies (LLM providers, databases)
- **Fixtures**: Pytest fixtures for database connections, test clients, and mock services

### Coverage Guidelines
To maintain quality standards, the project follows these coverage principles:

1. **Critical Path Coverage**: 
   - Authentication flows (login, logout, token refresh)
   - Agent orchestration and task delegation
   - Document ingestion and retrieval pipelines
   - WebSocket connection handling

2. **Component Coverage**:
   - All API endpoints should have corresponding test cases
   - Agent base classes and core functionality
   - Utility functions and helper modules
   - Configuration and settings validation

3. **Integration Coverage**:
   - End-to-end workflows for key user journeys
   - Database interaction tests with transaction rollback
   - External service mocking (LLM providers, vector databases)
   - WebSocket message handling and broadcasting

### Running Tests
To execute the test suite:

```bash
# Backend tests
cd backend
pytest tests/ -v

# Frontend tests  
cd frontend
npm test
```

### Coverage Reporting
While comprehensive coverage reports aren't currently configured, the recommended approach would be:

```bash
# Backend coverage with pytest-cov
cd backend
pytest --cov=backend --cov-report=html --cov-report=term-missing

# Frontend coverage  
cd frontend
npm run test -- --coverage
```

### Areas Requiring Additional Test Coverage
Based on the architecture review, the following areas should prioritize test development:

1. **Agent-Specific Logic**: Individual agent implementations in `/backend/agents/`
2. **RAG Pipeline**: Document processing, chunking, embedding, and retrieval
3. **LLM Provider Fallback**: Testing fallback chains and error handling
4. **WebSocket Functionality**: Real-time communication testing
5. **Authentication Edge Cases**: Token refresh, permission boundaries, OAuth flows
6. **Frontend Components**: Agent dashboard, chat interface, and module-specific UIs
7. **Integration Scenarios**: End-to-end business workflows spanning multiple agents

## Recommendations for Improving Test Coverage

1. **Establish Baseline Coverage**: Run initial coverage tests to establish current baseline
2. **Prioritize Critical Paths**: Focus on authentication, agent orchestration, and core data flows
3. **Implement Continuous Integration**: Configure GitHub Actions to run tests on PRs and pushes
4. **Add Coverage Thresholds**: Set minimum coverage requirements (e.g., 80% for new code)
5. **Mock External Services**: Ensure tests don't depend on external APIs or services
6. **Test Edge Cases**: Particularly for error handling in LLM provider fallbacks and database operations

This architecture provides a solid foundation for an enterprise AI system with clear separation of concerns, scalable agent architecture, and robust infrastructure. Improving test coverage will further enhance reliability and maintainability as the system evolves.
## File-by-File Explanation

### Backend (`/backend`)

#### Core Configuration
- `config.py`: Loads environment variables using Pydantic Settings; defines application settings (project name, API versions, database URLs, API keys for external services).
- `main.py`: Entry point of the FastAPI application. Configures CORS middleware, includes all API routers, and defines the health check endpoint (`/`).
- `llm_provider.py`: Manages connections to various LLM providers (NVIDIA NIM, Groq, Hugging Face Serverless) with fallback mechanisms. Provides a unified interface for text generation with model tier selection (fast/smart).
- `qdrant_service.py`: Handles interactions with the Qdrant vector database for storing and retrieving embeddings used in the Retrieval-Augmented Generation (RAG) system. Includes methods for document ingestion, vector upsertion, and similarity search.

#### API Routers (`/backend/routers`)
- `auth.py`: Authentication endpoints (user login/logout, token refresh, registration, OAuth, multi-factor authentication, role-based access control, organization management).
- `chat.py`: WebSocket and HTTP endpoints for real-time chat interactions with AI agents. Handles message streaming, conversation history, and agent handoff.
- `dashboard.py`: Endpoints for dashboard data retrieval (key metrics, analytics data, widget data for various modules like sales, marketing, finance).
- `ingest.py`: Document ingestion endpoints for processing and storing files in the knowledge base. Supports PDF, DOCX, TXT, and other formats; extracts text, generates embeddings, and stores in Qdrant.
- `notifications.py`: Endpoints for sending notifications (email via SendGrid, SMS via Twilio, in-app notifications, webhook integrations).
- `payments.py`: Payment processing endpoints integrating with Stripe and other payment gateways. Handles subscriptions, invoices, payment methods, and webhook events.
- `agents.py`: Endpoints for managing and interacting with AI agents (listing available agents, configuring agent parameters, invoking agents for task execution, monitoring agent performance).

#### AI Agent System (`/backend/agents`)
- `base.py`: Defines the base `BaseAgent` class that all agents inherit from. Provides common functionality including:
  - LLM provider integration with fallback mechanisms
  - Memory management (short-term conversation history and long-term knowledge base)
  - Tool usage framework (for integrating external APIs and services)
  - Error handling and logging utilities
- `orchestrator.py`: Contains the `OrchestratorAgent` that coordinates complex tasks by:
  1. Analyzing user prompts to determine intent using an LLM
  2. Decomposing complex requests into subtasks
  3. Selecting appropriate specialized agents (typically 1-3 agents per task)
  4. Executing agent tasks concurrently using `asyncio.gather`
  5. Aggregating results and returning a unified response to the frontend
- Specialized Agents (organized in subdirectories):
  - `marketing.py`: Marketing agent for campaign strategy, content creation, market analysis, and customer segmentation.
  - `sales.py`: Sales agent for lead generation, opportunity management, sales forecasting, and pipeline optimization.
  - `finance.py`: Finance agent for budgeting, expense tracking, financial reporting, and cash flow analysis.
  - `hr.py`: HR agent for recruitment, employee onboarding, performance management, and personnel administration.
  - `research.py`: Research agent for information gathering, summarization, fact-checking, and deep research tasks.
  - `analytics.py`: Analytics agent for data analysis, report generation, metric calculations, and insight derivation.
  - `legal.py`: Legal agent for contract review, compliance checking, legal research, and regulatory guidance.
  - `ceo.py`: CEO agent for strategic decision-making, business planning, executive advisory, and organizational leadership.
  - `skill_creator/`: Module for creating custom agent skills and capabilities (contains `__init__.py` and skill implementation files).
  - `planning/`: Module for strategic planning and task decomposition (contains `__init__.py` and planning utilities).
  - `business/`: Business-focused agents for operations and management tasks (contains `__init__.py` and business agent implementations).
  - `core/`: Core agent utilities and base classes for specialized agent development (contains `__init__.py` and shared components).

#### Tests (`/backend/tests`)
- `test_config.py`: Tests for configuration loading and validation.
- `test_llm_provider.py`: Tests for LLM provider integrations and fallback mechanisms.
- `test_qdrant_service.py`: Tests for Qdrant service operations (vector storage, retrieval, and indexing).
- `test_main.py`: Tests for main application endpoints and middleware.
- `test_routers_auth.py`: Tests for authentication endpoints (login, logout, token refresh, etc.).
- `test_routers_chat.py`: Tests for chat functionality and WebSocket connections.
- `test_routers_ingest.py`: Tests for document ingestion pipelines and processing.
- `test_routers_payments.py`: Tests for payment processing and subscription management.
- `test_agents_base.py`: Tests for base agent functionality and inheritance.
- `test_agents_orchestrator.py`: Tests for agent orchestrator task decomposition and coordination.
- `test_agents_specialized.py`: Tests for specialized agent implementations and domain-specific logic.

### Frontend (`/frontend`)

#### Configuration Files
- `package.json`: Defines project dependencies, scripts (dev, build, test), and metadata for the Next.js application.
- `tsconfig.json`: TypeScript configuration for type checking, module resolution, and compilation options.
- `next.config.ts`: Next.js configuration for custom webpack settings, image optimization, and experimental features.
- `eslint.config.mjs`: ESLint configuration for code linting and style enforcement.
- `postcss.config.mjs`: PostCSS configuration for CSS processing and plugin integration.

#### Source Code (`/frontend/src`)
- **App Router (`/app`)**:
  - `layout.tsx`: Root layout component providing global styles, metadata, and React providers (context, theme, etc.).
  - `page.tsx`: Homepage landing page with hero section and feature highlights.
  - `login/`: Authentication pages (`page.tsx` for login form, `page.test.tsx` for tests).
  - `onboarding/`: User onboarding flow for new organization setup (`page.tsx` for onboarding steps).
  - `agents/`: Agent dashboard and management interface (`page.tsx` for agent listing and configuration).
  - `knowledge/`: Knowledge base interface including graph visualization (`page.tsx` for search and navigation, `page.test.tsx` for tests).
  - `chat/`: AI chat interface for interacting with agents (`page.tsx` for chat interface).
  - `(authenticated)/`: Protected routes requiring authentication (layout and pages for authenticated users).

- **Components (`/components`)**:
  - **Layout**:
    - `Header.tsx`: Top navigation bar with user controls, navigation links, and theme toggle.
    - `Sidebar.tsx`: Collapsible sidebar for navigation between modules (agents, knowledge, chat, etc.).
  - **Agents**:
    - `AgentDataTable.tsx`: Tabular display of agent information (status, performance metrics, configuration).
    - `AgentChatWidget.tsx`: Embeddable chat widget for interacting with specific agents in various contexts.
    - `AgentOrchestratorDashboard.tsx`: Dashboard for monitoring and controlling agent workflows and execution graphs.
  - **UI Components**:
    - `ControlPlaneCard.tsx`: Card component for displaying key metrics, controls, and status indicators.
    - `ExecutionGrid.tsx`: Grid layout for executing and monitoring agent tasks with progress visualization.
    - `KnowledgeCommand.tsx`: Command palette (similar to CMD+K) for searching and accessing knowledge base items.
  - **Tests**:
    - `AgentChatWidget.test.tsx`: Unit tests for the AgentChatWidget component.
    - `ExecutionGrid.test.tsx`: Unit tests for the ExecutionGrid component.
    - `Sidebar.test.tsx`: Unit tests for the Sidebar component.
    - `KnowledgeCommand.test.tsx`: Unit tests for the KnowledgeCommand component.

#### Public Assets
- `public/`: Static assets served directly (images, icons, manifest files, robots.txt).

#### Design System
- `theme.css`: CSS variables and global styles based on the Huly design system.
- `variables.css`: CSS variable definitions for colors, spacing, typography, and shadows.
- `tokens.json`: JSON representation of design tokens for potential use in design tools or other platforms.

This file-by-explanation provides a concise overview of the purpose and responsibility of each major file and directory in the AEGIS codebase.
