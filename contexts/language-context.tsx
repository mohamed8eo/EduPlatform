"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ar"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.courses": "Courses",
    "nav.myCourses": "My Courses",
    "nav.bookmarks": "Bookmarks",
    "nav.contact": "Contact",
    "nav.dashboard": "Dashboard",
    "nav.becomeCreator": "Become Creator",
    "nav.signIn": "Sign In",
    "nav.signUp": "Sign Up",
    "nav.backToSite": "Back to Site",

    // Course Details
    "course.students": "students",
    "course.duration": "Duration",
    "course.rating": "Rating",
    "course.reviews": "reviews",
    "course.enrollNow": "Enroll Now",
    "course.continuelearning": "Continue Learning",
    "course.previewCourse": "Preview Course",
    "course.whatYouWillLearn": "What you'll learn",
    "course.requirements": "Requirements",
    "course.courseFeatures": "Course Features",
    "course.curriculum": "Course Curriculum",
    "course.instructor": "Instructor",
    "course.overview": "Overview",
    "course.certificate": "Certificate",
    "course.analytics": "Analytics",
    "course.lifetimeAccess": "Lifetime access",
    "course.mobileAccess": "Mobile and desktop access",
    "course.moneyBackGuarantee": "30-day money-back guarantee",

    // Reviews
    "reviews.title": "Student Reviews",
    "reviews.writeReview": "Write a Review",
    "reviews.yourRating": "Your Rating",
    "reviews.yourReview": "Your Review",
    "reviews.submitReview": "Submit Review",
    "reviews.helpful": "Helpful",
    "reviews.report": "Report",
    "reviews.courseRating": "Course Rating",
    "reviews.totalReviews": "Total Reviews",
    "reviews.shareExperience": "Share your experience with this course...",
    "reviews.newestFirst": "Newest First",
    "reviews.oldestFirst": "Oldest First",
    "reviews.highestRating": "Highest Rating",
    "reviews.lowestRating": "Lowest Rating",
    "reviews.mostHelpful": "Most Helpful",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.view": "View",
    "common.share": "Share",
    "common.download": "Download",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.courses": "الدورات",
    "nav.myCourses": "دوراتي",
    "nav.bookmarks": "المفضلة",
    "nav.contact": "اتصل بنا",
    "nav.dashboard": "لوحة التحكم",
    "nav.becomeCreator": "كن منشئ محتوى",
    "nav.signIn": "تسجيل الدخول",
    "nav.signUp": "إنشاء حساب",
    "nav.backToSite": "العودة للموقع",

    // Course Details
    "course.students": "طالب",
    "course.duration": "المدة",
    "course.rating": "التقييم",
    "course.reviews": "مراجعة",
    "course.enrollNow": "اشترك الآن",
    "course.continuelearning": "متابعة التعلم",
    "course.previewCourse": "معاينة الدورة",
    "course.whatYouWillLearn": "ما ستتعلمه",
    "course.requirements": "المتطلبات",
    "course.courseFeatures": "مميزات الدورة",
    "course.curriculum": "منهج الدورة",
    "course.instructor": "المدرب",
    "course.overview": "نظرة عامة",
    "course.certificate": "الشهادة",
    "course.analytics": "التحليلات",
    "course.lifetimeAccess": "وصول مدى الحياة",
    "course.mobileAccess": "وصول من الجوال والكمبيوتر",
    "course.moneyBackGuarantee": "ضمان استرداد المال لمدة 30 يوم",

    // Reviews
    "reviews.title": "تقييمات الطلاب",
    "reviews.writeReview": "اكتب تقييم",
    "reviews.yourRating": "تقييمك",
    "reviews.yourReview": "مراجعتك",
    "reviews.submitReview": "إرسال التقييم",
    "reviews.helpful": "مفيد",
    "reviews.report": "إبلاغ",
    "reviews.courseRating": "تقييم الدورة",
    "reviews.totalReviews": "إجمالي التقييمات",
    "reviews.shareExperience": "شارك تجربتك مع هذه الدورة...",
    "reviews.newestFirst": "الأحدث أولاً",
    "reviews.oldestFirst": "الأقدم أولاً",
    "reviews.highestRating": "أعلى تقييم",
    "reviews.lowestRating": "أقل تقييم",
    "reviews.mostHelpful": "الأكثر فائدة",

    // Common
    "common.loading": "جاري التحميل...",
    "common.error": "خطأ",
    "common.success": "نجح",
    "common.cancel": "إلغاء",
    "common.save": "حفظ",
    "common.edit": "تعديل",
    "common.delete": "حذف",
    "common.view": "عرض",
    "common.share": "مشاركة",
    "common.download": "تحميل",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Save language to localStorage and update document direction
    localStorage.setItem("language", language)
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = language
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  const isRTL = language === "ar"

  return <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
