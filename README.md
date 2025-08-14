GenAI Chatbot with RAG
This is a full-stack, AI-powered chatbot designed to provide contextual answers based on a private document. The application demonstrates a comprehensive understanding of modern web development and Generative AI principles.

The chatbot is built on a modular architecture, with a React frontend for the user interface and a Python/Flask backend for handling API logic and AI processing.

Key Features
Conversational Chatbot: An interactive chat interface that supports multi-turn conversations.

Retrieval-Augmented Generation (RAG): The core feature that allows the chatbot to answer questions based on a provided PDF document.

Secure API Integration: The backend securely handles all communication with the Gemini API, ensuring the API key is not exposed to the public.

Cross-Origin Resource Sharing (CORS): The backend is properly configured to allow secure communication with the frontend.

Technologies Used
Frontend
React: A popular JavaScript library for building the user interface.

Tailwind CSS: A utility-first CSS framework for clean and responsive design.

Backend
Python: The core programming language for the backend server.

Flask: A lightweight Python web framework used to build the API.

AI & Machine Learning
Gemini API: Google's state-of-the-art Large Language Model (LLM) for generative AI capabilities.

LangChain: A framework used to orchestrate the RAG pipeline, including document loading, chunking, and retrieval.

ChromaDB: A lightweight vector database used to store document embeddings for efficient semantic search.

Setup and Installation
1. Backend Setup
Navigate to the backend directory in your terminal.

Create a Python virtual environment: python -m venv venv

Activate the environment:

On Windows: venv\Scripts\activate

On macOS/Linux: source venv/bin/activate

Install the required Python packages: pip install -r requirements.txt

Create a .env file and add your Gemini API key: GEMINI_API_KEY="YOUR_API_KEY_HERE"

Place your knowledge base PDF file in the backend directory. The current code expects the file to be named policy.pdf.

Run the Flask backend server: flask run

2. Frontend Setup
Open a new terminal and navigate to the project's root directory.

Install the JavaScript dependencies: npm install

Run the React frontend server: npm run dev

The application will be accessible at http://localhost:5173.

How to Use
Ensure both the frontend and backend servers are running.

Open your browser and navigate to http://localhost:5173.

Type a question into the chatbox and press Enter.

The chatbot will first search for relevant information in the policy.pdf document. If it finds a match, it will use that context to answer your question. If the question is outside the scope of the document, it will use its general knowledge from the Gemini model.

My Learning and Challenges
Describe a key challenge you faced: For example, the CORS error between the frontend and backend or the chunking issues with the RAG model.

Explain your thought process to solve it: Describe how you debugged the problem and the specific solution you implemented.

Summarize what you learned: Conclude by highlighting the key skills you gained, such as debugging, full-stack integration, and practical application of GenAI concepts.