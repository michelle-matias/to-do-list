/* ✿ page.js — HOME LANDING PAGE (React / JavaScript) ✿
   This is the home page of your website. It displays Michelle's name and student details.
   Like layout.js, this React component separates:
     1. JAVASCRIPT SETUP: Imports and page setups (lines 1 - 10).
     2. HTML TREE (JSX): The layout block returned by the Home function (lines 12 - 22).
*/

// ─── 1. JAVASCRIPT CONTROL SECTION (Imports) ───

// Imports our dedicated home page CSS stylesheet (page.css)
import "./page.css";

// Defines the custom SEO page details specifically for the home landing page
export const metadata = {
    title: "my little to-do lista ✿",
    description: "stay soft, stay organised",
};

// ─── 2. HTML TEMPLATE SECTION (JSX Rendering) ───
// The Home function renders a styled header element holding Michelle's credentials.
export default function Home() {
    return (
        <div className="mainPage">
            {/* HTML: Styled site header container */}
            <header className="site-header">
                {/* HTML: Top floating flower decorations */}
                <div className="header-deco">✿ ✾ ✿</div>
                
                {/* HTML: Large elegant title displaying name */}
                <h1 className="site-name">Michelle Rose Matias</h1>
                
                {/* HTML: Student number subtitle */}
                <p className="site-student">Número de aluno · 28505</p>
                
                {/* HTML: Bottom out-of-sync floating flower decorations */}
                <div className="header-deco small">❀ · ❀ · ❀</div>
            </header>
        </div>
    );
}