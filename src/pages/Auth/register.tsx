import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Form, Input, notification, Space } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IUser } from "../../custom/type";
import { callRegister } from "../../apis";

function Register() {
    const [user, setUser] = useState<IUser | null>();
    const navigator = useNavigate();
    const onFinish = async () => {
        if (user) {
            try {
                const res = await callRegister(user);
                if (res && res.data) {
                    notification.success({ message: "Đăng kí thành công" });
                    navigator('/login');
                }
                else {
                    console.log(res.message)
                    notification.error({ message: String(res.message) });
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (error) {
                // Truy cập thông điệp lỗi và xử lý nó
                console.error("Lỗi:", String(error));
            }
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
                                value={user?.full_name}
                                onChange={(e) => setUser((prev) => ({ ...prev!, full_name: e.target.value.trim() }))}
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
                                value={user?.email}
                                onChange={(e) => setUser((prev) => ({ ...prev!, email: e.target.value.trim() }))}
                                className="input-login"
                                placeholder="Email"
                            />
                        </Form.Item>
                        <Form.Item
                            name="phone_number"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                        >
                            <Input
                                value={user?.phone_number}
                                onChange={(e) => setUser((prev) => ({ ...prev!, phone_number: e.target.value.trim() }))}
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
                                value={user?.username}
                                onChange={(e) => setUser((prev) => ({ ...prev!, username: e.target.value.trim() }))}
                                className="input-login"
                                placeholder="Tên đăng nhập"
                            />
                        </Form.Item>
                        <Form.Item
                            name="birthday"
                            rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
                        >
                            <DatePicker
                                allowClear={false}
                                style={{ width: '100%' }}
                                size="large"
                                value={user?.date_of_birth}
                                onChange={(date) => setUser((prev) => ({ ...prev!, date_of_birth: date }))}
                                placeholder="Ngày sinh"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password
                                size="large"
                                value={user?.password}
                                onChange={(e) => setUser((prev) => ({ ...prev!, password: e.target.value.trim() }))}
                                className="input-login"
                                type="password"
                                placeholder="Mật khẩu"
                            />
                        </Form.Item>
                        <Form.Item
                            hasFeedback
                            name="re-password"
                            rules={[{ required: true, message: 'Xác nhận mật khẩu không được để trống!' },
                            (
                                { getFieldValue }
                            ) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject("Xác nhận mật khẩu không trùng khớp")
                                }
                            })
                            ]}
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