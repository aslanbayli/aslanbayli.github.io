import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const vault = path.join(root, "content", "vault");
const output = path.join(root, "src", "generated");
const required = ["slug", "type", "title", "summary", "tags"];
const notes = [];
const warnings = [];

const dirs = [
  "profile.md",
  "experience.md",
  "skills.md",
  "projects.md",
  "blog/public",
  "blog/private",
];
// Private notes are read only to validate public wikilinks and issue leak-prevention
// warnings. They are filtered out before graph, site, and Vectorize artifacts are written.
const files = [];
async function collect(relative) {
  const absolute = path.join(vault, relative);
  if (relative.endsWith(".md")) files.push(absolute);
  else
    for (const entry of await readdir(absolute, { withFileTypes: true })) {
      const child = path.join(relative, entry.name);
      if (entry.isDirectory()) await collect(child);
      else if (entry.name.endsWith(".md")) files.push(path.join(vault, child));
    }
}
for (const dir of dirs) await collect(dir);

function parseFields(block) {
  const data = {};
  for (const line of block.split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value.slice(1, -1).split(",").map((item) => item.trim().replace(/^['\"]|['\"]$/g, "")).filter(Boolean);
    } else if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    else if (value === "true" || value === "false") value = value === "true";
    data[key] = value;
  }
  return data;
}

function parseFrontmatter(source, file) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match)
    throw new Error(`Missing frontmatter: ${path.relative(root, file)}`);
  return { data: parseFields(match[1]), body: match[2].trim() };
}

function addNote(data, body, file, relative) {
  for (const field of required)
    if (data[field] === undefined || data[field] === "")
      throw new Error(`${path.relative(root, file)} is missing ${field}`);
  if (!Array.isArray(data.tags))
    throw new Error(`${path.relative(root, file)} tags must be an array`);
  if (notes.some((note) => note.slug === data.slug))
    throw new Error(`Duplicate slug: ${data.slug}`);
  const id = crypto
    .createHash("sha1")
    .update(`${data.slug}:${relative}`)
    .digest("hex")
    .slice(0, 12);
  const url =
    data.type === "blog"
      ? `/blog/${data.slug}/`
      : data.type === "project"
        ? `/#project-${data.slug}`
        : data.type === "profile"
          ? "/#about"
          : data.type === "experience"
            ? "/#experience"
            : "/#knowledge";
  const sections = body
    .split(/(?=^## )/m)
    .filter(Boolean)
    .map((text, index) => {
      const heading = text.match(/^## (.+)$/m)?.[1] ?? data.title;
      const sectionId = crypto
        .createHash("sha1")
        .update(`${id}:${index}:${heading}`)
        .digest("hex")
        .slice(0, 16);
      return {
        id: sectionId,
        title: heading,
        text: text.trim(),
        url: `${url}#${sectionId}`,
      };
    });
  notes.push({ ...data, id, path: relative, body, sections, url });
}

for (const file of files) {
  const source = await readFile(file, "utf8");
  const { data, body } = parseFrontmatter(source, file);
  const relative = path.relative(vault, file).replaceAll(path.sep, "/");
  if (data.type !== "projects") {
    addNote(data, body, file, relative);
    continue;
  }
  for (const entry of body.split(/^## /m).slice(1)) {
    const [title, ...rest] = entry.split("\n");
    const section = rest.join("\n").trim();
    const metadata = section.match(/^<!--\s*\n([\s\S]*?)\n-->\s*\n([\s\S]*)$/);
    if (!metadata) throw new Error(`${relative} project ${title} is missing its metadata comment`);
    const project = { ...parseFields(metadata[1]), type: "project", title: title.trim() };
    addNote(project, metadata[2].trim(), file, `${relative}#${project.slug ?? title.trim()}`);
  }
}

const bySlug = new Map(notes.map((note) => [note.slug, note]));
for (const note of notes) {
  for (const target of note.body.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)) {
    const targetSlug = target[1].trim().toLowerCase().replaceAll(" ", "-");
    const linked =
      bySlug.get(targetSlug) ??
      [...bySlug.values()].find(
        (candidate) =>
          candidate.title.toLowerCase() === target[1].trim().toLowerCase(),
      );
    if (!linked)
      throw new Error(`${note.path} has broken public link [[${target[1]}]]`);
    if (
      note.path.startsWith("blog/public/") &&
      linked.path.startsWith("blog/private/")
    )
      warnings.push(
        `${note.path} links to private note [[${target[1]}]] and it was omitted`,
      );
  }
}

const publicNotes = notes.filter(
  (note) => note.type !== "blog" || note.path.startsWith("blog/public/"),
);
const graphNodes = publicNotes.map(
  ({ id, slug, type, title, summary, tags, url }) => ({
    id,
    slug,
    type,
    title,
    summary,
    tags,
    url,
  }),
);
const graphEdges = [];
for (const note of publicNotes)
  for (const target of note.body.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)) {
    const linked =
      bySlug.get(target[1].trim().toLowerCase().replaceAll(" ", "-")) ??
      [...bySlug.values()].find(
        (candidate) =>
          candidate.title.toLowerCase() === target[1].trim().toLowerCase(),
      );
    if (linked && publicNotes.includes(linked))
      graphEdges.push({ source: note.id, target: linked.id });
  }
await mkdir(output, { recursive: true });
await writeFile(
  path.join(output, "knowledge.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      notes: publicNotes,
      graph: { nodes: graphNodes, edges: graphEdges },
      warnings,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Knowledge build: ${publicNotes.length} public notes, ${graphEdges.length} edges${warnings.length ? `, ${warnings.length} warnings` : ""}`,
);
for (const warning of warnings) console.warn(`Warning: ${warning}`);
