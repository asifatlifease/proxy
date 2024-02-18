"use client";

import React, { FormEvent, useContext, useState } from "react";
import { Button, Input } from "antd";
import Link from "next/link";
import { AuthContext } from "@/shared/AuthProvider";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";
import { useRouter } from "next/navigation";

interface ICredentials {
  name: string;
  email: string;
  password: string;
}

function RegisterPage() {
  const router = useRouter();
  const { state, dispatch } = useContext(AuthContext);
  const [credentials, setCredentials] = useState<ICredentials>({
    name: "",
    email: "",
    password: "",
  });

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
      if (
        credentials?.email === "" ||
        credentials?.password === "" ||
        credentials?.name === ""
      ) {
        alert("All fliends are required!");
      } else {
        const userCredentials = await createUserWithEmailAndPassword(
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
              image: user?.photoURL,
            },
          },
        });
        setCredentials({
          name: "",
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
        <p className="text-center py-2">Register</p>
        <form onSubmit={handleLogin}>
          <Input
            name="name"
            type="text"
            value={credentials?.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />

          <div className="py-2">
            <Input
              name="email"
              type="email"
              value={credentials?.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </div>

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
            Register
          </Button>
        </form>
        <div className="flex justify-end py-2">
          <Link href="/login">Have an account ? Login</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
