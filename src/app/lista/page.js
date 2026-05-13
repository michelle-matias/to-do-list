import { Geist, Geist_Mono } from "next/font/google";
import "./page.module.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "my little to-do list ✿",
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
        <div className="mainPage">
            {children}
        </div>
        </body>
        </html>
    );
}