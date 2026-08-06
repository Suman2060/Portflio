export interface Project {
  id: number;
  title: string;
  slug: string;
  shortDescription: string | null;
  fullDescription: string | null;
  techStack: string[];
  coverImageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Shape used when creating a project — id/timestamps are server-generated
export interface CreateProjectInput {
  title: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  techStack?: string[];
  coverImageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  isFeatured?: boolean;
  displayOrder?: number;
}