
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MainLayout from "./layouts/MainLayout";

export const metadata = {
  title: "Material Management",
  description: "Manage your material requests efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Pindahkan MantineProvider ke dalam body */}
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <AuthProvider>
            <MainLayout>{children}</MainLayout>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
