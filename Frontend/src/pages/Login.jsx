import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import tvAnim from "@/assets/Animation_black_gold";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const location = useLocation();
  console.log("🚀 Login Page - location.state:", location.state);
  console.log("📍 Redirect to:", location.state?.from?.pathname || "/home");

  const navigate = useNavigate();
  const { login } = useAuth(); // from AuthContext

  const defaultTab = location.state?.tab || "login";

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  // OTP-related states
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // ✅ Login handler
  const handleLogin = async () => {
    try {
      setLoginError("");

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      const userWithToken = { ...data.user, token: data.token };
      login(userWithToken);

      const from = location.state?.from?.pathname || "/home";
      navigate(from, { replace: true });
    } catch (err) {
      setLoginError(err.message);
    }
  };

  //Register Handler

  const handleRegister = async () => {
    try {
      setRegisterError("");

      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      const userWithToken = { ...data.user, token: data.token };
      login(userWithToken);

      const from = location.state?.from?.pathname || "/home";
      navigate(from, { replace: true });
    } catch (err) {
      setRegisterError(err.message);
    }
  };

  // Send OTP function
  const handleSendOTP = async () => {
    if (!registerData.email) {
      setOtpMessage("Please enter a valid email.");
      return;
    }
    setIsSendingOtp(true);
    setOtpMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registerData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      setOtpSent(true);
      setOtpMessage("OTP sent to your email.");
    } catch (err) {
      setOtpMessage(err.message || "Error sending OTP.");
    }
    setIsSendingOtp(false);
  };

  // Verify OTP function
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setOtpMessage("Please enter a 6-digit OTP.");
      return;
    }
    setIsVerifyingOtp(true);
    setOtpMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registerData.email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      setOtpVerified(true);
      setOtpMessage("OTP verified! You can now create your account.");
    } catch (err) {
      setOtpMessage(err.message || "Invalid OTP.");
      setOtpVerified(false);
    }
    setIsVerifyingOtp(false);
  };

  // Resend OTP function
  const handleResendOTP = () => {
    setOtp("");
    setOtpVerified(false);
    handleSendOTP();
  };

  // ✅ Google Sign-In Placeholder
  const handleGoogleSignIn = () => {
    alert("Google Sign-In coming soon!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl shadow-lg overflow-hidden border border-yellow-500">
        {/* Left: Animation */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-black">
          <Lottie animationData={tvAnim} loop className="w-[80%] h-[80%]" />
        </div>

        {/* Right: Tabs */}
        <div className="w-full md:w-1/2 bg-black p-8 text-white">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-yellow-500 text-black rounded-lg">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-black data-[state=active]:text-yellow-400"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-black data-[state=active]:text-yellow-400"
              >
                Register
              </TabsTrigger>
            </TabsList>

            {/* ✅ Login Tab */}
            <TabsContent value="login">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <Input
                  placeholder="Email"
                  type="email"
                  className="bg-white text-black"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="bg-white text-black"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
                {loginError && (
                  <p className="text-red-500 text-sm text-center">
                    {loginError}
                  </p>
                )}
                <Button
                  onClick={handleLogin}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black transition-colors"
                >
                  Login
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors"
                  onClick={handleGoogleSignIn}
                >
                  Sign in with Google
                </Button>
              </motion.div>
            </TabsContent>

            {/* ✅ Register Tab */}
            <TabsContent value="register">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Name input */}
                <Input
                  placeholder="Name"
                  type="text"
                  className="bg-white text-black"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                  disabled={otpVerified}
                />

                {/* Email input + Send OTP button */}
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Email"
                    type="email"
                    className="bg-white text-black"
                    value={registerData.email}
                    onChange={(e) => {
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      });
                      setOtpSent(false);
                      setOtpVerified(false);
                      setOtp("");
                      setOtpMessage("");
                    }}
                    disabled={otpVerified}
                  />
                  <Button
                    onClick={handleSendOTP}
                    disabled={otpSent || otpVerified || isSendingOtp}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black"
                  >
                    {isSendingOtp
                      ? "Sending..."
                      : otpSent
                      ? "OTP Sent"
                      : "Send OTP"}
                  </Button>
                </div>

                {/* OTP input + Verify + Resend buttons */}
                {otpSent && !otpVerified && (
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter OTP"
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <div className="flex gap-2 items-center">
                      <Button
                        onClick={handleVerifyOTP}
                        disabled={otp.length !== 6 || isVerifyingOtp}
                        className="bg-yellow-500 hover:bg-yellow-400 text-black"
                      >
                        {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleResendOTP}
                        disabled={isSendingOtp}
                        className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                      >
                        Resend OTP
                      </Button>
                    </div>
                  </div>
                )}

                {/* Password input */}
                <Input
                  placeholder="Password"
                  type="password"
                  className="bg-white text-black"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  disabled={!otpVerified}
                />

                {/* Show OTP message or register error */}
                {otpMessage && (
                  <p className="text-yellow-400 text-sm text-center">
                    {otpMessage}
                  </p>
                )}
                {registerError && (
                  <p className="text-red-500 text-sm text-center">
                    {registerError}
                  </p>
                )}

                {/* Create Account button */}
                <Button
                  onClick={handleRegister}
                  disabled={!otpVerified}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black"
                >
                  Create Account
                </Button>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
