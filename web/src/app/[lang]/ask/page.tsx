"use client";
// ask
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { MessageCircle, Send, AlertTriangle, Phone } from "lucide-react";
import type { Lang } from "../../../lib/i18n";
import { t } from "../../../lib/i18n";
import { useOnboardingGate } from "../../../lib/useOnboardingGate";
import { sendChatMessage, type ChatApiResponse } from "../../../lib/chat";
import { ScreenHero, SafeNotice } from "../../../components/ui";

interface Message {
  role: "user" | "assistant";
  text: string;
  response?: ChatApiResponse;
}

export default function AskPage() {
  const { lang: rawLang } = useParams<{ lang: string }>();
  const lang: Lang = rawLang === "es" ? "es" : "en";
  const prefs = useOnboardingGate(lang);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError(null);
    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await sendChatMessage(
        text,
        prefs.ageBand ?? "13-15",
        lang,
        prefs.county
      );
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: response.reply, response },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            lang === "es"
              ? "Lo siento, no pude conectarme con el servidor. Por favor intenta de nuevo."
              : "Sorry, I couldn't connect to the server. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col pb-4" style={{ minHeight: "calc(100vh - 5rem)" }}>
      <ScreenHero
        icon={MessageCircle}
        title={t("ask_title", lang)}
        subtitle={
          lang === "es"
            ? "Haz una pregunta sobre tus derechos, tu caso o recursos."
            : "Ask a question about your rights, your case, or resources."
        }
        gradient="from-[#2A7F8E] via-[#1a5f7e] to-[#1B3A5C]"
        lang={lang}
      />

      {/* Safe notice */}
      <div className="mt-4">
        <SafeNotice lang={lang} />
      </div>

      {/* Messages */}
      <div className="mt-4 flex flex-col gap-3">
        {isEmpty && (
          <div className="rounded-3xl bg-white/95 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            {/* Compass avatar */}
            <div className="flex items-center gap-3 mb-4">
              <img src="/icons/icon-192.svg" className="h-11 w-11 shrink-0 rounded-2xl shadow-md" alt="" aria-hidden="true" />
              <div>
                <div className="text-sm font-semibold text-[#1B3A5C]">
                  {lang === "es" ? "Hola, soy Compass" : "Hi, I'm Compass"}
                </div>
                <div className="text-xs text-slate-500">
                  {lang === "es" ? "Aquí para ayudarte a encontrar respuestas" : "Here to help you find real answers"}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {lang === "es"
                ? "Puedes preguntarme sobre tus derechos, lo que pasa en el tribunal, cómo conseguir documentos, opciones de vivienda — lo que necesites saber."
                : "Ask me anything about your rights, what happens in court, how to get documents, housing options — whatever you need to know."}
            </p>
            <div className="mt-4 grid gap-2">
              <div className="text-xs font-semibold text-slate-400 mb-1">
                {lang === "es" ? "Algunas ideas para empezar:" : "Some ideas to get started:"}
              </div>
              {(lang === "es"
                ? [
                    "¿Cuáles son mis derechos como joven en cuidado adoptivo?",
                    "¿Qué significa la audiencia de permanencia?",
                    "¿Cómo consigo mi acta de nacimiento?",
                  ]
                : [
                    "What are my rights as a foster youth?",
                    "What does a permanency hearing mean?",
                    "How do I get my birth certificate?",
                  ]
              ).map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="rounded-2xl bg-[#2A7F8E]/6 px-4 py-2.5 text-left text-sm text-[#1B3A5C] font-medium ring-1 ring-[#2A7F8E]/15 hover:bg-[#2A7F8E]/12 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "flex justify-end" : ""}>
            {msg.role === "user" ? (
              <div className="max-w-[85%] rounded-3xl rounded-br-lg bg-[#1B3A5C] px-4 py-3 text-sm text-white">
                {msg.text}
              </div>
            ) : (
              <div className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                {/* Crisis banner */}
                {msg.response?.isCrisis && (
                  <div className="mb-3 rounded-2xl bg-rose-50 p-3 ring-1 ring-rose-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                      <span className="text-xs font-semibold text-rose-700">
                        {t("ask_crisis_header", lang)}
                      </span>
                    </div>
                    {msg.response.crisisResources?.map((r) => (
                      <div key={r.name} className="mb-1">
                        <a
                          href={`tel:${r.number.replace(/\D/g, "")}`}
                          className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-rose-700 ring-1 ring-rose-200"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          {r.name} · {r.number}
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>

                {/* Citations */}
                {msg.response?.citations && msg.response.citations.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {msg.response.citations.map((c, ci) => (
                      <span
                        key={ci}
                        className="inline-flex items-center rounded-full bg-[#2A7F8E]/10 px-2.5 py-1 text-[10px] font-medium text-[#1B3A5C]"
                      >
                        {c.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="rounded-3xl bg-white/95 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>●</span>
              <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>●</span>
              <span className="ml-1">{t("ask_thinking", lang)}</span>
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-rose-600 px-1">{error}</p>
        )}
      </div>

      <div ref={bottomRef} />

      {/* Input */}
      <div className="mt-4 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("ask_placeholder", lang)}
          rows={1}
          className="flex-1 resize-none rounded-2xl bg-white/85 px-4 py-3 text-sm ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-[#2A7F8E] placeholder:text-slate-400 leading-relaxed"
          style={{ maxHeight: "120px" }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className={
            "rounded-2xl p-3 transition-all " +
            (input.trim() && !loading
              ? "bg-[#2A7F8E] text-white hover:bg-[#236d7a] active:scale-[0.99]"
              : "bg-slate-100 text-slate-300 cursor-not-allowed")
          }
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
