<script>
  import NavBar from "../components/navigation/NavBar.svelte";
  import { goto } from "$app/navigation";
  import { convertDateToString } from "$lib/utils.js";
  export let data;
</script>

<div>
  <NavBar />
</div>
<div class="container">
  <section class="mx-40 py-10">
    <h2 class="text-3xl text-pink-600 pt-5 pb-10">Blog</h2>
    {#each data.sortedPosts as post}
      <div
        class="mb-4 border-b border-b-gray-300 box py-5 px-5"
        on:click={goto(`/blog/${post.slug}`)}
        on:keydown={goto(`blog/${post.slug}`)}
      >
        <p class="text-xs mb-2">{convertDateToString(post.date)}</p>
        <a
          class="text-2xl mb-3 text-pink-600 hover:text-gray-500"
          href={`/blog/${post.slug}`}>{post.title}</a
        >
        {#if post.image}
          <img src={`${post.image}`} alt="" />
        {:else}
          <p class="mb-2">{post.description}</p>
        {/if}
        <div class="text-sm">
          {#each post.tags as tag}
            <p class="tag">#{tag}</p>
          {/each}
        </div>
      </div>
    {/each}
    <div class="py-10"><a class="text-pink-500" href="/">&larr; Home</a></div>
  </section>
</div>
