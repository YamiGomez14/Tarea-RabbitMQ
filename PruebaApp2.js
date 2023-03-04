import { connect } from "amqplib";

const nombredelacola = "cola";

async function consumirMensaje() {
  try {
    const conexion = await connect({
      hostname: "localhost",
      username: "yamilka",
      password: "2180529",
      port: 5672,
      vhost: "/",
      protocol: "amqp",

    });
    const canal = await conexion.createChannel();
    await canal.assertQueue(nombredelacola);
    console.log("En espera de mensaje");
    canal.consume(nombredelacola, (msg) => {
    console.log(`El mensaje recibido es este: ${msg.content.toString()}`);
    canal.ack(msg);
    });
  } catch (error) {
    console.log(error);
  }
}

consumirMensaje();