import { error } from "@sveltejs/kit";
import { getBlogPosts } from "$lib/utils.js";

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  const sortedPosts = getBlogPosts();

  return {
    sortedPosts,
  };

  throw error(404, "Not found");
}
