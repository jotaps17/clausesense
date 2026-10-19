import type { Rule } from "../../../shared/types";

export const rules: Rule[] = [
  {
    id: "dark.hard_opt_out",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "dark_patterns",
    severity: "medium",
    title_i18n: {
      en: "Opt-out process is difficult or unclear",
      pt: "Processo de cancelamento é difícil ou pouco claro",
      es: "El proceso de opt-out es difícil o poco claro",
    },
    explanation_i18n: {
      en: "The document describes a complex or inconvenient opt-out process, making it harder to withdraw consent than to give it.",
      pt: "O documento descreve um processo de cancelamento complexo ou inconveniente, tornando mais difícil retirar o consentimento do que concedê-lo.",
      es: "El documento describe un proceso de opt-out complejo o inconveniente, lo que hace más difícil retirar el consentimiento que darlo.",
    },
    patterns: [
      { type: "phrase", value: "to opt out, contact us in writing" },
      { type: "regex", value: /opt[\s-]out\s+(by\s+)?(mail(ing)?|send(ing)?\s+a\s+(written\s+)?letter)/i },
      { type: "regex", value: /opt[\s-]out\s+(process\s+)?may\s+take\s+(up\s+to\s+)?\d+\s+(business\s+)?days/i },
    ],
  },
  {
    id: "dark.confirmshaming",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "dark_patterns",
    severity: "low",
    title_i18n: {
      en: "Confirmshaming language detected",
      pt: "Linguagem de confirmshaming detectada",
      es: "Lenguaje de confirmshaming detectado",
    },
    explanation_i18n: {
      en: "The document uses guilt-inducing language for the opt-out option to discourage users from declining.",
      pt: "O documento usa linguagem que induz culpa na opção de recusa para desencorajar usuários de recusar.",
      es: "El documento usa lenguaje que induce culpa en la opción de rechazo para disuadir a los usuarios de declinar.",
    },
    patterns: [
      { type: "phrase", value: "no, I don't want to save money" },
      { type: "phrase", value: "no, I prefer to pay more" },
      { type: "regex", value: /no,?\s+i\s+(don't|do\s+not)\s+(want|need|care\s+about)/i },
    ],
  },
];
