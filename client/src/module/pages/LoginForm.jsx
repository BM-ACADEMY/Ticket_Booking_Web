import { useState } from "react"
import axios from "axios"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import logo1 from "@/assets/images/logo1.jpg"
import { useAuth } from "../context/AuthContext"
import { useNavigate ,Link} from "react-router-dom"
import { toast } from "react-toastify"

const LoginForm = ({ className, ...props }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/admin-and-subAdmin/login`,
      { emailOrPhone, password },
      { withCredentials: true } // ⬅️ necessary for cookie
    );
    toast.success("Login successful!");
     login(response.data.admin) // set context state
    console.log("Login successful:", response.data);
    navigate("/");
  } catch (error) {
    toast.error("Login failed. Please check your credentials.");
    console.error("Login failed:", error.response?.data || error.message);
  }
};

  return (
    <div
      className={cn("flex min-h-screen items-center justify-center p-4", className)}
      {...props}
    >
  
      <Card className="w-full max-w-5xl shadow-lg overflow-hidden">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 p-0">
          {/* Left - Login Form */}
          <div className="flex items-center justify-center p-6 md:p-12">
            <form className="w-full max-w-md space-y-6" onSubmit={handleSubmit}>
              <div className="text-center">
                <h1 className="text-2xl font-bold">Welcome back pegasus</h1>
                <p className="text-muted-foreground text-sm">
                  Login to your account
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailOrPhone">Email or Phone Number</Label>
                <Input
                  id="emailOrPhone"
                  type="text"
                  placeholder="m@example.com or 34567890"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                Login
              </Button>
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
