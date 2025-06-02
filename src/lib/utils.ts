/* eslint-disable @typescript-eslint/no-explicit-any */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import z from 'zod'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toDexieSchemaFromZod(schema: z.ZodObject<any>, autoId = true): string {
  const keys = Object.keys(schema.shape).filter(k => k !== 'id');
  const idPrefix = autoId ? '++id' : 'id';
  return [idPrefix, ...keys].join(', ');
}
export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
