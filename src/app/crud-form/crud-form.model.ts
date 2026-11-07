export const contexts = ['Life', 'University', 'Games', 'BaxEnergy', 'Tricentis'] as const;
export type Context = (typeof contexts)[number];
