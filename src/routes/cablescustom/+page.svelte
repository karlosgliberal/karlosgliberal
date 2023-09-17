<script>
  import Cables from "$lib/components/Cables/Cables.svelte";
  import NavBar from "../components/navigation/NavBar.svelte";
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte starter Kit" />
</svelte:head>
<NavBar />
<div class="container">
  <h2 class="text-3xl text-pink-600 pt-5 pb-10">Cables custom</h2>
  <Cables patch="glich" width="800px" height="400px" />
</div>
