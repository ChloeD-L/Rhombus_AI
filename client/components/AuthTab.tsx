"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { registerUser, loginUser } from "../utils/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const AuthTabs: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await registerUser(username, password);
      setMessage("User registered successfully!");
      setToken(data.token);
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.error || "Registration failed"}`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);
      setMessage("Login successful!");
      setToken(data.token);
      localStorage.setItem("token", data.token);
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
            <CardDescription>Tab in your user name and password here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Username" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="********" />
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button>Log in</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Tab in your user name and password here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Username" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="********" />
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button>Register</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;
