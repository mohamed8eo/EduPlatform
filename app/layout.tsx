import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EduPlatform - Learn Anything, Anywhere",
  description: "Discover thousands of courses from expert instructors and advance your skills",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "hsl(var(--primary))",
          colorBackground: "hsl(var(--background))",
          colorInputBackground: "hsl(var(--muted))",
          colorInputText: "hsl(var(--foreground))",
          colorText: "hsl(var(--foreground))",
          colorTextSecondary: "hsl(var(--muted-foreground))",
          colorTextOnPrimaryBackground: "hsl(var(--primary-foreground))",
          colorNeutral: "hsl(var(--muted))",
          colorInputForeground: "hsl(var(--muted-foreground))",
          borderRadius: "var(--radius)",
          fontFamily: "var(--font-sans)",
        },
        elements: {
          card: "bg-card border border-border shadow-sm",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton: "bg-background border border-border text-foreground hover:bg-accent",
          socialButtonsBlockButtonText: "text-foreground",
          formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
          formFieldInput: "bg-background border border-input text-foreground",
          formFieldLabel: "text-foreground",
          formFieldLabelRow: "text-foreground",
          footerActionLink: "text-primary hover:text-primary/80",
          dividerLine: "bg-border",
          dividerText: "text-muted-foreground",
          // User dropdown styling
          userButtonBox: "bg-background rounded-md shadow-sm hover:shadow-md transition-shadow",
          userButtonTrigger: "hover:bg-accent focus:bg-accent transition-colors",
          userButtonPopoverCard: "bg-card shadow-lg rounded-lg border border-border/50",
          userButtonPopoverActionButton: "text-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
          userButtonPopoverActionButtonText: "text-foreground",
          userButtonPopoverActionButtonIcon: "text-muted-foreground",
          userButtonPopoverFooter: "bg-muted/30",
          userButtonPopoverFooterAction: "text-muted-foreground hover:text-foreground transition-colors",
          userButtonPopoverUserPreview: "text-foreground",
          userButtonPopoverUserPreviewTextContainer: "text-foreground",
          userButtonPopoverUserPreviewMainIdentifier: "text-foreground font-medium",
          userButtonPopoverUserPreviewSecondaryIdentifier: "text-muted-foreground",
          userButtonPopoverUserPreviewImage: "rounded-full ring-2 ring-primary/20",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <LanguageProvider>
              <div className="min-h-screen bg-background">
                <Navbar />
                <main>{children}</main>
                <Toaster />
                <Footer />
              </div>
            </LanguageProvider>``
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
