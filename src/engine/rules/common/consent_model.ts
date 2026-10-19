import type { Rule } from "../../../shared/types";

export const rules: Rule[] = [
  {
    id: "consent.bundled_acceptance",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "consent_model",
    severity: "medium",
    title_i18n: {
      en: "Consent bundled with service acceptance",
      pt: "Consentimento vinculado à aceitação do serviço",
      es: "Consentimiento vinculado a la aceptación del servicio",
    },
    explanation_i18n: {
      en: "By accepting the terms of the service, you are automatically giving consent for data processing. You cannot use the service without consenting.",
      pt: "Ao aceitar os termos do serviço, você automaticamente consente com o processamento de dados. Você não pode usar o serviço sem consentir.",
      es: "Al aceptar los términos del servicio, automáticamente das tu consentimiento para el procesamiento de datos. No puedes usar el servicio sin consentir.",
    },
    patterns: [
      { type: "phrase", value: "by accepting these terms you consent" },
      { type: "regex", value: /by\s+(using|accessing|registering)\s+(the\s+)?service.{0,60}you\s+(agree|consent)/i },
      { type: "phrase", value: "your consent is a condition of service" },
    ],
  },
  {
    id: "consent.continued_use",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "consent_model",
    severity: "medium",
    title_i18n: {
      en: "Continued use deemed as consent",
      pt: "Uso continuado considerado como consentimento",
      es: "El uso continuado se considera consentimiento",
    },
    explanation_i18n: {
      en: "The document treats your continued use of the service as implicit consent to its terms and any changes made to them.",
      pt: "O documento trata o uso continuado do serviço como consentimento implícito aos seus termos e quaisquer alterações.",
      es: "El documento trata el uso continuado del servicio como consentimiento implícito a sus términos y cualquier cambio en ellos.",
    },
    patterns: [
      { type: "regex", value: /continued\s+use\s+(of\s+(the\s+)?service)?.{0,60}(constitutes?|deemed|means)\s+(your\s+)?consent/i },
      { type: "phrase", value: "continued use constitutes acceptance" },
      { type: "phrase", value: "continuing to use the service means you agree" },
    ],
  },
  {
    id: "consent.pre_ticked",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "consent_model",
    severity: "medium",
    title_i18n: {
      en: "Pre-selected consent options",
      pt: "Opções de consentimento pré-selecionadas",
      es: "Opciones de consentimiento preseleccionadas",
    },
    explanation_i18n: {
      en: "Certain consent checkboxes or options may be pre-ticked by default, making it easy to accidentally agree.",
      pt: "Certas caixas de seleção ou opções de consentimento podem estar pré-marcadas por padrão, tornando fácil concordar acidentalmente.",
      es: "Ciertas casillas de verificación u opciones de consentimiento pueden estar preseleccionadas por defecto, lo que facilita acordar accidentalmente.",
    },
    patterns: [
      { type: "phrase", value: "pre-checked" },
      { type: "phrase", value: "pre-selected" },
      { type: "phrase", value: "opted in by default" },
      { type: "regex", value: /default(ly)?\s+(opt(ed)?[\s-]in|checked|selected)/i },
    ],
  },
];
