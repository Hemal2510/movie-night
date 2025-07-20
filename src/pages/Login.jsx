import React from "react";
import Lottie from "lottie-react";
import tvAnim from "@/assets/Animation_black_gold";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
const Login = () => {
    const location = useLocation();
const defaultTab = location.state?.tab || "login"; // 👈 pick register if passed
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
        
        {/* Tabs List */}
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-yellow-500 text-black rounded-lg">
          <TabsTrigger value="login" className="data-[state=active]:bg-black data-[state=active]:text-yellow-400">Login</TabsTrigger>
          <TabsTrigger value="register" className="data-[state=active]:bg-black data-[state=active]:text-yellow-400">Register</TabsTrigger>
        </TabsList>

        {/* Login Tab */}
        <TabsContent value="login">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <Input placeholder="Email" type="email" className="bg-white text-black" />
            <Input placeholder="Password" type="password" className="bg-white text-black" />
            <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black transition-colors">
              Login
            </Button>
            <Button
              variant="outline"
              className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
            >
              Sign in with Google
            </Button>
          </motion.div>
        </TabsContent>

        {/* Register Tab */}
        <TabsContent value="register">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <Input placeholder="Name" type="text" className="bg-white text-black" />
            <Input placeholder="Email" type="email" className="bg-white text-black" />
            <Input placeholder="Password" type="password" className="bg-white text-black" />
            <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black transition-colors">
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
