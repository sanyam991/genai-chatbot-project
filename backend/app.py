import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# LangChain RAG imports
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain.chains import ConversationalRetrievalChain

load_dotenv()

# Configure Gemini API
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("❌ Error: GEMINI_API_KEY not found in .env file.")
    exit()
genai.configure(api_key=api_key)

app = Flask(__name__)

# CORS for frontend
CORS(app, resources={r"/*": {"origins": "https://genai-chatbot-project.vercel.app"}})

# --- RAG SETUP ---
vectorstore = None
rag_chain = None

try:
    print("📄 Loading and processing document...")
    loader = PyPDFLoader("policy.pdf")  # Ensure file exists
    docs = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,
        chunk_overlap=300,
        separators=["\n\n", "\n", " ", "", "."],
    )
    splits = text_splitter.split_documents(docs)

    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=api_key
    )
    vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings)
    print("✅ Document processing complete.")

    model = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash-preview-05-20",
        google_api_key=api_key
    )
    rag_chain = ConversationalRetrievalChain.from_llm(
        llm=model,
        retriever=vectorstore.as_retriever(),
        return_source_documents=False
    )

except Exception as e:
    print(f"❌ Error during RAG setup: {e}")
    vectorstore = None
    rag_chain = None


@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'OK'}), 200

    if rag_chain is None or vectorstore is None:
        return jsonify({'error': 'Knowledge base is not available. Please contact admin.'}), 500

    try:
        data = request.json
        if not data or 'messages' not in data:
            return jsonify({'error': 'Invalid request format'}), 400

        print(f"📩 Incoming request: {data}")  # Debug

        user_message = data.get('messages', [])[-1]['parts'][0]['text']

        # Format chat history correctly
        chat_history = []
        for msg in data.get('messages', [])[:-1]:
            if msg['role'] == 'user':
                chat_history.append((msg['parts'][0]['text'], ""))  # User says
            else:
                chat_history.append(("", msg['parts'][0]['text']))  # Bot says

        # Call RAG
        response = rag_chain.invoke({
            'question': user_message,
            'chat_history': chat_history
        })

        print(f"🤖 RAG Response: {response}")  # Debug
        return jsonify({'message': response['answer']})

    except Exception as e:
        print(f"❌ Error processing RAG request: {e}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(port=5000)
