import { Avatar, Button, Dropdown, Layout, Menu, message, Space } from "antd";
import { callLogout } from "../../apis";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { setLogoutAction } from "../../redux/slice/accountSlice";
import { Link, useNavigate } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import { AppstoreOutlined, BookOutlined, BugOutlined, FontColorsOutlined, FormOutlined, HighlightOutlined, MenuFoldOutlined, MenuUnfoldOutlined, NotificationOutlined, QuestionCircleOutlined, UnorderedListOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import NotPermitted from "../../routes/protected-router/not-permitted";

interface LayoutProps {
    children?: React.ReactNode;
}
const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
    const user = useAppSelector(state => state.account.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }
    const itemsDropdown = [
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },
    ];
    const listMenu = [
        {
            label: <Link to='/admin'>Dashboard</Link>,
            key: '/admin',
            icon: <AppstoreOutlined />
        },
        {
            label: <Link to={'/admin/course'}>Course</Link>,
            key: '/admin/course',
            icon: <BookOutlined />
        },
        {
            label: <Link to={'/admin/lesson'}>Lesson</Link>,
            key: '/admin/lesson',
            icon: <FormOutlined />
        },
        {
            label: <Link to={'/admin/question'}>Question</Link>,
            key: '/admin/question',
            icon: <QuestionCircleOutlined />
        },
        {
            label: <Link to={'/admin/exam'}>Exam</Link>,
            key: '/admin/exam',
            icon: <HighlightOutlined />
        },
        {
            label: <Link to={'/admin/listvocab'}>List Vocabulary</Link>,
            key: '/admin/listvocab',
            icon: <UnorderedListOutlined />
        },
        {
            label: <Link to={'/admin/vocabulary'}>Vocabulary</Link>,
            key: '/admin/vocabulary',
            icon: <FontColorsOutlined />
        },
        {
            label: <Link to={'/admin/news'}>News</Link>,
            key: '/admin/news',
            icon: <NotificationOutlined />
        }
    ]

    useEffect(() => {
        setActiveMenu(location.pathname)
    }, [location])

    return (
        <>
            <Layout
                style={{ minHeight: '100vh' }}
                className="layout-admin"
            >
                {user ?
                    <>
                        <Sider
                            theme='light'
                            width={'15%'}
                            collapsible
                            collapsed={collapsed}
                            onCollapse={(value) => setCollapsed(value)}>
                            <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                                <BugOutlined />  ADMIN
                            </div>
                            <Menu
                                style={{
                                    borderInline: 'none',
                                }}
                                selectedKeys={[activeMenu]}
                                onClick={(e) => setActiveMenu(e.key)}
                                mode="inline"
                                items={listMenu}
                            />
                        </Sider>
                        <Layout>
                            <div
                                className='admin-header'
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginRight: 20
                                }}
                            >
                                <Button
                                    type="text"
                                    icon={collapsed ? React.createElement(MenuUnfoldOutlined) : React.createElement(MenuFoldOutlined)}
                                    onClick={() => setCollapsed(!collapsed)}
                                    style={{
                                        fontSize: '16px',
                                        width: 64,
                                        height: 64,
                                    }}
                                />

                                <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                    <Space style={{ cursor: "pointer" }}>
                                        {`Welcome ` + user?.username}
                                        <Avatar> {user?.username?.substring(0, 2)?.toUpperCase()} </Avatar>

                                    </Space>
                                </Dropdown>
                            </div>
                            {children}
                        </Layout>
                    </> : <NotPermitted />}
            </Layout>
        </>
    );
}

export default AdminLayout;