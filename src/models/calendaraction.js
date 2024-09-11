// models/calendaraction.js
import { query } from './db.js';

// Mostra eventos futuros ou que se repetem
export const mostrarEventos = async () => {
  const today = new Date().toISOString().split('T')[0];
  const result = await query('SELECT * FROM events WHERE repeats = true OR start_date >= $1 ORDER BY start_date', [today]);
  return result.rows;
};

// Adiciona um novo evento
export const adicionarEvento = async (evento) => {
  const { name, startDate, endDate, startTime, endTime, description, repeats } = evento;
  const result = await query(
    `INSERT INTO events (name, start_date, end_date, start_time, end_time, description, repeats)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name, startDate, endDate, startTime, endTime, description, repeats]
  );
  return result.rows[0];
};

// Edita um evento existente
export const editarEvento = async (id, evento) => {
  const { name, startDate, endDate, startTime, endTime, description, repeats } = evento;
  const result = await query(
    `UPDATE events SET name = $1, start_date = $2, end_date = $3, start_time = $4, end_time = $5, description = $6, repeats = $7
     WHERE id = $8 RETURNING *`,
    [name, startDate, endDate, startTime, endTime, description, repeats, id]
  );
  return result.rows[0];
};

// Deleta um evento
export const deletarEvento = async (id) => {
  const result = await query(`DELETE FROM events WHERE id = $1 RETURNING *`, [id]);
  return result.rows[0];
};
