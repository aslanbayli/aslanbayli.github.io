interface Env {
  AI: Ai;
  KNOWLEDGE_INDEX: VectorizeIndex;
  TURNSTILE_SECRET?: string;
  PUBLIC_ORIGIN: string;
  MAX_REQUESTS_PER_WINDOW: string;
  WINDOW_SECONDS: string;
}
interface ChatRequest {
  message?: unknown;
  history?: unknown;
  turnstileToken?: unknown;
  sessionId?: unknown;
}
type HistoryItem = { role: "user" | "assistant"; content: string };
const counters = new Map<string, { count: number; expires: number }>();
const allowedOrigins = (env: Env) => [
  env.PUBLIC_ORIGIN,
  "http://localhost:4321",
  "http://localhost:3000",
];
function corsHeaders(origin: string, env: Env) {
  return {
    "access-control-allow-origin": allowedOrigins(env).includes(origin)
      ? origin
      : env.PUBLIC_ORIGIN,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    vary: "Origin",
  };
}
function json(body: unknown, status: number, origin: string, env: Env) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders(origin, env),
    },
  });
}
function visitorKey(request: Request, sessionId: unknown) {
  return `${request.headers.get("cf-connecting-ip") || "unknown"}:${typeof sessionId === "string" ? sessionId.slice(0, 80) : "anonymous"}`;
}
function cleanHistory(value: unknown): HistoryItem[] {
  return Array.isArray(value)
    ? value.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const record = item as Record<string, unknown>;
        const role =
          record.role === "user" || record.role === "assistant"
            ? record.role
            : null;
        const content =
          typeof record.content === "string"
            ? record.content
            : typeof record.text === "string"
              ? record.text
              : null;
        return role && content
          ? [{ role, content: content.slice(0, 1000) }]
          : [];
      })
    : [];
}
function conciseAnswer(value: string) {
  const cleaned = value
    .replace(/^(?:Ali\s+Aslanbayli\s+)?Answer:\s*/i, "")
    .split(/\n(?:Follow-up question:|Note:|Let's |Please respond)/i)[0]
    .replace(/\s+/g, " ")
    .trim();
  const sentences = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [];
  return sentences.slice(0, 3).join(" ").trim().slice(0, 500);
}
async function verifyTurnstile(token: unknown, request: Request, env: Env) {
  if (!env.TURNSTILE_SECRET) return true;
  if (typeof token !== "string" || !token) return false;
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET,
        response: token,
        remoteip: request.headers.get("cf-connecting-ip"),
      }),
    },
  );
  return (
    response.ok &&
    Boolean(((await response.json()) as { success?: boolean }).success)
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("origin") || "";
    if (!allowedOrigins(env).includes(origin))
      return json({ error: "Origin not allowed." }, 403, origin, env);
    if (request.method === "OPTIONS")
      return new Response(null, { headers: corsHeaders(origin, env) });
    if (new URL(request.url).pathname !== "/chat" || request.method !== "POST")
      return json({ error: "Not found." }, 404, origin, env);
    let payload: ChatRequest;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid JSON." }, 400, origin, env);
    }
    const message =
      typeof payload.message === "string" ? payload.message.trim() : "";
    if (!message || message.length > 500)
      return json(
        { error: "Message must be between 1 and 500 characters." },
        400,
        origin,
        env,
      );
    if (!(await verifyTurnstile(payload.turnstileToken, request, env)))
      return json({ error: "Verification failed." }, 403, origin, env);
    const now = Date.now();
    const key = visitorKey(request, payload.sessionId);
    const windowMs = Number(env.WINDOW_SECONDS || 3600) * 1000;
    const limit = Number(env.MAX_REQUESTS_PER_WINDOW || 20);
    const counter = counters.get(key);
    const current =
      counter && counter.expires > now
        ? counter
        : { count: 0, expires: now + windowMs };
    if (current.count >= limit)
      return json(
        {
          error:
            "Chat limit reached. Please browse the knowledge graph and sources.",
        },
        429,
        origin,
        env,
      );
    current.count += 1;
    counters.set(key, current);
    try {
      const embedding = (await env.AI.run("@cf/baai/bge-base-en-v1.5", {
        text: [message],
      })) as { data: number[][] };
      const matches = await env.KNOWLEDGE_INDEX.query(embedding.data[0], {
        topK: 5,
        returnMetadata: "all",
      });
      const sources = (matches.matches || [])
        .filter((match) => Number(match.score || 0) >= 0.35)
        .map((match) => ({
          id: String(match.id),
          title: String(match.metadata?.title || "Public source"),
          url: String(match.metadata?.url || "/#knowledge"),
          text: String(match.metadata?.text || ""),
        }));
      if (!sources.length)
        return json(
          {
            answer:
              "I couldn't find enough evidence in Ali's knowledge base to answer that. Try asking about a listed project, experience, skill, or public post.",
            sources: [],
          },
          200,
          origin,
          env,
        );
      const context = sources
        .map(
          (source, index) =>
            `[Source ${index + 1}] ${source.title}\n${source.text}`,
        )
        .join("\n\n");
      const system = `You are the concise portfolio assistant for Ali Aslanbayli. Use only the supplied public sources. If they do not support an answer, say you do not have enough evidence. Never mention private notes. Answer the latest question only in two or three short sentences, under 70 words total. Do not write labels such as "Answer", follow-up questions, notes, disclaimers, or citation markers.\n\nPublic sources:\n${context}`;
      const result = (await env.AI.run("@cf/meta/llama-3.2-3b-instruct", {
        messages: [
          { role: "system", content: system },
          ...cleanHistory(payload.history),
          { role: "user", content: message },
        ],
        max_tokens: 120,
        temperature: 0.2,
        repetition_penalty: 1.1,
      })) as { response?: string };
      if (!result.response)
        return json(
          { error: "The chat model is temporarily unavailable." },
          503,
          origin,
          env,
        );
      return json(
        {
          answer: conciseAnswer(result.response) || "I do not have enough evidence to answer that.",
          sources: sources.map(({ id, title, url }) => ({ id, title, url })),
        },
        200,
        origin,
        env,
      );
    } catch {
      return json(
        { error: "The knowledge service is temporarily unavailable." },
        503,
        origin,
        env,
      );
    }
  },
};
