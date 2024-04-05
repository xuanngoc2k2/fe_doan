import { Divider } from "antd";
import React, { ReactNode } from "react";

interface IProps {
    children?: ReactNode;
}

const Header: React.FC<IProps> = ({ children }) => {
    return (
        <>
            <h1>Header</h1>
            {children}
            <Divider style={{ marginBottom: 0 }} />
        </>
    );
}

export default Header;
