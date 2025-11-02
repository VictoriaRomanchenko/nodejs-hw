import { Note } from "../models/note.js";
import createHttpError from "http-errors";

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;

  const skip = (page - 1) * perPage;
  const query = {};

  if (tag) {
    query.tag = tag;
  }

  if (search) {
    query.$text = { $search: search };
  }

  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments(query),
    Note.find(query).skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId);

  if (!note) {
    return next(createHttpError(404, "Note not found"));
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findByIdAndDelete(noteId);

  if (!note) {
    return next(createHttpError(404, "Note not found"));
  }

  res.status(200).json(note);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findByIdAndUpdate(noteId, req.body, { new: true });

  if (!note) {
    return next(createHttpError(404, "Note not found"));
  }

  res.status(200).json(note);
};
