import React, { ReactNode } from "react";
import Header from "../DefaultLayout/Header/header";

interface LayoutProps {
    children?: ReactNode;
}
const NotNewsLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <Header />
            {children}
        </>
    );
}

export default NotNewsLayout;
