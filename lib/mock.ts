/* Mock data for development. Replace with fetch calls to /api/* routes
 * once the backend is wired. Keep the shape identical so swapping in the
 * real fetcher is a one-line change. */

import type { HealthReport, WorksheetRow, CorrectionSummary } from "./types";

export const HOW_TO_FIX: Record<string, string> = {
  iswc: "Publisher must confirm or supply ISWC.",
  isrc: "Publisher must confirm or supply ISRC.",
  writer_ipi: "Publisher must supply a valid 9-11 digit IPI for the writer.",
  writer_name: "Publisher must confirm canonical name.",
  role_code: "Publisher must change role to a CWR-valid code (C, CA, A).",
  share:
    "Publisher must rebalance contributor shares so the work totals 100%.",
  agreement_type:
    "Publisher must confirm agreement type (E, SE or AM) for the writer.",
  duplicate: "Publisher must confirm correct IPI; remove the duplicate row.",
  work_id: "Publisher must supply a work_id for every row.",
};

export function mockHealthReport(catalogId: string): HealthReport {
  return {
    scanId: "HR-20260502-A1B2",
    generated: "2026-05-02",
    catalog: {
      id: catalogId,
      name: "Midnattssol-2026Q2",
      works: 31,
      contributorEntries: 41,
    },
    score: 86,
    status: "issues-detected",
    counts: { blocking: 4, resolvable: 2, residual: 0 },
    issueTypes: [
      {
        field: "writer_ipi",
        label: "Invalid IPI format",
        count: 2,
        severity: "blocking",
        howToFix: HOW_TO_FIX.writer_ipi,
      },
      {
        field: "role_code",
        label: "Invalid role code",
        count: 1,
        severity: "blocking",
        howToFix: HOW_TO_FIX.role_code,
      },
      {
        field: "share",
        label: "Invalid share",
        count: 1,
        severity: "blocking",
        howToFix: HOW_TO_FIX.share,
      },
      {
        field: "iswc",
        label: "Missing ISWC",
        count: 1,
        severity: "resolvable",
        howToFix: HOW_TO_FIX.iswc,
      },
      {
        field: "writer_name",
        label: "Writer name variant",
        count: 1,
        severity: "resolvable",
        howToFix: HOW_TO_FIX.writer_name,
      },
    ],
    works: [
      { workId: "W-001", title: "Midnattssol", severity: "clean", issueFields: [] },
      { workId: "W-002", title: "Vågens Sång", severity: "clean", issueFields: [] },
      { workId: "W-003", title: "Skär", severity: "clean", issueFields: [] },
      {
        workId: "W-007",
        title: "Vinterns Ros",
        severity: "issues",
        issueFields: ["writer_ipi"],
      },
      { workId: "W-008", title: "Nordvinden", severity: "clean", issueFields: [] },
      {
        workId: "W-011",
        title: "Skuggornas Dans",
        severity: "issues",
        issueFields: ["role_code"],
      },
      {
        workId: "W-014",
        title: "Glömda Dagar",
        severity: "issues",
        issueFields: ["writer_ipi"],
      },
      { workId: "W-015", title: "Norrlands Hjärta", severity: "clean", issueFields: [] },
    ],
    residualIssueTypes: [],
  };
}

export function mockWorksheet(catalogId: string): WorksheetRow[] {
  void catalogId;
  return [
    {
      issue_id: "101",
      work_id: "W-007",
      field: "writer_ipi",
      original: "",
      suggested: "00111222333",
      decision: null,
      notes: null,
    },
    {
      issue_id: "102",
      work_id: "W-011",
      field: "role_code",
      original: "WR",
      suggested: "CA",
      decision: null,
      notes: null,
    },
    {
      issue_id: "103",
      work_id: "W-014",
      field: "writer_ipi",
      original: "",
      suggested: "00777888999",
      decision: null,
      notes: null,
    },
  ];
}

export function mockCorrectionSummary(
  catalogId: string,
): CorrectionSummary {
  const applied = 20;
  const pricePerWork = 250;
  return {
    catalogId,
    applied,
    rejected: 0,
    edited: 1,
    unresolved: 0,
    pricePerWork,
    total: applied * pricePerWork,
    currency: "SEK",
  };
}
