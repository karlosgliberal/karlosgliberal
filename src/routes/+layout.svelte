<script>
  import "../app.css";
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Cabin:wght@400;500;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div>
  <main>
    <slot />
  </main>
</div>

<style>
  main {
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
    min-height: 100vh;
  }
</style>
