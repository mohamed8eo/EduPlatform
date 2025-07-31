import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="max-w-md w-full mx-4">
            <SignUp />
          </div>
      </div>
  )} 