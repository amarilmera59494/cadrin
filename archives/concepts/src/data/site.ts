export const site = {
  name: 'AU PORTÉ',
  signature: 'Bien choisir. Bien porter.',
  candidateDomain: 'cadrin.com',
  publicOrigin: null as string | null,
  socials: [] as { label: string; url: string }[],
  prototype: true,
  verifiedOn: '2026-11-12',
};
export const directions = [
  { id: 'revue', number: '01', name: 'REVUE', idea: 'L’objet devient sujet.', description: 'Une couverture expressive, des marges vivantes, le plaisir de prendre le temps.', keywords: 'Papier · Typographie · Culture' },
  { id: 'mesure', number: '02', name: 'MESURE', idea: 'À quelques millimètres près.', description: 'Des repères concrets pour trouver sa montre. La précision sans l’intimidation.', keywords: 'Clarté · Proportions · Choix' },
  { id: 'allure', number: '03', name: 'ALLURE', idea: 'La montre, dans la vie.', description: 'Une revue à porter. Des silhouettes, des matières et une autre façon de choisir.', keywords: 'Photographie · Style · Usages' },
] as const;
export type Direction = typeof directions[number]['id'];
