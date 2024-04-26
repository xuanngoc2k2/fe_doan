import React, { ReactNode } from "react";
import Header from "./Header/header";
import Footer from "./Footer/footer";
import News from "./News/news";

interface DefaultLayoutProps {
    children?: ReactNode;
}
const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
            <News />
        </>
    );
}

export default DefaultLayout;
