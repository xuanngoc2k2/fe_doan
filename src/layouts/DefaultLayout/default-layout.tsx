import React, { ReactNode } from "react";
import Header from "./Header/header";
import Footer from "./Footer/footer";
import News from "./News/news";

interface DefaultLayoutProps {
    children?: ReactNode;
    user?: unknown
}
const User = {
    userName: 'xuanngoc2k2',
    role: 'Admin'
}
const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    return (
        <>
            <Header user={User} />
            {children}
            <Footer />
            <News />
        </>
    );
}

export default DefaultLayout;
