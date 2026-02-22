import { SignIn } from '@clerk/nextjs'

function LoginPage() {
  return (
    <div className="z-50">
      <SignIn />
    </div>
  )
}

export default LoginPage
