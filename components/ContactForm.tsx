"use client";

import { useRef, useState } from "react";
import { LINKEDIN_URL } from "@/lib/content";
import type { TranslationKey } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

/** Cloudflare Worker URL, injected at build time (see README → Contact form). */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "";

const PROJECT_TYPES = ["webapp", "backend", "automation", "ai", "freelance", "job", "other"] as const;
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
  const [errors, setErrors] = useState<Partial<Record<Field, TranslationKey>>>({});
  const startedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  if (!ENDPOINT) {
    return (
      <p className="form-unavailable">
        {t("form.unavailable")}{" "}
        <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
          LinkedIn ↗
        </a>
      </p>
    );
  }

  const markStarted = () => {
    if (!startedAt.current) startedAt.current = Date.now();
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(data.entries()),
          lang,
          startedAt: startedAt.current || Date.now(),
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && body.ok) {
        setStatus("success");
        form.reset();
        startedAt.current = 0;
        return;
      }
      // Server-side validation error on a known field.
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

  if (status === "success") {
    return (
      <div className="form-success" role="status">
        <span className="form-success-icon" aria-hidden="true">
          ✓
        </span>
        <p>{t("form.success")}</p>
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
      <div className="form-field">
        <label htmlFor="cf-name">{t("form.name")} *</label>
        <input {...fieldProps("name")} type="text" autoComplete="name" required maxLength={120} />
        {errorFor("name")}
      </div>
      <div className="form-field">
        <label htmlFor="cf-email">{t("form.email")} *</label>
        <input {...fieldProps("email")} type="email" autoComplete="email" required maxLength={200} />
        {errorFor("email")}
      </div>
      <div className="form-field">
        <label htmlFor="cf-company">
          {t("form.company")}
          {optional}
        </label>
        <input id="cf-company" name="company" type="text" autoComplete="organization" maxLength={160} />
      </div>
      <div className="form-field">
        <label htmlFor="cf-website">
          {t("form.website")}
          {optional}
        </label>
        <input {...fieldProps("website")} type="text" inputMode="url" autoComplete="url" maxLength={300} placeholder="https://" />
        {errorFor("website")}
      </div>
      <div className="form-field">
        <label htmlFor="cf-projectType">{t("form.type")} *</label>
        <select {...fieldProps("projectType")} required defaultValue="">
          <option value="" disabled>
            {t("form.choose")}
          </option>
          {PROJECT_TYPES.map((v) => (
            <option key={v} value={v}>
              {t(`form.type.${v}`)}
            </option>
          ))}
        </select>
        {errorFor("projectType")}
      </div>
      <div className="form-field form-field-split">
        <div>
          <label htmlFor="cf-budget">
            {t("form.budget")}
            {optional}
          </label>
          <select id="cf-budget" name="budget" defaultValue="">
            <option value="">—</option>
            {BUDGETS.map((v) => (
              <option key={v} value={v}>
                {t(`form.budget.${v}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cf-timeline">
            {t("form.timeline")}
            {optional}
          </label>
          <select id="cf-timeline" name="timeline" defaultValue="">
            <option value="">—</option>
            {TIMELINES.map((v) => (
              <option key={v} value={v}>
                {t(`form.timeline.${v}`)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-field form-field-full">
        <label htmlFor="cf-message">{t("form.message")} *</label>
        <textarea
          {...fieldProps("message")}
          rows={5}
          required
          maxLength={5000}
          placeholder={t("form.messageHint")}
        />
        {errorFor("message")}
      </div>

      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="form-hp" aria-hidden="true">
        <label htmlFor="cf-fax">Fax</label>
        <input id="cf-fax" name="fax" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-footer form-field-full">
        <p className="form-privacy">{t("form.privacy")}</p>
        <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? t("form.sending") : t("form.submit")}
          {status !== "sending" && <span aria-hidden="true"> ↗</span>}
        </button>
      </div>
      <p className="form-status form-field-full" role="alert">
        {status === "error" ? t("form.error") : ""}
      </p>
    </form>
  );
}
