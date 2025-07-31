"use client"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function LanguageToggle() {
  const { language, setLanguage, isRTL } = useLanguage()

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ar" : "en"
    setLanguage(newLanguage)
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage} className="flex items-center space-x-2">
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">{language === "en" ? "العربية" : "English"}</span>
    </Button>
  )
}
