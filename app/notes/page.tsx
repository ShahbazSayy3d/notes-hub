"use client";

import {
  ArrowDownToLine,
  BookOpen,
  ChevronDown,
  FileText,
  Filter,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Note = {
  id: number;
  created_at: string;
  title: string;
  category: string;
  subject: string;
  year: string;
  description: string;
  pdf_url: string;
};

const categories = [
  "All Categories",
  "Computer Science",
  "Cyber Security",
  "AI & ML",
  "Mathematics",
  "Physics",
  "Programming",
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [subject, setSubject] = useState("All Subjects");
  const [year, setYear] = useState("All Years");

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error);
      setError("Unable to load notes right now.");
      setNotes([]);
    } else {
      setNotes((data as Note[]) || []);
    }

    setLoading(false);
  }

  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(
      new Set(
        notes
          .map((note) => note.subject)
          .filter((subject) => subject && subject.trim() !== "")
      )
    );

    return ["All Subjects", ...uniqueSubjects.sort()];
  }, [notes]);

  const years = useMemo(() => {
    const uniqueYears = Array.from(
      new Set(
        notes
          .map((note) => note.year)
          .filter((year) => year && year.trim() !== "")
      )
    );

    return ["All Years", ...uniqueYears.sort().reverse()];
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return notes.filter((note) => {
      const matchesSearch =
        searchText === "" ||
        note.title?.toLowerCase().includes(searchText) ||
        note.subject?.toLowerCase().includes(searchText) ||
        note.description?.toLowerCase().includes(searchText) ||
        note.category?.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All Categories" || note.category === category;

      const matchesSubject =
        subject === "All Subjects" || note.subject === subject;

      const matchesYear = year === "All Years" || note.year === year;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubject &&
        matchesYear
      );
    });
  }, [notes, search, category, subject, year]);

  const hasFilters =
    search !== "" ||
    category !== "All Categories" ||
    subject !== "All Subjects" ||
    year !== "All Years";

  function clearFilters() {
    setSearch("");
    setCategory("All Categories");
    setSubject("All Subjects");
    setYear("All Years");
  }

  function downloadPdf(note: Note) {
    if (!note.pdf_url) {
      return;
    }

    window.open(note.pdf_url, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-500 dark:bg-[#05070b] dark:text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-[10%] h-72 w-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute right-[5%] top-[35%] h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/10" />
        <div className="absolute bottom-[5%] left-[35%] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/10" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#070a10]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <a
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg transition-transform duration-300 group-hover:-translate-y-0.5 dark:bg-white dark:text-slate-900">
              <BookOpen size={20} />
            </div>

            <div>
              <div className="text-xl font-black tracking-tight">
                Notes<span className="text-blue-600">Hub</span>
              </div>
              <div className="hidden text-[11px] font-medium text-slate-500 sm:block dark:text-slate-400">
                Learn. Explore. Grow.
              </div>
            </div>
          </a>

          <nav className="flex items-center gap-2 text-sm font-medium sm:gap-6">
            <a
              href="/"
              className="hidden text-slate-600 transition hover:text-blue-600 sm:block dark:text-slate-300 dark:hover:text-blue-400"
            >
              Home
            </a>

            <a
              href="/notes"
              className="rounded-lg bg-blue-50 px-3 py-2 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
            >
              Notes
            </a>

            <a
              href="/admin"
              className="hidden text-slate-600 transition hover:text-blue-600 sm:block dark:text-slate-300 dark:hover:text-blue-400"
            >
              Admin
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300">
              <Sparkles size={15} />
              Your learning library
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
              Explore{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                Notes
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-400">
              Find lecture notes, study material, PDFs and academic resources
              organized in one simple place.
            </p>
          </div>

          {/* Search */}
          <div className="mt-10 max-w-4xl">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search notes, subjects, topics..."
                className="
                  w-full rounded-2xl border border-slate-200
                  bg-white py-4 pl-14 pr-12 text-base
                  outline-none transition
                  placeholder:text-slate-400
                  focus:border-blue-400
                  focus:ring-4 focus:ring-blue-500/10
                  dark:border-white/10
                  dark:bg-white/[0.04]
                  dark:text-white
                  dark:focus:border-blue-400/50
                "
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-20 border-b border-slate-200 bg-slate-50/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#05070b]/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-4 sm:px-8">
          <div className="mr-1 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Filter size={17} />
            Filters
          </div>

          <FilterSelect
            value={category}
            onChange={setCategory}
            options={categories}
          />

          <FilterSelect
            value={subject}
            onChange={setSubject}
            options={subjects}
          />

          <FilterSelect
            value={year}
            onChange={setYear}
            options={years}
          />

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* Notes */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Notes Library
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              {loading
                ? "Loading notes..."
                : filteredNotes.length === 1
                  ? "1 note available"
                  : `${filteredNotes.length} notes available`}
            </h2>
          </div>

          {!loading && notes.length > 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {notes.length} total resource{notes.length === 1 ? "" : "s"}
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.04]"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-400/20 dark:bg-red-500/10">
            <FileText
              size={36}
              className="mx-auto text-red-500"
            />

            <h3 className="mt-4 text-lg font-bold">
              Something went wrong
            </h3>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {error}
            </p>

            <button
              onClick={fetchNotes}
              className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-900"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty database */}
        {!loading && !error && notes.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-white/15 dark:bg-white/[0.03]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <FileText size={28} />
            </div>

            <h3 className="mt-6 text-xl font-bold">
              No notes uploaded yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              New notes and PDF resources uploaded by the administrator will
              appear here automatically.
            </p>
          </div>
        )}

        {/* No search results */}
        {!loading &&
          !error &&
          notes.length > 0 &&
          filteredNotes.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-white/[0.03]">
              <Search
                size={38}
                className="mx-auto text-slate-400"
              />

              <h3 className="mt-5 text-xl font-bold">
                No matching notes
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Try changing your search or filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-900"
              >
                Clear filters
              </button>
            </div>
          )}

        {/* Real notes */}
        {!loading && !error && filteredNotes.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <article
                key={note.id}
                className="
                  group futuristic-card flex flex-col overflow-hidden
                  rounded-2xl border border-slate-200
                  bg-white shadow-sm
                  dark:border-white/10
                  dark:bg-white/[0.035]
                  dark:shadow-[0_0_35px_rgba(37,99,235,0.03)]
                "
              >
                {/* Card top */}
                <div className="relative border-b border-slate-100 p-6 dark:border-white/10">
                  <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <FileText size={19} />
                  </div>

                  <div className="pr-14">
                    <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      {note.category || "General"}
                    </span>

                    <h3 className="mt-4 line-clamp-2 text-xl font-bold leading-7 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {note.title}
                    </h3>
                  </div>
                </div>

                {/* Card content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="space-y-2 text-sm">
                    {note.subject && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-500 dark:text-slate-400">
                          Subject
                        </span>
                        <span className="text-right font-semibold text-slate-800 dark:text-slate-200">
                          {note.subject}
                        </span>
                      </div>
                    )}

                    {note.year && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-slate-500 dark:text-slate-400">
                          Year
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {note.year}
                        </span>
                      </div>
                    )}
                  </div>

                  {note.description && (
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {note.description}
                    </p>
                  )}

                  <div className="mt-auto pt-6">
                    <button
                      onClick={() => downloadPdf(note)}
                      disabled={!note.pdf_url}
                      className="
                        flex w-full items-center justify-center gap-2
                        rounded-xl bg-slate-900 px-4 py-3
                        text-sm font-bold text-white
                        transition-all duration-300
                        hover:-translate-y-0.5
                        hover:shadow-lg
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        dark:bg-white
                        dark:text-slate-900
                        dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.12)]
                      "
                    >
                      <ArrowDownToLine size={17} />
                      Download PDF
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-[#070a10]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} NotesHub. All rights reserved.
          </div>

          <div className="flex items-center gap-5">
            <a
              href="/"
              className="transition hover:text-blue-600 dark:hover:text-blue-400"
            >
              Home
            </a>

            <a
              href="/notes"
              className="transition hover:text-blue-600 dark:hover:text-blue-400"
            >
              Notes
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="
          appearance-none rounded-xl
          border border-slate-200
          bg-white py-2.5 pl-4 pr-10
          text-sm font-medium text-slate-700
          outline-none transition
          hover:border-slate-300
          focus:border-blue-400
          focus:ring-4 focus:ring-blue-500/10
          dark:border-white/10
          dark:bg-white/[0.05]
          dark:text-slate-200
          dark:hover:border-white/20
        "
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
          >
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}