import { readFile } from "node:fs/promises";

const token = process.env.CLOUDFLARE_API_TOKEN;
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
const index = process.env.VECTORIZE_INDEX ?? "ali-public-knowledge";
if (!token || !account)
  throw new Error(
    "CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are required to update Vectorize",
  );
const knowledge = JSON.parse(
  await readFile("src/generated/knowledge.json", "utf8"),
);
const sections = knowledge.notes.flatMap((note) =>
  note.sections.map((section) => ({ ...section, note })),
);
const embeddingResponse = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/@cf/baai/bge-base-en-v1.5`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      text: sections.map(
        (section) => `${section.note.title}\n${section.title}\n${section.text}`,
      ),
    }),
  },
);
if (!embeddingResponse.ok)
  throw new Error(`Workers AI embedding failed: ${embeddingResponse.status}`);
const embeddings = (await embeddingResponse.json()).result?.data;
if (!Array.isArray(embeddings) || embeddings.length !== sections.length)
  throw new Error("Workers AI returned an invalid embedding batch");
const vectors = sections.map((section, position) => ({
  id: section.id,
  values: embeddings[position],
  metadata: {
    title: section.note.title,
    url: section.url,
    text: section.text,
    type: section.note.type,
  },
}));
const upsertResponse = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${account}/vectorize/v2/indexes/${index}/upsert`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ vectors }),
  },
);
if (!upsertResponse.ok)
  throw new Error(`Vectorize upsert failed: ${upsertResponse.status}`);
console.log(`Vectorize updated: ${vectors.length} public sections`);
