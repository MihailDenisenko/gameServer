import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Создаем WebSocket-сервер
const wss = new WebSocketServer({ server });

// Обработчик подключений WebSocket
wss.on("connection", (ws) => {
  console.log("🟢 Новое подключение");

  // Отправляем приветствие новому клиенту
  ws.send("Добро пожаловать в WebSocket-чат!");

  // Обработка сообщений от клиента
  ws.on("message", (data) => {
    const message = data.toString();
    console.log(`📩 Получено: ${message}`);

    // Рассылка сообщения всем подключенным клиентам
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocketServer.OPEN) {
        client.send(`Сообщение: ${message}`);
      }
    });
  });

  // Обработка закрытия соединения
  ws.on("close", () => {
    console.log("🔴 Соединение закрыто");
  });
});

// Маршрут для проверки работоспособности (требуется Render.com)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Старт сервера
server.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`🔌 WebSocket доступен по адресу: ws://localhost:${PORT}`);
});
