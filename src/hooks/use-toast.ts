"use client"

import { toast as sonnerToast } from "sonner"

type ToastType = "success" | "error" | "info" | "warning" | "default"

interface ToastOptions {
  title: string
  description?: string
  type?: ToastType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function useToast() {
  const toast = ({
    title,
    description,
    type = "default",
    duration = 3000,
    action,
  }: ToastOptions) => {
    const config = {
      description,
      duration,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    }

    switch (type) {
      case "success":
        sonnerToast.success(title, config)
        break
      case "error":
        sonnerToast.error(title, config)
        break
      case "info":
        sonnerToast.info(title, config)
        break
      case "warning":
        sonnerToast.warning(title, config)
        break
      default:
        sonnerToast(title, config)
        break
    }
  }

  const dismiss = sonnerToast.dismiss

  return { toast, dismiss }
}
