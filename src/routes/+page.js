import { error } from "@sveltejs/kit";
import { getBlogPosts } from "$lib/utils.js";

export async function load({ params }) {
  const sortedPosts = await getBlogPosts();
  const recentPosts = sortedPosts;

  return {
    recentPosts,
  };

  throw error(404, "Not found");
}
