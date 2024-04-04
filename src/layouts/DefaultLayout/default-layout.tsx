import React, { ReactNode } from "react";
import Header from "./Header/header";
import Footer from "./Footer/footer";

interface DefaultLayoutProps {
    children?: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}

export default DefaultLayout;
