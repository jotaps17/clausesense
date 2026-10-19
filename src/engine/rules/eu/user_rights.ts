import type { Rule } from "../../../shared/types";

export const rules: Rule[] = [
  {
    id: "eu.rights.no_erasure",
    version: "0.1.0",
    jurisdiction: ["EU"],
    category: "user_rights",
    severity: "high",
    title_i18n: {
      en: "Right to erasure (GDPR Art. 17) may be restricted",
      pt: "Direito ao apagamento (GDPR Art. 17) pode ser restringido",
      es: "El derecho al borrado (GDPR Art. 17) puede estar restringido",
    },
    explanation_i18n: {
      en: "Under GDPR Article 17, you have the right to have your personal data erased. This clause may restrict that right without valid legal basis.",
      pt: "De acordo com o Artigo 17 do GDPR, você tem o direito de ter seus dados pessoais apagados. Esta cláusula pode restringir esse direito sem base legal válida.",
      es: "Según el Artículo 17 del GDPR, tienes derecho a que tus datos personales sean borrados. Esta cláusula puede restringir ese derecho sin base legal válida.",
    },
    patterns: [
      { type: "regex", value: /we\s+(may\s+)?retain\s+(certain\s+)?data\s+(despite|notwithstanding)\s+(your\s+)?(erasure|deletion)\s+request/i },
      { type: "phrase", value: "right to erasure does not apply" },
    ],
  },
  {
    id: "eu.rights.no_portability",
    version: "0.1.0",
    jurisdiction: ["EU"],
    category: "user_rights",
    severity: "medium",
    title_i18n: {
      en: "Data portability right not mentioned (GDPR Art. 20)",
      pt: "Direito à portabilidade não mencionado (GDPR Art. 20)",
      es: "Derecho a la portabilidad no mencionado (GDPR Art. 20)",
    },
    explanation_i18n: {
      en: "GDPR Article 20 grants you the right to receive your personal data in a structured, machine-readable format and transfer it to another controller.",
      pt: "O Artigo 20 do GDPR garante o direito de receber seus dados pessoais em formato estruturado e legível por máquina e transferi-los para outro controlador.",
      es: "El Artículo 20 del GDPR te otorga el derecho de recibir tus datos personales en un formato estructurado y legible por máquina y transferirlos a otro responsable.",
    },
    patterns: [
      { type: "phrase", value: "data portability" },
      { type: "phrase", value: "right to portability" },
    ],
    negated_by: [
      /you\s+(have\s+the\s+right|may\s+request)\s+(to\s+)?receiv(e|ing)\s+(your\s+)?(personal\s+)?data\s+in\s+a\s+(machine[\s-]readable|portable)/i,
    ],
  },
  {
    id: "eu.rights.no_dpo",
    version: "0.1.0",
    jurisdiction: ["EU"],
    category: "user_rights",
    severity: "medium",
    title_i18n: {
      en: "No Data Protection Officer (DPO) contact provided",
      pt: "Nenhum contato do Encarregado de Proteção de Dados (DPO) fornecido",
      es: "No se proporciona contacto del Delegado de Protección de Datos (DPO)",
    },
    explanation_i18n: {
      en: "Certain organizations under GDPR must appoint a Data Protection Officer (DPO) and make their contact details available. This document does not mention one.",
      pt: "Certas organizações sob o GDPR devem nomear um Encarregado de Proteção de Dados (DPO) e disponibilizar seus dados de contato. Este documento não menciona um.",
      es: "Ciertas organizaciones bajo GDPR deben nombrar un Delegado de Protección de Datos (DPO) y poner a disposición sus datos de contacto. Este documento no menciona ninguno.",
    },
    patterns: [
      { type: "phrase", value: "data protection officer" },
      { type: "phrase", value: "DPO" },
    ],
    negated_by: [
      /data\s+protection\s+officer.{0,200}contact/i,
      /contact\s+(our|the)\s+(dpo|data\s+protection\s+officer)/i,
    ],
  },
];
