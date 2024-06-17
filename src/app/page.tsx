"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';

const App = () => {
  const router = useRouter();

useEffect(() => {
    if (!getCookie("uid")) {
      console.log("user not logged in");
      router.push("/auth/login");
    } else if(window.location.href === "/" || window.location.href === "/auth/login" || window.location.href === "/auth/signup") {
      console.log("user logged in");
      router.push("/dashboard");
    }
  }, [router]);


  return (
    <>
    </>
  );
};

export default App