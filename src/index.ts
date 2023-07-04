//import { Client, LocalAuth } from "whatsapp-web.js";
//import { sendQrCode } from "./disc";
require("./core/Events/client");
import client from "../src/core/client/wts.client";
require("./core/Events/messages");

// client.on("qr", async (qr) => {
//   await sendQrCode(qr);
// });

// (async() => {

//     await client.initialize();

//     client.on("message", (message) => {
//         //console.log(message.body);
//       });
// })()
const Inicializador = async () => {
  await client.initialize();
};

Inicializador();
