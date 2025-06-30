import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://51.20.181.155:3000";

const LoginForm = () => {
  const { user, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // await login(email, password, rememberMe);
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (!credentialResponse.credential) return;
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/google`,
        { token: credentialResponse.credential },
        { headers: { "Content-Type": "application/json" } }
      );
      const { token: appToken } = res.data;
      await login(null, null);
      // await login(null, null, rememberMe, appToken);
      navigate("/");
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  const handleGoogleError = () => {
    console.error("Google Sign In Failure");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Welcome Back
          </h1>
          {/* <p className="text-muted-foreground">Sign in with Work Email</p> */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(c) => setRememberMe(c as boolean)}
              />
              <Label htmlFor="remember" className="text-sm cursor-pointer">
                Remember me
              </Label>
            </div>
            <button type="button" className="text-sm text-primary">
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-primary text-primary-foreground"
          >
            Sign In
          </Button>
        </form>

        <p className="mt-3 text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <button className="text-primary font-medium">Sign up</button>
        </p>

        <div className="my-3 flex w-full items-center">
          <span className="flex-grow border-t border-gray-200" />
          <span className="px-3 text-gray-400">OR</span>
          <span className="flex-grow border-t border-gray-200" />
        </div>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          width="100%"
        />
      </div>
    </div>
  );
};

export default LoginForm;
