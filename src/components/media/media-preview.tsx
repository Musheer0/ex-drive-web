import { Media } from '@/lib/type';
import React, { useEffect, useState } from 'react';


const isVideo = (name: string) => /\.(mp4|webm|ogg)$/i.test(name);
const isImage = (name: string) => /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(name);

const getPreviewUrl = (file: Media): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API;
  if (!baseUrl) return '';

  const id = file.public_id.replace(/\.[^/.]+$/, '');
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  if (isVideo(ext)) return `${baseUrl}/v1/media/display/${id}.mp4`;
  if (isImage(ext)) return `${baseUrl}/v1/media/display/${id}.${ext}`;

  return `${baseUrl}/v1/media/display/${id}`;
};

const loadMediaBlobUrl = async (file: Media): Promise<string | null> => {
  const url = getPreviewUrl(file);

  try {
    const response = await fetch(url, {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Preview load failed');

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Failed to load blob preview:', err);
    return null;
  }
};

const MediaPreview = ({ file }: { file: Media }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    loadMediaBlobUrl(file).then(url => {
      if (mounted) setBlobUrl(url);
    });

    return () => {
      mounted = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [file]);

  if (!blobUrl) return <p>Loading media...</p>;

  if (isImage(file.name)) {
    return <img src={blobUrl} alt="media" className="rounded-xl shadow" />;
  }

  if (isVideo(file.name)) {
    return <video src={blobUrl} controls className="rounded-xl shadow" />;
  }

  return null
};

export default MediaPreview;
