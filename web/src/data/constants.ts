export const COUNTIES = [
  "Apache", "Cochise", "Coconino", "Gila", "Graham",
  "Greenlee", "La Paz", "Maricopa", "Mohave", "Navajo",
  "Pima", "Pinal", "Santa Cruz", "Yavapai", "Yuma",
] as const;

export type County = (typeof COUNTIES)[number];

export const AGE_BANDS = [
  { id: "10-12" as const, label: "10–12" },
  { id: "13-15" as const, label: "13–15" },
  { id: "16-17" as const, label: "16–17" },
  { id: "18-21" as const, label: "18–21" },
];

export const CRISIS_PINS = [
  {
    name: "988 Suicide & Crisis Lifeline",
    how: "Call or text 988",
    how_es: "Llama o envía mensaje al 988",
    url: "https://988lifeline.org/",
  },
  {
    name: "Crisis Text Line",
    how: "Text HOME to 741741",
    how_es: "Envía HOME al 741741",
    url: "https://www.crisistextline.org/",
  },
  {
    name: "AZ DCS Child Abuse Hotline",
    how: "1-888-SOS-CHILD",
    how_es: "1-888-SOS-CHILD",
    url: "https://dcs.az.gov/about/contact",
  },
  {
    name: "ALWAYS (legal help)",
    how: "Youth legal services (AZ)",
    how_es: "Servicios legales para jóvenes (AZ)",
    url: "https://alwaysaz.org/",
  },
] as const;
