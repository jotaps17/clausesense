import type { Rule } from "../../../shared/types";

export const rules: Rule[] = [
  {
    id: "dispute.forced_arbitration",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "dispute_resolution",
    severity: "high",
    title_i18n: {
      en: "Mandatory arbitration clause",
      pt: "Cláusula de arbitragem obrigatória",
      es: "Cláusula de arbitraje obligatorio",
    },
    explanation_i18n: {
      en: "You are required to resolve disputes through binding arbitration instead of going to court. This typically limits your legal options and remedies.",
      pt: "Você é obrigado a resolver disputas por meio de arbitragem vinculante em vez de ir a tribunal. Isso geralmente limita suas opções e recursos legais.",
      es: "Estás obligado a resolver disputas a través de arbitraje vinculante en lugar de ir a los tribunales. Esto generalmente limita tus opciones y recursos legales.",
    },
    patterns: [
      { type: "phrase", value: "binding arbitration" },
      { type: "phrase", value: "mandatory arbitration" },
      { type: "regex", value: /disputes?\s+(shall|must|will)\s+be\s+(resolved|settled)\s+(by|through|via)\s+arbitration/i },
      { type: "phrase", value: "agree to arbitrate" },
    ],
  },
  {
    id: "dispute.class_action_waiver",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "dispute_resolution",
    severity: "high",
    title_i18n: {
      en: "Class action lawsuit waiver",
      pt: "Renúncia a ações coletivas",
      es: "Renuncia a demandas colectivas",
    },
    explanation_i18n: {
      en: "You waive your right to participate in class action or collective lawsuits. All claims must be brought individually.",
      pt: "Você renuncia ao direito de participar de ações coletivas. Todos os reclamos devem ser feitos individualmente.",
      es: "Renuncias a tu derecho de participar en demandas colectivas. Todas las reclamaciones deben presentarse de forma individual.",
    },
    patterns: [
      { type: "phrase", value: "class action waiver" },
      { type: "phrase", value: "waive your right to a class action" },
      { type: "regex", value: /no\s+class[\s-]action/i },
      { type: "phrase", value: "class or collective action" },
      { type: "regex", value: /waiv(e|ing)\s+(\w+\s+)?right\s+to\s+(participate\s+in\s+(any\s+)?)?class/i },
    ],
  },
  {
    id: "dispute.unilateral_forum",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "dispute_resolution",
    severity: "medium",
    title_i18n: {
      en: "Company unilaterally selects jurisdiction",
      pt: "Empresa seleciona unilateralmente a jurisdição",
      es: "La empresa selecciona unilateralmente la jurisdicción",
    },
    explanation_i18n: {
      en: "Disputes must be litigated in a jurisdiction chosen by the company, which may be far from you and under laws less favorable to users.",
      pt: "As disputas devem ser resolvidas em uma jurisdição escolhida pela empresa, que pode ser distante de você e sob leis menos favoráveis aos usuários.",
      es: "Las disputas deben litigarse en una jurisdicción elegida por la empresa, que puede estar lejos de ti y bajo leyes menos favorables para los usuarios.",
    },
    patterns: [
      { type: "regex", value: /exclusive\s+(jurisdiction|venue)\s+(of|in)\s+the\s+(courts?\s+of|state\s+of)/i },
      { type: "phrase", value: "governing law shall be" },
      { type: "regex", value: /governed\s+by\s+the\s+laws\s+of/i },
    ],
  },
];
