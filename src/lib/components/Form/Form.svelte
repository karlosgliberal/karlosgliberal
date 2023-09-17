<script>
  import { enhance } from "$app/forms";
</script>

<div class="w-[400px] mx-auto">
  <form method="POST" action="#form-one" use:enhance>
    <div class="mb-4">
      <label class="uppercase text-min" for="name">Nombre y apellido </label>
      <input id="name" type="name" name="name" />
    </div>
    <div class="mb-4">
      <label for="email" class="uppercase text-min"> Email </label>
      <input id="email" type="email" name="email" />
    </div>
    <div class="mb-4">
      <label class="uppercase text-min" for="empresa"> Empresa </label>
      <input id="empresa" type="empresa" name="empresa" />
    </div>

    <button
      type="submit"
      class="bg-pink-700 py-2 px-10 uppercase text-white font-tertiary boto"
      >Enviar</button
    >
  </form>
</div>

<style>
  input {
    padding: 0.5rem;
    border-bottom: 2px solid #db2777;
    width: 100%;
    border-radius: 0;
  }
  label {
    margin-bottom: 15px;
  }

  button {
    padding: 0.5rem 1rem;

    width: 100%;
  }

  input:focus {
    background-color: white;
    border: 1px solid #db2777;
    border-radius: 0;
  }

  input:focus-visible {
    outline: 1px solid #db2777;
    border-radius: 0px;
  }

  .boto {
    border: 1px solid transparent;
    margin-top: 40px;
  }
  .boto:hover {
    background-color: white;
    color: #db2777;
    cursor: pointer;
    border: 1px solid #db2777;
    transition: all ease-in 300ms;
  }
</style>
