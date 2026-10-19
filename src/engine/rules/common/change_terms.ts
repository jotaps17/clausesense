import type { Rule } from "../../../shared/types";

export const rules: Rule[] = [
  {
    id: "change.unilateral_amendment",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "change_terms",
    severity: "medium",
    title_i18n: {
      en: "Terms can be changed without notice",
      pt: "Termos podem ser alterados sem aviso",
      es: "Los términos pueden cambiar sin previo aviso",
    },
    explanation_i18n: {
      en: "The company reserves the right to change these terms at any time without notifying you in advance.",
      pt: "A empresa reserva o direito de alterar estes termos a qualquer momento sem notificá-lo antecipadamente.",
      es: "La empresa se reserva el derecho de cambiar estos términos en cualquier momento sin notificarte con anticipación.",
    },
    patterns: [
      { type: "regex", value: /we\s+(may|reserve\s+the\s+right\s+to)\s+(modify|change|update|amend)\s+(these\s+)?(terms|policy)\s+(at\s+any\s+time|without\s+notice)/i },
      { type: "regex", value: /(terms|policy)\s+may\s+be\s+(modified|changed|updated|amended)\s+(at\s+any\s+time|without\s+notice)/i },
      { type: "phrase", value: "modify these terms at any time" },
      { type: "phrase", value: "change this policy without notice" },
    ],
    negated_by: [
      /will\s+notify\s+you/i,
      /we\s+will\s+(provide|give|send)\s+(you\s+)?(advance\s+|prior\s+)?notice/i,
    ],
  },
  {
    id: "change.continued_use_acceptance",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "change_terms",
    severity: "medium",
    title_i18n: {
      en: "Using the service after changes means acceptance",
      pt: "Usar o serviço após alterações significa aceitação",
      es: "Usar el servicio tras los cambios significa aceptación",
    },
    explanation_i18n: {
      en: "Continuing to use the service after terms are changed automatically means you accept the new terms, even without explicit confirmation.",
      pt: "Continuar usando o serviço após a alteração dos termos significa automaticamente que você aceita os novos termos, mesmo sem confirmação explícita.",
      es: "Continuar usando el servicio después de que cambien los términos significa automáticamente que aceptas los nuevos términos, incluso sin confirmación explícita.",
    },
    patterns: [
      { type: "regex", value: /continued\s+use.{0,80}(constitutes?|means|indicates?)\s+(your\s+)?(acceptance|agreement)/i },
      { type: "phrase", value: "your continued use of our service after" },
    ],
  },
];
