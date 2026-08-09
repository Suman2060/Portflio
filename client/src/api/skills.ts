import apiClient from './client';
import type { Skill } from '../types/skill';

export async function getSkills(): Promise<Skill[]> {
  const res = await apiClient.get<Skill[]>('/skills');
  return res.data;
}

export async function createSkill(data: Partial<Skill>) {
  const res = await apiClient.post('/skills', data);
  return res.data;
}
