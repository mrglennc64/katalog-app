/* Shared types for the Kataloghub workspace. Mirrors the API contract:
 *   GET /api/catalogs/{id}/health-report  → HealthReport
 *   GET /api/catalogs/{id}/worksheet      → WorksheetRow[]
 *   POST /api/corrections/worksheet       → CorrectionSummary
 */

export type IssueField =
  | "iswc"
  | "isrc"
  | "writer_ipi"
  | "writer_name"
  | "role_code"
  | "share"
  | "agreement_type"
  | "duplicate"
  | "work_id";

export type Severity = "blocking" | "resolvable" | "residual" | "clean";

export type IssueType = {
  field: IssueField;
  label: string;
  count: number;
  severity: Severity;
  howToFix: string;
};

export type WorkStatus = {
  workId: string;
  title: string;
  severity: "clean" | "issues";
  issueFields: string[];
};

export type HealthReport = {
  scanId: string;
  generated: string; // ISO date YYYY-MM-DD
  catalog: {
    id: string;
    name: string;
    works: number;
    contributorEntries: number;
  };
  score: number;
  status: "cwr-ready" | "issues-detected";
  counts: {
    blocking: number;
    resolvable: number;
    residual: number;
  };
  issueTypes: IssueType[];
  works: WorkStatus[];
  /** When set, the report represents the *after-corrections* state and these
   * are the issues that remained after HeyRoya processed the worksheet. */
  residualIssueTypes?: IssueType[];
};

export type WorksheetDecision = "accept" | "reject" | "edit" | null;

export type WorksheetRow = {
  issue_id: string;
  work_id: string;
  field: IssueField;
  original: string;
  suggested: string;
  decision: WorksheetDecision;
  notes: string | null;
};

export type CorrectionSummary = {
  catalogId: string;
  applied: number;
  rejected: number;
  edited: number;
  unresolved: number;
  pricePerWork: number;
  total: number;
  currency: "SEK";
};
