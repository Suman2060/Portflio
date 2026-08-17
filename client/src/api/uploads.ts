import apiClient from './client';

export async function uploadFile(file: File): Promise<{ url: string; filename: string }> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await apiClient.post('/uploads', fd);
  return res.data;
}
