GenAI Chatbot with Retrieval-Augmented Generation (RAG)

Overview:
This project is a full-stack, AI-powered chatbot that delivers contextual responses based on a private document using Retrieval-Augmented Generation (RAG).
It demonstrates proficiency in modern web development, Generative AI, and end-to-end application design.

The system follows a modular architecture:
Frontend: Built with React for an intuitive and responsive chat interface.
Backend: Implemented in Python (Flask) to handle API requests, AI processing, and secure integration with the Gemini API.

Key Features
Conversational AI Chatbot – Supports multi-turn conversations for seamless interaction.
Retrieval-Augmented Generation (RAG) – Retrieves context from a provided PDF (e.g., policy.pdf) to generate precise, document-aware answers.
Secure API Handling – Keeps the Gemini API key confidential on the backend.
Cross-Origin Resource Sharing (CORS) – Configured for secure frontend-backend communication.

Technologies Used
Frontend
React – Component-based UI library for dynamic interfaces.
Tailwind CSS – Utility-first CSS framework for clean, responsive design.

Backend
Python – Core backend programming language.
Flask – Lightweight web framework for building REST APIs.

AI & Machine Learning
Gemini API – Google’s advanced Large Language Model for generative responses.
LangChain – Framework to orchestrate the RAG workflow (document loading, chunking, retrieval).
ChromaDB – Lightweight vector database for storing embeddings and enabling semantic search.

Setup & Installation
Backend Setup
Open a terminal and navigate to the backend directory.

Create a virtual environment:
python -m venv venv


Activate the environment:
Windows:
venv\Scripts\activate

macOS/Linux:
source venv/bin/activate

Install dependencies:
pip install -r requirements.txt

Create a .env file and add your API key:
GEMINI_API_KEY="YOUR_API_KEY_HERE"


Place your knowledge base PDF in the backend directory (default name: policy.pdf).

Start the backend server:
flask run

Frontend Setup
Open a new terminal and navigate to the project root.

Install dependencies:
npm install

Start the development server:
npm run dev

Access the application at:
http://localhost:5173

Usage:
Ensure both frontend and backend are running.
Open your browser and go to http://localhost:5173.
Type a question into the chatbox and press Enter.

The chatbot will:
Search the policy.pdf for relevant context.
Use the Gemini model to generate an answer.
Fall back to general AI knowledge if no relevant document content is found.

Learning & Challenges:
Key Challenge: Handling CORS errors during frontend-backend communication and managing document chunking for RAG accuracy.
Solution: Configured Flask-CORS and fine-tuned LangChain chunk size/overlap to balance context relevance and efficiency.

Learnings:
Debugging cross-origin issues in full-stack apps.
Integrating LLMs with structured data retrieval.
Implementing a production-ready RAG pipeline.

Future Improvements:
Add authentication for user access control.
Support multiple document uploads.
Implement persistent conversation history.
Optimize embedding storage for large datasets.
