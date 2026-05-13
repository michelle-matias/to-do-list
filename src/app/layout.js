import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./Layout.module.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "my little to-do lista ✿",
    description: "stay soft, stay organised",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <head>
            <link
                href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap"
                rel="stylesheet"
            />
        </head>
        <body>
        <ul style={{ listStyle: "none", display: "flex", gap: "8px", padding: "1.25rem", margin: 0, position: "fixed", top: 0, left: 0, zIndex: 100, background: "none" }}>
            <li><a href="/" className="nav-lista">✦ Home</a></li>
            <li><a href="/lista" className="nav-lista">✿ Lista</a></li>
        </ul>
        <div className="mainPage">
            {children}
        </div>
        </body>
        </html>
    );
}