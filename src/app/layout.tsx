import type { Metadata } from "next";
import { metadata as sharedMetadata } from "./metadata";
import ClientLayout from "../components/ClientLayout"; // 👈 adjust the path to match the correct file location

export const metadata: Metadata = sharedMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
