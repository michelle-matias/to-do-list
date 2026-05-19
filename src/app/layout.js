/* ✿ layout.js — GLOBAL ROOT LAYOUT CONTROLLER (React / JavaScript) ✿
   In Next.js, this file wraps around every single page on the website.
   It acts as a master frame, injecting global styles, web fonts, and the shared top-navigation links.
   
   Here, we have a clear separation between:
     1. JAVASCRIPT SETUP: Imports, Font configurations, and Metadata settings (lines 1 - 20).
     2. HTML TREE (JSX): The HTML layout frame returned by the RootLayout function (lines 22 - 38).
*/
// ─── 1. JAVASCRIPT CONTROL SECTION (Imports & Configurations) ───

// Imports Next.js specialized font loaders for performance optimization
import { Geist, Geist_Mono } from "next/font/google";

// Imports separate CSS files. Next.js applies these globally across all pages
import "./globals.css"; // Global design system (colors, body styling)
import "./layout.css";  // Layout styling (navigation button shapes, hover effects)

// Setup the custom Geist Sans font family
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

// Setup the custom Geist Mono (monospace) font family
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// Defines site metadata which Next.js will automatically inject into the HTML <head> (SEO best practices!)
export const metadata = {
    title: "my little to-do lista ✿",
    description: "stay soft, stay organised",
};

// ─── 2. HTML TEMPLATE SECTION (JSX Rendering) ───
// The RootLayout function returns JSX (a JavaScript extension that writes HTML).
export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
            <head>
                {/* Imports external Google Fonts stylesheet for DM Sans (our clean body font) */}
                <link
                    href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>

                {/* HTML: Top-left navigation bar containing Home & Lista buttons */}
                <ul style={{
                    listStyle: "none",
                    display: "flex",
                    gap: "8px",
                    padding: "1.25rem",
                    margin: 0,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 100,
                    background: "none"
                }}>
                    <li><a href="/" className="nav-lista">✦ Home</a></li>
                    <li><a href="/lista" className="nav-lista">✿ Lista</a></li>
                </ul>

                {/* HTML: Main content canvas where Next.js injects individual pages (Home or Lista page) */}
                <div className="mainPage">
                    {children} {/* Renders the active page content here */}
                </div>

            </body>
        </html>
    );
}
