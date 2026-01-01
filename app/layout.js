import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "Phone Fix - Fast & Safe Phone Repairs",
  description: "Verified engineers. Secure pickup. Real-time tracking across Nigeria.",
  icons: {
    icon: '/everfix-logo.svg',
    apple: '/icon-192.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
