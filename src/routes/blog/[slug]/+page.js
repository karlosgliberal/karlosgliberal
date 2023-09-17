import { error } from "@sveltejs/kit";

export async function load({ params }) {
  const post = await import(`../posts/${params.slug}.md`);
  const { title, date, tags } = post.metadata;
  const content = post.default;

  return {
    content,
    title,
    date,
    tags,
  };

  throw error(404, "Not found");
}
