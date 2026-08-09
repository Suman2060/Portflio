import apiClient from './client';
import type { Experience } from '../types/experience';

export async function getExperience(): Promise<Experience[]> {
  const res = await apiClient.get<Experience[]>('/experience');
  return res.data;
}

export async function createExperience(data: Partial<Experience>) {
  const res = await apiClient.post('/experience', data);
  return res.data;
}

export async function updateExperience(id: number, data: Partial<Experience>) {
  const res = await apiClient.put(`/experience/${id}`, data);
  return res.data;
}

export async function deleteExperience(id: number) {
  const res = await apiClient.delete(`/experience/${id}`);
  return res.data;
}
