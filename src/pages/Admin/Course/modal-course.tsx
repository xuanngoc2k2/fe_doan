/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, GetProp, Input, message, Modal, notification, Select, Upload, UploadFile, UploadProps } from "antd";
import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import { ICourse } from "../../../custom/type";
import {
    backEndUrl,
    callUploadSingleFile,
    createNewCourse,
    updateCourse,
} from "../../../apis";

function ModalCourse({ data, open, handelCancel }: { data?: ICourse | null; open: boolean, handelCancel: () => void }) {
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
    const [uploading, setUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [fileList, setFileList] = useState<UploadFile[]>(
        data ? [
            {
                uid: '-1',
                name: data.image,
                status: 'done',
                url: `${backEndUrl}/images/course/${data.image}`,
            },
        ] : []);
    const [dataCourse, setDataCourse] = useState<ICourse | undefined>();
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    const onChangeUpload: UploadProps['onChange'] = ({ file: newFileList }) => {
        newFileList.status = 'done';
        setFileList([newFileList]);
    };

    const upImage = async (file: UploadFile) => {
        const uploadedFile = file.originFileObj as File;
        if (uploadedFile != null) {
            try {
                setUploading(true);
                const res = await callUploadSingleFile(uploadedFile, 'course');
                if (res.fileName) {
                    // message.success(`Thành công ${res.fileName}`);
                    const courseInfo = { ...(dataCourse || {}), image: res.fileName } as ICourse;
                    setDataCourse(courseInfo); // Cập nhật userInfo.image
                    return courseInfo; // Trả về userInfo đã được cập nhật
                }
            } catch (error) {
                message.error("Lỗi");
            } finally {
                setUploading(false); // Đặt lại trạng thái uploading
            }
        }
        return null; // Trả về null nếu có lỗi xảy ra
    };
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
    useEffect(() => {
        if (data) {
            setDataCourse(data)
        }
    }, [])
    const handleSumbit = async () => {
        if (!data) {
            let newCourse = dataCourse; // Khởi tạo updatedUserInfo bằng userInfo ban đầu

            if (fileList[0] && fileList[0].originFileObj) {
                // Nếu có file ảnh, thực hiện upload ảnh và cập nhật userInfo.image
                newCourse = await upImage(fileList[0]) || newCourse; // Nếu upImage trả về null, giữ nguyên userInfo
            }
            const res = await createNewCourse(newCourse!);
            if (res && res.data) {
                notification.success({
                    message: "Tạo mới thành công"
                })
                handelCancel()
            }
            else {
                notification.error({
                    message: "Đã xảy ra lỗi thêm"
                })
            }
        }
        else {
            let dataUpdateCourse = dataCourse; // Khởi tạo updatedUserInfo bằng userInfo ban đầu

            if (fileList[0] && fileList[0].originFileObj) {
                // Nếu có file ảnh, thực hiện upload ảnh và cập nhật userInfo.image
                dataUpdateCourse = await upImage(fileList[0]) || dataUpdateCourse; // Nếu upImage trả về null, giữ nguyên userInfo
            }
            const res = await updateCourse(dataUpdateCourse!.id, dataUpdateCourse!.course_name, dataUpdateCourse!.description, dataUpdateCourse!.image, Number(dataUpdateCourse!.level_required));
            if (res && res.data) {
                notification.success({
                    message: "Cập nhật thành công"
                })
                handelCancel()
            }
            else {
                notification.error({
                    message: "Đã xảy ra lỗi cập nhật"
                })
            }
        }
        console.log(dataCourse)
    }
    return (
        <Modal
            title={data ? 'Thông tin khóa học' : 'Thêm mới khóa học'}
            onCancel={handelCancel}
            open={open}
            footer={false}
        >
            <Form layout="vertical"
                initialValues={{
                    course_name: data?.course_name || '',
                    course_des: data?.description || '',
                    level: data?.level_required ? String(data.level_required) : undefined,
                }}>
                <Form.Item
                    label="Tên khóa học"
                    name='course_name'
                    rules={[{ required: true, message: 'Tên khóa học không được để trống!' }]}
                >
                    <Input
                        name="course_name"
                        onChange={(e) => {
                            setDataCourse((prev: ICourse | undefined) => {
                                if (prev) {
                                    return { ...prev, course_name: e.target.value };
                                }
                                return { ...prev!, course_name: e.target.value };
                                return prev; // Trả về giá trị state không thay đổi nếu prev không tồn tại
                            });
                        }}
                        value={data?.course_name || ''}
                        className="custom-input"
                        placeholder="Nhập tên khóa học"
                    />
                </Form.Item>

                <Form.Item name='course_des' label="Mô tả">
                    <Input.TextArea
                        onChange={(e) => {
                            setDataCourse((prev: ICourse | undefined) => {
                                if (prev) {
                                    return { ...prev, description: e.target.value };
                                }
                                return { ...prev!, description: e.target.value };
                            });


                        }}
                        name='course_des'
                        value={dataCourse?.description} rows={4} />
                </Form.Item>
                <Form.Item
                    label="Level"
                    name={'level'}
                    rules={[{ required: true, message: 'Level không được để trống!' }]}
                >
                    <Select
                        onChange={(value) => {
                            setDataCourse((prev: ICourse | undefined) => {
                                if (prev) {
                                    return { ...prev, level_required: value };
                                }
                                return { ...prev!, level_required: value };
                            });
                        }}
                        placeholder="Chọn cấp độ">
                        <Option value="1">TOPIK 1</Option>
                        <Option value="2">TOPIK 2</Option>
                        <Option value="3">TOPIK 3</Option>
                        <Option value="4">TOPIK 4</Option>
                        <Option value="5">TOPIK 5</Option>
                        <Option value="6">TOPIK 6</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Hình ảnh" valuePropName="fileList"
                    name={data ? undefined : 'image'}
                    rules={[{ required: true, message: 'Hình ảnh không được để trống!' }]}
                    getValueFromEvent={normFile}
                >
                    <Upload
                        name="image"
                        maxCount={1}
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChangeUpload}
                        onPreview={onPreview}
                    >
                        <button style={{ border: 0, background: 'none' }} type="button">
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button onClick={handleSumbit} type="primary" htmlType="submit" >{!data ? 'Tạo mới' : 'Lưu'}</Button>
                    <Button onClick={handelCancel} style={{ marginLeft: 10 }}>Cancel</Button>
                </Form.Item>
            </Form>
        </Modal>);
}

export default ModalCourse;