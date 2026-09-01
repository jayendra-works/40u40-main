"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { submitNominationForm } from "@/app/actions/nomination";
import type { GenderOption, NominationTypeOption } from "@/lib/validations/nomination";

const GENDER_OPTIONS: GenderOption[] = ["Male", "Female", "Prefer not to say", "Other"];
const NOMINATION_TYPES: { value: NominationTypeOption; label: string }[] = [
  { value: "self", label: "Self Nomination" },
  { value: "third_party", label: "Third-Party Nomination" },
];

const INPUT_CLASS =
  "w-full bg-transparent border-b border-[#EAE6E1]/15 px-0 py-3 text-sm text-[#EAE6E1] placeholder-[#EAE6E1]/20 focus:outline-none focus:border-[#C5B397] transition-colors duration-300";
const LABEL_CLASS = "block text-[11px] uppercase tracking-[0.25em] font-medium text-[#EAE6E1]/40 mb-2";
const ERROR_CLASS = "mt-1 text-[10px] uppercase tracking-[0.15em] text-red-400";

interface FormState {
  consentGiven: boolean;
  nominationType: NominationTypeOption;
  nominatorName: string;
  relationship: string;
  fullName: string;
  email: string;
  age: string;
  dateOfBirth: string;
  gender: string;
  designation: string;
  company: string;
  industry: string;
  linkedIn: string;
  instagramUrl: string;
  websiteUrl: string;
  profileUrl: string;
  personalLinks: string;
  revenueScale: string;
  companyImpact: string;
  fundingRaised: string;
  whyDeserves: string;
  awardsRecognition: string;
  mediaFeatures: string;
  bio: string;
  companyWebsiteSocial: string;
  anythingElse: string;
  nominatorEmail: string;
  reasonForNomination: string;
  photo: File | null;
  supportingDocs: File[];
}

const INITIAL_STATE: FormState = {
  consentGiven: false,
  nominationType: "self",
  nominatorName: "",
  relationship: "",
  fullName: "",
  email: "",
  age: "",
  dateOfBirth: "",
  gender: "",
  designation: "",
  company: "",
  industry: "",
  linkedIn: "",
  instagramUrl: "",
  websiteUrl: "",
  profileUrl: "",
  personalLinks: "",
  revenueScale: "",
  companyImpact: "",
  fundingRaised: "",
  whyDeserves: "",
  awardsRecognition: "",
  mediaFeatures: "",
  bio: "",
  companyWebsiteSocial: "",
  anythingElse: "",
  nominatorEmail: "",
  reasonForNomination: "",
  photo: null,
  supportingDocs: [],
};

export default function NominatePage() {
  const [state, setState] = useState<FormState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = useCallback(
    <K extends keyof FormState>(field: K, value: FormState[K]) => {
      setState((prev) => ({ ...prev, [field]: value }));
      setSubmitError(null);
    },
    []
  );

  const buildFormData = useCallback((): FormData => {
    const fd = new FormData();
    fd.set("consentGiven", state.consentGiven ? "true" : "false");
    fd.set("nominationType", state.nominationType);
    fd.set("nominatorName", state.nominationType === "self" ? "NA" : state.nominatorName.trim());
    fd.set("relationship", state.nominationType === "self" ? "NA" : state.relationship.trim());
    fd.set("fullName", state.fullName.trim());
    fd.set("email", state.email.trim());
    if (state.age) fd.set("age", state.age);
    if (state.dateOfBirth) fd.set("dateOfBirth", state.dateOfBirth);
    if (state.gender.trim()) fd.set("gender", state.gender.trim());
    fd.set("designation", state.designation.trim());
    fd.set("company", state.company.trim());
    fd.set("industry", state.industry.trim());
    if (state.linkedIn.trim()) fd.set("linkedIn", state.linkedIn.trim());
    if (state.instagramUrl.trim()) fd.set("instagramUrl", state.instagramUrl.trim());
    if (state.websiteUrl.trim()) fd.set("websiteUrl", state.websiteUrl.trim());
    if (state.profileUrl.trim()) fd.set("profileUrl", state.profileUrl.trim());
    if (state.personalLinks.trim()) fd.set("personalLinks", state.personalLinks.trim());
    if (state.revenueScale.trim()) fd.set("revenueScale", state.revenueScale.trim());
    fd.set("companyImpact", state.companyImpact.trim());
    if (state.fundingRaised.trim()) fd.set("fundingRaised", state.fundingRaised.trim());
    fd.set("whyDeserves", state.whyDeserves.trim());
    if (state.awardsRecognition.trim()) fd.set("awardsRecognition", state.awardsRecognition.trim());
    if (state.mediaFeatures.trim()) fd.set("mediaFeatures", state.mediaFeatures.trim());
    fd.set("bio", state.bio.trim());
    if (state.companyWebsiteSocial.trim()) fd.set("companyWebsiteSocial", state.companyWebsiteSocial.trim());
    if (state.anythingElse.trim()) fd.set("anythingElse", state.anythingElse.trim());
    if (state.nominationType === "third_party") {
      fd.set("nominatorEmail", state.nominatorEmail.trim());
      if (state.reasonForNomination.trim()) fd.set("reasonForNomination", state.reasonForNomination.trim());
    }
    if (state.photo) fd.set("photo", state.photo);
    state.supportingDocs.forEach((file) => fd.append("supportingDocs", file));
    return fd;
  }, [state]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!state.consentGiven) {
        setSubmitError("You must agree to participate to submit.");
        return;
      }
      if (!state.photo) {
        setSubmitError("A high-resolution photo of the nominee is required.");
        return;
      }
      setLoading(true);
      setSubmitError(null);
      const formData = buildFormData();
      const result = await submitNominationForm(formData);
      setLoading(false);
      if (result.success) setSubmitted(true);
      else setSubmitError(result.error);
    },
    [state, buildFormData]
  );

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#131210]">
        <div className="max-w-md text-center">
          <div className="w-12 h-[1px] bg-[#C5B397] mx-auto mb-10" />
          <h1 className="font-display text-5xl md:text-6xl italic text-[#EAE6E1] mb-6">Thank you</h1>
          <p className="text-[11px] uppercase tracking-[0.2em] font-light text-[#EAE6E1]/50 leading-loose mb-12">
            Your nomination has been received. We will be in touch.
          </p>
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  const isThirdParty = state.nominationType === "third_party";

  return (
    <div className="pt-[140px] pb-16 bg-[#131210] min-h-screen">
      {/* Page header */}
      <div className="px-6 md:px-24 mx-auto max-w-4xl mb-20 md:mb-28 text-center flex flex-col items-center justify-center">
        <div className="overflow-hidden mb-2">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight uppercase">
            Submit a
          </h1>
        </div>
        <div className="overflow-hidden mb-8">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight uppercase italic text-[#C5B397]">
            Nomination
          </h1>
        </div>
        <p className="text-sm md:text-base text-[#EAE6E1]/60 font-light max-w-xl leading-relaxed">
          Nominate a leader or apply for India&apos;s 40 Under 40 2026.
        </p>
      </div>

      <div className="px-6 md:px-24 mx-auto max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Informed Consent */}
          <fieldset className="space-y-4">
            <legend className="font-display text-3xl italic text-[#EAE6E1] mb-8 block border-b border-[#EAE6E1]/5 pb-4">
              Informed Consent
            </legend>
            <p className="text-[11px] uppercase tracking-[0.15em] font-light text-[#EAE6E1]/50 leading-loose mb-6">
              Before proceeding, please confirm that you have the consent of the nominee (if
              submitting on behalf of someone else) and that the information provided is accurate.
            </p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={state.consentGiven}
                onChange={(e) => update("consentGiven", e.target.checked)}
                className="mt-1 border border-[#EAE6E1]/20 bg-transparent text-[#C5B397] focus:ring-[#C5B397] focus:ring-offset-[#131210] rounded-none accent-[#C5B397]"
              />
              <span className="text-[11px] uppercase tracking-[0.15em] font-light text-[#EAE6E1]/60">
                Do you voluntarily agree to participate in this nomination? *
              </span>
            </label>
            <div>
              <span className={LABEL_CLASS}>Nomination Type *</span>
              <div className="flex flex-wrap gap-4 mt-2">
                {NOMINATION_TYPES.map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="nominationType"
                      value={value}
                      checked={state.nominationType === value}
                      onChange={() => update("nominationType", value)}
                      className="border border-[#EAE6E1]/20 bg-transparent text-[#C5B397] focus:ring-[#C5B397] accent-[#C5B397]"
                    />
                    <span className="text-[11px] uppercase tracking-[0.15em] font-light text-[#EAE6E1]/60">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="nominatorName" className={LABEL_CLASS}>
                Provide your name if nominating someone else; otherwise enter &apos;NA&apos; *
              </label>
              <input
                id="nominatorName"
                type="text"
                value={state.nominatorName}
                onChange={(e) => update("nominatorName", e.target.value)}
                className={INPUT_CLASS}
                placeholder={isThirdParty ? "Your full name" : "NA"}
                disabled={!isThirdParty}
              />
            </div>
            <div>
              <label htmlFor="relationship" className={LABEL_CLASS}>
                Relationship with the Nominee (Enter &apos;NA&apos; if self-nominated) *
              </label>
              <input
                id="relationship"
                type="text"
                value={state.relationship}
                onChange={(e) => update("relationship", e.target.value)}
                className={INPUT_CLASS}
                placeholder={isThirdParty ? "e.g. Colleague, Manager" : "NA"}
                disabled={!isThirdParty}
              />
            </div>
          </fieldset>

          {/* Nominee details */}
          <fieldset className="space-y-4">
            <legend className="font-display text-3xl italic text-[#EAE6E1] mb-8 block border-b border-[#EAE6E1]/5 pb-4">
              Nominee Details
            </legend>
            <div>
              <label htmlFor="fullName" className={LABEL_CLASS}>Full Name of Nominee *</label>
              <input
                id="fullName"
                type="text"
                value={state.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className={INPUT_CLASS}
                placeholder="Full name"
                required
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className={LABEL_CLASS}>Age of Nominee *</label>
                <input
                  id="age"
                  type="number"
                  min={1}
                  max={39}
                  value={state.age}
                  onChange={(e) => update("age", e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="Age"
                  required
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className={LABEL_CLASS}>Date of Birth *</label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={state.dateOfBirth}
                  onChange={(e) => update("dateOfBirth", e.target.value)}
                  className={INPUT_CLASS}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="gender" className={LABEL_CLASS}>Gender *</label>
              <select
                id="gender"
                value={state.gender}
                onChange={(e) => update("gender", e.target.value)}
                className={INPUT_CLASS}
                required
              >
                <option value="">Select</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="designation" className={LABEL_CLASS}>Current Designation / Title *</label>
              <input
                id="designation"
                type="text"
                value={state.designation}
                onChange={(e) => update("designation", e.target.value)}
                className={INPUT_CLASS}
                placeholder="e.g. CEO, Founder"
                required
              />
            </div>
            <div>
              <label htmlFor="company" className={LABEL_CLASS}>Organization / Company Name *</label>
              <input
                id="company"
                type="text"
                value={state.company}
                onChange={(e) => update("company", e.target.value)}
                className={INPUT_CLASS}
                placeholder="Company name"
                required
              />
            </div>
            <div>
              <label htmlFor="industry" className={LABEL_CLASS}>Industry Category *</label>
              <input
                id="industry"
                type="text"
                value={state.industry}
                onChange={(e) => update("industry", e.target.value)}
                className={INPUT_CLASS}
                placeholder="e.g. Technology, Finance"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className={LABEL_CLASS}>Email *</label>
              <input
                id="email"
                type="email"
                value={state.email}
                onChange={(e) => update("email", e.target.value)}
                className={INPUT_CLASS}
                placeholder="nominee@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="linkedIn" className={LABEL_CLASS}>LinkedIn Profile URL *</label>
              <input
                id="linkedIn"
                type="url"
                value={state.linkedIn}
                onChange={(e) => update("linkedIn", e.target.value)}
                className={INPUT_CLASS}
                placeholder="https://linkedin.com/in/..."
                required
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="instagramUrl" className={LABEL_CLASS}>Instagram Profile URL</label>
                <input
                  id="instagramUrl"
                  type="url"
                  value={state.instagramUrl}
                  onChange={(e) => update("instagramUrl", e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label htmlFor="websiteUrl" className={LABEL_CLASS}>Website URL</label>
                <input
                  id="websiteUrl"
                  type="url"
                  value={state.websiteUrl}
                  onChange={(e) => update("websiteUrl", e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <label htmlFor="profileUrl" className={LABEL_CLASS}>Profile / Portfolio URL</label>
              <input
                id="profileUrl"
                type="url"
                value={state.profileUrl}
                onChange={(e) => update("profileUrl", e.target.value)}
                className={INPUT_CLASS}
                placeholder="https://..."
              />
            </div>
            <div>
              <label htmlFor="personalLinks" className={LABEL_CLASS}>
                Personal website, portfolio, or social media (LinkedIn, Twitter/X, Instagram, etc.)
              </label>
              <textarea
                id="personalLinks"
                value={state.personalLinks}
                onChange={(e) => update("personalLinks", e.target.value)}
                rows={2}
                className={`${INPUT_CLASS} resize-y`}
                placeholder="URLs, one per line or comma-separated"
              />
            </div>
          </fieldset>

          {/* Revenue & Impact */}
          <fieldset className="space-y-4">
            <legend className="font-display text-3xl italic text-[#EAE6E1] mb-8 block border-b border-[#EAE6E1]/5 pb-4">
              Revenue, Scale & Impact
            </legend>
            <div>
              <label htmlFor="revenueScale" className={LABEL_CLASS}>
                Approximate revenue or scale (annual revenue, company size, or market reach)
              </label>
              <input
                id="revenueScale"
                type="text"
                value={state.revenueScale}
                onChange={(e) => update("revenueScale", e.target.value)}
                className={INPUT_CLASS}
                placeholder="e.g. $1M ARR, 50 employees"
              />
            </div>
            <div>
              <label htmlFor="companyImpact" className={LABEL_CLASS}>
                Please describe the impact of the company * (customers served, industry influence, innovation, social/economic impact)
              </label>
              <textarea
                id="companyImpact"
                value={state.companyImpact}
                onChange={(e) => update("companyImpact", e.target.value)}
                rows={4}
                className={`${INPUT_CLASS} resize-y`}
                placeholder="Describe impact..."
                required
              />
            </div>
            <div>
              <label htmlFor="fundingRaised" className={LABEL_CLASS}>
                Funding Raised (if applicable)? Amount and major investors.
              </label>
              <textarea
                id="fundingRaised"
                value={state.fundingRaised}
                onChange={(e) => update("fundingRaised", e.target.value)}
                rows={2}
                className={`${INPUT_CLASS} resize-y`}
                placeholder="e.g. $2M Series A, Investor names"
              />
            </div>
          </fieldset>

          {/* Why & Recognition */}
          <fieldset className="space-y-4">
            <legend className="font-display text-3xl italic text-[#EAE6E1] mb-8 block border-b border-[#EAE6E1]/5 pb-4">
              Why This Nominee & Recognition
            </legend>
            <div>
              <label htmlFor="whyDeserves" className={LABEL_CLASS}>
                Why does this nominee deserve to be on the 40 Under 40 list? Be specific *
              </label>
              <textarea
                id="whyDeserves"
                value={state.whyDeserves}
                onChange={(e) => update("whyDeserves", e.target.value)}
                rows={5}
                className={`${INPUT_CLASS} resize-y`}
                placeholder="Be specific about impact and achievements..."
                required
              />
            </div>
            <div>
              <label htmlFor="awardsRecognition" className={LABEL_CLASS}>
                Has the nominee or their company received any awards or recognitions? If yes, list awards and year.
              </label>
              <textarea
                id="awardsRecognition"
                value={state.awardsRecognition}
                onChange={(e) => update("awardsRecognition", e.target.value)}
                rows={3}
                className={`${INPUT_CLASS} resize-y`}
                placeholder="Award name, year. Enter 'None' if not applicable."
              />
            </div>
            <div>
              <label htmlFor="mediaFeatures" className={LABEL_CLASS}>
                Has the nominee or company been featured in media? If yes, provide details or links.
              </label>
              <textarea
                id="mediaFeatures"
                value={state.mediaFeatures}
                onChange={(e) => update("mediaFeatures", e.target.value)}
                rows={3}
                className={`${INPUT_CLASS} resize-y`}
                placeholder="Publication, link. Enter 'None' if not applicable."
              />
            </div>
          </fieldset>

          {/* Photo & Bio */}
          <fieldset className="space-y-4">
            <legend className="font-display text-3xl italic text-[#EAE6E1] mb-8 block border-b border-[#EAE6E1]/5 pb-4">
              Photo & Bio
            </legend>
            <div>
              <label htmlFor="photo" className={LABEL_CLASS}>
                High-resolution photo of the nominee * (JPG or PNG, max 10 MB)
              </label>
              <input
                id="photo"
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={(e) => update("photo", e.target.files?.[0] ?? null)}
                className={`${INPUT_CLASS} file:mr-6 file:py-2 file:px-6 file:border file:border-[#EAE6E1]/20 file:bg-transparent file:text-[#EAE6E1]/60 file:text-[9px] file:uppercase file:tracking-[0.2em] file:font-medium file:rounded-none hover:file:border-[#C5B397]/40 hover:file:text-[#C5B397] file:transition-colors`}
              />
            </div>
            <div>
              <label htmlFor="bio" className={LABEL_CLASS}>
                Brief Professional Bio (100–200 words) *
              </label>
              <textarea
                id="bio"
                value={state.bio}
                onChange={(e) => update("bio", e.target.value)}
                rows={6}
                className={`${INPUT_CLASS} resize-y`}
                placeholder="Short biography of the nominee..."
                required
              />
              <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-[#EAE6E1]/25">Minimum ~20 words; 100–200 words recommended.</p>
            </div>
          </fieldset>

          {/* Supporting documents */}
          <fieldset className="space-y-4">
            <legend className="font-display text-3xl italic text-[#EAE6E1] mb-8 block border-b border-[#EAE6E1]/5 pb-4">
              Supporting Documents
            </legend>
            <p className="text-[9px] uppercase tracking-[0.15em] text-[#EAE6E1]/30 mb-4">
              Upload up to 5 files: PDF, DOC, PPT, or images. Max 100 MB per file. (Optional)
            </p>
            <div>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,image/*"
                multiple
                onChange={(e) =>
                  update("supportingDocs", e.target.files ? Array.from(e.target.files) : [])
                }
                className={`${INPUT_CLASS} file:mr-6 file:py-2 file:px-6 file:border file:border-[#EAE6E1]/20 file:bg-transparent file:text-[#EAE6E1]/60 file:text-[9px] file:uppercase file:tracking-[0.2em] file:font-medium file:rounded-none hover:file:border-[#C5B397]/40 hover:file:text-[#C5B397] file:transition-colors`}
              />
            </div>
          </fieldset>

          {/* Company website & other */}
          <fieldset className="space-y-4">
            <legend className="font-display text-3xl italic text-[#EAE6E1] mb-8 block border-b border-[#EAE6E1]/5 pb-4">
              Company & Additional Info
            </legend>
            <div>
              <label htmlFor="companyWebsiteSocial" className={LABEL_CLASS}>
                Official website and social media handles of the nominee&apos;s company (LinkedIn, Instagram, Twitter/X, YouTube, etc.)
              </label>
              <textarea
                id="companyWebsiteSocial"
                value={state.companyWebsiteSocial}
                onChange={(e) => update("companyWebsiteSocial", e.target.value)}
                rows={2}
                className={`${INPUT_CLASS} resize-y`}
                placeholder="URLs or handles"
              />
            </div>
            <div>
              <label htmlFor="anythingElse" className={LABEL_CLASS}>
                Anything else we should know?
              </label>
              <textarea
                id="anythingElse"
                value={state.anythingElse}
                onChange={(e) => update("anythingElse", e.target.value)}
                rows={3}
                className={`${INPUT_CLASS} resize-y`}
                placeholder="Optional"
              />
            </div>
          </fieldset>

          {/* Third-party: nominator email & reason */}
          {isThirdParty && (
            <fieldset className="space-y-4">
              <legend className="font-display text-3xl italic text-[#EAE6E1] mb-8 block border-b border-[#EAE6E1]/5 pb-4">
                Your Details (Nominator)
              </legend>
              <div>
                <label htmlFor="nominatorEmail" className={LABEL_CLASS}>Your email *</label>
                <input
                  id="nominatorEmail"
                  type="email"
                  value={state.nominatorEmail}
                  onChange={(e) => update("nominatorEmail", e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="you@example.com"
                  required={isThirdParty}
                />
              </div>
              <div>
                <label htmlFor="reasonForNomination" className={LABEL_CLASS}>
                  Why are you nominating them?
                </label>
                <textarea
                  id="reasonForNomination"
                  value={state.reasonForNomination}
                  onChange={(e) => update("reasonForNomination", e.target.value)}
                  rows={3}
                  className={`${INPUT_CLASS} resize-y`}
                  placeholder="Brief reason..."
                />
              </div>
            </fieldset>
          )}

          {submitError && (
            <p className="text-[10px] uppercase tracking-[0.15em] text-red-400 bg-red-400/10 px-4 py-3 border border-red-400/20">{submitError}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-5 pt-8">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? "Submitting…" : "Submit Nomination"}
            </Button>
            <a
              href="/"
              className="inline-flex items-center justify-center border border-[#EAE6E1]/20 px-12 py-5 text-[10px] uppercase tracking-[0.35em] font-medium text-[#EAE6E1]/60 hover:text-[#EAE6E1] hover:border-[#EAE6E1]/40 transition-colors duration-300 text-center"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
