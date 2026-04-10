/**
 * pdfGenerator.ts
 * 
 * Gera PDFs programáticos a partir de conteúdo Markdown.
 * Produz texto vetorial selecionável (não screenshot).
 * Formatação: A4, Times New Roman, margens 25mm, entrelinhas dupla.
 */

import jsPDF from "jspdf";

// ──────────────────────────────────────
// Types
// ──────────────────────────────────────

interface PdfMeta {
  pieceType: string;
  legalArea: string;
  lawyerName?: string;
  lawyerOab?: string;
}

type Token =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "ordered_item"; index: number; text: string }
  | { type: "unordered_item"; text: string }
  | { type: "hr" }
  | { type: "blank" };

// ──────────────────────────────────────
// Constants – A4 layout (mm)
// ──────────────────────────────────────

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_L = 25;
const MARGIN_R = 25;
const MARGIN_T = 30;
const MARGIN_B = 30;
const CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R;

// Font sizes (pt)
const FONT_BODY = 12;
const FONT_H1 = 14;
const FONT_H2 = 13;
const FONT_H3 = 12;
const FONT_SMALL = 9;
const FONT_TINY = 8;

const LINE_HEIGHT = 1.8; // multiplier over font size

// ──────────────────────────────────────
// Markdown tokeniser (lightweight)
// ──────────────────────────────────────

function tokenise(md: string): Token[] {
  const lines = md.split("\n");
  const tokens: Token[] = [];
  let i = 0;
  let orderedCounter = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();

    // blank line
    if (trimmed === "") {
      tokens.push({ type: "blank" });
      i++;
      orderedCounter = 0;
      continue;
    }

    // horizontal rule
    if (/^-{3,}$|^\*{3,}$|^_{3,}$/.test(trimmed)) {
      tokens.push({ type: "hr" });
      i++;
      continue;
    }

    // headings
    if (trimmed.startsWith("### ")) {
      tokens.push({ type: "h3", text: stripInline(trimmed.slice(4)) });
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      tokens.push({ type: "h2", text: stripInline(trimmed.slice(3)) });
      i++;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      tokens.push({ type: "h1", text: stripInline(trimmed.slice(2)) });
      i++;
      continue;
    }

    // blockquote – gather consecutive > lines
    if (trimmed.startsWith(">")) {
      let block = "";
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        block += (block ? " " : "") + lines[i].trim().replace(/^>\s*/, "");
        i++;
      }
      tokens.push({ type: "blockquote", text: stripInline(block) });
      continue;
    }

    // ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      orderedCounter++;
      const text = trimmed.replace(/^\d+\.\s*/, "");
      tokens.push({ type: "ordered_item", index: orderedCounter, text: stripInline(text) });
      i++;
      continue;
    }

    // unordered list
    if (/^[-*+]\s/.test(trimmed)) {
      const text = trimmed.replace(/^[-*+]\s*/, "");
      tokens.push({ type: "unordered_item", text: stripInline(text) });
      i++;
      orderedCounter = 0;
      continue;
    }

    // paragraph – gather consecutive plain text lines
    {
      let para = "";
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !lines[i].trim().startsWith("#") &&
        !lines[i].trim().startsWith(">") &&
        !/^-{3,}$|^\*{3,}$|^_{3,}$/.test(lines[i].trim()) &&
        !/^\d+\.\s/.test(lines[i].trim()) &&
        !/^[-*+]\s/.test(lines[i].trim())
      ) {
        para += (para ? " " : "") + lines[i].trim();
        i++;
      }
      if (para) {
        tokens.push({ type: "paragraph", text: stripInline(para) });
        orderedCounter = 0;
      }
    }
  }

  return tokens;
}

/** Strip markdown inline formatting (bold, italic, links) but keep text */
function stripInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")   // bold
    .replace(/__(.+?)__/g, "$1")        // bold alt
    .replace(/\*(.+?)\*/g, "$1")        // italic
    .replace(/_(.+?)_/g, "$1")          // italic alt
    .replace(/`(.+?)`/g, "$1")          // code
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // links
    .trim();
}

// ──────────────────────────────────────
// Bold-aware text rendering
// ──────────────────────────────────────

interface TextSegment {
  text: string;
  bold: boolean;
}

/** Split text into bold/normal segments based on **...** markers */
function parseInlineSegments(raw: string): TextSegment[] {
  const segments: TextSegment[] = [];
  // We work on the original raw text (before stripInline for paragraphs)
  const parts = raw.split(/(\*\*.*?\*\*)/g);
  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      segments.push({ text: part.slice(2, -2), bold: true });
    } else if (part.length > 0) {
      segments.push({ text: part, bold: false });
    }
  }
  return segments;
}

// ──────────────────────────────────────
// PDF Generator
// ──────────────────────────────────────

export function generateLegalPdf(markdown: string, meta: PdfMeta): void {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  let y = MARGIN_T;
  let pageNum = 1;

  // ── helpers ──

  function ptToMm(pt: number): number {
    return pt * 0.3528;
  }

  function lineH(fontPt: number): number {
    return ptToMm(fontPt) * LINE_HEIGHT;
  }

  function checkPageBreak(needed: number): void {
    if (y + needed > PAGE_H - MARGIN_B) {
      addFooter();
      doc.addPage();
      pageNum++;
      addHeader();
      y = MARGIN_T + 8;
    }
  }

  function addHeader(): void {
    doc.setFont("times", "normal");
    doc.setFontSize(FONT_SMALL);
    doc.setTextColor(150);
    doc.text(`${meta.pieceType} — ${meta.legalArea}`, MARGIN_L, 15);
    const dateStr = `Juris AI • ${new Date().toLocaleDateString("pt-BR")}`;
    doc.text(dateStr, PAGE_W - MARGIN_R, 15, { align: "right" });
    doc.setDrawColor(200);
    doc.line(MARGIN_L, 18, PAGE_W - MARGIN_R, 18);
  }

  function addFooter(): void {
    doc.setFont("times", "normal");
    doc.setFontSize(FONT_TINY);
    doc.setTextColor(150);
    doc.setDrawColor(200);
    const footerY = PAGE_H - 15;
    doc.line(MARGIN_L, footerY - 3, PAGE_W - MARGIN_R, footerY - 3);
    doc.text(
      "Documento gerado por assistência de IA — sujeito à revisão profissional (OAB Prov. 222/2023)",
      MARGIN_L,
      footerY
    );
    doc.text(`— ${pageNum} —`, PAGE_W / 2, footerY, { align: "center" });
  }

  /** Write justified-ish text with word wrap, returning the final Y. */
  function writeText(
    text: string,
    x: number,
    startY: number,
    maxW: number,
    fontPt: number,
    fontStyle: "normal" | "bold" | "italic" | "bolditalic" = "normal",
    indent: number = 0
  ): number {
    doc.setFont("times", fontStyle);
    doc.setFontSize(fontPt);
    doc.setTextColor(30);
    const lh = lineH(fontPt);

    // Split text into lines that fit within maxW - indent (first line only indent)
    const firstLineW = maxW - indent;
    const lines = doc.splitTextToSize(text, firstLineW) as string[];
    
    // Re-split remaining lines without indent
    if (lines.length > 1 && indent > 0) {
      const firstLine = lines[0];
      const restText = text.slice(firstLine.length).trim();
      const restLines = doc.splitTextToSize(restText, maxW) as string[];
      lines.length = 0;
      lines.push(firstLine, ...restLines);
    }

    let currentY = startY;
    for (let i = 0; i < lines.length; i++) {
      checkPageBreak(lh);
      const xOffset = i === 0 ? x + indent : x;
      doc.text(lines[i], xOffset, currentY);
      currentY += lh;
    }
    return currentY;
  }

  /** Write rich text with bold segments */
  function writeRichText(
    rawText: string,
    x: number,
    startY: number,
    maxW: number,
    fontPt: number,
    indent: number = 0
  ): number {
    // For simplicity with bold segments, we'll use splitTextToSize on the full clean text
    // and render line by line, detecting bold markers per line.
    const cleanText = stripInline(rawText);
    doc.setFont("times", "normal");
    doc.setFontSize(fontPt);
    const lh = lineH(fontPt);

    const allLines = doc.splitTextToSize(cleanText, maxW - indent) as string[];
    
    // Re-split rest if indent
    if (allLines.length > 1 && indent > 0) {
      const firstLine = allLines[0];
      const restText = cleanText.slice(firstLine.length).trim();
      const restLines = doc.splitTextToSize(restText, maxW) as string[];
      allLines.length = 0;
      allLines.push(firstLine, ...restLines);
    }

    let currentY = startY;
    for (let i = 0; i < allLines.length; i++) {
      checkPageBreak(lh);
      const xOffset = i === 0 ? x + indent : x;
      doc.setFont("times", "normal");
      doc.setFontSize(fontPt);
      doc.setTextColor(30);
      doc.text(allLines[i], xOffset, currentY);
      currentY += lh;
    }
    return currentY;
  }

  // ── render ──

  addHeader();
  y = MARGIN_T + 2;

  const tokens = tokenise(markdown);
  const INDENT = 10; // paragraph first-line indent in mm

  for (const token of tokens) {
    switch (token.type) {
      case "h1": {
        checkPageBreak(lineH(FONT_H1) * 2);
        y += 4;
        doc.setFont("times", "bold");
        doc.setFontSize(FONT_H1);
        doc.setTextColor(20);
        const h1Lines = doc.splitTextToSize(token.text.toUpperCase(), CONTENT_W) as string[];
        for (const line of h1Lines) {
          checkPageBreak(lineH(FONT_H1));
          doc.text(line, PAGE_W / 2, y, { align: "center" });
          y += lineH(FONT_H1);
        }
        y += 3;
        break;
      }

      case "h2": {
        checkPageBreak(lineH(FONT_H2) * 2);
        y += 6;
        doc.setFont("times", "bold");
        doc.setFontSize(FONT_H2);
        doc.setTextColor(30);
        const h2Lines = doc.splitTextToSize(token.text.toUpperCase(), CONTENT_W) as string[];
        for (const line of h2Lines) {
          checkPageBreak(lineH(FONT_H2));
          doc.text(line, MARGIN_L, y);
          y += lineH(FONT_H2);
        }
        // underline
        doc.setDrawColor(180);
        doc.line(MARGIN_L, y - lineH(FONT_H2) + ptToMm(FONT_H2) + 1, PAGE_W - MARGIN_R, y - lineH(FONT_H2) + ptToMm(FONT_H2) + 1);
        y += 2;
        break;
      }

      case "h3": {
        checkPageBreak(lineH(FONT_H3) * 2);
        y += 3;
        doc.setFont("times", "bold");
        doc.setFontSize(FONT_H3);
        doc.setTextColor(40);
        doc.text(token.text, MARGIN_L, y);
        y += lineH(FONT_H3) + 1;
        break;
      }

      case "paragraph": {
        checkPageBreak(lineH(FONT_BODY));
        y = writeRichText(token.text, MARGIN_L, y, CONTENT_W, FONT_BODY, INDENT);
        y += 2;
        break;
      }

      case "blockquote": {
        checkPageBreak(lineH(FONT_BODY));
        const bqX = MARGIN_L + 8;
        const bqW = CONTENT_W - 12;
        // Draw left bar
        const bqStart = y - 1;
        y = writeText(token.text, bqX, y, bqW, 11, "italic");
        doc.setDrawColor(139, 115, 85); // brown
        doc.setLineWidth(0.6);
        doc.line(MARGIN_L + 5, bqStart, MARGIN_L + 5, y - 1);
        doc.setLineWidth(0.2);
        y += 2;
        break;
      }

      case "ordered_item": {
        checkPageBreak(lineH(FONT_BODY));
        const label = `${token.index}. `;
        doc.setFont("times", "bold");
        doc.setFontSize(FONT_BODY);
        doc.setTextColor(30);
        doc.text(label, MARGIN_L + 5, y);
        const labelW = doc.getTextWidth(label);
        y = writeText(token.text, MARGIN_L + 5 + labelW, y, CONTENT_W - 5 - labelW, FONT_BODY);
        y += 1;
        break;
      }

      case "unordered_item": {
        checkPageBreak(lineH(FONT_BODY));
        doc.setFont("times", "normal");
        doc.setFontSize(FONT_BODY);
        doc.setTextColor(30);
        doc.text("•", MARGIN_L + 5, y);
        y = writeText(token.text, MARGIN_L + 10, y, CONTENT_W - 10, FONT_BODY);
        y += 1;
        break;
      }

      case "hr": {
        checkPageBreak(8);
        y += 4;
        doc.setDrawColor(160);
        doc.setLineWidth(0.3);
        const hrCenter = PAGE_W / 2;
        doc.line(hrCenter - 30, y, hrCenter + 30, y);
        y += 4;
        break;
      }

      case "blank": {
        y += 2;
        break;
      }
    }
  }

  // Final footer on last page
  addFooter();

  // Signature block if lawyer info present
  if (meta.lawyerName || meta.lawyerOab) {
    checkPageBreak(30);
    y += 10;
    doc.setFont("times", "normal");
    doc.setFontSize(FONT_BODY);
    doc.setTextColor(30);
    doc.text("Nestes termos, pede deferimento.", MARGIN_L, y);
    y += lineH(FONT_BODY) * 2;

    const today = new Date();
    const dateStr = today.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    doc.text(`Local, ${dateStr}.`, MARGIN_L, y);
    y += lineH(FONT_BODY) * 3;

    // Signature line
    const sigCenter = PAGE_W / 2;
    doc.line(sigCenter - 35, y, sigCenter + 35, y);
    y += 5;
    if (meta.lawyerName) {
      doc.setFont("times", "bold");
      doc.text(meta.lawyerName, sigCenter, y, { align: "center" });
      y += lineH(FONT_BODY);
    }
    if (meta.lawyerOab) {
      doc.setFont("times", "normal");
      doc.setFontSize(11);
      doc.text(`OAB ${meta.lawyerOab}`, sigCenter, y, { align: "center" });
    }
  }

  // ── save ──
  const filename = `${meta.pieceType.replace(/\s+/g, "_")}_${meta.legalArea}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
