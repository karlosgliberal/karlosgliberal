import { kv } from "@vercel/kv";
import { emitKeypressEvents } from "readline";

export const actions = {
  default: async ({ cookies, request }) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const user = {
      usuarios: {
        email: email,
        name: formData.get("name"),
        empresa: formData.get("empresa"),
      },
    };
    // Connection with vercel
    // await kv.set(email, user);
    console.log("Enviado");
    return {
      success: true,
    };
  },
};
