export interface IProject {
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  liveUrl?: string;
  repoUrl?: string;
  features?: string[];
  ownerId: number;
}
