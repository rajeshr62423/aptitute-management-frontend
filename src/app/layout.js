import { Quicksand } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";
import Toast from "@/components/common/Toast";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata = {
  title: "AptitudePro | Smart Assessments",
  description:
    "Manage aptitude assessments, candidates and performance in one place.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={quicksand.variable}>
      <body className="antialiased">
        <ReduxProvider>
          {children}
          <Toast />
          <div id="modal-root" />
        </ReduxProvider>
      </body>
    </html>
  );
}
