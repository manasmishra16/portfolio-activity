import type { Metadata } from "next";
import { Syne, Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manas Mishra — Data, Intelligence & Applications | Full-Stack & ML Engineer",
  description:
    "Portfolio of Manas Mishra. Computer Science & Engineering at KSIT Bengaluru (Expected 2027). Specializing in Machine Learning (CNN, LSTM), Data Engineering (Pandas, Scikit-learn), Full-Stack Systems, and 3D Creative Technology.",
  keywords: [
    "Manas Mishra",
    "manasmishra16",
    "Data Scientist",
    "Machine Learning Engineer",
    "Full-Stack Developer",
    "Creative Technologist",
    "KSIT Bengaluru",
    "TensorFlow",
    "React",
    "Three.js",
  ],
  authors: [{ name: "Manas Mishra", url: "https://github.com/manasmishra16" }],
  creator: "Manas Mishra",
  openGraph: {
    title: "Manas Mishra — Data, Intelligence & Applications",
    description: "Computer Science Engineer building intelligent ML systems, data-driven applications, and immersive 3D digital experiences.",
    url: "https://github.com/manasmishra16",
    siteName: "Manas Mishra Portfolio",
    type: "website",
  },
};

import { ThemeProvider } from "@/lib/theme-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} dark scroll-smooth`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('portfolio-theme');
                  var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
                  var theme = stored ? stored : (prefersLight ? 'light' : 'dark');
                  var root = document.documentElement;
                  if (theme === 'light') {
                    root.classList.remove('dark');
                    root.classList.add('light');
                    root.setAttribute('data-theme', 'light');
                  } else {
                    root.classList.remove('light');
                    root.classList.add('dark');
                    root.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased selection:bg-[#ff5a1f] selection:text-white overflow-x-hidden text-[15px] leading-relaxed">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
