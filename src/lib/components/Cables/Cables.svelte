<script>
  import { onMount } from "svelte";

  export let patch;
  export let pathPatch = `${patch}/patch.js`;
  export let styles = "";
  export let width = "";
  export let height = "";
  export let fullscreen = false;

  const initializeCables = () => {
    CABLES.patch = new CABLES.Patch({
      patch: CABLES.exportedPatch,
      prefixAssetPath: `${patch}/`,
      glCanvasId: `cables_${patch}`,
      glCanvasResizeToWindow: false,
      onError: showError,
      onPatchLoaded: patchInitialized,
      onFinishedLoading: patchFinishedLoading,
      outSidefunction: myFunction,

      canvas: { alpha: true, premultipliedAlpha: true },
    });
  };
  onMount(() => {
    initializeCables();
  });

  function showError(errId, errMsg) {
    alert("An error occured: " + errId + ", " + errMsg);
  }

  function patchInitialized() {
    // You can now access the patch object (CABLES.patch), register variable watchers and so on
  }

  function patchFinishedLoading() {
    // You can now access the patch object (CABLES.patch), register variable watchers and so on
  }
  function myFunction() {
    alert("function called!");
  }
</script>

<svelte:head>
  <script src={pathPatch} on:load={initializeCables}></script>
</svelte:head>

{#if fullscreen}
  <div class="w-screen h-screen bg-slate-400">
    <canvas
      class={styles}
      id="cables_{patch}"
      style="width: 100vw; height: 100vh;"
      {fullscreen}
    />
  </div>
{:else}
  <canvas class={styles} id="cables_{patch}" {width} {height} {fullscreen} />
{/if}
