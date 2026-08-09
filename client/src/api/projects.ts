import type { CreateProjectInput, Project } from "../types/project";
import apiClient from "./client";

export async function getProjects(): Promise<Project[]> {
  const res = await apiClient.get<Project[]>('/projects');
  return res.data;
}

export async function getProjectBySlug(slug: string): Promise<Project> {
  const res = await apiClient.get<Project>(`/projects/${slug}`);
  return res.data;
}

export async function createProject(
  data: CreateProjectInput,
  token?: string
): Promise<Project> {
  const config = token ? { headers: { Authorization: 'Bearer ' + token } } : undefined;
  const res = await apiClient.post('/projects', data, config);
  return res.data;
}

export async function updateProject(id: number, data: Partial<CreateProjectInput>): Promise<Project> {
  const res = await apiClient.put<Project>(`/projects/${id}`, data);
  return res.data;
}

export async function deleteProject(id: number): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}
