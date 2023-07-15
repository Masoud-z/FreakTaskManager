"use client";
import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./LandingPageStyle.module.css";
import { logStatus } from "@/components/helper/Contexts";

export default function LandingPage() {
  const { loggedIn } = useContext(logStatus);
  return (
    <div className={styles.container}>
      <h1>
        Manage All Your Tasks
        <br />
        Like a Freak!
      </h1>
      <div className={styles.btnContainer}>
        {!loggedIn && (
          <Link href="/signup" className={styles.btn}>
            Sign Up
          </Link>
        )}
        <Image src="/tasks.png" alt="globe" width="300" height="300" />
        {!loggedIn && (
          <Link href="/signin" className={styles.btn}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
