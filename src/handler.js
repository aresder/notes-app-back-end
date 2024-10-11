const { nanoid } = require('nanoid');
const notes = require('./notes.js');

const addNoteHandler = (request, h) => {
  const { body, tags, title } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    id, title, tags, body, createdAt, updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;
  const msgSuccess = { status: 'success', message: 'Catatan berhasil ditambahkan', data: { noteId: id }, };
  const msgFailed = { status: 'fail', message: 'Catatan gagal ditambahkan', };

  return isSuccess ? h.response(msgSuccess).code(201) : h.response(msgFailed).code(500);
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: { notes },
});

const getNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const note = notes.filter((note) => note.id === id)[0];
  const msgSuccess = h.response({ status: 'success', data: { note } }).code(200);
  const msgFailed = h.response({ status: 'Fail', message: 'Catatan tidak ditemukan' }).code(404);

  return note !== undefined ? msgSuccess : msgFailed;
};

const editNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const { title, tags, body } = req.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title, tags, body, updatedAt,
    }

    return h.response({ status: 'success', message: 'Catatan berhasil diperbarui' }).code(200)
  } else {
    return h.response({ status: 'fail', message: 'Gagal diperbarui. Id tidak ditemukan' }).code(404)
  };
};

const deleteNoteByIdHandler = (req, h) => {
  const { id } = req.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    return h.response({ status: 'success', message: 'Catatan berhasil dihapus' }).code(200);
  } else {
    return h.response({ status: 'success', message: 'Gagal dihapus. Id tidak ditemukan' }).code(404);
  };
};

module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler };