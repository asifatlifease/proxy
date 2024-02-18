"use client";

import { auth } from "@/services/firebase";
import { AuthContext } from "@/shared/AuthProvider";
import { Button, Input } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useContext, useState } from "react";

interface ICredentials {
  email: string;
  password: string;
}

function LoginPage() {
  const { state, dispatch } = useContext(AuthContext);
  const [credentials, setCredentials] = useState<ICredentials>({
    email: "",
    password: "",
  });
  const router = useRouter();

  function handleInputChange(e: any) {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      if (credentials?.email === "" || credentials?.password === "") {
        alert("All fliends are required!");
      } else {
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          credentials?.email,
          credentials?.password
        );
        const user: any = userCredentials.user;
        console.log("user", user)
        dispatch({
          type: "set-user",
          payload: {
            authToken: user?.accessToken,
            user: {
              uid: user?.uid,
              email: user?.email,
              name: user?.displayName,
              image: user?.photoURL,
            },
          },
        });
        setCredentials({
          email: "",
          password: "",
        });

        router.push("/");
      }
    } catch (error) {
      console.log("something went wrong", error);
    }
  }
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="w-2/6">
        <p className="text-center py-2">Login</p>
        <form onSubmit={handleLogin}>
          <Input
            name="email"
            type="email"
            value={credentials?.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />

          <div className="py-2">
            <Input
              name="password"
              type="password"
              value={credentials?.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
          </div>
          <Button htmlType="submit" block type="primary">
            Login
          </Button>
        </form>
        <div className="flex justify-end py-2">
          <Link href="/register"> Not have an account ? Register</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
