import type { Rule } from "../../../shared/types";

export const rules: Rule[] = [
  {
    id: "eu.cross_border.no_adequacy",
    version: "0.1.0",
    jurisdiction: ["EU"],
    category: "cross_border",
    severity: "high",
    title_i18n: {
      en: "Data transferred outside EEA without adequate protection",
      pt: "Dados transferidos fora do EEE sem proteção adequada",
      es: "Datos transferidos fuera del EEE sin protección adecuada",
    },
    explanation_i18n: {
      en: "Your data may be transferred to countries that the EU has not deemed to provide adequate privacy protections, and no alternative safeguards (like SCCs) are mentioned.",
      pt: "Seus dados podem ser transferidos para países que a UE não considera que fornecem proteções de privacidade adequadas, e nenhuma salvaguarda alternativa (como SCCs) é mencionada.",
      es: "Tus datos pueden ser transferidos a países que la UE no considera que proporcionan protecciones de privacidad adecuadas, y no se mencionan salvaguardas alternativas (como SCCs).",
    },
    patterns: [
      { type: "regex", value: /transfer\s+(your\s+)?(personal\s+)?data\s+(to|outside)\s+(countries?|jurisdictions?)\s+(that\s+)?(may\s+not|do\s+not)\s+provide/i },
      { type: "phrase", value: "countries without adequate protection" },
      { type: "regex", value: /international\s+data\s+transfer.{0,200}(may\s+not|without)\s+(the\s+)?(same|equivalent)\s+(level\s+of\s+)?protect/i },
    ],
    negated_by: [
      /standard\s+contractual\s+clauses/i,
      /SCCs/,
      /adequacy\s+decision/i,
      /binding\s+corporate\s+rules/i,
    ],
  },
  {
    id: "eu.cross_border.us_transfer",
    version: "0.1.0",
    jurisdiction: ["EU"],
    category: "cross_border",
    severity: "medium",
    title_i18n: {
      en: "Data transferred to the United States",
      pt: "Dados transferidos para os Estados Unidos",
      es: "Datos transferidos a los Estados Unidos",
    },
    explanation_i18n: {
      en: "Your data is transferred to the United States. Ensure Standard Contractual Clauses (SCCs) or another mechanism applies.",
      pt: "Seus dados são transferidos para os Estados Unidos. Certifique-se de que as Cláusulas Contratuais Padrão (SCCs) ou outro mecanismo se aplica.",
      es: "Tus datos se transfieren a los Estados Unidos. Asegúrate de que las Cláusulas Contractuales Estándar (SCCs) u otro mecanismo sea aplicable.",
    },
    patterns: [
      { type: "regex", value: /transfer\s+(your\s+)?(personal\s+)?data\s+to\s+(the\s+)?united\s+states/i },
      { type: "regex", value: /servers?\s+(located\s+)?(in|within)\s+(the\s+)?united\s+states/i },
      { type: "phrase", value: "processed in the United States" },
    ],
  },
];
