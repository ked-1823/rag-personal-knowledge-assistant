"use client";

import { useState } from "react";

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [asking, setAsking] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    setMessage(data.message);
    setLoading(false);
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    setAsking(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: question,
          session_id: "user-1",
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          question,
          answer: data.answer,
        },
      ]);

      setQuestion("");
    } catch (error) {
      console.error(error);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center px-4">
      
      {/* HEADER */}
      <div className="w-full max-w-4xl mt-10 text-center">
        <h1 className="text-4xl font-bold text-slate-800">
          Personal Knowledge Assistant
        </h1>

        <p className="text-slate-500 mt-3 text-sm">
          Upload your PDF documents and interact with them using AI-powered
          retrieval and generation.
        </p>
      </div>

      {/* UPLOAD CARD */}
      <div className="w-full max-w-4xl mt-8 bg-slate-50 p-6 rounded-2xl shadow-md border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-1">
          Upload Document
        </h2>

        <p className="text-sm text-slate-600 mb-4">
          Select a PDF file to build your knowledge base.
        </p>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-slate-600
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-lg file:border-0
                     file:bg-blue-600 file:text-white
                     file:cursor-pointer hover:file:bg-blue-700"
        />

        <div className="mt-5 flex items-center gap-4 flex-wrap">
          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Uploading..." : "Upload PDF"}
          </button>

          {message && (
            <span className="text-sm text-green-600 font-medium">
              {message}
            </span>
          )}
        </div>
      </div>

      {/* CHAT CARD */}
      <div className="w-full max-w-4xl mt-6 bg-slate-50 rounded-2xl shadow-md border border-slate-200 flex flex-col">
        
        {/* CHAT HEADER */}
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-800">
            Chat with your document
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Ask questions and receive answers grounded in your uploaded PDF.
          </p>
        </div>

        {/* MESSAGES */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-5">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <p className="text-slate-400 text-sm">
                No messages yet. Upload a PDF and start asking questions.
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className="space-y-3">

              {/* USER MESSAGE */}
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl max-w-[75%] shadow-sm">
                  {msg.question}
                </div>
              </div>

              {/* AI MESSAGE */}
              <div className="flex justify-start">
                <div className="bg-slate-200 text-slate-800 px-4 py-3 rounded-2xl max-w-[75%] shadow-sm whitespace-pre-wrap">
                  {msg.answer}
                </div>
              </div>

            </div>
          ))}

          {asking && (
            <div className="flex justify-start">
              <div className="bg-slate-200 text-slate-700 px-4 py-3 rounded-2xl shadow-sm">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ask a question about your document..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !asking) {
                  handleAsk();
                }
              }}
              className="flex-1 px-4 py-3 border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleAsk}
              disabled={asking}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 transition"
            >
              {asking ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-6 mb-8 text-xs text-slate-500">
        Powered by FastAPI • ChromaDB • OpenAI Embeddings • Next.js
      </div>
    </div>
  );
}