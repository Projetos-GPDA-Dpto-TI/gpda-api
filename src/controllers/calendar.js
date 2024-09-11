// controllers/calendarController.js
import express from "express";
import * as calendar from "../models/calendaraction.js";

const calendarController = express.Router();

// Rota para mostrar eventos
calendarController.get("/mostrar", async (req, res) => {
  try {
    const eventos = await calendar.mostrarEventos();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter os eventos." });
  }
});

// Rota para adicionar um novo evento
calendarController.post("/adicionar", async (req, res) => {
  try {
    const novoEvento = await calendar.adicionarEvento(req.body);
    res.status(201).json(novoEvento);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar o evento." });
  }
});

// Rota para editar um evento existente
calendarController.put("/editar/:id", async (req, res) => {
  try {
    const eventoAtualizado = await calendar.editarEvento(req.params.id, req.body);
    if (eventoAtualizado) {
      res.json(eventoAtualizado);
    } else {
      res.status(404).json({ error: "Evento não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao editar o evento." });
  }
});

// Rota para deletar um evento
calendarController.delete("/deletar/:id", async (req, res) => {
  try {
    const eventoDeletado = await calendar.deletarEvento(req.params.id);
    if (eventoDeletado) {
      res.json(eventoDeletado);
    } else {
      res.status(404).json({ error: "Evento não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar o evento." });
  }
});

// Rota para capturar todas as outras requisições que não são definidas
calendarController.all("*", (_, res) => {
  res.sendStatus(404);
});

export default calendarController;