<script>
  import Form from "$lib/components/Form/Form.svelte";
  import NavBar from "../components/navigation/NavBar.svelte";

  export let form;
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte starter Kit" />
</svelte:head>
<NavBar />
<section>
  <div class="container py-20">
    <div class="flex justify-center">
      <div class="box w-[500px] p-10">
        <h2 class="text-3xl text-pink-600 pt-5 pb-10">Formulario</h2>
        {#if form?.success}
          <div class="text-center">
            <div class="flex flex-col justify-center items-center py-32">
              <p id="form-one" class="pb-2 pt-5 uppercase">
                ¡Hemos recibido tu mensaje!
              </p>
              <p class="text-min">
                En breve nos pondremos en contacto contigo.
              </p>
            </div>
          </div>
        {:else}
          <Form />
        {/if}
      </div>
    </div>
  </div>
</section>
