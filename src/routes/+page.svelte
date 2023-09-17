<script>
  import { MetaTags } from "svelte-meta-tags";

  import Hero from "./components/Hero/Hero.svelte";
</script>

<MetaTags
  title="Svelte starter Kit"
  titleTemplate="%s | Home"
  description="Un kit de inicio con Svelte"
  canonical="/"
  openGraph={{
    url: "https://",
    title: "Svelte starter Kit",
    description: "Un kit de inicio con Svelte",
    // Tamaño 1200 x 600 px
    images: [
      {
        url: "https://",
        alt: "Svelte starter Kit",
      },
    ],
    site_name: "Svelte starter Kit",
    type: "article",
  }}
  twitter={{
    site: "@biko2",
    cardType: "summary_large_image",
    title: "Svelte starter Kit",
    description: "Un kit de inicio con Svelte",
    // Tamaño 1280 x 640 px
    image: "https://",
    imageAlt: "Svelte starter Kit",
  }}
/>
<section>
  <Hero />
</section>
