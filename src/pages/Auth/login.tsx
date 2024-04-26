import { LockOutlined, RightCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, notification, Space } from "antd";
import Checkbox from "antd/es/checkbox/Checkbox";
import {
    Link,
    useLocation,
} from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useAppSelector } from "../../redux/hook";
import { useEffect } from "react";
import { callLogin } from "../../apis";
import { setUserLoginInfo } from "../../redux/slice/accountSlice";

function Login() {
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const callback = params?.get("callback");
    // const naviga
    useEffect(() => {
        if (isAuthenticated) {
            window.location.href = '/';
            // navigator('/')
        }
    }, [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onFinish = async (values: any) => {
        const { username, password } = values;
        try {
            const res = await callLogin(username, password);
            if (res.data) {
                localStorage.setItem('access_token', res.data.access_token);
                dispatch(setUserLoginInfo(res.data.user));
                message.success("Đăng nhập tài khoản thành công!");
                window.location.href = callback ? callback : '/'
            } else if (res.data === undefined) {
                notification.error({
                    message: "Tài khoản hoặc mật khẩu không đúng",
                    description:
                        res.data,
                    duration: 5
                })
            }
            else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description:
                        res.data,
                    duration: 5
                })
            }
        }
        catch (error) {
            notification.error({
                message: String(error),
                description: '1',
                duration: 5
            })
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: "column",
            minHeight: '90vh',
            background: '#f2f2f2',
        }}>
            <Space align="center" direction="vertical" size={16}>
                <Card
                    bordered
                    title={<div className="txt-login">Đăng nhập</div>}
                    style={{
                        width: 400,
                        marginTop: 100,
                        borderTop: '4px solid #0cacea'
                    }}
                >
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                        >
                            <Input
                                size="large"
                                className="input-login"
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="Tên đăng nhập"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password
                                size="large"
                                className="input-login"
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Mật khẩu"
                            />
                        </Form.Item>
                        <Form.Item >
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox style={{ marginBottom: 10 }}>Ghi nhớ</Checkbox>
                            </Form.Item>
                            <Button block type="primary" htmlType="submit" className="login-form-button">
                                Đăng nhập
                            </Button>
                        </Form.Item>
                        <Link to={'/register'}>Đăng kí tài khoản <RightCircleOutlined /></Link>
                    </Form>
                </Card>
            </Space>
        </div >
    );
}

export default Login;