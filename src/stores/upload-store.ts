import { create } from "zustand"
import type { Media } from "@/lib/type"

export interface UploadTask {
  id: string
  file: File
  progress: number
  status: "uploading" | "completed" | "failed"
  abortController: AbortController
  createdAt: number
  // NO `parent` here anymore
}

interface UploadStore {
  parent: string | null

  tasks: UploadTask[]
  failedTasks: UploadTask[]
  completedTasks: UploadTask[]

  addTask: (files: File[]) => void
  updateTaskProgress: (id: string, progress: number) => void
  moveToCompleted: (id: string, result: Media) => void
  moveToFailed: (id: string, error?: string) => void
  removeTask: (id: string, section: "tasks" | "failed" | "completed") => void
  retryTask: (id: string) => void
  cancelTask: (id: string) => void

  setParent: (parentId: string|null) => void
  clearParent: () => void
}

export const useUploadStore = create<UploadStore>((set) => ({
  parent: null,

  tasks: [],
  failedTasks: [],
  completedTasks: [],

  addTask: (files) => {
    const newTasks = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      progress: 0,
      status: "uploading" as const,
      abortController: new AbortController(),
      createdAt: Date.now(),
    }))

    set((state) => ({
      tasks: [...state.tasks, ...newTasks],
    }))
  },

  updateTaskProgress: (id, progress) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, progress } : task
      ),
    })),

  moveToCompleted: (id) =>
    set((state) => {
      const task = state.tasks.find((t) => t.id === id)
      if (!task) return state

      const completedTask = {
        ...task,
        status: "completed" as const,
        progress: 100,
      }

      return {
        tasks: state.tasks.filter((t) => t.id !== id),
        completedTasks: [...state.completedTasks, completedTask],
      }
    }),

  moveToFailed: (id,) =>
    set((state) => {
      const task = state.tasks.find((t) => t.id === id)
      if (!task) return state

      const failedTask = {
        ...task,
        status: "failed" as const,
      }

      return {
        tasks: state.tasks.filter((t) => t.id !== id),
        failedTasks: [...state.failedTasks, failedTask],
      }
    }),

  removeTask: (id, section) => {
    const sectionMap = {
      tasks: "tasks",
      failed: "failedTasks",
      completed: "completedTasks",
    } as const

    const actualSection = sectionMap[section]

    set((state) => ({
      [actualSection]: state[actualSection].filter((task: UploadTask) => task.id !== id),
    }))
  },

  retryTask: (id) =>
    set((state) => {
      const failedTask = state.failedTasks.find((t) => t.id === id)
      if (!failedTask) return state

      const newAbortController = new AbortController()
      const retryTask = {
        ...failedTask,
        status: "uploading" as const,
        progress: 0,
        abortController: newAbortController,
      }

      return {
        failedTasks: state.failedTasks.filter((t) => t.id !== id),
        tasks: [...state.tasks, retryTask],
      }
    }),

  cancelTask: (id) =>
    set((state) => {
      const task = state.tasks.find((t) => t.id === id)
      if (task) {
        task.abortController.abort()
      }

      return {
        tasks: state.tasks.filter((t) => t.id !== id),
      }
    }),

  setParent: (parentId) =>
    set(() => ({
      parent: parentId,
    })),

  clearParent: () =>
    set(() => ({
      parent: null,
    })),
}))
