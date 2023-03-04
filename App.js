
const app = express();

const nombredelacola = "cola";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
        <form action="/send" method="POST">
            <input type="text" name="message" />
            <button type="submit">Send</button> 
        </form>
    `);
});

app.post("/send", async (req, res) => {
  try {
    const { message } = req.body;

    const connection = await connect({
      hostname: "localhost",
      username: "yamilka",
      password: "2180529",
      port: 5672, //este es el otro puerto que use al crear los nodos en Rabbit
      vhost: "/",
      protocol: "amqp",
    });
    const channel = await connection.createChannel();
    await channel.assertQueue(nombredelacola);
    await channel.sendToQueue(nombredelacola, Buffer.from(message));
    await channel.close();
    await connection.close();
    res.send("Mensaje enviado");
  } catch (error) {
    console.log(error);
    res.status(500).send("No se ha podido enviar el mensaje");
  }
});

app.listen(8080, () => {
  console.log("Ejecutandose en el puerto 8080");
});