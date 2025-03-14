import { AlertTriangle } from "lucide-react"

interface FormErrorProps {
  message?: string | null
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null

  return (
    <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm flex items-start gap-2">
      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}

