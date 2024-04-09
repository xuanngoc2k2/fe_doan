import React, { ReactNode } from "react";
import Header from "../DefaultLayout/Header/header";

interface LayoutProps {
    children?: ReactNode;
}
const User = {
    username: 'username',
    pass: 'sfsff'
}
const NotNewsLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <Header user={User} />
            {children}
        </>
    );
}

export default NotNewsLayout;
