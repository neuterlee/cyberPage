import { defineProperties } from "figma:react";

type PageMode = "before" | "after";

export default function Layer({
  title = "Monash password page redesign",
  page = "before",
}: {
  title?: string;
  page?: PageMode;
}) {
  return (
    <div style={styles.canvas}>
      <div style={styles.frame}>
        <div style={styles.header}>
          <h1 style={styles.slideTitle}>{title}</h1>
          <p style={styles.subtitle}>
            {page === "before"
              ? "Current Monash password-change experience (baseline capture)."
              : "Redesigned guided passphrase experience (proposed)."}
          </p>
        </div>

        <div style={styles.singlePanel}>{page === "before" ? <BeforePage /> : <AfterPage />}</div>
      </div>
    </div>
  );
}

function BeforePage() {
  return (
    <section style={styles.panel}>
      <div style={styles.panelBar}>BEFORE - Current page</div>
      <div style={styles.pageBody}>
        <h2 style={styles.pageTitle}>Change Password</h2>
        <div style={styles.block}>
          <h3 style={styles.blockTitle}>Password Requirements</h3>
          <ul style={styles.list}>
            <li>13+ characters can be lower-case only</li>
            <li>Minimum 8 characters</li>
            <li>8-13 characters require 3 of: uppercase, lowercase, numbers, symbols</li>
            <li>Cannot reuse last 24 passwords</li>
            <li>Must not include username or name</li>
            <li>24-hour wait between changes</li>
            <li>Checked against 3B+ breached passwords</li>
          </ul>
        </div>
        <Field label="Email address or username" />
        <Field label="Current password" />
        <Field label="New password" />
        <Field label="Confirm new password" />
        <button style={styles.primaryBtn}>Change</button>
      </div>
    </section>
  );
}

function AfterPage() {
  return (
    <section style={styles.panel}>
      <div style={styles.panelBar}>AFTER - Redesigned experience</div>
      <div style={styles.pageBody}>
        <h2 style={styles.pageTitle}>Create a stronger Monash passphrase</h2>
        <div style={styles.infoBox}>
          Use at least 13 characters and prefer 4+ unrelated words (for example:
          river coffee galaxy piano).
        </div>
        <Field label="1. Enter your new passphrase" placeholder="Type your new passphrase" />
        <Field label="2. Confirm your new passphrase" placeholder="Re-type your new passphrase" />
        <Field label="3. Enter your current password" placeholder="Current password" />
        <div style={styles.feedbackBox}>
          <div>OK At least 13 characters</div>
          <div>OK Not found in breached-password lists</div>
          <div>Warn Avoid username, name, or Monash ID</div>
          <div>Warn Avoid small changes to old passwords</div>
        </div>
        <button style={styles.primaryBtn}>Update my passphrase</button>
      </div>
    </section>
  );
}

function Field({ label, placeholder = "" }: { label: string; placeholder?: string }) {
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.fieldLabel}>{label}</label>
      <div style={styles.fakeInput}>{placeholder}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  canvas: {
    width: "100%",
    minHeight: "100vh",
    background: "#eef2f7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    fontFamily: "Inter, Arial, Helvetica, sans-serif",
    color: "#111827",
  },
  frame: {
    width: 1400,
    height: 860,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 18px 60px rgba(0,0,0,0.12)",
    padding: 28,
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24 },
  slideTitle: { margin: 0, fontSize: 34, color: "#002145" },
  subtitle: { margin: 0, fontSize: 16, color: "#5b677a", maxWidth: 600 },
  singlePanel: { flex: 1 },
  panel: { border: "1px solid #c9d4e5", borderRadius: 14, overflow: "hidden", height: "100%" },
  panelBar: {
    background: "#002145",
    color: "#fff",
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 20,
  },
  pageBody: { padding: "28px 36px", display: "flex", flexDirection: "column", gap: 14 },
  pageTitle: { margin: 0, fontSize: 30, color: "#111" },
  block: { border: "1px solid #d7d7d7", borderRadius: 6, padding: 16 },
  blockTitle: { margin: "0 0 8px", fontSize: 16 },
  list: { margin: 0, paddingLeft: 18, lineHeight: 1.6, fontSize: 14 },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 6 },
  fieldLabel: { fontSize: 14, fontWeight: 700 },
  fakeInput: {
    minHeight: 38,
    border: "1px solid #cfd6df",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    color: "#7b8494",
    fontSize: 14,
    background: "#fff",
  },
  infoBox: { border: "1px solid #c9d4e5", background: "#f3f7ff", padding: 14, borderRadius: 8, lineHeight: 1.5 },
  feedbackBox: {
    border: "1px solid #c9d4e5",
    background: "#f8fbff",
    borderRadius: 8,
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 14,
  },
  primaryBtn: {
    marginTop: 8,
    height: 40,
    border: 0,
    borderRadius: 5,
    background: "#0057b8",
    color: "white",
    fontWeight: 800,
    fontSize: 15,
  },
};

defineProperties(Layer, {
  title: {
    label: "Slide title",
    type: "string",
    defaultValue: "Monash password page redesign",
  },
  page: {
    label: "Page",
    type: "string",
    defaultValue: "before",
  },
});
