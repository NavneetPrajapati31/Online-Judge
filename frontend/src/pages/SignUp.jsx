"use client";

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Code2, Github, Mail, Check, X } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { authAPI } from "@/utils/api";
import { AuthContext } from "@/components/auth-context";
import ProfileCompletionModal from "@/components/profile-completion-modal";

const GITHUB_OAUTH_URL = `${import.meta.env.VITE_API_URL}/api/auth/github`;
const GOOGLE_OAUTH_URL = `${import.meta.env.VITE_API_URL}/api/auth/google`;

const handleGithubOAuth = () => {
  window.location.href = GITHUB_OAUTH_URL;
};

const handleGoogleOAuth = () => {
  window.location.href = GOOGLE_OAUTH_URL;
};

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileToken, setProfileToken] = useState("");
  const [profileFormData, setProfileFormData] = useState({
    fullName: "",
    username: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Password validation
    if (name === "password") {
      setPasswordValidation({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isPasswordValid) {
      setError("Password does not meet requirements.");
      return;
    }
    if (!doPasswordsMatch) {
      setError("Passwords do not match.");
      return;
    }
    const userData = {
      email: formData.email,
      password: formData.password,
    };
    try {
      const result = await authAPI.signup(userData);
      if (result.token) {
        await login(result.token);
        if (result.user && result.user.profileComplete === false) {
          setProfileToken(result.token);
          setProfileFormData({
            fullName: "",
            username: result.user.username || "",
          });
          setShowProfileModal(true);
        } else {
          navigate("/problems");
        }
      } else {
        setError("Signup succeeded but no token received.");
      }
    } catch (err) {
      setError(err.message || "Registration failed.");
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/complete-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileToken}`,
          },
          body: JSON.stringify({
            fullName: profileFormData.fullName,
            username: profileFormData.username,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Profile completion failed");
      await login(data.token);
      setShowProfileModal(false);
      navigate("/problems");
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const doPasswordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword !== "";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8">
        {/* Logo and Header */}
        {/* <div className="text-center">
          <p className="text-xl font-bold text-foreground">
            Join our community
          </p>
          <p className="!text-md text-muted-foreground mt-2">
            Create your coding account today
          </p>
        </div> */}

        <Card className="bg-card border-border">
          <CardHeader className="space-y-1 border-border">
            <CardTitle className="text-xl text-center text-foreground">
              Create account
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social Login Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="bg-card border-border text-foreground"
                onClick={handleGithubOAuth}
                type="button"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button
                variant="outline"
                className="bg-card border-border text-foreground"
                onClick={handleGoogleOAuth}
                type="button"
              >
                <FaGoogle className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-destructive text-sm mb-2" role="alert">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Password Requirements */}
                {formData.password && (
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      {passwordValidation.length ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <X className="h-3 w-3 text-destructive" />
                      )}
                      <span
                        className={
                          passwordValidation.length
                            ? "text-emerald-500"
                            : "text-destructive"
                        }
                      >
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {passwordValidation.uppercase ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <X className="h-3 w-3 text-destructive" />
                      )}
                      <span
                        className={
                          passwordValidation.uppercase
                            ? "text-emerald-500"
                            : "text-destructive"
                        }
                      >
                        One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {passwordValidation.lowercase ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <X className="h-3 w-3 text-destructive" />
                      )}
                      <span
                        className={
                          passwordValidation.lowercase
                            ? "text-emerald-500"
                            : "text-destructive"
                        }
                      >
                        One lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {passwordValidation.number ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <X className="h-3 w-3 text-destructive" />
                      )}
                      <span
                        className={
                          passwordValidation.number
                            ? "text-emerald-500"
                            : "text-destructive"
                        }
                      >
                        One number
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {passwordValidation.special ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <X className="h-3 w-3 text-destructive" />
                      )}
                      <span
                        className={
                          passwordValidation.special
                            ? "text-emerald-500"
                            : "text-destructive"
                        }
                      >
                        One special character
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">
                  Confirm password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword && (
                  <div className="flex items-center space-x-2 text-xs">
                    {doPasswordsMatch ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <X className="h-3 w-3 text-destructive" />
                    )}
                    <span
                      className={
                        doPasswordsMatch
                          ? "text-emerald-500"
                          : "text-destructive"
                      }
                    >
                      Passwords match
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="rounded border-border bg-muted text-primary focus:ring-primary"
                  required
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-primary hover:text-primary/80 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-primary hover:text-primary/80 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-foreground"
                disabled={!isPasswordValid || !doPasswordsMatch}
              >
                Create account
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-primary hover:text-primary/80 hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="hover:text-primary underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="hover:text-primary underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
      <ProfileCompletionModal
        open={showProfileModal}
        onSubmit={handleProfileSubmit}
        formData={profileFormData}
        onChange={handleProfileInputChange}
        loading={profileLoading}
        error={profileError}
      />
    </div>
  );
}
