import type { Rule } from "../../../shared/types";

export const rules: Rule[] = [
  {
    id: "collection.precise_geolocation",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "data_collection",
    severity: "high",
    title_i18n: {
      en: "Precise geolocation collected",
      pt: "Geolocalização precisa coletada",
      es: "Recopilación de geolocalización precisa",
    },
    explanation_i18n: {
      en: "The document states it may collect your precise location, which can reveal sensitive details about where you live, work, or travel.",
      pt: "O documento indica que pode coletar sua localização precisa, o que pode revelar detalhes sensíveis sobre onde você vive, trabalha ou viaja.",
      es: "El documento indica que puede recopilar tu ubicación precisa, lo que puede revelar detalles sensibles sobre dónde vives, trabajas o viajas.",
    },
    patterns: [
      { type: "phrase", value: "precise geolocation" },
      { type: "phrase", value: "precise location" },
      { type: "regex", value: /collect\s+(your\s+)?(?:gps|location)\s+data/i },
      { type: "phrase", value: "real-time location" },
    ],
  },
  {
    id: "collection.biometrics",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "data_collection",
    severity: "critical",
    title_i18n: {
      en: "Biometric data collected",
      pt: "Dados biométricos coletados",
      es: "Recopilación de datos biométricos",
    },
    explanation_i18n: {
      en: "The document indicates collection of biometric identifiers such as fingerprints, facial recognition data, or voiceprints.",
      pt: "O documento indica a coleta de identificadores biométricos como impressões digitais, dados de reconhecimento facial ou reconhecimento de voz.",
      es: "El documento indica la recopilación de identificadores biométricos como huellas dactilares, datos de reconocimiento facial o de voz.",
    },
    patterns: [
      { type: "regex", value: /biometric\s+(data|identifiers?|information)/i },
      { type: "phrase", value: "facial recognition" },
      { type: "phrase", value: "fingerprint" },
      { type: "phrase", value: "voiceprint" },
      { type: "phrase", value: "retinal scan" },
    ],
  },
  {
    id: "collection.device_fingerprinting",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "data_collection",
    severity: "medium",
    title_i18n: {
      en: "Device fingerprinting used",
      pt: "Fingerprinting de dispositivo utilizado",
      es: "Uso de huella digital del dispositivo",
    },
    explanation_i18n: {
      en: "The service collects technical identifiers to uniquely identify your device across sessions and sites.",
      pt: "O serviço coleta identificadores técnicos para identificar exclusivamente seu dispositivo entre sessões e sites.",
      es: "El servicio recopila identificadores técnicos para identificar tu dispositivo de forma única entre sesiones y sitios.",
    },
    patterns: [
      { type: "phrase", value: "device fingerprint" },
      { type: "phrase", value: "browser fingerprint" },
      { type: "regex", value: /uniquely\s+identif(y|ying)\s+(your\s+)?device/i },
      { type: "phrase", value: "device identifier" },
    ],
  },
  {
    id: "collection.inferred_data",
    version: "0.1.0",
    jurisdiction: ["US", "EU", "BR"],
    category: "data_collection",
    severity: "medium",
    title_i18n: {
      en: "Inferences drawn about you",
      pt: "Inferências feitas sobre você",
      es: "Se hacen inferencias sobre ti",
    },
    explanation_i18n: {
      en: "The service may create profiles or inferences about your characteristics, preferences, or behavior beyond the data you directly provide.",
      pt: "O serviço pode criar perfis ou inferências sobre suas características, preferências ou comportamento além dos dados que você fornece diretamente.",
      es: "El servicio puede crear perfiles o inferencias sobre tus características, preferencias o comportamiento más allá de los datos que proporcionas directamente.",
    },
    patterns: [
      { type: "regex", value: /infer(ences?)?\s+(about|regarding)\s+(you|your)/i },
      { type: "phrase", value: "derived data" },
      { type: "phrase", value: "inferred information" },
      { type: "phrase", value: "predictive data" },
    ],
  },
];
