"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  speciality: string | null;
  city: string | null;
  stage: string | null;
  source: string | null;
  createdAt: string;
  data: Record<string, unknown>;
};

const DETAIL_LABELS: Record<string, string> = {
  stage: "Stage",
  timeline: "Start / expand timeline",
  investment: "Investment considered",
  location_status: "Location status",
  location_confidence: "Location confidence (1–5)",
  concerns: "Biggest concerns",
  top_problem: "Top problem",
  mistake: "Mistake feared",
  missing_support: "Missing support",
  learning_pref: "Learning preference",
  paid_before: "Paid support before",
  attend_workshop: "Would attend workshop",
  post_workshop_support: "Post-workshop support",
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function toValue(v: unknown): string {
  if (Array.isArray(v)) return v.join(", ");
  if (v == null) return "—";
  return String(v);
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", { cache: "no-store" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "Failed to load leads.");
        return;
      }
      const j = await res.json();
      setLeads(j.leads ?? []);
    } catch {
      setError("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((l) =>
      [l.name, l.email, l.phone, l.city, l.speciality]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [leads, query]);

  function exportCsv() {
    const cols = [
      "createdAt",
      "name",
      "email",
      "phone",
      "city",
      "speciality",
      "stage",
    ];
    const rows = filtered.map((l) =>
      cols
        .map((c) => {
          const val =
            c === "createdAt"
              ? new Date(l.createdAt).toISOString()
              : (l as unknown as Record<string, unknown>)[c];
          return `"${String(val ?? "").replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csv = [cols.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grow-medico-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ---------------- dashboard ---------------- */
  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-[1200px]">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-bricolage)] text-[1.7rem] font-extrabold text-[var(--ink)]">
              Leads Dashboard
            </h1>
            <p className="mt-1 text-[.9rem] text-[var(--muted)]">
              {leads.length} total {leads.length === 1 ? "lead" : "leads"}
              {query && ` · ${filtered.length} shown`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, city…"
              className="min-w-[200px] flex-1 rounded-full border-[1.5px] border-[var(--line-2)] bg-white px-4 py-2 text-[14px] text-[var(--text)] focus:border-[var(--brand)] focus:outline-none"
            />
            <button
              onClick={() => fetchLeads()}
              disabled={loading}
              className="rounded-full border-[1.5px] border-[var(--line-2)] bg-white px-4 py-2 text-[14px] font-semibold text-[var(--ink)] hover:border-[var(--brand)] disabled:opacity-70"
            >
              {loading ? "…" : "Refresh"}
            </button>
            <button
              onClick={exportCsv}
              className="rounded-full bg-[var(--brand)] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[var(--brand-600)]"
            >
              Export CSV
            </button>
          </div>
        </header>

        {error && (
          <p className="mt-4 rounded-[10px] bg-[#fdecea] px-4 py-3 text-[.85rem] font-medium text-[#c0392b]">
            {error}
          </p>
        )}

        {/* table (md+) */}
        <div className="mt-6 hidden overflow-x-auto rounded-[16px] border border-[var(--line)] bg-white md:block">
          <table className="w-full border-collapse text-left text-[.9rem]">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--brand-050)] text-[.72rem] uppercase tracking-[.08em] text-[var(--muted)]">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">City</th>
                <th className="px-4 py-3 font-semibold">Speciality</th>
                <th className="px-4 py-3 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <FragmentRow
                  key={l.id}
                  lead={l}
                  open={expanded === l.id}
                  onToggle={() =>
                    setExpanded((cur) => (cur === l.id ? null : l.id))
                  }
                />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-[var(--muted)]"
                  >
                    No leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* cards (mobile) */}
        <div className="mt-6 grid gap-3 md:hidden">
          {filtered.map((l) => (
            <div
              key={l.id}
              className="rounded-[14px] border border-[var(--line)] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-[var(--ink)]">{l.name}</div>
                  <div className="text-[.85rem] text-[var(--muted)]">
                    {l.city || "—"} · {l.speciality || "—"}
                  </div>
                </div>
                <div className="text-[.72rem] text-[var(--muted)]">
                  {fmtDate(l.createdAt)}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[.85rem]">
                <a
                  href={`mailto:${l.email}`}
                  className="text-[var(--accent-600)] underline"
                >
                  {l.email}
                </a>
                <a
                  href={`tel:${l.phone}`}
                  className="text-[var(--accent-600)] underline"
                >
                  {l.phone}
                </a>
              </div>
              <Details data={l.data} />
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-10 text-center text-[var(--muted)]">No leads yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}

function FragmentRow({
  lead,
  open,
  onToggle,
}: {
  lead: Lead;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="border-b border-[var(--line)] align-top hover:bg-[var(--brand-050)]/50">
        <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)]">
          {fmtDate(lead.createdAt)}
        </td>
        <td className="px-4 py-3 font-semibold text-[var(--ink)]">
          {lead.name}
        </td>
        <td className="px-4 py-3">
          <a
            href={`mailto:${lead.email}`}
            className="text-[var(--accent-600)] underline"
          >
            {lead.email}
          </a>
        </td>
        <td className="whitespace-nowrap px-4 py-3">
          <a
            href={`tel:${lead.phone}`}
            className="text-[var(--accent-600)] underline"
          >
            {lead.phone}
          </a>
        </td>
        <td className="px-4 py-3 text-[var(--text)]">{lead.city || "—"}</td>
        <td className="px-4 py-3 text-[var(--text)]">
          {lead.speciality || "—"}
        </td>
        <td className="px-4 py-3 text-right">
          <button
            onClick={onToggle}
            className="rounded-full border border-[var(--line-2)] px-3 py-1 text-[.78rem] font-medium text-[var(--ink)] hover:border-[var(--brand)]"
          >
            {open ? "Hide" : "Details"}
          </button>
        </td>
      </tr>
      {open && (
        <tr className="border-b border-[var(--line)] bg-[var(--brand-050)]/40">
          <td colSpan={7} className="px-4 py-4">
            <Details data={lead.data} />
          </td>
        </tr>
      )}
    </>
  );
}

function Details({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(DETAIL_LABELS).filter(
    ([k]) => data[k] != null && String(data[k]).length > 0
  );
  if (entries.length === 0)
    return (
      <p className="mt-2 text-[.82rem] text-[var(--muted)]">
        No additional survey answers.
      </p>
    );
  return (
    <dl className="mt-2 grid gap-x-6 gap-y-2 sm:grid-cols-2">
      {entries.map(([k, label]) => (
        <div key={k} className="text-[.85rem]">
          <dt className="font-semibold text-[var(--ink)]">{label}</dt>
          <dd className="text-[var(--text)]">{toValue(data[k])}</dd>
        </div>
      ))}
    </dl>
  );
}
