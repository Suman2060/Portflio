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
  isPublished: boolean;
  githubId?: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  source?: 'cms' | 'github';
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
  isPublished?: boolean;
  displayOrder?: number;
}