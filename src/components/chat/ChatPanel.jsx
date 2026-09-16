import React, { useState, useRef, useEffect } from "react";
import { Plus, Send, Loader2, RotateCcw } from "lucide-react";
import ChatMessage from "./ChatMessage";
import AttachmentDrawer from "./AttachmentDrawer";
import { useAreas } from "../../context/ContentContext";

// The Python agent backend. Its start-up banner prints the line to put in .env
// (VITE_AGENT_API_URL=...); without it, the backend on this PC is used.
const API_URL = (import.meta.env.VITE_AGENT_API_URL || "http://localhost:8000").replace(/\/+$/, "");

// sessionStorage keeps the conversation when a listing card is opened and the
// visitor comes back; it is cleared when the tab closes.
const STORAGE_KEY = "agent-chat";

// A free Render service sleeps after 15 minutes and takes about a minute to wake,
// and a free model can be slow on top of that.
const REQUEST_TIMEOUT_MS = 180000;
const SLOW_AFTER_MS = 8000;

const WELCOME = {
  role: "bot",
  text: "Hi! I'm the property assistant for Dubai and Abu Dhabi. Ask me for homes to buy or rent, prices in an area, what buying or renting would cost, or a PDF shortlist — and I'll move the map as we go.",
  suggestions: ["2 bed to rent in Dubai Marina", "Villas for sale in Abu Dhabi", "What would buying cost?"],
};

function loadSaved() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
    if (saved && Array.isArray(saved.messages) && saved.messages.length) return saved;
  } catch {
    // storage blocked or unreadable: start a new conversation
  }
  return { sessionId: null, messages: [WELCOME] };
}

class AgentError extends Error {
  constructor(status, detail) {
    super(detail || `HTTP ${status}`);
    this.status = status;
    this.detail = detail;
  }
}

export default function ChatPanel({ onFocusArea, propertyCountByArea }) {
  const { resolveFocus } = useAreas();
  const [saved] = useState(loadSaved);
  const [messages, setMessages] = useState(saved.messages);
  const sessionIdRef = useRef(saved.sessionId);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [slow, setSlow] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ sessionId: sessionIdRef.current, messages }));
    } catch {
      // storage full or blocked: the chat still works, it just isn't kept
    }
  }, [messages]);

  // Coming back to the page: put the map where the conversation left it.
  useEffect(() => {
    const last = [...saved.messages].reverse().find((m) => m.mapFocus);
    if (last) onFocusArea(last.mapFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the backend can't be reached, still move the map for a place name,
  // using the areas already loaded from Supabase.
  const offlineReply = (text) => {
    const area = resolveFocus(text);
    if (area) {
      onFocusArea(area);
      const count = propertyCountByArea[area.name] || 0;
      return {
        role: "bot",
        error: true,
        text: `I can't reach the assistant right now, but I've moved the map to ${area.name} — ${count} ${count === 1 ? "property" : "properties"} listed there.`,
      };
    }
    return { role: "bot", error: true, text: "I can't reach the assistant right now. Please try again in a moment." };
  };

  const errorReply = (err, text) => {
    if (err.name === "AbortError") {
      return { role: "bot", error: true, text: "That took too long to answer. Please try again." };
    }
    if (!(err instanceof AgentError)) {
      console.warn(`Agent API at ${API_URL} is unreachable:`, err);
      return offlineReply(text);
    }
    if (err.status === 409) {
      return { role: "bot", error: true, text: "I'm still answering your previous message — one moment." };
    }
    if (err.status === 503 && err.detail) {
      return { role: "bot", error: true, text: err.detail };
    }
    console.warn("Agent API error:", err.status, err.detail);
    return { role: "bot", error: true, text: "Something went wrong on my side. Please try again." };
  };

  const ask = async (raw) => {
    const text = raw.trim();
    if (!text || sending) return;

    setInput("");
    setDrawerOpen(false);
    setMessages((m) => [...m, { role: "user", text }]);
    setSending(true);

    const slowTimer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    const controller = new AbortController();
    const abortTimer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          session_id: sessionIdRef.current,
          // Links in the agent's PDFs and emails point back to wherever this site runs.
          website_url: window.location.origin,
        }),
        signal: controller.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new AgentError(res.status, typeof data.detail === "string" ? data.detail : null);
      }

      sessionIdRef.current = data.session_id;
      if (data.map_focus) onFocusArea(data.map_focus); // same shape as resolveFocus(): { name, emirate, isEmirate, center }

      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: data.reply,
          cards: data.cards || [],
          suggestions: data.suggestions || [],
          mapFocus: data.map_focus || null,
          draft: data.draft
            ? { title: data.draft.title, version: data.draft.version, url: `${API_URL}${data.draft.pdf_path}` }
            : null,
          inquiry: data.inquiry || null,
          email: data.email || null,
        },
      ]);
    } catch (err) {
      setMessages((m) => [...m, errorReply(err, text)]);
    } finally {
      clearTimeout(slowTimer);
      clearTimeout(abortTimer);
      setSending(false);
      setSlow(false);
    }
  };

  const newChat = () => {
    const oldId = sessionIdRef.current;
    if (oldId) {
      fetch(`${API_URL}/sessions/${encodeURIComponent(oldId)}`, { method: "DELETE" }).catch(() => {});
    }
    sessionIdRef.current = null;
    setMessages([WELCOME]);
  };

  const last = messages[messages.length - 1];
  const chips = !sending && last?.role === "bot" ? last.suggestions || [] : [];

  return (
    <div className="relative flex h-full flex-col bg-sage/45">
      <div className="flex items-center justify-between border-b border-ink/10 bg-sand-light px-4 py-2">
        <span className="font-heading text-[10px] font-semibold uppercase tracking-label text-ink/55">
          Property assistant
        </span>
        <button
          type="button"
          onClick={newChat}
          disabled={sending || messages.length <= 1}
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 font-heading text-[10px] uppercase tracking-label text-ink-mute transition-colors hover:bg-sage hover:text-ink disabled:opacity-40"
        >
          <RotateCcw className="h-3 w-3" /> New chat
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} />
        ))}
        {sending && (
          <div className="flex items-center gap-2 font-heading text-[10px] uppercase tracking-label text-ink/45">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-brass" />{" "}
            {slow ? "still thinking — the assistant may be waking up…" : "thinking…"}
          </div>
        )}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => ask(chip)}
                className="rounded-full border border-ink/15 bg-sand-light px-3 py-1.5 text-xs text-ink-mute transition-colors hover:border-brass/60 hover:text-ink"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <AttachmentDrawer open={drawerOpen} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex items-center gap-2 border-t border-ink/10 bg-sand-light p-3"
      >
        <button
          type="button"
          onClick={() => setDrawerOpen((o) => !o)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage text-ink-mute transition-colors hover:bg-brass/25 hover:text-ink"
        >
          <Plus
            className={`w-5 h-5 transition-transform duration-500 ${drawerOpen ? "rotate-45" : ""}`}
          />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={2000}
          placeholder="Ask about homes, areas or costs →"
          className="h-11 flex-1 rounded-full border border-ink/10 bg-white/70 px-4 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-brass/60"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sand transition-colors hover:bg-ink-soft disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
