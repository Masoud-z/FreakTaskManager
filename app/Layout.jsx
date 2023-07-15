import "@/styles/global.css";
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
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

export default layout;
