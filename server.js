const WebSocket = require("ws");
const http = require("http");

// Создаем HTTP-сервер для WebSocket
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Обработка подключений
wss.on("connection", (ws) => {
  console.log("Новое подключение");

  // Отправка сообщения клиенту
  ws.send(
    JSON.stringify({
      type: "welcome",
      message: "Добро пожаловать в WebSocket сервер!",
    })
  );

  // Обработка сообщений от клиента
  ws.on("message", (data) => {
    console.log("Получено сообщение:", data.toString());

    // Рассылка сообщения всем подключенным клиентам
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "broadcast",
            message: `Клиент сказал: ${data.toString()}`,
          })
        );
      }
    });
  });

  // Обработка отключения
  ws.on("close", () => {
    console.log("Клиент отключен");
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`WebSocket сервер запущен на порту ${PORT}`);
});
