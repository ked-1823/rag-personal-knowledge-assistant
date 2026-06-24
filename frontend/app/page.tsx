"use client";

import { useState } from "react";

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [asking, setAsking] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {

      const files = Array.from(e.target.files);

      if (files.length > 4) {
        setMessage("Maximum 4 PDFs allowed");
        return;
      }

      setSelectedFiles(files);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setMessage("Please select a PDF first");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.error || "Upload failed");
      }

      setMessage(data.message);
    } catch (error: any) {
      console.error("Upload Error:", error);
      setMessage(error.message || "Upload failed");
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white px-4 py-10">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-4">
          <span>✨</span>
          <span className="text-sm text-slate-300">
            AI Powered RAG Assistant
          </span>
        </div>

        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
          Personal Knowledge Assistant
        </h1>

        <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
          Upload PDFs, build a searchable knowledge base, and chat with your
          documents using Retrieval-Augmented Generation.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">

        {/* LEFT PANEL */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">

            <h2 className="text-xl font-semibold mb-2">
              📄 Upload Document
            </h2>

            <p className="text-slate-400 text-sm mb-5">
              Upload your Multiple PDFs and create an intelligent searchable knowledge base.
            </p>

            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-300
            file:mr-4 file:px-4 file:py-2
            file:rounded-xl file:border-0
            file:bg-blue-600 file:text-white
            hover:file:bg-blue-700"
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-medium hover:scale-[1.02] transition-all duration-300 shadow-lg"
            >
              {loading ? "Uploading..." : "Upload PDF"}
            </button>

            {message && (
              <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-300 text-sm">
                {message}
              </div>
            )}

            <div className="mt-8 space-y-3">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-sm text-slate-400">Framework</p>
                <p className="font-medium">Next.js + FastAPI</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-sm text-slate-400">Vector Database</p>
                <p className="font-medium">ChromaDB</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-sm text-slate-400">Embeddings</p>
                <p className="font-medium">OpenAI</p>
              </div>
            </div>
          </div>
        </div>

        {/* CHAT SECTION */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

            {/* CHAT HEADER */}
            <div className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-xl">
                  💬 Chat Assistant
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Ask questions about your uploaded document
                </p>
              </div>

              <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs border border-green-500/20">
                Online
              </div>
            </div>

            {/* CHAT BODY */}
            <div className="h-[600px] overflow-y-auto p-6 space-y-6">

              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="text-7xl mb-4">🤖</div>

                  <h3 className="text-xl font-semibold mb-2">
                    Start a Conversation
                  </h3>

                  <p className="text-slate-400 max-w-md">
                    Upload a PDF and ask questions to get context-aware answers
                    grounded in your document.
                  </p>
                </div>
              )}

              {messages.map((msg, index) => (
                <div key={index} className="space-y-4">

                  {/* USER */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-3xl rounded-br-md bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 shadow-lg">
                      {msg.question}
                    </div>
                  </div>

                  {/* AI */}
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-3xl rounded-bl-md bg-white/10 border border-white/10 px-5 py-3 text-slate-200 whitespace-pre-wrap">
                      {msg.answer}
                    </div>
                  </div>

                </div>
              ))}

              {asking && (
                <div className="flex justify-start">
                  <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* INPUT */}
            <div className="border-t border-white/10 p-5 bg-black/20">
              <div className="flex gap-3">

                <input
                  type="text"
                  placeholder="Ask anything about your document..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !asking) {
                      handleAsk();
                    }
                  }}
                  className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={handleAsk}
                  disabled={asking}
                  className="px-7 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 font-medium hover:scale-105 transition-all duration-300"
                >
                  {asking ? "Thinking..." : "Send"}
                </button>

              </div>
            </div>

          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="text-center mt-10 text-slate-500 text-sm">
        Powered by FastAPI • ChromaDB • OpenAI Embeddings • Next.js
      </div>

    </div>
  );
}