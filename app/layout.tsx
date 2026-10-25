import type { Metadata } from "next";
import { AppProvider } from "../context/AppContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Real Estate Agent",
  description: "AI real-estate sales agent with a 3D little-planet visualization.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

const earlyThemeScript = `
(function () {
  try {
    var theme = localStorage.getItem('gpr_theme');
    theme = theme === 'light' ? 'light' : 'dark';
    if (theme === 'dark') document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
    var lang = localStorage.getItem('gpr_language');
    lang = lang === 'ar' ? 'ar' : 'en';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  } catch (_) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: earlyThemeScript }} />
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
