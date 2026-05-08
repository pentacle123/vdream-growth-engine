import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "VDream Growth Engine",
  description: "AI-Powered B2B Marketing Platform for VDream",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
