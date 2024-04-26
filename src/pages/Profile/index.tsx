import {
    Button,
    // Avatar, 
    Card, Carousel, DatePicker, Form,
    GetProp,
    // GetProp,     UploadProps 
    Input, message,
    Upload,
    UploadFile,
    UploadProps,
} from 'antd';
import './profile.scss'
import { useEffect, useRef, useState } from 'react';
import { CarouselRef } from 'antd/es/carousel';
import { backEndUrl, callUploadSingleFile, getInfoUser, updatePass, updateUserInfo } from '../../apis';
import { IUser } from '../../custom/type';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

function Profile() {
    const [isActive, setIsActive] = useState(0);
    const [userInfo, setUserInfo] = useState<IUser | null>(null);
    const crRef = useRef<CarouselRef | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
    const [uploading, setUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dataUpdatePass, setDataUpdatePass] = useState<{ pass: string, newPass: string }>();

    const handleClick = () => {
        if (crRef.current) {
            console.log(crRef.current.innerSlider.state.currentSlide)
            crRef.current.goTo(isActive == 0 ? 1 : 0)
        }
    }
    const fetchUserInfo = async () => {
        try {
            const res = await getInfoUser();
            if (res.data) {
                setUserInfo(res.data);
                if (res.data.image) {
                    setFileList([
                        {
                            uid: '-1',
                            name: res.data.image,
                            status: 'done',
                            url: `${backEndUrl}/images/users/${res.data.image}`,
                        },
                    ]);
                }
            } else {
                message.error("Lỗi lấy data");
            }
        } catch (error) {
            message.error("Lỗi lấy data");
        } finally {
            setIsLoading(!isLoading); // Kết thúc quá trình loading dữ liệu
        }
    };

    useEffect(() => {
        if (!userInfo && isLoading) {
            fetchUserInfo();
        }
    }, [userInfo, isLoading]);

    const dateFormat = 'DD-MM-YYYY';
    dayjs.extend(customParseFormat);
    // Chuyển đổi định dạng ngày


    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as FileType);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };
    const onChangeAvatar: UploadProps['onChange'] = ({ file: newFileList }) => {
        newFileList.status = 'done';
        setFileList([newFileList]);
    };
    const onChange = () => {

    }
    const upImage = async (file: UploadFile) => {
        const uploadedFile = file.originFileObj as File;
        if (uploadedFile != null) {
            try {
                setUploading(true);
                const res = await callUploadSingleFile(uploadedFile, 'users');
                if (res.fileName) {
                    message.success(`Thành công ${res.fileName}`);
                    // Tạo một bản sao của userInfo với image mới 
                    const updatedUserInfo = { ...(userInfo || {}), image: res.fileName } as IUser;
                    setUserInfo(updatedUserInfo); // Cập nhật userInfo.image
                    return updatedUserInfo; // Trả về userInfo đã được cập nhật
                }
            } catch (error) {
                message.error("Lỗi");
            } finally {
                setUploading(false); // Đặt lại trạng thái uploading
            }
        }
        return null; // Trả về null nếu có lỗi xảy ra
    };



    const handleUpdate = async () => {
        try {
            let updatedUserInfo = userInfo; // Khởi tạo updatedUserInfo bằng userInfo ban đầu

            if (fileList[0] && fileList[0].originFileObj) {
                // Nếu có file ảnh, thực hiện upload ảnh và cập nhật userInfo.image
                updatedUserInfo = await upImage(fileList[0]) || userInfo; // Nếu upImage trả về null, giữ nguyên userInfo
            }

            // Kiểm tra nếu userInfo đã được cập nhật image, thì mới thực hiện updateUserInfo
            if (updatedUserInfo && !uploading) {
                const res = await updateUserInfo(updatedUserInfo);
                if (res.data.success === true) {
                    message.success("Cập nhật thành công !!");
                } else {
                    message.error("Cập nhật thất bại");
                }
            }
        } catch (error) {
            message.error("Có lỗi xảy ra trong quá trình cập nhật");
        }
    };
    const handleUpdatePass = async () => {
        try {
            const res = await updatePass(dataUpdatePass!.pass, dataUpdatePass!.newPass);
            console.log(res);
            if (res.data) {
                if (res.data.success === false) {
                    message.error(res.data.message)
                }
                if (res.data.success === true) {
                    message.success(res.data.message)
                }
            }
            else {
                message.error(
                    res.data.message
                )
            }

        } catch {
            message.error("Lỗi")
        }
    }
    return (
        <div className="profile-page-container">
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
                                {/* {userInfo?.image ? <img src={`${backEndUrl}/images/vocabulary/${userInfo?.image}`} /> :
                                    <Avatar icon={<UserOutlined />} size={150} />
                                } */}
                                {/* <ImgCrop rotationSlider> */}
                                <Upload
                                    maxCount={1}
                                    listType="picture-circle"
                                    fileList={fileList}
                                    onChange={onChangeAvatar}
                                    onPreview={onPreview}
                                >
                                    {fileList.length < 5 && '+ Upload'}
                                </Upload>
                                {/* </ImgCrop> */}
                            </div>
                            <div className='info-detail'>
                                {userInfo ? <Form
                                    className='form-info'
                                    layout='vertical'
                                    name="complex-form"
                                    initialValues={{
                                        fullName: userInfo?.full_name || '',
                                        phone: userInfo?.phone_number || '',
                                        email: userInfo?.email || '',
                                        level: userInfo.level
                                    }}
                                >
                                    <Form.Item
                                        label="Họ và tên"
                                        rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                                        name="fullName"
                                        className="custom-input"
                                    >
                                        <Input
                                            size='large'
                                            onChange={(e) => {
                                                const value = e.target.value as string;
                                                setUserInfo((prev: IUser | null) => ({ ...prev!, full_name: value }));
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Số điện thoại"
                                        name="phone"
                                        className="custom-input"
                                        rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                                    >
                                        <Input
                                            size='large'
                                            onChange={(e) => {
                                                const value = e.target.value as string;
                                                setUserInfo((prev: IUser | null) => ({ ...prev!, phone_number: value }));
                                            }}
                                        />
                                    </Form.Item>
                                    <div>

                                    </div>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        className="custom-input"
                                    >
                                        <Input
                                            disabled
                                            size='large'
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Level"
                                        name="level"
                                    >
                                        <Input
                                            disabled
                                            size='large'
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        style={{ marginLeft: 50 }}
                                        label="Ngày sinh"
                                        name="birthday"
                                    >

                                        <DatePicker
                                            allowClear={false}
                                            onChange={(value) => {
                                                if (value) {
                                                    setUserInfo((prev: IUser | null) => ({ ...prev!, date_of_birth: value.toDate() }));
                                                }
                                            }}
                                            size='large'
                                            defaultValue={dayjs(dayjs(userInfo.date_of_birth, { format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }).format('DD-MM-YYYY'), dateFormat)}
                                            format={dateFormat} />
                                    </Form.Item>
                                    <Form.Item style={{ position: 'absolute', bottom: 0, right: 10 }}>
                                        <Button type="primary" htmlType="submit" onClick={handleUpdate}>Cập nhật</Button>
                                    </Form.Item>
                                </Form> : <></>}
                            </div>
                        </Card>
                    </div>
                    <div className='info-content' style={{ background: 'blue' }}>
                        <Card style={{
                            width: '100%',
                            height: '100%'
                        }} title="Đổi mật khẩu">
                            <Form
                                layout='vertical'
                                name="complex-form"
                            >
                                <Form.Item
                                    label="Mật khẩu cũ"
                                    rules={[{ required: true, message: 'Mật khẩu cũ không được để trống!' }
                                    ]}
                                    hasFeedback
                                    name="last_password"
                                    className="custom-input"
                                >
                                    <Input.Password
                                        size='large'
                                        onChange={(e) => {
                                            const value = e.target.value as string;
                                            setDataUpdatePass((prev) => ({ ...prev!, pass: value }))
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Mật khẩu mới"
                                    name="new_password"
                                    className="custom-input"
                                    hasFeedback
                                    rules={[
                                        { required: true, message: 'Mật khẩu mới không được để trống!' }
                                    ]}
                                >
                                    <Input.Password
                                        size='large'
                                        onChange={(e) => {
                                            const value = e.target.value as string;
                                            setDataUpdatePass((prev) => ({ ...prev!, newPass: value }))
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Xác nhận mật khẩu mới"
                                    name="re_new_password"
                                    hasFeedback
                                    className="custom-input"
                                    rules={[{ required: true, message: 'Xác nhận mật khẩu không được để trống!' },
                                    (
                                        { getFieldValue }
                                    ) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('new_password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject("Xác nhận mật khẩu không trùng khớp")
                                        }
                                    })
                                    ]}
                                >
                                    <Input.Password
                                        size='large'
                                    />
                                </Form.Item>
                                <Form.Item style={{ position: 'absolute', bottom: 0, right: 10 }}>
                                    <Button type="primary" htmlType="submit" onClick={handleUpdatePass}>Cập nhật</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                </Carousel>
            </div>
        </div>);
}

export default Profile;