import { apiClient, type ApiEnvelope } from './client';

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export type UploadedImage = {
  fileId: string;
  /** Path to send in other calls, e.g. `authorAvatarUrl`. */
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
};

/** Uploads a JPG, PNG, WebP, GIF or SVG of up to 2 MB. */
export async function uploadImage(file: File): Promise<UploadedImage> {
  const form = new FormData();
  form.append('file', file);
  form.append('name', file.name);
  const { data } = await apiClient.post<ApiEnvelope<UploadedImage>>('/public/upload/image', form);
  return data.data;
}
