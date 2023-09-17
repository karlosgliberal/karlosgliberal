<script>
  import NavBar from "../components/navigation/NavBar.svelte";
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte starter Kit" />
</svelte:head>

<NavBar />
<div class="container py-20">
  <h2 class="text-3xl text-pink-600 pt-5 pb-10">Cables</h2>
  <div class="flex gap-5 justify-center">
    <div class="box w-[450px] p-10 text-center">
      <a class="text-2xl" href="/cablescustom ">Tamaño personalizado</a>
    </div>
    <div class="box w-[450px] p-10 text-2xl text-center">
      <a class="text-2xl" href="/cablesfullscreen">Fullscreen</a>
    </div>
  </div>
</div>
