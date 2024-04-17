import { Avatar, Card, Carousel, Form, GetProp, Input, message, Space, UploadProps } from 'antd';
import './profile.scss'
import { useEffect, useRef, useState } from 'react';
import { CarouselRef } from 'antd/es/carousel';
import { backEndUrl, getInfoUser } from '../../apis';
import { IUser } from '../../custom/type';
import { UserOutlined } from '@ant-design/icons';

function Profile() {
    const [isActive, setIsActive] = useState(0);
    const [userInfo, setUserInfo] = useState<IUser | null>();
    const crRef = useRef<CarouselRef | null>(null);
    const handleClick = () => {
        if (crRef.current) {
            console.log(crRef.current.innerSlider.state.currentSlide)
            crRef.current.goTo(isActive == 0 ? 1 : 0)
        }
    }
    const onChange = () => {
    }
    useEffect(() => {
        const fetch = async () => {

            try {
                const res = await getInfoUser();
                if (res.data) {
                    setUserInfo(res.data);
                }
                else {
                    message.error("Lỗi lấy data")
                }
            }
            catch {
                message.error("Lỗi lấy data")
            }
        }
        fetch()
    }, []);
    // type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

    // const getBase64 = (file: FileType): Promise<string> =>
    //     new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = () => resolve(reader.result as string);
    //         reader.onerror = (error) => reject(error);
    //     });
    return (<div className="profile-page-container">
        <div className='profile-content'>
            <div className='profile-btn-option'>
                <div onClick={() => {
                    setIsActive(0);
                    handleClick()
                }}
                    style={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}
                    className={`btn-option ${isActive == 0 ? 'active' : ''}`}>
                    <p>Thông tin cá nhân</p>
                </div>
                <div onClick={() => { setIsActive(1); handleClick() }}
                    style={{ borderTopRightRadius: 8, borderBottomRightRadius: 8 }}
                    className={`btn-option ${isActive == 1 ? 'active' : ''}`}>
                    <p>Đổi mật khẩu</p>
                </div>
            </div>
            <Carousel
                ref={crRef}
                dots={false}
                beforeChange={onChange}>
                <div className='info-content' style={{ background: 'red' }}>
                    <Card style={{
                        width: '100%',
                        height: '100%'
                    }} title="Thông tin cá nhân">
                        <div className='info-image'>
                            {userInfo?.image ? <img src={`${backEndUrl}/images/vocabulary/${userInfo?.image}`} /> : <Avatar icon={<UserOutlined />} size={150} />}
                        </div>
                        <div className='info-detail'>
                            <Form
                                name="complex-form"
                                labelCol={{ span: 12 }}
                                wrapperCol={{ span: 24 }}
                                style={{ maxWidth: 600 }}
                            >
                                <Form.Item label="Username">
                                    <Space>
                                        <Form.Item
                                            name="username"
                                            noStyle
                                            rules={[{ required: true, message: 'Username is required' }]}
                                        >
                                            <Input style={{ width: 160 }} placeholder="Please input" />
                                        </Form.Item>
                                        <Form.Item
                                            name="username"
                                            noStyle
                                            rules={[{ required: true, message: 'Username is required' }]}
                                        >
                                            <Input style={{ width: 160 }} placeholder="Please input" />
                                        </Form.Item>
                                        <Form.Item
                                            name="username"
                                            noStyle
                                            rules={[{ required: true, message: 'Username is required' }]}
                                        >
                                            <Input style={{ width: 160 }} placeholder="Please input" />
                                        </Form.Item>
                                        <Form.Item
                                            name="username"
                                            noStyle
                                            rules={[{ required: true, message: 'Username is required' }]}
                                        >
                                            <Input style={{ width: 160 }} placeholder="Please input" />
                                        </Form.Item>
                                        <Form.Item
                                            name="username"
                                            noStyle
                                            rules={[{ required: true, message: 'Username is required' }]}
                                        >
                                            <Input style={{ width: 160 }} placeholder="Please input" />
                                        </Form.Item>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </div>
                    </Card>
                </div>
                <div className='info-detail' style={{ background: 'blue' }}>
                    <Card style={{
                        width: '100%',
                        height: '100%'
                    }} title="Đổi mật khẩu">
                        <h3>{userInfo && userInfo.last_login}</h3>
                    </Card>
                </div>
            </Carousel>
        </div>
    </div>);
}

export default Profile;