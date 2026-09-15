"use client";

import {
  ArrowDownToLine,
  BookOpen,
  ChevronDown,
  FileText,
  Filter,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import ThemeToggle from "@/components/ThemeToggle";

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

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [subject, setSubject] = useState("All Subjects");
  const [year, setYear] = useState("All Years");

  const fetchNotes = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }

    const { data, error } = await supabase
      .from("notes")
      .select(
        "id, created_at, title, category, subject, year, description, pdf_url"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error);

      if (showLoading) {
        setError("Unable to load notes right now.");
      }
    } else {
      setNotes((data as Note[]) || []);
      setError("");
    }

    if (showLoading) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes(true);

    // Check for newly uploaded notes automatically.
    const interval = window.setInterval(() => {
      fetchNotes(false);
    }, 10000);

    return () => {
      window.clearInterval(interval);
    };
  }, [fetchNotes]);

  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(
      new Set(
        notes
          .map((note) => note.subject?.trim())
          .filter((item): item is string => Boolean(item))
      )
    );

    return ["All Subjects", ...uniqueSubjects.sort()];
  }, [notes]);

  const years = useMemo(() => {
    const uniqueYears = Array.from(
      new Set(
        notes
          .map((note) => note.year?.trim())
          .filter((item): item is string => Boolean(item))
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

      const matchesYear =
        year === "All Years" || note.year === year;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubject &&
        matchesYear
      );
    });
  }, [notes, search, category, subject, year]);

  function clearAllFilters() {
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

  function scrollToNotes() {
    document
      .getElementById("notes-library")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function selectCategory(value: string) {
    setCategory(value);
    scrollToNotes();
  }

  const hasFilters =
    search !== "" ||
    category !== "All Categories" ||
    subject !== "All Subjects" ||
    year !== "All Years";

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 transition-colors duration-500 dark:bg-[#05070b] dark:text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[8%] top-[10%] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute right-[4%] top-[30%] h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/10" />
        <div className="absolute bottom-[5%] left-[35%] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/5" />
      </div>

      {/* Navigation */}
      <header className="border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#070a10]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950">
              <span className="text-lg font-black">N</span>
            </div>

            <div>
              <div className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Notes<span className="text-blue-600 dark:text-blue-400">Hub</span>
              </div>

              <div className="hidden text-[9px] font-semibold uppercase tracking-[0.25em] text-slate-500 sm:block dark:text-slate-500">
                Learn · Practice · Grow
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <a
              href="#top"
              className="text-slate-900 transition hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
            >
              Home
            </a>

            <a
              href="#notes-library"
              className="text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              Notes
            </a>

            <a
              href="#categories"
              className="text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              Categories
            </a>

            <a
              href="#about"
              className="text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <a
              href="/admin/login"
              className="
                rounded-xl border border-slate-200
                bg-white px-4 py-2.5
                text-sm font-semibold text-slate-700
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-slate-300
                hover:bg-slate-50
                dark:border-white/10
                dark:bg-white/[0.04]
                dark:text-slate-200
                dark:hover:border-white/20
                dark:hover:bg-white/[0.08]
              "
            >
              Sign in
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative border-b border-slate-200 dark:border-white/10">
        <div className="futuristic-grid">
          <div className="mx-auto max-w-7xl px-6 pb-20 pt-24 text-center lg:px-8 lg:pb-24 lg:pt-28">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400">
                <Sparkles size={14} />
                Free Study Materials
              </div>

              <h1 className="text-5xl font-black leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
                Everything you need to
                <span className="mt-2 block bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
                  learn better.
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-400">
                Find organized study notes, practical resources and academic
                materials — sorted by subject, category and year.
              </p>

              {/* Search */}
              <div className="mx-auto mt-10 max-w-2xl">
                <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_10px_40px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#10141b] dark:shadow-[0_0_50px_rgba(37,99,235,0.06)]">
                  <Search
                    size={21}
                    className="ml-4 shrink-0 text-slate-400 dark:text-slate-500"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        scrollToNotes();
                      }
                    }}
                    placeholder="Search notes, subjects or topics..."
                    className="
                      min-w-0 flex-1
                      bg-transparent
                      px-4 py-3
                      text-sm text-slate-900
                      outline-none
                      placeholder:text-slate-400
                      sm:text-base
                      dark:text-white
                      dark:placeholder:text-slate-500
                    "
                  />

                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="mr-2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                      aria-label="Clear search"
                    >
                      <X size={17} />
                    </button>
                  )}

                  <button
                    onClick={scrollToNotes}
                    className="
                      hidden rounded-xl
                      bg-blue-600 px-6 py-3
                      text-sm font-bold text-white
                      shadow-lg shadow-blue-600/20
                      transition-all duration-300
                      hover:-translate-y-0.5
                      hover:bg-blue-500
                      sm:block
                    "
                  >
                    Search
                  </button>
                </div>

                <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
                  No account required to browse or download notes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters + Notes */}
      <section
        id="notes-library"
        className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#070a10]"
      >
        {/* Filters */}
        <div className="border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#070a10]/90">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-5 lg:px-8">
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
                onClick={clearAllFilters}
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                Recently Added
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                Latest notes
              </h2>

              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Real study material uploaded by the administrator.
              </p>
            </div>

            {!loading && (
              <div className="text-sm text-slate-500 dark:text-slate-500">
                {filteredNotes.length} of {notes.length} resource
                {notes.length === 1 ? "" : "s"}
              </div>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03]"
                />
              ))}
            </div>
          )}

          {/* Database error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-14 text-center dark:border-red-500/20 dark:bg-red-500/5">
              <FileText
                size={38}
                className="mx-auto text-red-500 dark:text-red-400"
              />

              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                Unable to load notes
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {error}
              </p>

              <button
                onClick={() => fetchNotes(true)}
                className="mt-5 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Try again
              </button>
            </div>
          )}

          {/* No notes uploaded */}
          {!loading && !error && notes.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-white/15 dark:bg-white/[0.02]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <FileText size={30} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                No notes uploaded yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                New notes uploaded by the administrator will automatically
                appear here.
              </p>
            </div>
          )}

          {/* No matching notes */}
          {!loading &&
            !error &&
            notes.length > 0 &&
            filteredNotes.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-white/[0.02]">
                <Search
                  size={38}
                  className="mx-auto text-slate-400"
                />

                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                  No matching notes
                </h3>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Try another search term or change the filters.
                </p>

                <button
                  onClick={clearAllFilters}
                  className="mt-5 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  Clear filters
                </button>
              </div>
            )}

          {/* REAL SUPABASE NOTES ONLY */}
          {!loading && !error && filteredNotes.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDownload={downloadPdf}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="border-b border-slate-200 bg-white dark:border-white/10 dark:bg-[#05070b]"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
              Explore
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              Browse by category
            </h2>

            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Click a category to filter the notes above.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories
              .filter((item) => item !== "All Categories")
              .map((item) => {
                const count = notes.filter(
                  (note) => note.category === item
                ).length;

                return (
                  <button
                    key={item}
                    onClick={() => selectCategory(item)}
                    className="
                      group rounded-2xl
                      border border-slate-200
                      bg-slate-50
                      p-6 text-left
                      transition-all duration-300
                      hover:-translate-y-1
                      hover:border-blue-300
                      hover:bg-blue-50/50
                      dark:border-white/10
                      dark:bg-white/[0.025]
                      dark:hover:border-blue-400/30
                      dark:hover:bg-blue-500/[0.04]
                    "
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        <BookOpen size={20} />
                      </div>

                      <span className="text-sm font-bold text-slate-400 transition group-hover:text-blue-600 dark:text-slate-600 dark:group-hover:text-blue-400">
                        {count}
                      </span>
                    </div>

                    <h3 className="mt-6 text-lg font-bold text-slate-900 dark:text-white">
                      {item}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
                      {count} resource{count === 1 ? "" : "s"}
                    </p>
                  </button>
                );
              })}
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#070a10]"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                About NotesHub
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                Learning material,
                <br />
                without the friction.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
                NotesHub is a simple academic resource platform where students
                can find organized notes and PDF study material without
                creating an account.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 dark:border-white/10 dark:bg-white/[0.025]">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Free and accessible
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Students can browse and download available study material
                    without creating an account.
                  </p>
                </div>
              </div>

              <div className="mt-7 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <FileText size={21} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Always connected to your library
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Notes uploaded through the administrator dashboard are
                    automatically picked up by the homepage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#05070b]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            © {new Date().getFullYear()} NotesHub. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#top"
              className="transition hover:text-blue-600 dark:hover:text-white"
            >
              Home
            </a>

            <a
              href="#notes-library"
              className="transition hover:text-blue-600 dark:hover:text-white"
            >
              Notes
            </a>

            <a
              href="/admin/login"
              className="transition hover:text-blue-600 dark:hover:text-white"
            >
              Admin
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function NoteCard({
  note,
  onDownload,
}: {
  note: Note;
  onDownload: (note: Note) => void;
}) {
  return (
    <article
      className="
        group flex min-h-[310px] flex-col overflow-hidden
        rounded-2xl border border-slate-200
        bg-white
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:border-blue-300
        hover:shadow-xl hover:shadow-slate-200/50
        dark:border-white/10
        dark:bg-[#10141b]
        dark:shadow-none
        dark:hover:border-blue-400/20
        dark:hover:shadow-[0_0_35px_rgba(37,99,235,0.07)]
      "
    >
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-xs font-black text-red-500 dark:bg-red-500/10 dark:text-red-400">
            PDF
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <FileText size={14} />
            PDF
          </div>
        </div>

        {note.year && (
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:border-blue-400/20 dark:bg-blue-500/5 dark:text-blue-400">
            {note.year}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-6">
        <div>
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            {note.category || "General"}
          </p>

          <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-6 text-slate-900 dark:text-white">
            {note.title}
          </h3>

          {note.subject && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {note.subject}
            </p>
          )}

          {note.description && (
            <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-500">
              {note.description}
            </p>
          )}
        </div>

        <div className="mt-auto pt-6">
          <button
            onClick={() => onDownload(note)}
            disabled={!note.pdf_url}
            className="
              inline-flex w-full
              items-center justify-center gap-2
              rounded-xl
              bg-blue-600
              px-4 py-3
              text-sm font-bold text-white
              shadow-lg shadow-blue-600/15
              transition-all duration-300
              hover:-translate-y-0.5
              hover:bg-blue-500
              hover:shadow-blue-500/20
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <ArrowDownToLine size={16} />
            Download PDF
          </button>
        </div>
      </div>
    </article>
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
          appearance-none
          rounded-xl
          border border-slate-200
          bg-white
          py-2.5 pl-4 pr-10
          text-sm font-medium text-slate-700
          outline-none
          transition
          hover:border-slate-300
          focus:border-blue-400
          focus:ring-4 focus:ring-blue-500/10
          dark:border-white/10
          dark:bg-[#10141b]
          dark:text-slate-300
          dark:hover:border-white/20
        "
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-white text-slate-900 dark:bg-[#10141b] dark:text-white"
          >
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}