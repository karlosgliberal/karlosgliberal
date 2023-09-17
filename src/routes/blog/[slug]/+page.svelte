<script>
  export let data;
  import { convertDateToString } from "$lib/utils.js";
  import { fade } from "svelte/transition";
</script>

<div class="container">
  <article
    in:fade={{ duration: 800 }}
    out:fade={{ duration: 0 }}
    class="mx-40 py-10"
  >
    <p class="text-sm mb-4">{convertDateToString(data.date)}</p>
    <h1 class="text-4xl bold mb-4">{data.title}</h1>
    <div class="tags mb-4">
      {#each data.tags as tag}
        <p class="tag">#{tag}</p>
      {/each}
    </div>
    <svelte:component this={data.content} />
    <div class="border-b mt-10 pb-3 flex justify-between">
      <div><a class="text-pink-500" href="/blog">&larr; Atras</a></div>
      <div>
        <label class="swap swap-flip text-xl">
          <!-- this hidden checkbox controls the state -->
          <input type="checkbox" />
          <div class="swap-on">😈</div>
          <div class="swap-off">😇</div>
        </label>
      </div>
    </div>
  </article>
</div>
