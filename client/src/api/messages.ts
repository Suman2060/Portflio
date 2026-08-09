import apiClient from './client';
import type { Message } from '../types/message';

export async function getMessages(): Promise<Message[]> {
  const res = await apiClient.get<Message[]>('/messages');
  return res.data;
}

export async function markMessageRead(id: number) {
  const res = await apiClient.put(`/messages/${id}/read`);
  return res.data;
}
