<script>
  import { goto } from "$app/navigation";
  import { fade, scale } from "svelte/transition";

  let y;
</script>

<svelte:window bind:scrollY={y} />

<div class="hero h-[105vh]">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <div class="mb-5">
        <svg
          class="mx-auto"
          width="50"
          height="71"
          viewBox="0 0 50 71"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 60.4669V9.61426L9.61426 0H20.1308V8.56304H14.4221L9.91357 13.0701V57.011L14.4207 61.5181H20.1294V70.0812H9.61426L0 60.4669ZM29.8692 70.0812V61.5181H35.5779L40.085 57.011V13.0701L35.5779 8.56304H29.8692V0H40.3857L50 9.61426V60.4669L40.3857 70.0812H29.8692Z"
            fill="#EB5482"
          />
        </svg>
      </div>
      <h1 class="text-5xl font-bold font-primary">Starter Kit</h1>
      <p class="py-6 font-primary uppercase">
        🚀 🛸 🏖️ Svelte Kit + TailwindCss + DaisyUI 🦖  🐳    ☠️
      </p>
      {#if !y}
        <div
          transition:scale={{
            duration: 1000,
            baseScale: 0.2,
          }}
        >
          <p class="text-xl">&darr;</p>
        </div>
      {/if}
      {#if y > 10}
        <button
          in:fade={{ duration: 800 }}
          out:fade={{ duration: 200 }}
          on:click={() => goto("/blog")}
          class="btn btn-primary">Get Started</button
        >
      {/if}
    </div>
  </div>
</div>
