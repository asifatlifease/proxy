"use client";

import { auth } from "@/services/firebase";
import { AuthContext } from "@/shared/AuthProvider";
import { Button, Input } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useContext, useState } from "react";
import toast from "react-hot-toast";

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
    let loginLoadingId;
    try {
      loginLoadingId = toast.loading("Loging....");
      e.preventDefault();
      if (credentials?.email === "" || credentials?.password === "") {
        toast.error("All fields are required!");
      } else {
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          credentials?.email,
          credentials?.password
        );
        const user: any = userCredentials.user;

        dispatch({
          type: "set-user",
          payload: {
            authToken: user?.accessToken,
            user: {
              uid: user?.uid,
              email: user?.email,
              name: user?.displayName,
              profileImage: user?.photoURL,
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
      toast.error("Oops! Someting went wrong.");
    } finally {
      toast.dismiss(loginLoadingId);
    }
  }
  return (
    <div className="w-2/6 border rounded-md p-2">
      <p className="text-center py-2">Login</p>
      <form onSubmit={handleLogin}>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          value={credentials?.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
        />

        <div className="py-2">
          <Input
            name="password"
            type="password"
            autoComplete="password"
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
  );
}

export default LoginPage;
