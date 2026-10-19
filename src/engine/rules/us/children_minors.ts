import type { Rule } from "../../../shared/types";

export const rules: Rule[] = [
  {
    id: "us.children.coppa_missing",
    version: "0.1.0",
    jurisdiction: ["US"],
    category: "children_minors",
    severity: "critical",
    title_i18n: {
      en: "Missing COPPA protections for children",
      pt: "Proteções COPPA ausentes para crianças",
      es: "Faltan protecciones COPPA para niños",
    },
    explanation_i18n: {
      en: "The document does not address COPPA (Children's Online Privacy Protection Act) compliance for users under 13, which is required for US-directed services.",
      pt: "O documento não aborda a conformidade com COPPA (Lei de Proteção à Privacidade Online de Crianças) para usuários com menos de 13 anos.",
      es: "El documento no aborda el cumplimiento de COPPA (Ley de Protección de Privacidad Infantil en Línea) para usuarios menores de 13 años.",
    },
    patterns: [
      { type: "regex", value: /not\s+(designed|intended|directed)\s+(at\s+|for\s+)?children\s+(under|younger\s+than)\s+13/i },
      { type: "phrase", value: "we do not knowingly collect data from children" },
    ],
    negated_by: [
      /COPPA/i,
      /parental\s+consent/i,
    ],
  },
  {
    id: "us.children.no_age_gate",
    version: "0.1.0",
    jurisdiction: ["US"],
    category: "children_minors",
    severity: "high",
    title_i18n: {
      en: "No age verification mechanism described",
      pt: "Nenhum mecanismo de verificação de idade descrito",
      es: "No se describe mecanismo de verificación de edad",
    },
    explanation_i18n: {
      en: "The document does not mention any age verification or age-gating mechanism to prevent minors from accessing services that require age restrictions.",
      pt: "O documento não menciona nenhum mecanismo de verificação de idade para impedir que menores acessem serviços que exigem restrições de idade.",
      es: "El documento no menciona ningún mecanismo de verificación de edad para evitar que menores accedan a servicios que requieren restricciones de edad.",
    },
    patterns: [
      { type: "regex", value: /you\s+(must\s+be|represent\s+that\s+you\s+are)\s+(at\s+least\s+)?(13|18)\s+years/i },
    ],
    negated_by: [
      /age\s+verification/i,
      /we\s+verify\s+age/i,
    ],
  },
];
