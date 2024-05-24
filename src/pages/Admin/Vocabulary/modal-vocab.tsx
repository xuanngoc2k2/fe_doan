/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusOutlined } from "@ant-design/icons";
import { Button, Collapse, Form, GetProp, Input, message, Modal, notification, Select, Space, Upload, UploadFile, UploadProps } from "antd";
import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import { ICourse, IVocabulary } from "../../../custom/type";
import {
    backEndUrl,
    callUploadSingleFile,
    createNewCourse,
    createNewVocab,
    updateCourse,
    updateVocab,
} from "../../../apis";
import TextArea from "antd/es/input/TextArea";

function ModalVocab({ data, open, handelCancel, idList }: { data?: IVocabulary | null; open: boolean, handelCancel: () => void, idList?: number }) {
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
    const [uploading, setUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dataVocab, setDataVocab] = useState<IVocabulary | undefined>();
    const [fileList, setFileList] = useState<UploadFile[]>(
        (data && data.image) ? [
            {
                uid: '-1',
                name: data.image!,
                status: 'done',
                url: `${backEndUrl}/images/vocabulary/${data.image!}`,
            },
        ] : []);
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
                const res = await callUploadSingleFile(uploadedFile, 'vocabulary');
                if (res.fileName) {
                    const courseInfo = { ...(dataVocab || {}), image: res.fileName } as ICourse;
                    setDataVocab(courseInfo); // Cập nhật userInfo.image
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
            setDataVocab(data)
        }
    }, [])
    const handleSumbit = async () => {
        if (!data) {
            let newVocab = dataVocab; // Khởi tạo updatedUserInfo bằng userInfo ban đầu

            if (fileList[0] && fileList[0].originFileObj) {
                // Nếu có file ảnh, thực hiện upload ảnh và cập nhật userInfo.image
                newVocab = await upImage(fileList[0]) || newVocab; // Nếu upImage trả về null, giữ nguyên userInfo
            }
            let res = null;
            if (idList) {
                res = await createNewVocab(newVocab!, idList!);
            }
            else {
                res = await createNewVocab(newVocab!);
            }
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
            let dataUpdateVocab = dataVocab; // Khởi tạo updatedUserInfo bằng userInfo ban đầu
            if (fileList[0] && fileList[0].originFileObj) {
                // Nếu có file ảnh, thực hiện upload ảnh và cập nhật userInfo.image
                dataUpdateVocab = await upImage(fileList[0]) || dataUpdateVocab; // Nếu upImage trả về null, giữ nguyen userInfo
            }
            const res = await updateVocab(dataUpdateVocab!.id!, dataUpdateVocab!);
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
    }
    return (
        <Modal
            title={data ? 'Thông tin từ vựng' : 'Thêm mới từ vựng'}
            onCancel={handelCancel}
            open={open}
            footer={false}
        >
            <Form layout="vertical" initialValues={{
                word_name: data?.word || '',
                word_meaning: data?.meaning || '',
                level: data?.level && String(data?.level) || undefined,
                partOfSpeech: data?.partOfSpeech || '',
                spell: data?.spell || '',
                example: data?.example || '',
            }}>
                <Form.Item
                    style={{ marginBottom: 0 }}
                    label="Từ mới"
                    name={'word_name'}
                    rules={[{ required: true, message: 'Vui lòng nhập từ mới!' }]}
                >
                    <Input
                        value={dataVocab?.word}
                        onChange={(e) => setDataVocab(prevState => ({ ...prevState, word: e.target.value }))}
                        className="custom-input"
                        placeholder="Nhập tên danh sách từ"
                    />
                </Form.Item>
                <Form.Item
                    style={{ marginBottom: 0 }}
                    label="Định nghĩa"
                    name={'word_meaning'}
                    rules={[{ required: true, message: 'Vui lòng nhập định nghĩa từ!' }]}
                >
                    <Input
                        value={dataVocab?.meaning}
                        onChange={(e) => setDataVocab(prevState => ({ ...prevState, meaning: e.target.value }))}
                        className="custom-input"
                        placeholder="Nhập nhập định nghĩa từ"
                    />
                </Form.Item>
                <Form.Item
                    style={{ marginBottom: 0 }}
                    required
                    name={'description'}
                    label="Mô tả"
                >
                    <Space.Compact>
                        <Form.Item
                            name={['level']}
                            noStyle
                            rules={[{ required: true, message: 'Cấp độ từ là bắt buộc' }]}
                        >
                            <Select onSelect={(value) => setDataVocab(prevState => ({ ...prevState, level: Number(value) }))} placeholder="Chọn cấp độ">
                                <Option value="1">TOPIK 1</Option>
                                <Option value="2">TOPIK 2</Option>
                                <Option value="3">TOPIK 3</Option>
                                <Option value="4">TOPIK 4</Option>
                                <Option value="5">TOPIK 5</Option>
                                <Option value="6">TOPIK 6</Option>
                            </Select>

                        </Form.Item>
                        <Form.Item
                            name={['partOfSpeech']}
                            noStyle
                            rules={[{ required: true, message: 'Loại từ là bắt buộc' }]}
                        >
                            <Input onChange={(e) => setDataVocab(prevState => ({ ...prevState, partOfSpeech: e.target.value }))} style={{ width: '100%' }} placeholder="Nhập loại từ" />
                        </Form.Item>
                        <Form.Item
                            name={['spell']}
                            noStyle
                            rules={[{ required: true, message: 'Phiên âm từ là bắt buộc' }]}
                        >
                            <Input onChange={(e) => setDataVocab(prevState => ({ ...prevState, spell: e.target.value }))} style={{ width: '100%' }} placeholder="Nhập phiên âm" />
                        </Form.Item>
                    </Space.Compact>
                </Form.Item>
                <Collapse style={{ marginBottom: 10, marginTop: 10 }} size="small" items={[{
                    key: '1',
                    label: 'Thêm ảnh/ví dụ',
                    children:
                        (<>
                            <Form.Item style={{ marginBottom: 0 }} label="Hình ảnh" valuePropName="fileList" getValueFromEvent={normFile}>
                                <Upload
                                    fileList={fileList}
                                    onChange={onChangeUpload}
                                    onPreview={onPreview}
                                    maxCount={1} listType="picture-card">
                                    <button style={{ border: 0, background: 'none' }} type="button">
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </button>
                                </Upload>
                            </Form.Item>
                            <Form.Item name={'example'} label="Ví dụ">
                                <TextArea onChange={(e) => setDataVocab(prevState => ({ ...prevState, example: e.target.value }))} rows={2} />
                            </Form.Item>
                            {/* <Form.Item
                                name={['course']}
                            >
                                <Select onSelect={(value) => setDataVocab(prevState => ({ ...prevState, courseId: Number(value) }))} placeholder="Chọn khóa học">
                                    {listCourse.map((course) => {
                                        return (
                                            <Select.Option value={course.id}>{course.course_name}</Select.Option>)
                                    })}
                                </Select>

                            </Form.Item> */}
                        </>)
                }]} />
                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={handleSumbit}>{data ? "Lưu" : "Tạo mới"}</Button>
                    <Button style={{ marginLeft: 10 }} onClick={handelCancel}>Cancel</Button>
                </Form.Item>
            </Form>
        </Modal>);
}

export default ModalVocab;