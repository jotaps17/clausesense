import type { Rule } from "../../../shared/types";

export const rules: Rule[] = [
  {
    id: "eu.profiling.automated_decisions",
    version: "0.1.0",
    jurisdiction: ["EU"],
    category: "profiling_automation",
    severity: "high",
    title_i18n: {
      en: "Automated decision-making with legal effects (GDPR Art. 22)",
      pt: "Decisões automatizadas com efeitos jurídicos (GDPR Art. 22)",
      es: "Toma de decisiones automatizada con efectos jurídicos (GDPR Art. 22)",
    },
    explanation_i18n: {
      en: "Decisions that significantly affect you may be made solely by automated means, including profiling, without human review. GDPR Article 22 gives you the right to object.",
      pt: "Decisões que afetam significativamente você podem ser tomadas exclusivamente por meios automatizados, incluindo criação de perfis, sem revisão humana.",
      es: "Las decisiones que te afectan significativamente pueden tomarse únicamente por medios automatizados, incluida la creación de perfiles, sin revisión humana.",
    },
    patterns: [
      { type: "phrase", value: "automated decision-making" },
      { type: "phrase", value: "solely automated processing" },
      { type: "regex", value: /automated.{0,60}(decision|profiling).{0,60}(legal|significant)\s+effects?/i },
      { type: "phrase", value: "algorithmic decision" },
    ],
    negated_by: [
      /right\s+to\s+(object\s+to\s+|request\s+human)\s*(review|intervention|oversight)/i,
    ],
  },
  {
    id: "eu.profiling.no_opt_out",
    version: "0.1.0",
    jurisdiction: ["EU"],
    category: "profiling_automation",
    severity: "high",
    title_i18n: {
      en: "Profiling without opt-out",
      pt: "Criação de perfil sem opt-out",
      es: "Creación de perfiles sin opt-out",
    },
    explanation_i18n: {
      en: "The service profiles you for purposes such as targeted advertising or content personalization, but does not provide a clear way to opt out.",
      pt: "O serviço cria perfis sobre você para fins como publicidade direcionada ou personalização de conteúdo, mas não fornece uma maneira clara de optar por não participar.",
      es: "El servicio crea perfiles sobre ti con fines como publicidad dirigida o personalización de contenido, pero no proporciona una forma clara de optar por no participar.",
    },
    patterns: [
      { type: "regex", value: /profil(e|ing)\s+(you|your\s+(behavior|activity|interests?))/i },
      { type: "phrase", value: "build a profile about you" },
      { type: "phrase", value: "user profiling" },
    ],
    negated_by: [
      /opt[\s-]out\s+of\s+profil/i,
      /right\s+to\s+object\s+to\s+profil/i,
    ],
  },
];
