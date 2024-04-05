import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Space } from "antd";
import { Link } from "react-router-dom";

function Register() {
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
                    title={<div className="txt-login">Đăng kí tài khoản</div>}
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
                            name="full_name"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                        >
                            <Input
                                size="large"
                                className="input-login"
                                placeholder="Họ tên"
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                        >
                            <Input
                                size="large"
                                className="input-login"
                                placeholder="Email"
                            />
                        </Form.Item>
                        <Form.Item
                            name="phone_number"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                        >
                            <Input
                                size="large"
                                className="input-login"
                                placeholder="Số điện thoại"
                            />
                        </Form.Item>
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                        >
                            <Input
                                size="large"
                                className="input-login"
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
                                type="password"
                                placeholder="Mật khẩu"
                            />
                        </Form.Item>
                        <Form.Item
                            name="re-password"
                            rules={[{ required: true, message: 'Vui lòng nhắc lại mật khẩu!' }]}
                        >
                            <Input.Password
                                size="large"
                                className="input-login"
                                type="password"
                                placeholder="Nhắc lại mật khẩu"
                            />
                        </Form.Item>
                        <Form.Item >
                            <Button block type="primary" htmlType="submit" className="login-form-button">
                                Đăng kí
                            </Button>
                        </Form.Item>
                        <Link to={'/login'}><LeftCircleOutlined /> Đăng nhập</Link>
                    </Form>
                </Card>
            </Space >
        </div >
    );
}

export default Register;