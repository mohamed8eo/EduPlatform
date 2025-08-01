"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import LanguageToggle from "@/components/language-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BookOpen, LayoutDashboard, Menu, Bookmark, GraduationCap, Home, Phone, User, Plus } from "lucide-react"
import { gsap } from "gsap"
import { useLanguage } from "@/contexts/language-context"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { checkUserCreatorStatus } from "@/lib/action/instractor"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isCreator, setIsCreator] = useState(false)
  const pathname = usePathname()
  const { t, isRTL } = useLanguage()
  const { isSignedIn, user } = useUser()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    gsap.fromTo(".navbar", { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" })
  }, [])

  useEffect(() => {
    const checkCreatorStatus = async () => {
      // Check if user is signed in
      if (isSignedIn && user) {
        try {
          const result = await checkUserCreatorStatus()
          console.log('Navbar creator status check:', result)
          if (result.success) {
            setIsCreator(result.isCreator)
            console.log('User is creator:', result.isCreator)
          } else {
            // Fallback to localStorage check
            const userRole = localStorage.getItem("userRole")
            const fallbackIsCreator = userRole === "creator" || user.publicMetadata?.role === "CREATOR"
            setIsCreator(fallbackIsCreator)
            console.log('Fallback creator check:', fallbackIsCreator)
          }
        } catch (error) {
          console.error('Error checking creator status:', error)
          // Fallback to localStorage check
          const userRole = localStorage.getItem("userRole")
          const fallbackIsCreator = userRole === "creator" || user.publicMetadata?.role === "CREATOR"
          setIsCreator(fallbackIsCreator)
          console.log('Error fallback creator check:', fallbackIsCreator)
        }
      } else {
        setIsCreator(false)
      }
    }

    checkCreatorStatus()
  }, [isSignedIn, user])

  const navItems = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/courses", label: t("nav.courses"), icon: BookOpen },
    { href: "/my-courses", label: t("nav.myCourses"), icon: GraduationCap },
    { href: "/bookmarks", label: t("nav.bookmarks"), icon: Bookmark },
    { href: "/contact", label: t("nav.contact"), icon: Phone },
  ]

  const dashboardItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
    { href: "/dashboard/students", label: "Students", icon: User },
    { href: "/dashboard/analytics", label: "Analytics", icon: LayoutDashboard },
    { href: "/dashboard/earnings", label: "Earnings", icon: LayoutDashboard },
  ]

  const isDashboard = pathname.startsWith("/dashboard")
  const currentItems = isDashboard ? dashboardItems : navItems

  const isActiveLink = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    if (href.startsWith("/dashboard/")) {
      return pathname.startsWith(href)
    }
    return pathname === href
  }

  return (
    <nav
      className={`navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg border-border"
          : "bg-background/80 backdrop-blur-sm border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center h-16 ${isRTL ? "flex-row-reverse" : ""}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              EduPlatform
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className={`hidden lg:flex items-center space-x-1 ${isRTL ? "space-x-reverse" : ""}`}>
            {currentItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground ${
                  isActiveLink(item.href)
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Creator/Dashboard Toggle */}
            {!isDashboard ? (
              isCreator ? (
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className={`ml-2 ${isRTL ? "ml-0 mr-2" : ""}`}>
                    <LayoutDashboard className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                    {t("nav.dashboard")}
                  </Button>
                </Link>
              ) : (
                <Link href="/become-creator">
                  <Button variant="ghost" size="sm" className={`ml-2 ${isRTL ? "ml-0 mr-2" : ""}`}>
                    <Plus className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                    {t("nav.becomeCreator")}
                  </Button>
                </Link>
              )
            ) : (
              <Link href="/">
                <Button variant="ghost" size="sm" className={`ml-2 ${isRTL ? "ml-0 mr-2" : ""}`}>
                  <Home className={`h-4 w-4 ${isRTL ? "ml-2 mr-0" : "mr-2"}`} />
                  {t("nav.backToSite")}
                </Button>
              </Link>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className={`hidden lg:flex items-center space-x-2 ${isRTL ? "space-x-reverse" : ""}`}>
            <LanguageToggle />
            <ModeToggle />
            {isSignedIn ? (
              <UserButton />
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    {t("Signin")}
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="shadow-sm">
                    {t("Signup")}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className={`lg:hidden flex items-center space-x-2 ${isRTL ? "space-x-reverse" : ""}`}>
            <LanguageToggle />
            <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? "left" : "right"} className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-6 border-b">
                    <Link
                      href="/"
                      className={`flex items-center space-x-2 ${isRTL ? "space-x-reverse" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <BookOpen className="h-6 w-6 text-primary" />
                      <span className="text-lg font-bold">EduPlatform</span>
                    </Link>
                  </div>

                  {/* Navigation Items */}
                  <div className="flex-1 overflow-y-auto py-4">
                    <div className="px-4 space-y-1">
                      {currentItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isRTL ? "space-x-reverse" : ""
                            } ${
                              isActiveLink(item.href)
                                ? "bg-accent text-accent-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </Link>
                        )
                      })}
                    </div>

                    {/* Divider */}
                    <div className="my-4 px-4">
                      <div className="h-px bg-border" />
                    </div>

                    {/* Creator/Dashboard Toggle */}
                    <div className="px-4">
                      {!isDashboard ? (
                        isCreator ? (
                          <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                            <Button
                              variant="ghost"
                              className={`w-full justify-start ${isRTL ? "flex-row-reverse" : ""}`}
                            >
                              <LayoutDashboard className={`h-5 w-5 ${isRTL ? "ml-3 mr-0" : "mr-3"}`} />
                              {t("nav.dashboard")}
                            </Button>
                          </Link>
                        ) : (
                          <Link href="/become-creator" onClick={() => setIsOpen(false)}>
                            <Button
                              variant="ghost"
                              className={`w-full justify-start ${isRTL ? "flex-row-reverse" : ""}`}
                            >
                              <Plus className={`h-5 w-5 ${isRTL ? "ml-3 mr-0" : "mr-3"}`} />
                              {t("nav.becomeCreator")}
                            </Button>
                          </Link>
                        )
                      ) : (
                        <Link href="/" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className={`w-full justify-start ${isRTL ? "flex-row-reverse" : ""}`}>
                            <Home className={`h-5 w-5 ${isRTL ? "ml-3 mr-0" : "mr-3"}`} />
                            {t("nav.backToSite")}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 border-t space-y-2">
                    {isSignedIn ? (
                      <div className="flex justify-center">
                        <UserButton />
                      </div>
                    ) : (
                      <>
                        <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full">
                            {t("nav.signIn")}
                          </Button>
                        </Link>
                        <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                          <Button className="w-full">{t("nav.signUp")}</Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
