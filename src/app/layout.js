import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
            <style>{`
          .nav-home {
            font-family: 'DM Sans', sans-serif;
            font-size: 13px;
            font-weight: 500;
            color: #b565a7;
            background: rgba(255,255,255,0.7);
            border: 1.5px solid #f0c4de;
            border-radius: 20px;
            padding: 7px 18px;
            text-decoration: none;
            letter-spacing: 0.3px;
            display: inline-block;
            transition: all 0.2s;
          }
          .nav-home:hover {
            background: #fce8f3;
            border-color: #e8a0cd;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(180,100,200,0.2);
          }
          .nav-lista {
            font-family: 'DM Sans', sans-serif;
            font-size: 13px;
            font-weight: 500;
            color: white;
            background: linear-gradient(135deg, #d48bbf, #b07dd4);
            border: 1.5px solid transparent;
            border-radius: 20px;
            padding: 7px 18px;
            text-decoration: none;
            letter-spacing: 0.3px;
            display: inline-block;
            transition: all 0.2s;
          }
          .nav-lista:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(180,100,200,0.35);
          }
        `}</style>
        </head>
        <body>
        <ul style={{ listStyle: "none", display: "flex", gap: "8px", padding: "1.25rem", margin: 0, position: "fixed", top: 0, left: 0, zIndex: 100 }}>
            <li><a href="/" className="nav-home">✦ home</a></li>
            <li><a href="/lista" className="nav-lista">✿ lista</a></li>
        </ul>

        <div className="mainPage">
            {children}
        </div>
        </body>
        </html>
    );
}