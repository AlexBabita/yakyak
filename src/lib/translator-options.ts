/**
 * Options for the YakYak translator: roles (team speak) and languages (optional).
 * From/To can be any team role, agent, bot, or audience (e.g. customer, stakeholder).
 */

export const ROLES = [
  { value: "developer", label: "Developer" },
  { value: "project-manager", label: "Project Manager" },
  { value: "qa", label: "QA" },
  { value: "designer", label: "Designer" },
  { value: "agent", label: "Agent" },
  { value: "bot", label: "Bot" },
  { value: "customer", label: "Customer" },
  { value: "stakeholder", label: "Stakeholder" },
  { value: "finance-team", label: "Finance Team" },
  { value: "legal", label: "Legal" },
  { value: "support", label: "Support" },
  { value: "marketing", label: "Marketing" },
  { value: "executive", label: "Executive" },
] as const;

export type RoleValue = (typeof ROLES)[number]["value"];

export const LANGUAGES = [
  { value: "", label: "No translation" },
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese (Mandarin)" },
  { value: "uk", label: "Ukrainian" },
  { value: "be", label: "Belarusian" },
  { value: "hi", label: "Hindi" },
  { value: "ru", label: "Russian" },
  { value: "ar", label: "Arabic" },
  { value: "ko", label: "Korean" },
  { value: "tr", label: "Turkish" },
  { value: "pl", label: "Polish" },
  { value: "nl", label: "Dutch" },
  { value: "vi", label: "Vietnamese" },
  { value: "th", label: "Thai" },
  { value: "id", label: "Indonesian" },
] as const;

export type LanguageValue = (typeof LANGUAGES)[number]["value"];

/** Sentinel for "No translation" in Radix Select (Select.Item cannot have value=""). */
export const LANGUAGE_SELECT_NONE = "__none__" as const;

/** Value for "Auto-detect" in the From language selector (default). */
export const LANGUAGE_SELECT_AUTO = "__auto__" as const;
