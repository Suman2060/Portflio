import type { CreateProjectInput, Project } from "../types/project";
import apiClient from "./client";

export async function getProjects(): Promise<Project[]> {
  const res = await apiClient.get<Project[]>('/projects');
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
