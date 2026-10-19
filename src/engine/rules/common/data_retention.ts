import type { Rule } from "../../../shared/types";

export const rules: Rule[] = [
  {
    id: "retention.indefinite",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "data_retention",
    severity: "high",
    title_i18n: {
      en: "Indefinite data retention",
      pt: "Retenção de dados por tempo indefinido",
      es: "Retención indefinida de datos",
    },
    explanation_i18n: {
      en: "The document does not specify any limit on how long your data will be kept, meaning it could be retained forever.",
      pt: "O documento não especifica qualquer limite para o tempo de retenção dos seus dados, o que significa que podem ser mantidos indefinidamente.",
      es: "El documento no especifica ningún límite sobre cuánto tiempo se conservarán tus datos, lo que significa que podrían retenerse indefinidamente.",
    },
    patterns: [
      { type: "phrase", value: "retain indefinitely" },
      { type: "regex", value: /retain.{0,40}indefinitely/i },
      { type: "phrase", value: "as long as necessary" },
      { type: "regex", value: /retain\s+(your\s+)?data\s+(for\s+)?as\s+long\s+as/i },
      { type: "phrase", value: "until no longer needed" },
    ],
    negated_by: [
      /retain\s+(for\s+)?(up\s+to\s+)?\d+\s+(days?|months?|years?)/i,
    ],
  },
  {
    id: "retention.post_deletion",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "data_retention",
    severity: "high",
    title_i18n: {
      en: "Data retained after account deletion",
      pt: "Dados retidos após exclusão da conta",
      es: "Datos retenidos tras eliminar la cuenta",
    },
    explanation_i18n: {
      en: "Your data may be kept even after you delete your account.",
      pt: "Seus dados podem ser mantidos mesmo após você excluir sua conta.",
      es: "Tus datos pueden conservarse incluso después de eliminar tu cuenta.",
    },
    patterns: [
      { type: "regex", value: /retain\s+(certain\s+)?(?:data|information)\s+(even\s+)?after\s+(you\s+)?(close|delete|terminate)/i },
      { type: "phrase", value: "retain after account closure" },
      { type: "regex", value: /may\s+keep\s+(copies\s+of\s+)?(your\s+)?(?:data|information)\s+after/i },
    ],
  },
  {
    id: "retention.law_required_no_cap",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "data_retention",
    severity: "medium",
    title_i18n: {
      en: "Retention period is 'as required by law' with no specific cap",
      pt: "Período de retenção 'conforme exigido por lei' sem prazo específico",
      es: "Período de retención 'según lo exigido por la ley' sin límite específico",
    },
    explanation_i18n: {
      en: "Data is retained 'as required by law' without specifying a time limit, which is often used as a blanket justification.",
      pt: "Os dados são retidos 'conforme exigido por lei' sem especificar um prazo, o que frequentemente é usado como justificativa genérica.",
      es: "Los datos se conservan 'según lo exigido por la ley' sin especificar un límite de tiempo, lo que a menudo se usa como justificación general.",
    },
    patterns: [
      { type: "regex", value: /as\s+(long\s+as\s+)?required\s+by\s+(applicable\s+)?law/i },
      { type: "phrase", value: "required by applicable law" },
      { type: "phrase", value: "legal obligations require us to retain" },
    ],
  },
];
