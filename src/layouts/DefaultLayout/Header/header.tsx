import { Avatar, Divider, Menu } from "antd";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Col, Row } from 'antd';
import { BookOutlined, CaretDownOutlined, FontColorsOutlined, HighlightOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";

interface IProps {
    children?: ReactNode;
    user?: unknown;
}
const Header: React.FC<IProps> = ({ children, user }) => {
    console.log(user)
    return (
        <>
            <Row className="header-container">
                <Col span={6} className="header-logo">
                    <Link to={'/'}>
                        <img width={100} src="../../../src/assets/images/logo.png" />
                    </Link>
                </Col>
                <Col span={12}>
                    <Menu
                        className="header-menu"
                        mode="horizontal"
                    >
                        <Menu.Item icon={<BookOutlined />}>Khóa học</Menu.Item>
                        <Menu.SubMenu
                            style={{ marginRight: 30, marginLeft: 30 }}
                            icon={<HighlightOutlined />}
                            title={<>Ôn thi <span><CaretDownOutlined /></span></>}
                        >
                            <Menu.Item key="topikI">LÀM ĐỀ TOPIK I</Menu.Item>
                            <Menu.Item key="topikII">LÀM ĐỀ TOPIK II</Menu.Item>
                        </Menu.SubMenu>
                        <Menu.Item icon={<FontColorsOutlined />}>Từ vựng</Menu.Item>
                    </Menu>
                </Col>
                <Col span={6} className="header-avatar-profile">
                    {user ? (
                        <Menu mode="horizontal" style={{ borderBottom: 'none' }}>
                            <Menu.SubMenu
                                className="header-profile"
                                title={<Avatar size={50}
                                    icon={<UserOutlined />}
                                />}
                            >
                                <Menu.Item key="profile" icon={<UserOutlined />} className="header-profile-item">Thông tin cá nhân</Menu.Item>
                                <Menu.Item key="ur-vocabulary"
                                    icon={<FontColorsOutlined />}
                                    className="header-profile-item">Từ vựng của tôi</Menu.Item>
                                <Menu.Item key="ur-course" icon={<BookOutlined />} className="header-profile-item">Khóa học đã đăng kí</Menu.Item>
                                <Menu.Item key="logout" icon={<LogoutOutlined />} className="header-profile-item">Đăng xuất</Menu.Item>
                            </Menu.SubMenu>
                        </Menu>
                    ) : (
                        <Avatar size={50} icon={<UserOutlined />} />
                    )}
                </Col>
                {children}
            </Row >
            <Divider style={{ marginBottom: 0 }} />
        </>
    );
}

export default Header;
