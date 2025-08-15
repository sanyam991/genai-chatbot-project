import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# LangChain specific imports for RAG
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain.chains import ConversationalRetrievalChain

load_dotenv()
# Check if the API key is available
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not found in .env file.")
    exit()

genai.configure(api_key=api_key)

app = Flask(__name__)
# Allow requests from your React app
CORS(app, origins="https://genai-chatbot-project.vercel.app")

# --- RAG SETUP ---
# Load the document and create a vector store. This runs once when the server starts.
try:
    print("Loading and processing document...")
    loader = PyPDFLoader("policy.pdf") # <- Ensure your PDF file is named this
    docs = loader.load()

    # Use a more sophisticated text splitter
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,  # Increased chunk size
        chunk_overlap=300, # Added a more generous overlap
        separators=["\n\n", "\n", " ", "", "."],
    )
    splits = text_splitter.split_documents(docs)

    # Pass the API key explicitly to the embeddings model
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=api_key)
    vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings)
    print("Document processing complete. RAG system is ready.")
except Exception as e:
    print(f"Error during RAG setup: {e}")
    vectorstore = None # RAG will not work if there's an error here

# Initialize the RAG chain
model = ChatGoogleGenerativeAI(model="gemini-2.5-flash-preview-05-20", google_api_key=api_key)
rag_chain = ConversationalRetrievalChain.from_llm(
    llm=model,
    retriever=vectorstore.as_retriever() if vectorstore else None,
    return_source_documents=False
)

@app.route('/chat', methods=['POST'])
def chat():
    if rag_chain is None:
        return jsonify({'error': 'RAG system is not initialized. Check server logs.'}), 500

    try:
        data = request.json
        if not data or 'messages' not in data:
            return jsonify({'error': 'Invalid request format'}), 400

        user_message = data.get('messages', [])[-1]['parts'][0]['text']
        
        # The chat history needs to be in a specific format for the RAG chain
        chat_history = [
            (msg['parts'][0]['text'], msg['parts'][0]['text'])
            for msg in data.get('messages', [])[:-1]
        ]
        
        # Invoke the RAG chain
        response = rag_chain.invoke({'question': user_message, 'chat_history': chat_history})
        
        return jsonify({'message': response['answer']})
    except Exception as e:
        print(f"Error processing RAG request: {e}")
        return jsonify({'error': f'An error occurred on the server: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(port=5000)
