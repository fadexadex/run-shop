import { CheckCircle } from "lucide-react"

interface FormSuccessProps {
  message?: string | null
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null

  return (
    <div className="bg-green-50 text-green-500 p-3 rounded mb-4 text-sm flex items-start gap-2">
      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}

