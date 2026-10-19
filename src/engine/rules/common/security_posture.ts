import type { Rule } from "../../../shared/types";

export const rules: Rule[] = [
  {
    id: "security.breach_no_notification",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "security_posture",
    severity: "high",
    title_i18n: {
      en: "No breach notification commitment",
      pt: "Sem compromisso de notificação em caso de violação",
      es: "Sin compromiso de notificación ante brechas",
    },
    explanation_i18n: {
      en: "The document does not commit to notifying you in the event of a data breach, which may leave you unaware of exposure.",
      pt: "O documento não se compromete a notificá-lo em caso de violação de dados, o que pode deixá-lo sem saber sobre exposição.",
      es: "El documento no se compromete a notificarte en caso de una brecha de datos, lo que puede dejarte sin saber de la exposición.",
    },
    patterns: [
      { type: "regex", value: /no\s+(obligation|commitment|duty)\s+to\s+(notify|inform)\s+(you|users)/i },
      { type: "phrase", value: "not obligated to notify" },
      { type: "regex", value: /we\s+(cannot|do\s+not)\s+guarantee\s+(the\s+)?security/i },
    ],
    negated_by: [
      /will\s+notify\s+you\s+(of|about|regarding)\s+(any\s+)?(data\s+)?breach/i,
    ],
  },
  {
    id: "security.liability_disclaimer",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "security_posture",
    severity: "high",
    title_i18n: {
      en: "All liability for breaches disclaimed",
      pt: "Toda responsabilidade por violações é negada",
      es: "Se niega toda responsabilidad por brechas",
    },
    explanation_i18n: {
      en: "The company disclaims all responsibility for data breaches or security incidents, meaning you bear all the risk of any exposure.",
      pt: "A empresa nega toda responsabilidade por violações de dados ou incidentes de segurança, o que significa que você assume todo o risco de qualquer exposição.",
      es: "La empresa niega toda responsabilidad por brechas de datos o incidentes de seguridad, lo que significa que tú asumes todo el riesgo de cualquier exposición.",
    },
    patterns: [
      { type: "phrase", value: "not responsible for any data breach" },
      { type: "regex", value: /disclaim\s+(all\s+)?(liability|responsibility)\s+(for|in\s+connection\s+with)\s+(any\s+)?(security|data\s+breaches?|unauthorized)/i },
      { type: "phrase", value: "no liability for unauthorized access" },
    ],
  },
  {
    id: "security.storage_location_undisclosed",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "security_posture",
    severity: "medium",
    title_i18n: {
      en: "Data storage location not disclosed",
      pt: "Localização de armazenamento de dados não divulgada",
      es: "Ubicación de almacenamiento de datos no revelada",
    },
    explanation_i18n: {
      en: "The document does not specify where your data is stored, making it difficult to assess the applicable privacy protections.",
      pt: "O documento não especifica onde seus dados são armazenados, dificultando a avaliação das proteções de privacidade aplicáveis.",
      es: "El documento no especifica dónde se almacenan tus datos, lo que dificulta evaluar las protecciones de privacidad aplicables.",
    },
    patterns: [
      { type: "regex", value: /store(d)?\s+(your\s+)?(?:data|information)\s+(on\s+servers?\s+)?(located\s+)?(anywhere|globally|worldwide)/i },
      { type: "phrase", value: "may be stored anywhere in the world" },
      { type: "phrase", value: "servers located around the world" },
    ],
  },
];
