import type { Rule } from "../../../shared/types";

export const rules: Rule[] = [
  {
    id: "sharing.third_parties_unspecified",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "data_sharing",
    severity: "high",
    title_i18n: {
      en: "Data shared with unspecified third parties",
      pt: "Dados compartilhados com terceiros não especificados",
      es: "Datos compartidos con terceros no especificados",
    },
    explanation_i18n: {
      en: "The document allows sharing your personal data with third parties without clearly identifying who they are.",
      pt: "O documento permite o compartilhamento de seus dados pessoais com terceiros sem identificá-los claramente.",
      es: "El documento permite compartir tus datos personales con terceros sin identificarlos claramente.",
    },
    patterns: [
      { type: "regex", value: /shar(e|ed|ing)\s+(your\s+)?(personal\s+)?data\s+with\s+(third|3rd)\s+part/i },
      { type: "phrase", value: "affiliates and partners" },
      { type: "phrase", value: "service providers and partners" },
    ],
    negated_by: [
      /we\s+do\s+not\s+(sell|share)\s+(your\s+)?personal/i,
      /we\s+never\s+sell\s+(your\s+)?data/i,
    ],
  },
  {
    id: "sharing.data_sale",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "data_sharing",
    severity: "critical",
    title_i18n: {
      en: "Personal data may be sold",
      pt: "Dados pessoais podem ser vendidos",
      es: "Los datos personales pueden ser vendidos",
    },
    explanation_i18n: {
      en: "The document explicitly reserves the right to sell your personal data to third parties.",
      pt: "O documento reserva explicitamente o direito de vender seus dados pessoais a terceiros.",
      es: "El documento se reserva explícitamente el derecho de vender tus datos personales a terceros.",
    },
    patterns: [
      { type: "regex", value: /sell\s+(\w+\s+)?(personal\s+)?(?:data|information)/i },
      { type: "regex", value: /sale\s+of\s+(\w+\s+)?(?:personal\s+)?(?:data|information)/i },
      { type: "regex", value: /right\s+to\s+sell\s+\w+\s+data/i },
      { type: "phrase", value: "monetize your data" },
    ],
    negated_by: [
      /we\s+do\s+not\s+sell\s+(your\s+)?personal/i,
      /we\s+will\s+never\s+sell/i,
    ],
  },
  {
    id: "sharing.ad_tech",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "data_sharing",
    severity: "high",
    title_i18n: {
      en: "Data shared with advertising networks",
      pt: "Dados compartilhados com redes de publicidade",
      es: "Datos compartidos con redes publicitarias",
    },
    explanation_i18n: {
      en: "Your data may be shared with advertising partners or used for targeted advertising purposes.",
      pt: "Seus dados podem ser compartilhados com parceiros de publicidade ou usados para publicidade direcionada.",
      es: "Tus datos pueden ser compartilhados con socios publicitarios o usados para publicidad dirigida.",
    },
    patterns: [
      { type: "regex", value: /advertising\s+(partners|networks|companies)/i },
      { type: "phrase", value: "targeted advertising" },
      { type: "phrase", value: "interest-based advertising" },
      { type: "phrase", value: "behavioral advertising" },
      { type: "regex", value: /ad\s+tech\s+partners/i },
    ],
  },
];
