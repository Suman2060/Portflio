import type { CreateProjectInput, Project } from "../types/project";
import apiClient from "./client";



export async function getProjects(): Promise<Project[]> {
  const res = await apiClient.get<Project[]>('/projects');
  return res.data;
}

export async function createProject(
    data:CreateProjectInput,
    token:string
):Promise<Project>{
    const res  = await apiClient.post('/projects',data,{
        headers: {Authorization: `Bearer ${token}`}
    });
    return res.data;

}