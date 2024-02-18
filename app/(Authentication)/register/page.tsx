"use client";

import React, { FormEvent, useContext, useState } from "react";
import { Button, Input } from "antd";
import Link from "next/link";
import { AuthContext } from "@/shared/AuthProvider";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/services/firebase";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

interface ICredentials {
  name: string;
  email: string;
  password: string;
}

function RegisterPage() {
  const router = useRouter();
  const { dispatch } = useContext(AuthContext);
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
    let registerLoadingId;
    try {
      registerLoadingId = toast.loading("Registering Please wait....");
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
        const payload = {
          email: user?.email,
          name: user?.displayName || credentials?.name,
          profileImage: user?.photoURL,
        };

        await setDoc(doc(db, "users", user?.uid), payload);

        dispatch({
          type: "set-user",
          payload: {
            authToken: user?.accessToken,
            user: {
              uid: user?.uid,
              ...payload,
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
      toast.error("Oops! Something went wrong.");
    } finally {
      toast.dismiss(registerLoadingId);
    }
  }
  return (
    <div className="w-2/6 border rounded-md p-2">
      <p className="text-center py-2">Register</p>
      <form onSubmit={handleLogin}>
        <Input
          name="name"
          type="text"
          autoComplete="name"
          value={credentials?.name}
          onChange={handleInputChange}
          placeholder="Enter your name"
        />

        <div className="py-2">
          <Input
            name="email"
            type="email"
            autoComplete="email"
            value={credentials?.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
        </div>

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
          Register
        </Button>
      </form>
      <div className="flex justify-end py-2">
        <Link href="/login">Have an account ? Login</Link>
      </div>
    </div>
  );
}

export default RegisterPage;
