import type { Rule } from "../../../shared/types";

export const rules: Rule[] = [
  {
    id: "us.rights.no_deletion",
    version: "0.1.0",
    jurisdiction: ["US"],
    category: "user_rights",
    severity: "high",
    title_i18n: {
      en: "No right to delete your data (CCPA/CPRA)",
      pt: "Sem direito de excluir seus dados (CCPA/CPRA)",
      es: "Sin derecho a eliminar tus datos (CCPA/CPRA)",
    },
    explanation_i18n: {
      en: "Under California law (CCPA/CPRA), you have the right to request deletion of your personal information. This clause may limit or deny that right.",
      pt: "De acordo com a lei da Califórnia (CCPA/CPRA), você tem o direito de solicitar a exclusão de suas informações pessoais. Esta cláusula pode limitar ou negar esse direito.",
      es: "Según la ley de California (CCPA/CPRA), tienes derecho a solicitar la eliminación de tu información personal. Esta cláusula puede limitar o negar ese derecho.",
    },
    patterns: [
      { type: "regex", value: /we\s+(are\s+not\s+required|may\s+decline)\s+to\s+(honor|fulfill|process)\s+(deletion|erasure)\s+requests?/i },
      { type: "phrase", value: "we may retain data despite a deletion request" },
      { type: "regex", value: /not\s+able\s+to\s+(fully\s+)?delete\s+(all|your)/i },
    ],
  },
  {
    id: "us.rights.fees_for_access",
    version: "0.1.0",
    jurisdiction: ["US"],
    category: "user_rights",
    severity: "high",
    title_i18n: {
      en: "Fees charged for rights requests",
      pt: "Taxas cobradas por solicitações de direitos",
      es: "Se cobran tarifas por solicitudes de derechos",
    },
    explanation_i18n: {
      en: "The document reserves the right to charge fees for processing data access, correction, or deletion requests, which can deter you from exercising your rights.",
      pt: "O documento reserva o direito de cobrar taxas pelo processamento de solicitações de acesso, correção ou exclusão de dados, o que pode desmotivar o exercício de seus direitos.",
      es: "El documento se reserva el derecho de cobrar tarifas por procesar solicitudes de acceso, corrección o eliminación de datos, lo que puede disuadirte de ejercer tus derechos.",
    },
    patterns: [
      { type: "regex", value: /may\s+charge\s+(a\s+)?(reasonable\s+)?fee\s+for\s+(data\s+)?(access|portability|deletion)\s+requests?/i },
      { type: "phrase", value: "administrative fee for rights requests" },
    ],
  },
  {
    id: "us.rights.do_not_sell",
    version: "0.1.0",
    jurisdiction: ["US"],
    category: "user_rights",
    severity: "medium",
    title_i18n: {
      en: "Opt-out of data sale required (CCPA)",
      pt: "Necessidade de opt-out para venda de dados (CCPA)",
      es: "Se requiere opt-out para la venta de datos (CCPA)",
    },
    explanation_i18n: {
      en: "Your data is shared or sold to third parties by default. Under CCPA, California residents must actively opt out via a 'Do Not Sell or Share My Personal Information' link.",
      pt: "Seus dados são compartilhados ou vendidos a terceiros por padrão. Sob o CCPA, residentes da Califórnia devem optar ativamente por não participar.",
      es: "Tus datos se comparten o venden a terceros por defecto. Bajo CCPA, los residentes de California deben optar activamente por no participar.",
    },
    patterns: [
      { type: "phrase", value: "Do Not Sell or Share My Personal Information" },
      { type: "phrase", value: "opt out of the sale" },
      { type: "regex", value: /california\s+residents?.{0,100}opt[\s-]out/i },
    ],
  },
];
