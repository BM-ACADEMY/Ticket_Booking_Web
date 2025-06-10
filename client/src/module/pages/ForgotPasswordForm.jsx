import { useState } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "react-toastify"
const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin-and-subAdmin/forgot-password`, { email },{
        withCredentials: true // Ensure cookies are sent with the request
      })
      toast.success("Password reset link sent to your email!")
      console.log("Response from forgot password:", res)
      setStatus("Email sent! Check your inbox.")
    } catch (err) {
      toast.error("Failed to send reset link. Please check your email.")
      console.error(err)
      setStatus("User not found or error sending email.")
    }
  }

  return (
  <div className="flex min-h-screen items-center justify-center p-4">
    <Card className="w-full max-w-md shadow-lg">
      <CardContent className="p-6 space-y-4">
        {/* Note Section */}
        <div className="bg-gray-100 rounded-md p-4 text-left">
          <h3 className="text-base font-bold text-black">Forgot email or password?</h3>
          <p className="text-sm text-gray-500 mt-1">
            To change your password, first enter your email. If it exists, you’ll be able to reset your password — or create a new account if needed.
          </p>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold">Forgot Password</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Enter your email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>

        {/* Status Message */}
        {status && <p className="text-sm text-center text-muted-foreground">{status}</p>}
      </CardContent>
    </Card>
  </div>
);

}

export default ForgotPasswordForm
