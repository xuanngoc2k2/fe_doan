import { Avatar, Button, Divider, Drawer, Menu, message } from "antd";
import React, { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Col, Row } from 'antd';
import { BookOutlined, CaretDownOutlined, FontColorsOutlined, HighlightOutlined, LoginOutlined, LogoutOutlined, MenuOutlined, UserOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { backEndUrl, callLogout } from "../../../apis";
import { setLogoutAction } from "../../../redux/slice/accountSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import './header.scss';
interface IProps {
    children?: ReactNode;
}
const Header: React.FC<IProps> = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [visible, setVisible] = useState(false);
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);
    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/login')
        }
    }
    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };
    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            navigate('/admin')
        }
        // dispatch(fetchAccount())
    }, [isAuthenticated])
    return (
        <>
            <Row className="header-container">
                <Col span={6} className="header-logo">
                    <Link to={'/'}>
                        <img width={100} src="../../../src/assets/images/logo.png" />
                    </Link>
                </Col>
                <Col span={12} className="home-menu">
                    <Menu
                        selectedKeys={location.pathname === '/' ? [] : [location.pathname]}
                        className="header-menu"
                        mode="horizontal"
                    >
                        <Menu.Item key={'/course'} icon={<BookOutlined />}><Link to={'/course'}>Khóa học</Link></Menu.Item>
                        <Menu.SubMenu
                            style={{ marginRight: 30, marginLeft: 30 }}
                            icon={<HighlightOutlined />}
                            title=
                            {
                                <>
                                    Ôn thi <span><CaretDownOutlined /></span>
                                </>
                            }
                        >
                            <Menu.Item key="/exams/1"><Link to={'/exams/1'}>LÀM ĐỀ TOPIK I</Link></Menu.Item>
                            <Menu.Item key="/exams/2"><Link to={'/exams/2'}>LÀM ĐỀ TOPIK II</Link></Menu.Item>
                            <Menu.Item key="/exams/3"><Link to={'/exams/3'}>LÀM ĐỀ EPS</Link></Menu.Item>
                        </Menu.SubMenu>
                        <Menu.Item key='/vocab' icon={<FontColorsOutlined />}><Link to={'/vocab'}>Từ vựng</Link></Menu.Item>
                    </Menu>
                </Col>
                <Col span={6} className="header-avatar-profile">
                    {user?.id != 0 ? (
                        <Menu selectedKeys={[]} mode="horizontal" style={{ borderBottom: 'none' }}>
                            <Menu.SubMenu
                                className="header-profile"
                                title={<Avatar icon={<img src={`${backEndUrl}/images/users/${user.image}`} />} size={50} />}
                            >
                                <Menu.Item key="profile" icon={<UserOutlined />} className="header-profile-item"><Link to={'/user'}>Thông tin cá nhân</Link></Menu.Item>
                                <Menu.Item key="ur-vocabulary"
                                    onClick={() =>
                                        navigate('/vocab')
                                    }
                                    icon={<FontColorsOutlined />}
                                    className="header-profile-item">Từ vựng của tôi</Menu.Item>
                                <Menu.Item key="ur-course" icon={<BookOutlined />} className="header-profile-item"><Link to={'/result'}>Bài thi đã làm</Link></Menu.Item>
                                <Menu.Item key="logout" icon={<LogoutOutlined />} className="header-profile-item"
                                    onClick={handleLogout}>Đăng xuất</Menu.Item>
                            </Menu.SubMenu>
                        </Menu>
                    ) : (
                        <Menu selectedKeys={[]} mode="horizontal" style={{ borderBottom: 'none' }}>
                            <Menu.SubMenu
                                className="header-profile"
                                title={<Avatar size={50}
                                    icon={<UserOutlined />}
                                />}
                            >
                                <Menu.Item key="login" icon={<LoginOutlined />} className="header-profile-item"><Link to={'/login'}>Đăng nhập</Link></Menu.Item>
                                <Menu.Item key="register" icon={<UserSwitchOutlined />} className="header-profile-item"><Link to={'/register'}>Đăng kí</Link></Menu.Item>
                            </Menu.SubMenu>
                        </Menu>
                    )}
                    <div className="btn-menu">
                        <Button type="primary" onClick={showDrawer} icon={<MenuOutlined />} />
                    </div>
                </Col>

                {children}
            </Row >
            <Drawer
                title="Menu"
                placement="right"
                onClose={onClose}
                open={visible}
            >
                <Col span={24}>
                    <Menu
                        selectedKeys={location.pathname === '/' ? [] : [location.pathname]}
                        className="header-menu"
                        mode="vertical"
                    >
                        <Menu.Item key={'/course'} icon={<BookOutlined />}><Link to={'/course'}>Khóa học</Link></Menu.Item>
                        <Menu.SubMenu className="menu-submenu"
                            style={{ marginRight: 0, marginLeft: 0 }}
                            icon={<HighlightOutlined />}
                            title=
                            {
                                <>
                                    Ôn thi
                                </>
                            }
                        >
                            <Menu.Item key="/exams/1"><Link to={'/exams/1'}>LÀM ĐỀ TOPIK I</Link></Menu.Item>
                            <Menu.Item key="/exams/2"><Link to={'/exams/2'}>LÀM ĐỀ TOPIK II</Link></Menu.Item>
                            <Menu.Item key="/exams/3"><Link to={'/exams/3'}>LÀM ĐỀ EPS</Link></Menu.Item>
                        </Menu.SubMenu>
                        <Menu.Item key='/vocab' icon={<FontColorsOutlined />}><Link to={'/vocab'}>Từ vựng</Link></Menu.Item>
                    </Menu>
                </Col>
            </Drawer>
            <Divider style={{ marginBottom: 0 }} />
        </>
    );
}

export default Header;
