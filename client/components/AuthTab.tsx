"use client";

import React, { use, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { registerUser, loginUser } from "../utils/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";

const AuthTabs: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setToken } = useUserContext();
  const router = useRouter();

  // Handle register event
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage("Please enter both username and password.");
      return;
    }
    try {
      const data = await registerUser(username, password);
      setMessage("User registered successfully!");
      setToken(data.token);
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.error || "Registration failed"}`);
    }
  };

  // Handle login event
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage("Please enter both username and password.");
      return;
    }
    try {
      const data = await loginUser(username, password);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.error || "Login failed"}`);
    }
  };

  return (
    <Tabs defaultValue="login" className="w-full max-w-md mx-auto">
      <TabsList className="flex">
        <TabsTrigger value="login" className="w-1/2">
          Login
        </TabsTrigger>
        <TabsTrigger value="register" className="w-1/2">
          Register
        </TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Log in</CardTitle>
            <CardDescription>Enter your username and password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="********"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <Button onClick={handleLogin}>Log in</Button>
            {message && <p className="text-red-500">{message}</p>}
          </CardFooter>
        </Card>
      </TabsContent>

      {/* 注册表单 */}
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Enter your username and password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="********"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <Button onClick={handleRegister}>Register</Button>
            {message && <p className="text-red-500">{message}</p>}
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;
