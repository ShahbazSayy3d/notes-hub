"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  FileText,
  FolderOpen,
  LogOut,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Note = {
  id: number;
  title: string;
  category: string;
  subject: string;
  year: string;
  description: string;
  pdf_url: string;
};

const ADMIN_UID =
  "bb4e9e3c-96a6-4a30-8d65-f9ee691ed1aa";

const categories = [
  "Computer Science",
  "Cyber Security",
  "AI & ML",
  "Mathematics",
  "Physics",
  "Programming",
];

export default function AdminDashboard() {
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(
    null
  );

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState<number | null>(
    null
  );

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    if (user.id !== ADMIN_UID) {
      await supabase.auth.signOut();
      router.replace("/admin/login");
      return;
    }

    setUserEmail(user.email || "");

    await loadNotes();

    setLoading(false);
  }

  async function loadNotes() {
    const { data, error: notesError } = await supabase
      .from("notes")
      .select(
        "id, title, category, subject, year, description, pdf_url"
      )
      .order("created_at", { ascending: false });

    if (notesError) {
      console.error(notesError);
      setError(notesError.message);
      return;
    }

    setNotes(data || []);
  }

  function resetForm() {
    setTitle("");
    setCategory("");
    setSubject("");
    setYear("");
    setDescription("");
    setPdfFile(null);
    setMessage("");
    setError("");
    setEditingNote(null);
  }

  function closeForm() {
    if (uploading) return;

    resetForm();
    setShowForm(false);
  }

  function openAddForm() {
    resetForm();
    setShowForm(true);
  }

  function openEditForm(note: Note) {
    setEditingNote(note);

    setTitle(note.title);
    setCategory(note.category);
    setSubject(note.subject);
    setYear(note.year);
    setDescription(note.description || "");
    setPdfFile(null);

    setMessage("");
    setError("");

    setShowForm(true);
  }

  async function handleSaveNote(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!title.trim()) {
      setError("Please enter a note title.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!subject.trim()) {
      setError("Please enter the subject.");
      return;
    }

    if (!year.trim()) {
      setError("Please enter the academic year.");
      return;
    }

    if (!editingNote && !pdfFile) {
      setError("Please select a PDF file.");
      return;
    }

    if (pdfFile) {
      if (pdfFile.type !== "application/pdf") {
        setError("Only PDF files are allowed.");
        return;
      }

      const maximumSize = 50 * 1024 * 1024;

      if (pdfFile.size > maximumSize) {
        setError("The PDF must be 50 MB or smaller.");
        return;
      }
    }

    setUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          "Your session has expired. Please sign in again."
        );
      }

      if (user.id !== ADMIN_UID) {
        throw new Error(
          "You are not authorized to manage notes."
        );
      }

      let pdfUrl = editingNote?.pdf_url || "";
      let newFilePath: string | null = null;

      /*
       * If a new PDF was selected, upload it first.
       */
      if (pdfFile) {
        setMessage(
          editingNote
            ? "Uploading replacement PDF..."
            : "Uploading PDF..."
        );

        const cleanName = pdfFile.name
          .replace(/[^a-zA-Z0-9._-]/g, "-")
          .replace(/-+/g, "-");

        newFilePath = `${Date.now()}-${crypto.randomUUID()}-${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from("notes-pdfs")
          .upload(newFilePath, pdfFile, {
            contentType: "application/pdf",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(
            `PDF upload failed: ${uploadError.message}`
          );
        }

        const { data: publicUrlData } = supabase.storage
          .from("notes-pdfs")
          .getPublicUrl(newFilePath);

        pdfUrl = publicUrlData.publicUrl;
      }

      /*
       * ADD NEW NOTE
       */
      if (!editingNote) {
        setMessage("Saving note information...");

        const { error: insertError } = await supabase
          .from("notes")
          .insert({
            title: title.trim(),
            category,
            subject: subject.trim(),
            year: year.trim(),
            description: description.trim(),
            pdf_url: pdfUrl,
          });

        if (insertError) {
          if (newFilePath) {
            await supabase.storage
              .from("notes-pdfs")
              .remove([newFilePath]);
          }

          throw new Error(
            `Note could not be saved: ${insertError.message}`
          );
        }

        await loadNotes();

        setMessage("Note uploaded successfully!");

        setTimeout(() => {
          setShowForm(false);
          resetForm();
        }, 1200);

        return;
      }

      /*
       * EDIT EXISTING NOTE
       */
      setMessage("Updating note...");

      const { error: updateError } = await supabase
        .from("notes")
        .update({
          title: title.trim(),
          category,
          subject: subject.trim(),
          year: year.trim(),
          description: description.trim(),
          pdf_url: pdfUrl,
        })
        .eq("id", editingNote.id);

      if (updateError) {
        if (newFilePath) {
          await supabase.storage
            .from("notes-pdfs")
            .remove([newFilePath]);
        }

        throw new Error(
          `Note could not be updated: ${updateError.message}`
        );
      }

      /*
       * If a replacement PDF was uploaded successfully,
       * remove the old PDF from Storage.
       */
      if (newFilePath && editingNote.pdf_url) {
        const oldFilePath = getStorageFilePath(
          editingNote.pdf_url
        );

        if (oldFilePath) {
          await supabase.storage
            .from("notes-pdfs")
            .remove([oldFilePath]);
        }
      }

      await loadNotes();

      setMessage("Note updated successfully!");

      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 1200);
    } catch (saveError) {
      console.error(saveError);

      if (saveError instanceof Error) {
        setError(saveError.message);
      } else {
        setError("Something went wrong.");
      }

      setMessage("");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteNote(note: Note) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${note.title}"?\n\nThis will remove the note and its PDF file.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(note.id);
    setError("");
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          "Your session has expired. Please sign in again."
        );
      }

      if (user.id !== ADMIN_UID) {
        throw new Error(
          "You are not authorized to delete notes."
        );
      }

      /*
       * First remove the PDF from Storage.
       */
      const filePath = getStorageFilePath(note.pdf_url);

      if (filePath) {
        const { error: storageError } =
          await supabase.storage
            .from("notes-pdfs")
            .remove([filePath]);

        if (storageError) {
          throw new Error(
            `PDF could not be deleted: ${storageError.message}`
          );
        }
      }

      /*
       * Then remove the database record.
       */
      const { error: deleteError } = await supabase
        .from("notes")
        .delete()
        .eq("id", note.id);

      if (deleteError) {
        throw new Error(
          `Note could not be deleted: ${deleteError.message}`
        );
      }

      setNotes((currentNotes) =>
        currentNotes.filter(
          (currentNote) => currentNote.id !== note.id
        )
      );

      setMessage("Note deleted successfully!");

      setTimeout(() => {
        setMessage("");
      }, 1800);
    } catch (deleteError) {
      console.error(deleteError);

      if (deleteError instanceof Error) {
        setError(deleteError.message);
      } else {
        setError("Something went wrong while deleting.");
      }
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  const categoryCount = new Set(
    notes.map((note) => note.category)
  ).size;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 dark:bg-[#070b14] dark:text-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#070b14]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h1 className="font-bold">NotesHub Admin</h1>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Content management dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-500 md:block dark:text-slate-400">
              {userEmail}
            </span>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:border-red-400/30 dark:hover:text-red-400"
            >
              <LogOut size={17} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            Administration
          </p>

          <h2 className="mt-1 text-3xl font-black tracking-tight">
            Dashboard
          </h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Manage your NotesHub learning resources from one place.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard
            title="Total Notes"
            value={loading ? "—" : notes.length}
            icon={<BookOpen size={23} />}
          />

          <StatCard
            title="PDF Resources"
            value={loading ? "—" : notes.length}
            icon={<FileText size={23} />}
          />

          <StatCard
            title="Categories"
            value={loading ? "—" : categoryCount}
            icon={<FolderOpen size={23} />}
          />
        </div>

        {/* Add note banner */}
        <div className="mt-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-7 text-white shadow-xl shadow-blue-500/15">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2 text-blue-100">
                <Upload size={19} />

                <span className="text-sm font-semibold">
                  Content management
                </span>
              </div>

              <h3 className="mt-2 text-2xl font-black">
                Add a new note
              </h3>

              <p className="mt-1 text-sm text-blue-100">
                Upload a PDF and publish it to the NotesHub library.
              </p>
            </div>

            <button
              onClick={openAddForm}
              className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <Plus size={19} />
              Add New Note
            </button>
          </div>
        </div>

        {/* Global messages */}
        {message && !showForm && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700 dark:border-green-400/20 dark:bg-green-500/10 dark:text-green-300">
            <CheckCircle2 size={19} />
            {message}
          </div>
        )}

        {error && !showForm && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
            <AlertCircle size={19} />
            {error}
          </div>
        )}

        {/* Notes */}
        <section className="mt-10">
          <div className="mb-5">
            <h3 className="text-xl font-bold">
              Notes Library
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Recently added resources
            </p>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 dark:border-white/10 dark:bg-white/[0.04]">
              Loading notes...
            </div>
          ) : notes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-white/10 dark:bg-white/[0.04]">
              <FileText
                size={38}
                className="mx-auto text-slate-400"
              />

              <h4 className="mt-4 font-bold">
                No notes yet
              </h4>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Click "Add New Note" to upload your first PDF.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.04]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.03]">
                    <tr>
                      <th className="px-6 py-4 font-bold">
                        Title
                      </th>

                      <th className="px-6 py-4 font-bold">
                        Category
                      </th>

                      <th className="px-6 py-4 font-bold">
                        Subject
                      </th>

                      <th className="px-6 py-4 font-bold">
                        Year
                      </th>

                      <th className="px-6 py-4 text-right font-bold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {notes.map((note) => (
                      <tr
                        key={note.id}
                        className="border-b border-slate-100 last:border-0 dark:border-white/5"
                      >
                        <td className="px-6 py-4 font-semibold">
                          {note.title}
                        </td>

                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                          {note.category}
                        </td>

                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                          {note.subject}
                        </td>

                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                          {note.year}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                openEditForm(note)
                              }
                              disabled={
                                deletingId === note.id
                              }
                              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:border-blue-400/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                            >
                              <Pencil size={15} />
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteNote(note)
                              }
                              disabled={
                                deletingId === note.id
                              }
                              className="flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-400/20 dark:text-red-400 dark:hover:bg-red-500/10"
                            >
                              <Trash2 size={15} />

                              {deletingId === note.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0c1220]">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-white/10">
              <div>
                <h3 className="text-xl font-bold">
                  {editingNote
                    ? "Edit Note"
                    : "Add New Note"}
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {editingNote
                    ? "Update the note information or replace its PDF."
                    : "Add a PDF resource to your NotesHub library."}
                </p>
              </div>

              <button
                onClick={closeForm}
                disabled={uploading}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSaveNote}
              className="max-h-[75vh] space-y-5 overflow-y-auto p-6"
            >
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold"
                >
                  Note Title
                </label>

                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="e.g. Introduction to Network Security"
                  disabled={uploading}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold"
                >
                  Category
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  disabled={uploading}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                >
                  <option value="">
                    Select a category
                  </option>

                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject + Year */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(event) =>
                      setSubject(event.target.value)
                    }
                    placeholder="e.g. Network Security"
                    disabled={uploading}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="year"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Academic Year
                  </label>

                  <input
                    id="year"
                    type="text"
                    value={year}
                    onChange={(event) =>
                      setYear(event.target.value)
                    }
                    placeholder="e.g. 2026"
                    disabled={uploading}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold"
                >
                  Description
                  <span className="ml-2 font-normal text-slate-400">
                    Optional
                  </span>
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Briefly describe this resource..."
                  rows={4}
                  disabled={uploading}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              {/* PDF */}
              <div>
                <label
                  htmlFor="pdf"
                  className="mb-2 block text-sm font-semibold"
                >
                  {editingNote
                    ? "Replace PDF"
                    : "PDF File"}
                </label>

                {editingNote && (
                  <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                    Leave this empty to keep the existing PDF.
                  </p>
                )}

                <label
                  htmlFor="pdf"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50/50 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-blue-400/40"
                >
                  <Upload
                    size={30}
                    className="text-slate-400"
                  />

                  {pdfFile ? (
                    <>
                      <p className="mt-3 text-sm font-bold">
                        {pdfFile.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {(pdfFile.size / (1024 * 1024)).toFixed(
                          2
                        )}{" "}
                        MB
                      </p>

                      <p className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                        Click to choose another PDF
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-3 text-sm font-bold">
                        {editingNote
                          ? "Choose a replacement PDF"
                          : "Choose a PDF file"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        PDF only • Maximum 50 MB
                      </p>
                    </>
                  )}

                  <input
                    id="pdf"
                    type="file"
                    accept="application/pdf,.pdf"
                    disabled={uploading}
                    className="hidden"
                    onChange={(event) => {
                      setPdfFile(
                        event.target.files?.[0] || null
                      );
                      setError("");
                    }}
                  />
                </label>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300">
                  <AlertCircle
                    size={19}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{error}</span>
                </div>
              )}

              {/* Success */}
              {message && (
                <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-400/20 dark:bg-green-500/10 dark:text-green-300">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{message}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={uploading}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {editingNote ? (
                    <Pencil size={18} />
                  ) : (
                    <Upload size={18} />
                  )}

                  {uploading
                    ? "Saving..."
                    : editingNote
                      ? "Save Changes"
                      : "Upload Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

/*
 * Converts a Supabase public PDF URL back into
 * the Storage file path.
 *
 * Example:
 * https://xxxxx.supabase.co/storage/v1/object/public/notes-pdfs/file.pdf
 *
 * becomes:
 * file.pdf
 */
function getStorageFilePath(
  publicUrl: string
): string | null {
  if (!publicUrl) {
    return null;
  }

  const marker =
    "/storage/v1/object/public/notes-pdfs/";

  const index = publicUrl.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return decodeURIComponent(
    publicUrl.substring(index + marker.length)
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-blue-400/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-black">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      </div>
    </div>
  );
}