"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Note = {
  id: number;
  title: string;
  category: string;
  subject: string;
  year: string;
};

export default function SupabaseTestPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function testSupabase() {
      const { data, error } = await supabase
        .from("notes")
        .select("id, title, category, subject, year")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        setNotes(data || []);
      }

      setLoading(false);
    }

    testSupabase();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold">Supabase Connection Test</h1>

          <p className="mt-2 text-slate-500">
            NotesHub is testing the connection to the Supabase database.
          </p>

          {loading && (
            <div className="mt-8 rounded-2xl bg-blue-50 p-5 text-blue-700">
              Connecting to Supabase...
            </div>
          )}

          {!loading && error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
              <p className="font-semibold">Connection error</p>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="mt-8">
              <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-green-700">
                <p className="font-semibold">
                  ✅ Supabase connection successful!
                </p>

                <p className="mt-2 text-sm">
                  Notes found in database:{" "}
                  <strong>{notes.length}</strong>
                </p>
              </div>

              {notes.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
                  The connection works, but your notes table is currently
                  empty.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="rounded-2xl border border-slate-200 p-5"
                    >
                      <h2 className="font-semibold">{note.title}</h2>

                      <p className="mt-2 text-sm text-slate-500">
                        {note.category} • {note.subject} • {note.year}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}