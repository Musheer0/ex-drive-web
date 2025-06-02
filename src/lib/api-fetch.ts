import {  ZodSchema } from 'zod';

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | string;
  body?: unknown;
};

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
  schema?: ZodSchema<T> // Zod schema for response validation
): Promise<T> {
  const url = `${process.env.NEXT_PUBLIC_API}${endpoint}`;

  const fetchOptions: RequestInit = {
    method: options.method || 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Fetch error: ${res.status} ${errorText}`);
  }

  const json = await res.json();

  if (schema) {
    const result = schema.safeParse(json);
    if (!result.success) {
      console.error('Zod validation failed:', result.error.format());
      throw new Error('Response validation failed');
    }
    return result.data;
  }

  return json as T;
}
