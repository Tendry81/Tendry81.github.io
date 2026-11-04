"use client";

import { useRef, useState } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Laptop,
  Server,
  Cpu,
  Bot,
  Briefcase,
  Layers,
  HelpCircle,
} from "lucide-react";
import { LINKEDIN_URL, GITHUB_URL } from "@/lib/content";
import type { TranslationKey } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

// Use Next.js API route /api/contact as first-class backend endpoint
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "/api/contact";

const PROJECT_TYPES = [
  { id: "webapp", icon: Laptop },
  { id: "backend", icon: Server },
  { id: "automation", icon: Layers },
  { id: "ai", icon: Bot },
  { id: "freelance", icon: Briefcase },
  { id: "job", icon: Cpu },
  { id: "other", icon: HelpCircle },
] as const;

const BUDGETS = ["lt1k", "1k-5k", "5k-15k", "gt15k", "tbd"] as const;
const TIMELINES = ["asap", "1m", "1-3m", "flexible"] as const;

const FIELDS = ["name", "email", "projectType", "message", "website"] as const;
type Field = (typeof FIELDS)[number];
type Status = "idle" | "sending" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(data: FormData): Partial<Record<Field, TranslationKey>> {
  const errors: Partial<Record<Field, TranslationKey>> = {};
  const get = (k: string) => String(data.get(k) ?? "").trim();
  if (get("name").length < 2) errors.name = "form.invalid.name";
  if (!EMAIL_RE.test(get("email"))) errors.email = "form.invalid.email";
  if (!get("projectType")) errors.projectType = "form.invalid.projectType";
  if (get("message").length < 10) errors.message = "form.invalid.message";
  const website = get("website");
  if (website && !/^(https?:\/\/)?[^\s/$.?#]+\.[^\s]{2,}$/i.test(website)) {
    errors.website = "form.invalid.website";
  }
  return errors;
}

export function ContactForm() {
  const { lang, t } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");
  const [selectedType, setSelectedType] = useState<string>("webapp");
  const [messageLength, setMessageLength] = useState<number>(0);
  const [errors, setErrors] = useState<Partial<Record<Field, TranslationKey>>>({});
  const [submittedName, setSubmittedName] = useState<string>("");
  const startedAt = useRef<number>(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  const markStarted = () => {
    if (!startedAt.current) startedAt.current = Date.now();
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("projectType", selectedType);

    const found = validate(data);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      if (first === "projectType") {
        document.getElementById("project-type-selector")?.focus();
      } else {
        form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      }
      return;
    }

    setStatus("sending");
    try {
      const payload: Record<string, unknown> = {
        name: data.get("name"),
        email: data.get("email"),
        company: data.get("company"),
        website: data.get("website"),
        projectType: selectedType,
        budget: data.get("budget"),
        timeline: data.get("timeline"),
        message: data.get("message"),
        lang,
        startedAt: startedAt.current || Date.now(),
      };

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; name?: string };
      if (res.ok && body.ok) {
        setSubmittedName(String(data.get("name") ?? ""));
        setStatus("success");
        form.reset();
        setMessageLength(0);
        startedAt.current = 0;
        return;
      }

      // Server-side validation error
      const field = body.error as Field;
      if (res.status === 422 && FIELDS.includes(field)) {
        setErrors({ [field]: `form.invalid.${field}` as TranslationKey });
        setStatus("idle");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  function handleReset() {
    setStatus("idle");
    setErrors({});
    startedAt.current = Date.now();
  }

  if (status === "success") {
    return (
      <div className="form-success-card" role="status">
        <div className="form-success-icon-wrap" aria-hidden="true">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h3 className="form-success-title">
          {lang === "fr" ? `Message envoyé, merci ${submittedName} !` : `Message received, thank you ${submittedName}!`}
        </h3>
        <p className="form-success-desc">{t("form.success")}</p>
        <div className="form-success-actions">
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            {lang === "fr" ? "Envoyer un autre message" : "Send another message"}
          </button>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="btn btn-primary">
            LinkedIn ↗
          </a>
        </div>
      </div>
    );
  }

  const fieldProps = (name: Field) => ({
    name,
    id: `cf-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `cf-${name}-error` : undefined,
  });

  const errorFor = (name: Field) =>
    errors[name] ? (
      <span className="form-error" id={`cf-${name}-error`}>
        <AlertCircle className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" />
        {t(errors[name]!)}
      </span>
    ) : null;

  const optional = <span className="form-optional"> ({t("form.optional")})</span>;

  return (
    <form
      ref={formRef}
      className="contact-form"
      noValidate
      onSubmit={onSubmit}
      onFocus={markStarted}
      aria-busy={status === "sending"}
    >
      <div className="form-row-2">
        <div className="form-field">
          <label htmlFor="cf-name">
            {t("form.name")} <span className="text-accent-ink font-bold">*</span>
          </label>
          <input
            {...fieldProps("name")}
            type="text"
            autoComplete="name"
            placeholder={lang === "fr" ? "ex: Marc Dupont" : "e.g., Alex Morgan"}
            required
            maxLength={120}
          />
          {errorFor("name")}
        </div>

        <div className="form-field">
          <label htmlFor="cf-email">
            {t("form.email")} <span className="text-accent-ink font-bold">*</span>
          </label>
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            placeholder={lang === "fr" ? "ex: contact@societe.com" : "e.g., alex@company.com"}
            required
            maxLength={200}
          />
          {errorFor("email")}
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-field">
          <label htmlFor="cf-company">
            {t("form.company")}
            {optional}
          </label>
          <input
            id="cf-company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder={lang === "fr" ? "Nom de votre entreprise" : "Company or project name"}
            maxLength={160}
          />
        </div>

        <div className="form-field">
          <label htmlFor="cf-website">
            {t("form.website")}
            {optional}
          </label>
          <input
            {...fieldProps("website")}
            type="text"
            inputMode="url"
            autoComplete="url"
            maxLength={300}
            placeholder="https://..."
          />
          {errorFor("website")}
        </div>
      </div>

      {/* Interactive Project Type Selector */}
      <div className="form-field form-field-full">
        <label id="project-type-label">
          {t("form.type")} <span className="text-accent-ink font-bold">*</span>
        </label>
        <div
          id="project-type-selector"
          className="project-type-grid"
          role="radiogroup"
          aria-labelledby="project-type-label"
        >
          {PROJECT_TYPES.map(({ id, icon: Icon }) => {
            const isSelected = selectedType === id;
            return (
              <button
                type="button"
                key={id}
                role="radio"
                aria-checked={isSelected}
                className={`project-type-btn ${isSelected ? "is-selected" : ""}`}
                onClick={() => setSelectedType(id)}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t(`form.type.${id}`)}</span>
              </button>
            );
          })}
        </div>
        <input type="hidden" name="projectType" value={selectedType} />
        {errorFor("projectType")}
      </div>

      <div className="form-row-2">
        <div className="form-field">
          <label htmlFor="cf-budget">
            {t("form.budget")}
            {optional}
          </label>
          <div className="select-wrap">
            <select id="cf-budget" name="budget" defaultValue="">
              <option value="">— {lang === "fr" ? "Sélectionner un budget" : "Select budget"} —</option>
              {BUDGETS.map((v) => (
                <option key={v} value={v}>
                  {t(`form.budget.${v}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="cf-timeline">
            {t("form.timeline")}
            {optional}
          </label>
          <div className="select-wrap">
            <select id="cf-timeline" name="timeline" defaultValue="">
              <option value="">— {lang === "fr" ? "Sélectionner un délai" : "Select timeline"} —</option>
              {TIMELINES.map((v) => (
                <option key={v} value={v}>
                  {t(`form.timeline.${v}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="form-field form-field-full">
        <div className="message-label-wrap">
          <label htmlFor="cf-message">
            {t("form.message")} <span className="text-accent-ink font-bold">*</span>
          </label>
          <span className="char-count">{messageLength} / 5000</span>
        </div>
        <textarea
          {...fieldProps("message")}
          rows={5}
          required
          maxLength={5000}
          placeholder={t("form.messageHint")}
          onChange={(e) => setMessageLength(e.target.value.length)}
        />
        {errorFor("message")}
      </div>

      {/* Honeypot field (hidden from screen, catches bots) */}
      <div className="form-hp" aria-hidden="true">
        <label htmlFor="cf-fax">Fax</label>
        <input id="cf-fax" name="fax" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-footer form-field-full">
        <p className="form-privacy" dangerouslySetInnerHTML={{ __html: t("form.privacy") }} />
        <button className="btn btn-primary submit-btn" type="submit" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />
              <span>{t("form.sending")}</span>
            </>
          ) : (
            <>
              <span>{t("form.submit")}</span>
              <Send className="w-4 h-4 ml-1.5" aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      {status === "error" && (
        <div className="form-status-box form-status-error" role="alert">
          <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
          <p>{t("form.error")}</p>
        </div>
      )}
    </form>
  );
}
