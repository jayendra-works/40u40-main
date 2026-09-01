export interface JuryMember {
  id: string;
  name: string;
  title: string;
  organization: string;
  imageUrl?: string;
}

export const JURY: JuryMember[] = [];
