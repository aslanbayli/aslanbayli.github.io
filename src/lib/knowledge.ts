import knowledge from "../generated/knowledge.json";

export interface KnowledgeNote {
  id: string;
  slug: string;
  type: string;
  title: string;
  summary: string;
  tags: string[];
  image?: string;
  status?: string;
  featured?: boolean;
  github?: string;
  demo?: string;
  date?: string;
  excerpt?: string;
  readTime?: string;
  cover?: string;
  body: string;
  url: string;
}

export const publicNotes = knowledge.notes as KnowledgeNote[];
export const projects = publicNotes.filter((note) => note.type === "project").map((note) => ({
  ...note,
  description: note.summary,
  image: note.image ?? "",
  status: note.status ?? "Project",
  featured: Boolean(note.featured),
  github: note.github ?? "",
  demo: note.demo ?? "",
  blog: "",
}));
export const posts = publicNotes.filter((note) => note.type === "blog").sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
export const experienceNote = publicNotes.find((note) => note.type === "experience");
export const graph = knowledge.graph;
