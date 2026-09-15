import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ChevronRight,
  Code2,
  Download,
  FileText,
  GraduationCap,
  Library,
  LockKeyhole,
  Menu,
  Network,
  Search,
  Shield,
  Sparkles,
  X,
} from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";

const categories = [
  {
    name: "Computer Science",
    description:
      "Programming, databases, operating systems and core computer science resources.",
    icon: Code2,
  },
  {
    name: "Cyber Security",
    description:
      "Security concepts, networking, ethical hacking and digital forensics.",
    icon: Shield,
  },
  {
    name: "AI & Machine Learning",
    description:
      "Artificial intelligence, machine learning, Python and practical resources.",
    icon: BrainCircuit,
  },
  {
    name: "Mathematics",
    description:
      "Formulas, solved examples, derivations and examination material.",
    icon: Sparkles,
  },
  {
    name: "Physics",
    description:
      "Concepts, derivations, numericals and revision notes for students.",
    icon: Network,
  },
  {
    name: "Programming",
    description:
      "Python, C, C++, Java and programming fundamentals.",
    icon: Code2,
  },
];

const latestNotes = [
  {
    title: "Network Security — Unit 1",
    subject: "Network Security",
    category: "Cyber Security",
    year: "2026",
    size: "2.4 MB",
  },
  {
    title: "Python Programming Fundamentals",
    subject: "Programming Fundamentals",
    category: "Computer Science",
    year: "2026",
    size: "3.1 MB",
  },
  {
    title: "Linux Administration — Practical Notes",
    subject: "Linux Administration",
    category: "Computer Science",
    year: "2026",
    size: "1.8 MB",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f3f5f8] text-slate-950 transition-colors duration-500 dark:bg-[#060a12] dark:text-slate-100">

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl transition-colors duration-500 dark:border-white/[0.08] dark:bg-[#060a12]/80">

        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">

          {/* LOGO */}

          <a href="#home" className="group flex items-center gap-3">

            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-lg transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.35)] dark:bg-white dark:text-slate-950">

              <span className="relative z-10">
                N
              </span>

              <span className="absolute inset-0 rounded-xl bg-blue-500/0 blur-xl transition-all duration-300 group-hover:bg-blue-500/30" />

            </div>

            <div>

              <div className="text-lg font-bold tracking-tight">
                NotesHub
              </div>

              <div className="hidden text-[9px] font-medium uppercase tracking-[0.2em] text-slate-400 sm:block dark:text-slate-500">
                Learn • Practice • Grow
              </div>

            </div>

          </a>


          {/* DESKTOP NAVIGATION */}

          <nav className="hidden items-center gap-8 md:flex">

            <a
              href="#home"
              className="text-sm font-medium text-slate-900 transition-colors hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400"
            >
              Home
            </a>

            <a
              href="#notes"
              className="text-sm font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              Notes
            </a>

            <a
              href="#categories"
              className="text-sm font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              Categories
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              About
            </a>

          </nav>


          {/* RIGHT SIDE */}

          <div className="flex items-center gap-3">

            <ThemeToggle />

            <a
              href="/login"
              className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 hover:shadow-[0_0_25px_rgba(37,99,235,0.14)] sm:block dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:border-blue-400/40 dark:hover:text-blue-400 dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            >
              Sign in
            </a>

          </div>

        </div>

      </header>


      {/* ==================================================
          HERO
      ================================================== */}

      <section
        id="home"
        className="relative overflow-hidden border-b border-slate-200/70 dark:border-white/[0.06]"
      >

        {/* Ambient background */}

        <div className="pointer-events-none absolute inset-0 -z-10">

          <div className="ambient-glow absolute left-[15%] top-[-180px] h-[450px] w-[450px] rounded-full bg-blue-300/20 blur-[120px] dark:bg-blue-600/20" />

          <div className="glow-orb absolute right-[5%] top-[120px] h-[350px] w-[350px] rounded-full bg-indigo-300/10 blur-[110px] dark:bg-indigo-500/10" />

        </div>


        <div className="mx-auto max-w-7xl px-5 pb-24 pt-20 sm:px-8 sm:pb-28 sm:pt-28">

          <div className="mx-auto max-w-4xl text-center">

            {/* Badge */}

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700 shadow-sm dark:border-blue-400/20 dark:bg-blue-500/[0.08] dark:text-blue-400 dark:shadow-[0_0_25px_rgba(59,130,246,0.08)]">

              <Sparkles size={13} />

              Free Study Materials

            </div>


            {/* Heading */}

            <h1 className="text-5xl font-bold tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">

              Everything you need to

              <span className="mt-2 block bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-400">
                learn better.
              </span>

            </h1>


            {/* Description */}

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg dark:text-slate-400">

              Find organized study notes, practical resources and academic
              materials — sorted by subject, category and year.

            </p>


            {/* SEARCH */}

            <div className="mx-auto mt-10 max-w-2xl">

              <div className="group flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_15px_50px_rgba(15,23,42,0.07)] transition-all duration-500 focus-within:border-blue-300 focus-within:shadow-[0_0_40px_rgba(37,99,235,0.12)] dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_15px_60px_rgba(0,0,0,0.25)] dark:focus-within:border-blue-400/40 dark:focus-within:shadow-[0_0_50px_rgba(59,130,246,0.14)]">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center text-slate-400 dark:text-slate-500">
                  <Search size={21} />
                </div>

                <input
                  type="text"
                  placeholder="Search notes, subjects or topics..."
                  className="h-12 min-w-0 flex-1 bg-transparent px-1 text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:text-base dark:text-white dark:placeholder:text-slate-500"
                />

                <button className="hidden rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] sm:block dark:bg-blue-600 dark:hover:bg-blue-500 dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.35)]">
                  Search
                </button>

              </div>

            </div>


            <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
              No account required to browse or download notes.
            </p>

          </div>

        </div>

      </section>


      {/* ==================================================
          CATEGORY SECTION
      ================================================== */}

      <section
        id="categories"
        className="relative overflow-hidden border-b border-slate-200 bg-white transition-colors duration-500 dark:border-white/[0.06] dark:bg-[#080d17]"
      >

        {/* Dark mode grid */}

        <div className="futuristic-grid pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 dark:opacity-100" />


        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">

          {/* Section heading */}

          <div className="mb-10 flex items-end justify-between gap-6">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                Explore
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                Browse by category
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Find learning materials organized around the subjects
                you are studying.
              </p>

            </div>

            <a
              href="#categories"
              className="hidden items-center gap-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 sm:flex dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all
              <ArrowRight size={15} />
            </a>

          </div>


          {/* CATEGORY CARDS */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {categories.map((category) => {

              const Icon = category.icon;

              return (
                <a
                  key={category.name}
                  href="#notes"
                  className="futuristic-card group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 p-6 backdrop-blur-sm dark:border-white/[0.09] dark:bg-white/[0.035] dark:hover:border-blue-400/30 dark:hover:bg-blue-500/[0.035] dark:hover:shadow-[0_0_45px_rgba(59,130,246,0.12)]"
                >

                  {/* Hover glow */}

                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/0 blur-3xl transition-all duration-500 group-hover:bg-blue-500/15 dark:group-hover:bg-blue-500/20" />


                  <div className="relative flex items-start justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_25px_rgba(37,99,235,0.25)] dark:bg-white/[0.07] dark:text-slate-300 dark:group-hover:bg-blue-500 dark:group-hover:text-white">

                      <Icon size={21} />

                    </div>


                    <ChevronRight
                      size={18}
                      className="text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-500 dark:text-slate-600 dark:group-hover:text-blue-400"
                    />

                  </div>


                  <h3 className="relative mt-6 text-lg font-bold text-slate-950 dark:text-white">
                    {category.name}
                  </h3>

                  <p className="relative mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {category.description}
                  </p>


                  <div className="relative mt-5 flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400">
                    Explore resources
                    <ArrowRight size={13} />
                  </div>

                </a>
              );
            })}

          </div>

        </div>

      </section>


      {/* ==================================================
          LATEST NOTES
      ================================================== */}

      <section
        id="notes"
        className="relative overflow-hidden bg-[#f3f5f8] transition-colors duration-500 dark:bg-[#060a12]"
      >

        <div className="pointer-events-none absolute left-[-150px] top-[200px] h-[350px] w-[350px] rounded-full bg-blue-500/5 blur-[100px] dark:bg-blue-500/10" />


        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">

          <div className="mb-10">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Recently added
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              Latest notes
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Fresh study material ready for you to explore.
            </p>

          </div>


          {/* NOTE CARDS */}

          <div className="grid gap-5 lg:grid-cols-3">

            {latestNotes.map((note) => (

              <article
                key={note.title}
                className="futuristic-card group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-500 hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] dark:border-white/[0.09] dark:bg-white/[0.035] dark:hover:border-blue-400/30 dark:hover:bg-white/[0.05] dark:hover:shadow-[0_0_45px_rgba(59,130,246,0.1)]"
              >

                {/* PDF HEADER */}

                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4 dark:border-white/[0.06] dark:bg-white/[0.025]">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-xs font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                      PDF
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                      <FileText size={13} />
                      {note.size}
                    </div>

                  </div>


                  <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-400">
                    {note.year}
                  </span>

                </div>


                {/* CONTENT */}

                <div className="p-6">

                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {note.category}
                  </p>

                  <h3 className="mt-2 text-xl font-bold leading-snug text-slate-950 dark:text-white">
                    {note.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {note.subject}
                  </p>


                  <div className="mt-7 flex items-center justify-between">

                    <button className="flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-[0_0_25px_rgba(37,99,235,0.25)] dark:bg-blue-600 dark:hover:bg-blue-500 dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                      <Download size={15} />
                      Download PDF
                    </button>

                    <button className="flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400">
                      Details
                      <ChevronRight size={15} />
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>


          <div className="mt-10 text-center">

            <a
              href="#notes"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 hover:shadow-[0_0_25px_rgba(37,99,235,0.1)] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-blue-400/30 dark:hover:text-blue-400 dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.12)]"
            >
              Browse all notes
              <ArrowRight size={15} />
            </a>

          </div>

        </div>

      </section>


      {/* ==================================================
          ABOUT / CTA
      ================================================== */}

      <section
        id="about"
        className="relative overflow-hidden bg-slate-950 text-white"
      >

        {/* Futuristic background */}

        <div className="futuristic-grid absolute inset-0 opacity-100" />

        <div className="pointer-events-none absolute left-[10%] top-[20%] h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[100px]" />

        <div className="pointer-events-none absolute right-[5%] bottom-[-100px] h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[120px]" />


        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

            <div>

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-400">

                <GraduationCap size={14} />

                Built for students

              </div>


              <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">

                Study material without unnecessary barriers.

              </h2>


              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">

                NotesHub keeps academic resources simple. Browse freely,
                find what you need and download your notes without being
                forced to create an account.

              </p>


              <div className="mt-8 flex flex-wrap gap-3">

                <a
                  href="#notes"
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_35px_rgba(59,130,246,0.3)]"
                >
                  Explore notes
                  <ArrowRight size={15} />
                </a>

                <a
                  href="/login"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition-all duration-300 hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300"
                >
                  <LockKeyhole size={15} />
                  Optional sign in
                </a>

              </div>

            </div>


            {/* STAT CARDS */}

            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/30 hover:bg-blue-500/[0.06] hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">

                <BookOpen className="text-blue-400" size={22} />

                <div className="mt-5 text-2xl font-bold">
                  Free
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Study materials
                </p>

              </div>


              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/30 hover:bg-blue-500/[0.06] hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">

                <Download className="text-blue-400" size={22} />

                <div className="mt-5 text-2xl font-bold">
                  Easy
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  PDF downloads
                </p>

              </div>


              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/30 hover:bg-blue-500/[0.06] hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">

                <Library className="text-blue-400" size={22} />

                <div className="mt-5 text-2xl font-bold">
                  Organized
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  By subject & year
                </p>

              </div>


              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/30 hover:bg-blue-500/[0.06] hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">

                <LockKeyhole className="text-blue-400" size={22} />

                <div className="mt-5 text-2xl font-bold">
                  Optional
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Student account
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="bg-[#05080f] text-slate-500">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/[0.07] px-5 py-8 text-sm sm:px-8 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-950">
              N
            </div>

            <p>
              © 2026 NotesHub. Built for students.
            </p>

          </div>


          <div className="flex gap-6">

            <a
              href="#home"
              className="transition-colors hover:text-white"
            >
              Home
            </a>

            <a
              href="#notes"
              className="transition-colors hover:text-white"
            >
              Notes
            </a>

            <a
              href="#categories"
              className="transition-colors hover:text-white"
            >
              Categories
            </a>

            <a
              href="#about"
              className="transition-colors hover:text-white"
            >
              About
            </a>

          </div>

        </div>

      </footer>

    </main>
  );
}