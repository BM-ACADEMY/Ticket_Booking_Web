import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import logo1 from "@/assets/images/logo1.jpg"

const LoginForm = ({ className, ...props }) => {
  return (
    <div
      className={cn("flex min-h-screen items-center justify-center p-4", className)}
      {...props}
    >
      <Card className="w-full max-w-5xl shadow-lg overflow-hidden">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 p-0">
          {/* Left - Login Form */}
          <div className="flex items-center justify-center p-6 md:p-12">
            <form className="w-full max-w-md space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-sm">
                  Login to your  account
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              {/* <div className="relative text-center text-sm">
                <div className="absolute inset-0 top-1/2 border-t" />
                <span className="relative bg-white px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" type="button" className="w-full">
                  <span className="sr-only">Login with Apple</span>
                  🍎
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  <span className="sr-only">Login with Google</span>
                  🔍
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  <span className="sr-only">Login with Meta</span>
                  📘
                </Button>
              </div> */}
              {/* <div className="text-center text-sm">
                Don’t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div> */}
            </form>
          </div>

          {/* Right - Logo/Image */}
          <div className="bg-black brightness-50 hidden md:flex items-center justify-center">
            <div className="flex flex-col items-center justify-center p-4 shrink-0">
              <img
                src={logo1}
                alt="Logo"
                className="w-40 h-40 object-contain mb-4"
              />
              <p className="text-muted-foreground text-center text-sm">
                Welcome to Acme Admin Panel
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
