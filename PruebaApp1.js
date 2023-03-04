
import express from "express";
import { connect } from "amqplib"; 
import bodyParser from "body-parser";
const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
        <form action="/enviar-mensaje" method="POST">
            <input type="text" name="message" />
            <button type="submit">Send</button> 
        </form>
    `);
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/enviar-mensaje', async (req, res) => {
  try {
    const message = req.body.message; // Obtener el mensaje desde el body de la petición
    const connection = await connect({
      hostname: "localhost",
      username: "yamilka",
      password: "2180529",
      port: 5672, //este es el otro puerto que use al crear los nodos en Rabbit
      vhost: "/",
      protocol: "amqp",
    });; // Conectarse a RabbitMQ
    const channel = await connection.createChannel(); // Crear un canal

    const nombredelacola = "cola"; // Nombre de la cola a la que se enviará el mensaje

    await channel.assertQueue(nombredelacola); // Asegurar que la cola existe
    await channel.sendToQueue(nombredelacola, Buffer.from(message)); // Enviar el mensaje a la cola

    console.log(`Mensaje enviado: ${message}`);

    await channel.close(); // Cerrar el canal
    await connection.close(); // Cerrar la conexión

    res.status(200).send('Mensaje enviado correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al enviar el mensaje');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
