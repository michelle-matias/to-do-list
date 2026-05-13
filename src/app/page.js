import "./page.css";

export const metadata = {
    title: "my little to-do lista ✿",
    description: "stay soft, stay organised",
};

export default function Home() {
    return (
        <div className="mainPage">
            <header className="site-header">
                <div className="header-deco">✿ ✾ ✿</div>
                <h1 className="site-name">Michelle Rose Matias</h1>
                <p className="site-student">Número de aluno · 28505</p>
                <div className="header-deco small">❀ · ❀ · ❀</div>
            </header>
        </div>
    );
}