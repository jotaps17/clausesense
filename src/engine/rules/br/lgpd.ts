import type { Rule } from "../../../shared/types";

export const rules: Rule[] = [
  {
    id: "br.lgpd.no_titular_rights",
    version: "0.1.0",
    jurisdiction: ["BR"],
    category: "user_rights",
    severity: "high",
    title_i18n: {
      en: "Rights of data subjects under LGPD not addressed",
      pt: "Direitos do titular de dados previstos na LGPD não tratados",
      es: "Derechos de los titulares de datos bajo la LGPD no contemplados",
    },
    explanation_i18n: {
      en: "Brazil's LGPD (Lei 13.709/2018) grants data subjects rights including access, correction, deletion, and portability. This document does not clearly describe how to exercise these rights.",
      pt: "A LGPD (Lei 13.709/2018) garante ao titular direitos como acesso, correção, exclusão e portabilidade de dados. Este documento não descreve claramente como exercer esses direitos.",
      es: "La LGPD de Brasil (Lei 13.709/2018) otorga a los titulares derechos que incluyen acceso, corrección, eliminación y portabilidad. Este documento no describe claramente cómo ejercer estos derechos.",
    },
    patterns: [
      { type: "phrase", value: "titular dos dados" },
      { type: "phrase", value: "direitos do titular" },
      { type: "regex", value: /LGPD/i },
    ],
    negated_by: [
      /direitos?.{0,100}titular/i,
      /acesso.{0,100}(dados|informações)/i,
    ],
  },
  {
    id: "br.lgpd.no_encarregado",
    version: "0.1.0",
    jurisdiction: ["BR"],
    category: "user_rights",
    severity: "medium",
    title_i18n: {
      en: "No DPO (Encarregado) contact under LGPD",
      pt: "Sem contato do Encarregado de Dados (LGPD)",
      es: "Sin contacto del Encarregado (DPO) bajo la LGPD",
    },
    explanation_i18n: {
      en: "Under Brazil's LGPD, organizations must designate a Data Protection Officer (Encarregado) and publish their contact information. This document does not provide this information.",
      pt: "De acordo com a LGPD brasileira, as organizações devem designar um Encarregado pelo tratamento de dados pessoais e publicar seus dados de contato.",
      es: "Según la LGPD de Brasil, las organizaciones deben designar un Encarregado de protección de datos y publicar su información de contacto.",
    },
    patterns: [
      { type: "regex", value: /encarregad[oa]/i },
    ],
    negated_by: [
      /encarregad[oa].{0,200}(contato|e[\s-]?mail|email)/i,
      /contato.{0,200}encarregad[oa]/i,
    ],
  },
  {
    id: "br.lgpd.consent_specific",
    version: "0.1.0",
    jurisdiction: ["BR"],
    category: "consent_model",
    severity: "high",
    title_i18n: {
      en: "Consent not specific or informed under LGPD",
      pt: "Consentimento não é específico ou informado conforme a LGPD",
      es: "El consentimiento no es específico ni informado según la LGPD",
    },
    explanation_i18n: {
      en: "Brazil's LGPD requires consent to be free, informed, unambiguous, and specific for a given purpose. Generic or blanket consent does not comply.",
      pt: "A LGPD exige que o consentimento seja livre, informado, inequívoco e para uma finalidade determinada. Consentimento genérico ou abrangente não está em conformidade.",
      es: "La LGPD de Brasil exige que el consentimiento sea libre, informado, inequívoco y para una finalidad específica. El consentimiento genérico o global no cumple con esto.",
    },
    patterns: [
      { type: "regex", value: /consentimento.{0,200}(finalidades?|propósitos?|usos?)/i },
      { type: "phrase", value: "consentimento para todas as finalidades" },
      { type: "regex", value: /uso\s+dos\s+dados.{0,200}consentimento/i },
    ],
    negated_by: [
      /consentimento\s+(específico|granular)/i,
      /finalidade\s+específica/i,
    ],
  },
];
