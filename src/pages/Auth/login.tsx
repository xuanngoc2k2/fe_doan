import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Space } from "antd";
import Checkbox from "antd/es/checkbox/Checkbox";
import { Link } from "react-router-dom";

function Login() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onFinish = (values: any) => {
        console.log('Received values:', values);
        // Xử lý đăng nhập ở đây
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
                        width: 350,
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
                            rules={[{ required: true, message: 'Please input your Username!' }]}
                        >
                            <Input
                                size="large"
                                className="input-login"
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="Username"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input
                                size="large"
                                className="input-login"
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
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
                        <Link to={'#'}>Đăng kí tài khoản</Link>
                    </Form>
                </Card>
            </Space>
        </div >
    );
}

export default Login;