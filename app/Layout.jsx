"use client";
import { useState } from "react";
import "@/styles/global.css";
import { Dark, Msg, logStatus } from "@/helper/Contexts";
import Layout from "@/components/Layout/Layout";

export const metadata = {
  title: "Task Management",
  description: "The app you manage all your tasks",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

function layout({ children }) {
  const [darkMode, setDarkMode] = useState(true);
  const [msg, setMsg] = useState({ open: false, message: "", type: "" });
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <html lang="en">
      <body>
        <logStatus.Provider value={{ loggedIn, setLoggedIn }}>
          <Msg.Provider value={{ msg, setMsg }}>
            <Dark.Provider value={{ darkMode, setDarkMode }}>
              <Layout>{children}</Layout>
            </Dark.Provider>
          </Msg.Provider>
        </logStatus.Provider>
      </body>
    </html>
  );
}

export default layout;
