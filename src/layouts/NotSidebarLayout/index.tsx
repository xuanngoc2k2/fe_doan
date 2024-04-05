import React, { ReactNode } from "react";
import Header from "../DefaultLayout/Header/header";
import Footer from "../DefaultLayout/Footer/footer";

interface LayoutProps {
    children?: ReactNode;
}
const User = {
    username: 'username',
    pass: 'sfsff'
}
const NotSidebarLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <Header user={User} />
            {children}
            <Footer />
        </>
    );
}

export default NotSidebarLayout;
