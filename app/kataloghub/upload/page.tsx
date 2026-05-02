"use client";

import { useRef, useState } from "react";
import { Card } from "@/app/components/Card";
import { StepIndicator, PIPELINE_STEPS } from "@/app/components/StepIndicator";

type Row = {
  work_id: string;
  title: string;
  writer_name: string;
  writer_ipi: string;
  role_code: string;
  share: string;
  agreement_type: string;
  iswc: string;
  isrc: string;
};

type Issue = {
  work_id: string;
  field: string;
  original_value: string;
  validated_value: string;
  status: "invalid" | "missing";
  comment: string;
};

type ScanResult = {
  scanId: string;
  scanDate: string;
  rows: Row[];
  issues: Issue[];
  distinctWorks: number;
};

type StatusKind = "error" | "success" | "blocked";
type StatusMsg = { html: string; kind: StatusKind } | null;

type TierConfig = {
  maxWorksPerValidation: number;
  maxValidationsPerPeriod: number;
  maxCatalogsPerPeriod: number;
};
type UsageState = {
  validationsThisPeriod: number;
  catalogsThisPeriod: number;
  userId: string | null;
};

declare global {
  interface Window {
    KATALOGHUB_TIER_CONFIG?: TierConfig;
    KATALOGHUB_USAGE_STATE?: UsageState;
  }
}

const FOREIGN_SOCIETIES: Record<string, 1> = {
  TONO: 1, GEMA: 1, SACEM: 1, PRS: 1, BMI: 1, ASCAP: 1, SOCAN: 1, ICE: 1,
  MLC: 1, SIAE: 1, BUMA: 1, SUISA: 1, ZAIKS: 1, AKM: 1, AUSTRO: 1, SABAM: 1,
  SACM: 1, SADAIC: 1, APRA: 1, JASRAC: 1,
};

const TIER_MESSAGES = {
  OK: "Validering kan genomföras.",
  LIMIT_WORKS: "Valideringen kan inte genomföras. Antalet verk överstiger avtalad nivå.",
  LIMIT_VALIDATIONS: "Valideringsgränsen för perioden är uppnådd. Uppdatering av avtal krävs.",
  LIMIT_CATALOGS: "Antalet kataloger överstiger avtalad nivå. Kontakta HeyRoya för justering.",
};

function escapeHtml(s: unknown): string {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

function csvEscape(v: unknown): string {
  const s = v == null ? "" : String(v);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function parseCsv(text: string): Row[] {
  const rows: string[][] = [];
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (!line.trim()) continue;
    const cells: string[] = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (c === '"') inQ = false;
        else cur += c;
      } else {
        if (c === '"') inQ = true;
        else if (c === "," || c === ";") { cells.push(cur); cur = ""; }
        else cur += c;
      }
    }
    cells.push(cur);
    rows.push(cells);
  }
  if (rows.length === 0) throw new Error("Filen saknar data.");
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const dataRows = rows.slice(1);

  const hasAll = (cols: string[]) => cols.every((c) => header.indexOf(c) >= 0);
  const val = (cols: string[], name: string) => {
    const i = header.indexOf(name);
    return i >= 0 && cols[i] != null ? cols[i].trim() : "";
  };

  const newRequired = ["work_id", "title", "writer_name", "writer_ipi", "role_code", "share", "agreement_type", "iswc", "isrc"];
  if (hasAll(newRequired)) {
    return dataRows.map((cols) => {
      const o: Record<string, string> = {};
      for (let hi = 0; hi < header.length; hi++) o[header[hi]] = (cols[hi] != null ? cols[hi] : "").trim();
      return o as unknown as Row;
    });
  }

  const legacyRequired = ["title", "name", "role", "share_percent", "ipi"];
  if (hasAll(legacyRequired)) {
    const workIdMap: Record<string, string> = {};
    let nextId = 1;
    return dataRows.map((cols) => {
      const title = val(cols, "title");
      if (!workIdMap[title]) workIdMap[title] = "W-" + String(nextId++).padStart(3, "0");
      const society = val(cols, "society").toUpperCase();
      const agreement = FOREIGN_SOCIETIES[society] ? "SE" : "E";
      return {
        work_id: workIdMap[title],
        title,
        writer_name: val(cols, "name"),
        writer_ipi: val(cols, "ipi"),
        role_code: val(cols, "role"),
        share: val(cols, "share_percent"),
        agreement_type: agreement,
        iswc: val(cols, "iswc"),
        isrc: val(cols, "isrc"),
      };
    });
  }

  for (const col of newRequired) {
    if (header.indexOf(col) < 0) throw new Error("Saknar kolumn: " + col);
  }
  throw new Error("Okänt CSV-format.");
}

function validateRow(row: Row): Issue[] {
  const issues: [string, string, string, "invalid" | "missing", string][] = [];
  if (!row.work_id) issues.push(["work_id", "", "", "missing", "Saknar work_id"]);
  if (!row.writer_ipi || row.writer_ipi.length < 9) issues.push(["writer_ipi", row.writer_ipi, "", "invalid", "Ogiltigt IPI-format"]);
  if (["C", "CA", "A"].indexOf(row.role_code) < 0) issues.push(["role_code", row.role_code, "", "invalid", "Ogiltig rollkod"]);
  const s = Number(row.share);
  if (!(s > 0) || s > 100) issues.push(["share", row.share, "", "invalid", "Ogiltig delning"]);
  if (["E", "SE", "AM"].indexOf(row.agreement_type) < 0) issues.push(["agreement_type", row.agreement_type, "", "invalid", "Ogiltig avtalstyp"]);
  return issues.map((a) => ({
    work_id: row.work_id,
    field: a[0],
    original_value: a[1],
    validated_value: a[2],
    status: a[3],
    comment: a[4],
  }));
}

function detectDuplicates(rows: Row[]): Issue[] {
  const seen: Record<string, true> = {};
  const dups: Issue[] = [];
  for (const r of rows) {
    const key = (r.work_id || "") + "|" + (r.writer_ipi || "");
    if (!r.work_id && !r.writer_ipi) continue;
    if (seen[key]) {
      dups.push({
        work_id: r.work_id,
        field: "duplicate",
        original_value: r.writer_ipi,
        validated_value: "",
        status: "invalid",
        comment: "Dubblett av work_id+writer_ipi",
      });
    } else seen[key] = true;
  }
  return dups;
}

function tierGate(distinct: number): { status: "allowed" | "blocked"; reason: string; code: string } {
  const c = (typeof window !== "undefined" && window.KATALOGHUB_TIER_CONFIG) || { maxWorksPerValidation: 1000, maxValidationsPerPeriod: 1, maxCatalogsPerPeriod: 1 };
  const u = (typeof window !== "undefined" && window.KATALOGHUB_USAGE_STATE) || { validationsThisPeriod: 0, catalogsThisPeriod: 0, userId: null };
  if (typeof c.maxWorksPerValidation === "number" && distinct > c.maxWorksPerValidation) return { status: "blocked", reason: TIER_MESSAGES.LIMIT_WORKS, code: "LIMIT_WORKS" };
  if (typeof c.maxValidationsPerPeriod === "number" && (u.validationsThisPeriod || 0) >= c.maxValidationsPerPeriod) return { status: "blocked", reason: TIER_MESSAGES.LIMIT_VALIDATIONS, code: "LIMIT_VALIDATIONS" };
  if (typeof c.maxCatalogsPerPeriod === "number" && (u.catalogsThisPeriod || 0) >= c.maxCatalogsPerPeriod) return { status: "blocked", reason: TIER_MESSAGES.LIMIT_CATALOGS, code: "LIMIT_CATALOGS" };
  return { status: "allowed", reason: TIER_MESSAGES.OK, code: "OK" };
}

function uniqueCount(rows: Row[], key: keyof Row): number {
  const seen: Record<string, 1> = {};
  let n = 0;
  for (const r of rows) {
    const v = (r[key] || "").trim();
    if (v && !seen[v]) { seen[v] = 1; n++; }
  }
  return n;
}

const SAMPLE_CSV = [
  "work_id,title,writer_name,writer_ipi,role_code,share,agreement_type,iswc,isrc",
  "W-001,Midnattssol,Erik Andersson,00712984310,CA,50,E,T-100.001.001-1,SE-NRD-26-10001",
  "W-001,Midnattssol,Maria Svensson,00123456789,CA,50,E,T-100.001.001-1,SE-NRD-26-10001",
  "W-002,Vågens Sång,Johan Berg,00345678901,CA,50,E,T-100.002.002-2,SE-NRD-26-10002",
  "W-002,Vågens Sång,Karin Lindgren,00987654321,CA,50,E,T-100.002.002-2,SE-NRD-26-10002",
  "W-003,Skär,Anna Holm,00444555666,CA,50,E,,SE-NRD-26-10003",
  "W-003,Skär,Sofie Berg,00777888999,CA,50,E,,SE-NRD-26-10003",
  "W-004,Drottningens Klang,Mikael Östberg,00888999000,CA,50,E,,SE-NRD-26-10004",
  "W-004,Drottningens Klang,Erik Andersson,00712984310,CA,50,E,,SE-NRD-26-10004",
  "W-005,Frusen Tid,Maria Svensson,00123456789,CA,60,E,T-100.005.005-5,SE-NRD-26-10005",
  "W-005,Frusen Tid,Johan Berg,00345678901,CA,30,E,T-100.005.005-5,SE-NRD-26-10005",
  "W-006,Bergslagen,Karin Lindgren,00987654321,CA,40,E,T-100.006.006-6,SE-NRD-26-10006",
  "W-006,Bergslagen,Anna Holm,00444555666,CA,40,E,T-100.006.006-6,SE-NRD-26-10006",
  "W-006,Bergslagen,Sofie Berg,00777888999,CA,30,E,T-100.006.006-6,SE-NRD-26-10006",
  "W-007,Vinterns Ros,Lars Petersen,,CA,50,E,T-100.007.007-7,SE-NRD-26-10007",
  "W-007,Vinterns Ros,Erik Andersson,00712984310,CA,50,E,T-100.007.007-7,SE-NRD-26-10007",
  "W-008,Nordvinden,Mikael Östberg,00888999000,CA,50,E,T-100.008.008-8,SE-NRD-26-10008",
  "W-008,Nordvinden,Maria Svensson,00123456789,CA,50,E,T-100.008.008-8,SE-NRD-26-10008",
  "W-009,Berlin Drömmar,Tobias Schmidt,00211322433,CA,50,SE,T-100.009.009-9,SE-NRD-26-10009",
  "W-009,Berlin Drömmar,Erik Andersson,00712984310,CA,50,E,T-100.009.009-9,SE-NRD-26-10009",
  "W-010,Paris i Höst,Pierre Lambert,00322433544,CA,50,SE,T-100.010.010-1,SE-NRD-26-10010",
  "W-010,Paris i Höst,Maria Svensson,00123456789,CA,50,E,T-100.010.010-1,SE-NRD-26-10010",
  "W-011,Skuggornas Dans,Anna Holm,00444555666,WR,50,E,T-100.011.011-2,SE-NRD-26-10011",
  "W-011,Skuggornas Dans,Johan Berg,00345678901,CA,50,E,T-100.011.011-2,SE-NRD-26-10011",
  "W-012,Stjärnvägen,L. Petersen,00111222333,CA,50,E,T-100.012.012-3,SE-NRD-26-10012",
  "W-012,Stjärnvägen,Karin Lindgren,00987654321,CA,50,E,T-100.012.012-3,SE-NRD-26-10012",
  "W-013,Tystnaden Talar,Erik Andersson,00712984310,CA,50,E,T-100.013.013-4,SE-NRD-26-10013",
  "W-013,Tystnaden Talar,Maria Svensson,00123456789,CA,50,E,T-100.013.013-4,SE-NRD-26-10013",
  "W-014,Glömda Dagar,Sofie Berg,,CA,50,E,,SE-NRD-26-10014",
  "W-014,Glömda Dagar,Johan Berg,00345678901,CA,50,E,,SE-NRD-26-10014",
  "W-015,Norrlands Hjärta,Lars Petersen,00111222333,CA,50,E,T-100.015.015-6,SE-NRD-26-10015",
  "W-015,Norrlands Hjärta,Mikael Östberg,00888999000,CA,50,E,T-100.015.015-6,SE-NRD-26-10015",
].join("\n");

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime + ";charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadSample() {
  downloadFile(SAMPLE_CSV, "kataloghub-exempel.csv", "text/csv");
}

function pctNum(n: number, total: number) { return total ? Math.round((100 * n) / total) : 0; }
function fillClass(p: number) { return p === 100 ? "bg-kh-green" : p >= 80 ? "bg-kh-yellow" : "bg-kh-red"; }

export default function UploadPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<Row[] | null>(null);
  const [fileName, setFileName] = useState("Ingen fil har valts");
  const [statusMsg, setStatusMsg] = useState<StatusMsg>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    setResult(null);
    setParsed(null);

    const MAX_SIZE = 50 * 1024 * 1024;
    if (f.size > MAX_SIZE) {
      setStatusMsg({ html: "<strong>Fel:</strong> Filen är för stor. Max 50 MB.", kind: "error" });
      return;
    }
    const isCsvType = f.type === "text/csv" || f.type === "application/vnd.ms-excel" || f.type === "";
    const isCsvName = f.name.toLowerCase().endsWith(".csv");
    if (!isCsvType && !isCsvName) {
      setStatusMsg({ html: "<strong>Fel:</strong> Endast CSV-filer stöds.", kind: "error" });
      return;
    }

    const r = new FileReader();
    r.onload = (ev) => {
      try {
        const out = parseCsv(String(ev.target?.result ?? ""));
        setParsed(out);
        setStatusMsg(null);
      } catch (err) {
        setStatusMsg({ html: "<strong>Fel:</strong> " + escapeHtml((err as Error).message), kind: "error" });
      }
    };
    r.readAsText(f, "UTF-8");
  }

  function runScan() {
    if (!parsed) return;
    const distinct = uniqueCount(parsed, "work_id");
    const gate = tierGate(distinct);
    if (gate.status === "blocked") {
      setStatusMsg({
        html: "<strong>" + escapeHtml(gate.reason) + '</strong><span class="ml-2 inline-block rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-text-muted">' + escapeHtml(gate.code) + "</span>",
        kind: "blocked",
      });
      setResult(null);
      return;
    }
    const allIssues: Issue[] = [];
    for (const row of parsed) {
      for (const i of validateRow(row)) allIssues.push(i);
    }
    for (const d of detectDuplicates(parsed)) allIssues.push(d);
    const scanDate = new Date().toISOString().slice(0, 10);
    const scanId = "HR-" + scanDate.replace(/-/g, "") + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    setResult({ scanId, scanDate, rows: parsed, issues: allIssues, distinctWorks: distinct });
    setStatusMsg(null);
  }

  function downloadCsv() {
    if (!result) return;
    const out = ["work_id,field,original_value,validated_value,status,comment"];
    for (const x of result.issues) {
      out.push([x.work_id, x.field, x.original_value, x.validated_value, x.status, x.comment].map(csvEscape).join(","));
    }
    downloadFile(out.join("\n"), "kataloghub-CSV-underlag-" + result.scanId + ".csv", "text/csv");
  }

  function downloadPdf() {
    if (!result) return;
    const { rows, issues, distinctWorks, scanId, scanDate } = result;
    const totalRows = rows.length;

    const byField: Record<string, Issue[]> = {};
    const byWorkId: Record<string, Issue[]> = {};
    for (const x of issues) {
      (byField[x.field] = byField[x.field] || []).push(x);
      (byWorkId[x.work_id || ""] = byWorkId[x.work_id || ""] || []).push(x);
    }
    const labels: Record<string, string> = {
      work_id: "Saknar work_id",
      writer_ipi: "Ogiltigt IPI-format",
      role_code: "Ogiltig rollkod",
      share: "Ogiltig delning",
      agreement_type: "Ogiltig avtalstyp",
      duplicate: "Dubbletter (work_id + writer_ipi)",
    };

    const workTitles: Record<string, string> = {};
    const workHasISWC: Record<string, true> = {};
    const workHasISRC: Record<string, true> = {};
    for (const r of rows) {
      const w = r.work_id || "";
      if (!workTitles[w]) workTitles[w] = r.title || "";
      if ((r.iswc || "").trim() !== "") workHasISWC[w] = true;
      if ((r.isrc || "").trim() !== "") workHasISRC[w] = true;
    }
    const workIds = Object.keys(workTitles);
    let iswcOK = 0, isrcOK = 0;
    for (const w of workIds) { if (workHasISWC[w]) iswcOK++; if (workHasISRC[w]) isrcOK++; }
    let ipiOK = 0, roleOK = 0, shareOK = 0, agrOK = 0;
    for (const pr of rows) {
      if ((pr.writer_ipi || "").length >= 9) ipiOK++;
      if (["C", "CA", "A"].indexOf(pr.role_code) >= 0) roleOK++;
      const s = Number(pr.share); if (s > 0 && s <= 100) shareOK++;
      if (["E", "SE", "AM"].indexOf(pr.agreement_type) >= 0) agrOK++;
    }
    const pct = (n: number, total: number) => (total ? Math.round((100 * n) / total) + "%" : "0%");

    const entries: [string, Issue[]][] = [];
    for (const fk in byField) entries.push([fk, byField[fk]]);
    entries.sort((a, b) => b[1].length - a[1].length);
    const commonList = entries
      .map((e) => "<li><strong>" + escapeHtml(labels[e[0]] || e[0]) + ":</strong> " + e[1].length + " " + (e[1].length === 1 ? "rad" : "rader") + "</li>")
      .join("");

    const coverage =
      '<div class="cov-grid">' +
      '<div class="cov"><div class="cov-label">ISWC per verk</div><div class="cov-bar"><div class="cov-fill" style="width:' + pct(iswcOK, distinctWorks) + ';"></div></div><div class="cov-text">' + iswcOK + " / " + distinctWorks + " (" + pct(iswcOK, distinctWorks) + ")</div></div>" +
      '<div class="cov"><div class="cov-label">ISRC per verk</div><div class="cov-bar"><div class="cov-fill" style="width:' + pct(isrcOK, distinctWorks) + ';"></div></div><div class="cov-text">' + isrcOK + " / " + distinctWorks + " (" + pct(isrcOK, distinctWorks) + ")</div></div>" +
      '<div class="cov"><div class="cov-label">writer_ipi (rader)</div><div class="cov-bar"><div class="cov-fill" style="width:' + pct(ipiOK, totalRows) + ';"></div></div><div class="cov-text">' + ipiOK + " / " + totalRows + " (" + pct(ipiOK, totalRows) + ")</div></div>" +
      '<div class="cov"><div class="cov-label">role_code (rader)</div><div class="cov-bar"><div class="cov-fill" style="width:' + pct(roleOK, totalRows) + ';"></div></div><div class="cov-text">' + roleOK + " / " + totalRows + " (" + pct(roleOK, totalRows) + ")</div></div>" +
      '<div class="cov"><div class="cov-label">share (rader)</div><div class="cov-bar"><div class="cov-fill" style="width:' + pct(shareOK, totalRows) + ';"></div></div><div class="cov-text">' + shareOK + " / " + totalRows + " (" + pct(shareOK, totalRows) + ")</div></div>" +
      '<div class="cov"><div class="cov-label">agreement_type (rader)</div><div class="cov-bar"><div class="cov-fill" style="width:' + pct(agrOK, totalRows) + ';"></div></div><div class="cov-text">' + agrOK + " / " + totalRows + " (" + pct(agrOK, totalRows) + ")</div></div>" +
      "</div>";

    const bullets = (arr: Issue[] | undefined, fmt: (i: Issue) => string) => (arr || []).map(fmt).join("");
    const ipiItems = bullets(byField.writer_ipi, (i) => "<li>" + escapeHtml(i.work_id || "(tom)") + " · ipi <code>" + escapeHtml(i.original_value || "(tom)") + "</code> — " + escapeHtml(i.comment) + "</li>");
    const widItems = bullets(byField.work_id, (i) => "<li>Rad utan work_id — " + escapeHtml(i.comment) + "</li>");
    const dupItems = bullets(byField.duplicate, (i) => "<li>" + escapeHtml(i.work_id) + " · ipi <code>" + escapeHtml(i.original_value) + "</code> — " + escapeHtml(i.comment) + "</li>");
    let idSec = "";
    if (widItems || ipiItems || dupItems) {
      idSec = "<h2>Identifierar- och dubblettvalidering</h2><div class=\"panel\">"
        + (widItems ? '<div class="group-h">Saknad work_id</div><ul>' + widItems + "</ul>" : "")
        + (ipiItems ? '<div class="group-h">Ogiltigt writer_ipi</div><ul>' + ipiItems + "</ul>" : "")
        + (dupItems ? '<div class="group-h">Dubbletter</div><ul>' + dupItems + "</ul>" : "")
        + "</div>";
    }
    const roleItems = bullets(byField.role_code, (i) => "<li>" + escapeHtml(i.work_id) + " · <code>" + escapeHtml(i.original_value || "(tom)") + "</code> — " + escapeHtml(i.comment) + "</li>");
    const agrItems = bullets(byField.agreement_type, (i) => "<li>" + escapeHtml(i.work_id) + " · <code>" + escapeHtml(i.original_value || "(tom)") + "</code> — " + escapeHtml(i.comment) + "</li>");
    let roleSec = "";
    if (roleItems || agrItems) {
      roleSec = '<h2>Roll- och avtalsvalidering</h2><div class="panel">'
        + (roleItems ? '<div class="group-h">Ogiltig rollkod</div><ul>' + roleItems + "</ul>" : "")
        + (agrItems ? '<div class="group-h">Ogiltig avtalstyp</div><ul>' + agrItems + "</ul>" : "")
        + "</div>";
    }
    const shareItems = bullets(byField.share, (i) => "<li>" + escapeHtml(i.work_id) + " · share = <strong>" + escapeHtml(i.original_value) + "</strong> — " + escapeHtml(i.comment) + "</li>");
    const shareSec = shareItems ? '<h2>Andelsvalidering</h2><div class="panel"><ul>' + shareItems + "</ul></div>" : "";

    let workRowsHtml = "";
    for (const wid of workIds) {
      if (!wid) continue;
      const t = workTitles[wid] || "";
      const wIss = byWorkId[wid] || [];
      const pill = wIss.length === 0 ? '<span class="pill clean">Ren</span>' : '<span class="pill major">Avvikelser</span>';
      const keyIssues = wIss.length ? wIss.map((i) => i.field).join(", ") : "—";
      workRowsHtml += '<tr><td class="wid">' + escapeHtml(wid) + "</td><td>" + escapeHtml(t) + "</td><td>" + pill + "</td><td>" + escapeHtml(keyIssues) + "</td></tr>";
    }
    const worksWithIssues = Object.keys(byWorkId).filter((k) => k).length;

    const html = '<!DOCTYPE html>\n<html lang="sv">\n<head>\n<meta charset="UTF-8">\n<title>Valideringsrapport — Kataloghub</title>\n<style>\n'
      + 'body { background:#fff; color:#111; font-family:system-ui,-apple-system,"Segoe UI",sans-serif; line-height:1.55; padding:32px 28px 64px; }\n'
      + ".container { max-width:1080px; margin:0 auto; }\n"
      + "h1 { font-size:18px; color:#1f7a3a; margin-bottom:6px; }\n"
      + ".meta { font-size:12px; color:#555; }\n"
      + ".print-btn { background:#1f7a3a; color:#fff; border:0; border-radius:4px; padding:8px 14px; font-weight:600; cursor:pointer; font-size:12px; margin-top:8px; }\n"
      + ".summary { display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; margin:18px 0; }\n"
      + ".card { border:1px solid #e5e5e5; border-radius:6px; padding:12px 14px; }\n"
      + ".card .label { font-size:11px; color:#777; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px; }\n"
      + ".card .value { font-size:22px; font-weight:600; }\n"
      + "h2 { font-size:13px; text-transform:uppercase; letter-spacing:0.08em; color:#1f7a3a; margin:24px 0 8px; }\n"
      + ".panel { border:1px solid #e5e5e5; border-radius:6px; padding:12px 16px; }\n"
      + ".panel ul { margin:0; padding-left:20px; } .panel li { font-size:13px; color:#333; padding:4px 0; }\n"
      + ".disclaimer { border:1px solid #e5e5e5; border-radius:6px; padding:12px 16px; margin-top:18px; font-size:12px; color:#444; }\n"
      + ".disclaimer p { margin-bottom:4px; }\n"
      + "header { display:flex; align-items:flex-end; justify-content:space-between; gap:24px; padding-bottom:16px; border-bottom:1px solid #e5e5e5; margin-bottom:18px; }\n"
      + ".card .sub { font-size:11px; color:#777; margin-top:2px; }\n"
      + ".card.red .value { color:#c43838; } .card.amber .value { color:#a86c20; }\n"
      + ".panel li code { background:#f6f6f6; border:1px solid #e5e5e5; border-radius:3px; padding:1px 5px; font-size:12px; color:#1f7a3a; }\n"
      + ".panel .group-h { font-weight:700; color:#111; margin-top:10px; margin-bottom:4px; font-size:11px; text-transform:uppercase; letter-spacing:0.04em; }\n"
      + ".panel .group-h:first-child { margin-top:0; }\n"
      + ".cov-grid { display:grid; grid-template-columns:repeat(2, 1fr); gap:14px; }\n"
      + ".cov { border:1px solid #e5e5e5; border-radius:6px; padding:12px 14px; }\n"
      + ".cov-label { font-size:11px; color:#777; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px; }\n"
      + ".cov-bar { height:6px; background:#f0f0f0; border-radius:3px; overflow:hidden; margin-bottom:6px; }\n"
      + ".cov-fill { height:6px; background:#1f7a3a; border-radius:3px; }\n"
      + ".cov-text { font-size:12px; color:#444; font-family:monospace; }\n"
      + "table.works { width:100%; border-collapse:collapse; font-size:12px; border:1px solid #e5e5e5; border-radius:6px; overflow:hidden; margin-top:8px; }\n"
      + "table.works th, table.works td { padding:10px 14px; text-align:left; border-bottom:1px solid #e5e5e5; }\n"
      + "table.works th { background:#f5f5f5; font-size:10px; text-transform:uppercase; letter-spacing:0.06em; color:#555; font-weight:700; }\n"
      + "table.works tr:last-child td { border-bottom:0; }\n"
      + "table.works .wid { font-family:monospace; color:#1f7a3a; }\n"
      + ".pill { display:inline-block; padding:2px 10px; border-radius:999px; font-size:10px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; }\n"
      + ".pill.major { background:#fdeaea; color:#c43838; border:1px solid #f3c7c7; }\n"
      + ".pill.clean { background:#e7f7f1; color:#0f6657; border:1px solid #b5dccb; }\n"
      + "@media print { .print-btn { display:none; } body { padding:20px; } }\n"
      + "</style>\n</head>\n<body>\n<div class=\"container\">\n"
      + "<header>\n"
      + "  <div>\n"
      + "    <h1>Kataloghub · Valideringsrapport</h1>\n"
      + '    <div class="meta">Scan-ID: ' + escapeHtml(scanId) + " · Genererad " + escapeHtml(scanDate) + "</div>\n"
      + '    <div class="meta">Verk: ' + distinctWorks + " · Rader: " + totalRows + " · Avvikelser: " + issues.length + "</div>\n"
      + "  </div>\n"
      + '  <button class="print-btn" onclick="window.print()">Skriv ut / Spara som PDF</button>\n'
      + "</header>\n"
      + '<div class="summary">\n'
      + '  <div class="card"><div class="label">Verk analyserade</div><div class="value">' + distinctWorks + '</div><div class="sub">unika work_id</div></div>\n'
      + '  <div class="card"><div class="label">Rader</div><div class="value">' + totalRows + '</div><div class="sub">upphovsposteringar</div></div>\n'
      + '  <div class="card ' + (issues.length ? "red" : "") + '"><div class="label">Avvikelser</div><div class="value">' + issues.length + '</div><div class="sub">i hela katalogen</div></div>\n'
      + '  <div class="card ' + (worksWithIssues ? "amber" : "") + '"><div class="label">Verk med avvikelser</div><div class="value">' + worksWithIssues + '</div><div class="sub">av ' + distinctWorks + "</div></div>\n"
      + "</div>\n"
      + "<h2>Vanligaste avvikelser</h2>\n"
      + '<div class="panel"><ul>' + (commonList || "<li>Inga avvikelser identifierade.</li>") + "</ul></div>\n"
      + "<h2>Identifierartäckning</h2>\n"
      + coverage
      + idSec
      + shareSec
      + roleSec
      + "<h2>Status per verk</h2>\n"
      + '<table class="works"><thead><tr><th>work_id</th><th>title</th><th>Status</th><th>Avvikelsefält</th></tr></thead><tbody>' + workRowsHtml + "</tbody></table>\n"
      + '<div class="disclaimer">\n'
      + "  <p><strong>Valideringsbegränsningar.</strong> Kataloghub genomför validering enligt avtalad nivå.</p>\n"
      + "  <p>Korrigering av metadata ingår inte. Korrigering erbjuds separat via HeyRoya.</p>\n"
      + "</div>\n"
      + "</div>\n</body>\n</html>";

    const w = window.open("", "_blank");
    if (!w) { alert("Pop-up blockerad — tillåt pop-ups för denna sida."); return; }
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  // Coverage data for live render
  let cov: { iswcOK: number; isrcOK: number; ipiOK: number; roleOK: number; shareOK: number; agrOK: number; distinct: number; totalRows: number } | null = null;
  let workRows: { wid: string; title: string; issueFields: string[] }[] = [];
  if (result) {
    const { rows, issues, distinctWorks } = result;
    const titles: Record<string, string> = {};
    const hasIswc: Record<string, true> = {};
    const hasIsrc: Record<string, true> = {};
    for (const r of rows) {
      const w = r.work_id || "";
      if (!titles[w]) titles[w] = r.title || "";
      if ((r.iswc || "").trim() !== "") hasIswc[w] = true;
      if ((r.isrc || "").trim() !== "") hasIsrc[w] = true;
    }
    let iswcOK = 0, isrcOK = 0;
    for (const w of Object.keys(titles)) { if (hasIswc[w]) iswcOK++; if (hasIsrc[w]) isrcOK++; }
    let ipiOK = 0, roleOK = 0, shareOK = 0, agrOK = 0;
    for (const r of rows) {
      if ((r.writer_ipi || "").length >= 9) ipiOK++;
      if (["C", "CA", "A"].indexOf(r.role_code) >= 0) roleOK++;
      const s = Number(r.share); if (s > 0 && s <= 100) shareOK++;
      if (["E", "SE", "AM"].indexOf(r.agreement_type) >= 0) agrOK++;
    }
    cov = { iswcOK, isrcOK, ipiOK, roleOK, shareOK, agrOK, distinct: distinctWorks, totalRows: rows.length };

    const byWid: Record<string, Issue[]> = {};
    for (const i of issues) (byWid[i.work_id || ""] = byWid[i.work_id || ""] || []).push(i);
    workRows = Object.keys(titles)
      .filter((k) => k)
      .map((wid) => ({
        wid,
        title: titles[wid] || "",
        issueFields: (byWid[wid] || []).map((i) => i.field),
      }));
  }

  const statusBg =
    statusMsg?.kind === "error" || statusMsg?.kind === "blocked"
      ? "border-kh-red/40 bg-kh-red/5 text-kh-red"
      : statusMsg?.kind === "success"
        ? "border-kh-green/40 bg-kh-green/5 text-text"
        : "border-border bg-bg text-text";

  return (
    <>
      <StepIndicator steps={PIPELINE_STEPS} current={1} />

      <header className="mb-6">
        <h1 className="text-3xl font-bold uppercase">Ladda upp katalog</h1>
        <p className="mt-1 text-sm text-text-muted">
          Filbaserad kontroll av struktur, identifierare och format. Ingen integration. Ingen automatisering.
        </p>
      </header>

      <Card title="Katalogfil (CSV)">
        <p className="mb-3 font-mono text-xs text-text-muted">
          Krävd struktur: work_id, title, writer_name, writer_ipi, role_code, share, agreement_type, iswc, isrc.{" "}
          <button type="button" onClick={downloadSample} className="text-kh-green underline hover:text-kh-green-dark">
            Hämta exempelfil
          </button>
          .
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor="catalog"
            className="inline-block cursor-pointer rounded-full border border-border bg-bg px-4 py-2 text-sm hover:border-text-muted"
          >
            Välj fil
          </label>
          <input
            id="catalog"
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={onFileChange}
          />
          <span className="text-sm text-text-muted">{fileName}</span>
          <button
            type="button"
            onClick={runScan}
            disabled={!parsed}
            className="ml-auto rounded-full bg-kh-orange px-4 py-2 text-sm font-semibold text-white hover:bg-kh-orange-dark disabled:cursor-not-allowed disabled:bg-border disabled:text-text-muted"
          >
            Starta validering
          </button>
        </div>
      </Card>

      {statusMsg && (
        <div
          className={`mt-4 rounded-md border px-4 py-3 text-sm ${statusBg}`}
          dangerouslySetInnerHTML={{ __html: statusMsg.html }}
        />
      )}

      {result && (
        <>
          <Card className="mt-4">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Status</span>
                <strong>Validering klar</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Verk</span>
                <strong>{result.distinctWorks}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Rader</span>
                <strong>{result.rows.length}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Avvikelser</span>
                <strong>{result.issues.length}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Scan-ID</span>
                <strong className="font-mono">{result.scanId}</strong>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={downloadPdf}
                className="rounded border border-border px-4 py-2 text-sm hover:border-text-muted"
              >
                Ladda ner PDF-rapport
              </button>
              <button
                type="button"
                onClick={downloadCsv}
                className="rounded border border-border px-4 py-2 text-sm hover:border-text-muted"
              >
                Ladda ner CSV-underlag
              </button>
            </div>
          </Card>

          <Card title={`Avvikelser (${result.issues.length} rader)`} className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-text-muted">
                    <th className="py-2 pr-3 font-semibold">work_id</th>
                    <th className="py-2 pr-3 font-semibold">fält</th>
                    <th className="py-2 pr-3 font-semibold">nuvarande</th>
                    <th className="py-2 pr-3 font-semibold">status</th>
                    <th className="py-2 font-semibold">kommentar</th>
                  </tr>
                </thead>
                <tbody>
                  {result.issues.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-kh-green">
                        Inga avvikelser identifierade.
                      </td>
                    </tr>
                  ) : (
                    result.issues.map((x, idx) => (
                      <tr key={idx} className="border-b border-border last:border-0">
                        <td className="py-2 pr-3 font-mono text-xs text-kh-green">{x.work_id || "—"}</td>
                        <td className="py-2 pr-3 font-mono text-xs text-kh-green">{x.field}</td>
                        <td className="py-2 pr-3 font-mono text-xs text-text-muted">{x.original_value === "" ? "—" : x.original_value}</td>
                        <td className="py-2 pr-3">
                          <span
                            className={`inline-block rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase ${
                              x.status === "invalid"
                                ? "border-kh-red/40 bg-kh-red/10 text-kh-red"
                                : "border-kh-yellow/40 bg-kh-yellow/10 text-[#7a5a10]"
                            }`}
                          >
                            {x.status}
                          </span>
                        </td>
                        <td className="py-2 text-text">{x.comment}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {cov && (
            <Card title="Identifierartäckning" className="mt-4">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  { label: "ISWC per verk", n: cov.iswcOK, total: cov.distinct },
                  { label: "ISRC per verk", n: cov.isrcOK, total: cov.distinct },
                  { label: "writer_ipi (rader)", n: cov.ipiOK, total: cov.totalRows },
                  { label: "role_code (rader)", n: cov.roleOK, total: cov.totalRows },
                  { label: "share (rader)", n: cov.shareOK, total: cov.totalRows },
                  { label: "agreement_type (rader)", n: cov.agrOK, total: cov.totalRows },
                ].map((c) => {
                  const p = pctNum(c.n, c.total);
                  return (
                    <div key={c.label} className="rounded border border-border bg-bg p-3">
                      <div className="mb-2 text-[11px] uppercase tracking-wide text-text-muted">{c.label}</div>
                      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-border">
                        <div className={`h-1.5 rounded-full ${fillClass(p)}`} style={{ width: `${p}%` }} />
                      </div>
                      <div className="font-mono text-xs text-text">
                        {c.n} / {c.total} ({p}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <Card title={`Status per verk (${workRows.length} verk)`} className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-text-muted">
                    <th className="py-2 pr-3 font-semibold">work_id</th>
                    <th className="py-2 pr-3 font-semibold">title</th>
                    <th className="py-2 pr-3 font-semibold">status</th>
                    <th className="py-2 font-semibold">avvikelsefält</th>
                  </tr>
                </thead>
                <tbody>
                  {workRows.map((w) => (
                    <tr key={w.wid} className="border-b border-border last:border-0">
                      <td className="py-2 pr-3 font-mono text-xs text-kh-green">{w.wid}</td>
                      <td className="py-2 pr-3">{w.title}</td>
                      <td className="py-2 pr-3">
                        {w.issueFields.length === 0 ? (
                          <span className="inline-block rounded-full border border-kh-green/40 bg-kh-green/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-kh-green">
                            Ren
                          </span>
                        ) : (
                          <span className="inline-block rounded-full border border-kh-red/40 bg-kh-red/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-kh-red">
                            Avvikelser
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-text">{w.issueFields.length ? w.issueFields.join(", ") : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      <Card title="Vad som kontrolleras" className="mt-4">
        <ul className="space-y-1 text-sm text-text">
          <li>· Kolumnordning och obligatoriska fält</li>
          <li>· Identifierare: work_id, writer_ipi, iswc, isrc</li>
          <li>· Format, roller, andelar och teckenkodning</li>
          <li>· Dubbletter baserat på work_id och writer_ipi</li>
        </ul>
      </Card>
    </>
  );
}
