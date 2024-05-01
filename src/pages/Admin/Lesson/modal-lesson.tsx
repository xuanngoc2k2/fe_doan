/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, GetProp, Input, message, Modal, notification, Select, Switch, Upload, UploadFile, UploadProps } from "antd";
import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import { ICourse, IGroupQuestion, ILesson, IQuestion } from "../../../custom/type";
import {
    backEndUrl,
    callUploadSingleFile,
    callUploadVideo,
    createNewCourse,
    createNewLesson,
    getAllGroupQuestion,
    getAllQuestionByGroupQuestion,
    updateCourse,
    updateLesson,
} from "../../../apis";

function ModalLesson({ dataListCourse, data, open, handelCancel }: { dataListCourse: ICourse[], data?: ILesson | null; open: boolean, handelCancel: () => void }) {
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
    const [uploading, setUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dataLesson, setDataLesson] = useState<ILesson | undefined>();
    const [isVideo, setIsVideo] = useState(data ? data.isQuestion ? false : true : true);
    const [isReading, setIsReading] = useState(true);
    const [groupQuestion, setGroupQuestion] = useState<IGroupQuestion[] | []>([]);
    const [idGroup, setIdGroup] = useState(0);
    const [listQuestion, setListQuestion] = useState<IQuestion[] | []>([]);

    const [fileListVideo, setFileListVideo] = useState<UploadFile[]>(
        data?.isQuestion != null ? [
            {
                uid: '-1',
                name: data.content,
                status: 'done',
                url: `${backEndUrl}/video/${data.content}`,
            },
        ] : []);
    const [fileList, setFileList] = useState<UploadFile[]>(
        data ? [
            {
                uid: '-1',
                name: data.thumbnail,
                status: 'done',
                url: `${backEndUrl}/images/lesson/${data.thumbnail}`,
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

    const onChangeUploadVideo: UploadProps['onChange'] = ({ file: newFileList }) => {
        newFileList.status = 'done';
        setFileListVideo([newFileList]);
    };

    const upLoadFile = async (file: UploadFile, content?: boolean) => {
        const uploadedFile = file.originFileObj as File;
        if (uploadedFile != null) {
            try {
                setUploading(true);
                if (content) {
                    const res = await callUploadVideo(uploadedFile, 'video');
                    if (res.fileName && content) {
                        console.log(res.fileName)
                        // message.success(`Thành công ${res.fileName}`);
                        const lessonInfo = { ...(dataLesson || {}), content: res.fileName } as ILesson;
                        setDataLesson(lessonInfo); // Cập nhật userInfo.image
                        setUploading((false))
                        return lessonInfo; // Trả về userInfo đã được cập nhật
                    }
                }
                else {
                    const res = await callUploadSingleFile(uploadedFile, 'lesson');
                    const lessonInfo = { ...(dataLesson || {}), thumbnail: res.fileName } as ILesson;
                    setDataLesson(lessonInfo); // Cập nhật userInfo.image
                    setUploading((false))
                    return lessonInfo;
                }
                setUploading((false))
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
            setDataLesson(data)
            const idGroup = data.content.split(',');
            setIdGroup(Number(idGroup[0]));
        }
        try {
            const fetch = async () => {
                const res = await getAllGroupQuestion();
                if (res && res.data) {
                    setGroupQuestion(res.data);
                }
                else {
                    notification.error({
                        message: 'Đã xảy ra lỗi lấy dữ liệu group question'
                    })
                }
                if (idGroup) {
                    const res = await getAllQuestionByGroupQuestion(idGroup)
                    if (res && res.data) {
                        setListQuestion(res.data[0].questions);
                    }
                    else {
                        notification.error({
                            message: 'Đã xảy ra lỗi lấy dữ liệu question'
                        })
                    }
                }
            }
            fetch();
        }
        catch (error) {
            notification.error({
                message: String(error)
            })
        }
    }, [idGroup])
    const handleSubmit = async () => {
        if (!data) {
            let newLesson = dataLesson; // Khởi tạo updatedUserInfo bằng userInfo ban đầu

            if (fileList[0] && fileList[0].originFileObj) {
                // Nếu có file ảnh, thực hiện upload ảnh và cập nhật userInfo.image
                newLesson = await upLoadFile(fileList[0]) || newLesson; // Nếu upLoadFile trả về null, giữ nguyên userInfo
            }
            if (fileListVideo[0] && fileListVideo[0].originFileObj) {
                // Nếu có file ảnh, thực hiện upload ảnh và cập nhật userInfo.image
                newLesson = await upLoadFile(fileList[0], true) || newLesson; // Nếu upLoadFile trả về null, giữ nguyên userInfo
            }
            const res = await createNewLesson(newLesson!);
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
            let dataUpdateLesson = dataLesson; // Khởi tạo updatedUserInfo bằng userInfo ban đầu

            if (fileList[0] && fileList[0].originFileObj) {
                // Nếu có file ảnh, thực hiện upload ảnh và cập nhật userInfo.image
                dataUpdateLesson = await upLoadFile(fileList[0]) || dataUpdateLesson; // Nếu upLoadFile trả về null, giữ nguyên userInfo
            }
            if (fileListVideo[0] && fileListVideo[0].originFileObj) {
                // Nếu có file ảnh, thực hiện upload ảnh và cập nhật userInfo.image
                dataUpdateLesson = await upLoadFile(fileListVideo[0], true) || dataUpdateLesson; // Nếu upLoadFile trả về null, giữ nguyên userInfo
            }
            const res = await updateLesson(dataUpdateLesson!.id, dataUpdateLesson!);
            console.log(dataUpdateLesson)
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
    const handleChange = (b: boolean) => {
        setDataLesson((prev: ILesson | undefined) => {
            if (prev) {
                return { ...prev, isQuestion: !b };
            }
            return { ...prev!, isQuestion: !b };
        });
        setIsVideo(b);
    }
    const handleChangeTypeQuestion = (b: boolean) => {
        setIsReading(b);
    }

    const switchDefaultChecked = data ? !data.isQuestion : true;
    return (
        <Modal
            title={data ? 'Thông tin bài học' : 'Thêm mới bài học'}
            onCancel={handelCancel}
            open={open}
            footer={false}
            width={1200}
        >
            <Form layout="vertical"
                initialValues={{
                    lesson_name: data?.lesson_name || '',
                    lesson_des: data?.description || '',
                    course: data?.course!.id ? String(data.course!.id) : undefined,
                    order: data?.order || '',
                    idGroup: data?.isQuestion ? String(data?.content.split(',')[0]) : undefined,
                    content: data?.isQuestion ? String(data?.content.split(',')[1]) : undefined,
                }}>
                <Form.Item
                    label="Tên bài học"
                    name='lesson_name'
                    rules={[{ required: true, message: 'Tên bài học không được để trống!' }]}
                >
                    <Input
                        name="lesson_name"
                        onChange={(e) => {
                            setDataLesson((prev: ILesson | undefined) => {
                                if (prev) {
                                    return { ...prev, lesson_name: e.target.value };
                                }
                                return { ...prev!, lesson_name: e.target.value };
                            });
                        }}
                        value={data?.lesson_name || ''}
                        className="custom-input"
                        placeholder="Nhập tên bài học"
                    />
                </Form.Item>

                <Form.Item name='lesson_des' label="Mô tả">
                    <Input.TextArea
                        onChange={(e) => {
                            setDataLesson((prev: ILesson | undefined) => {
                                if (prev) {
                                    return { ...prev, description: e.target.value };
                                }
                                return { ...prev!, description: e.target.value };
                            });


                        }}
                        name='lesson_des'
                        value={dataLesson?.description} rows={2} />
                </Form.Item>
                <Form.Item name='order' label="Thứ tự bài học">
                    <Input
                        onChange={(e) => {
                            setDataLesson((prev: ILesson | undefined) => {
                                if (prev) {
                                    return { ...prev, order: Number(e.target.value) };
                                }
                                return { ...prev!, order: Number(e.target.value) };
                            });
                        }}
                        name='lesson_des'
                        value={dataLesson?.order} />
                </Form.Item>
                <Form.Item
                    label="Khóa học"
                    name={'course'}
                    rules={[{ required: true, message: 'Khóa học không được để trống!' }]}
                >
                    <Select
                        onChange={(value) => {
                            setDataLesson((prev: ILesson | undefined) => {
                                if (prev) {
                                    return { ...prev, courseId: value };
                                }
                                return { ...prev!, courseId: value };
                            });
                        }}
                        placeholder="Chọn khóa học">
                        {dataListCourse.map((course) =>
                            <Option value={`${course.id}`}>{course.course_name}</Option>
                        )}
                    </Select>
                </Form.Item>
                <Form.Item label={(
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        Nội dung
                        <Switch onChange={handleChange} style={{ marginLeft: 20 }} checkedChildren="Video" unCheckedChildren="Câu hỏi"
                            defaultChecked={switchDefaultChecked}
                        />
                        {!isVideo && <Switch onChange={handleChangeTypeQuestion} style={{ marginLeft: 20 }} checkedChildren="Reading" unCheckedChildren="Listening" defaultChecked />}
                    </div>
                )} valuePropName="fileListVideo"
                    name={data ? undefined : 'content'}
                    rules={[{ required: true, message: 'Video không được để trống!' }]}
                    getValueFromEvent={normFile}
                >
                    {/* có thể nhúng video */}
                    {isVideo ? <Upload
                        name="content"
                        maxCount={1}
                        fileList={fileListVideo}
                        onChange={onChangeUploadVideo}
                    >
                        <Button type="primary">
                            <div><PlusOutlined /> Upload</div>
                        </Button>
                    </Upload>
                        :
                        <>
                            <Form.Item
                                label="Nhóm câu hỏi"
                                name={'idGroup'}
                                rules={[{ required: true, message: 'Nhóm câu hỏi không được để trống!' }]}
                            >
                                <Select
                                    onChange={(value) => {
                                        setIdGroup(value);
                                    }}
                                    placeholder="Chọn nhóm câu hỏi">
                                    {groupQuestion.map((group) =>
                                        <Option value={`${group.id}`}>{group.content}</Option>
                                    )}
                                </Select>
                            </Form.Item>
                            {idGroup != 0 &&
                                <Form.Item
                                    label="Câu hỏi"
                                    name={'content'}
                                    rules={[{ required: true, message: 'Câu hỏi không được để trống!' }]}
                                >
                                    <Select
                                        onChange={(value) => {
                                            setDataLesson((prev: ILesson | undefined) => {
                                                if (prev) {
                                                    return { ...prev, content: (idGroup + ',' + value) };
                                                }
                                                return { ...prev!, content: (idGroup + ',' + value) };
                                            });
                                        }}
                                        placeholder="Chọn câu hỏi">
                                        {listQuestion.map((question) =>
                                            <Option value={`${question.id}`}>{question.question}</Option>
                                        )}
                                    </Select>
                                </Form.Item>}
                        </>}
                </Form.Item>
                <Form.Item label="Hình ảnh minh họa" valuePropName="fileList"
                    name={data ? undefined : 'image'}
                    rules={[{ required: true, message: 'Hình ảnh minh họa không được để trống!' }]}
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
                    <Button onClick={handleSubmit} type="primary" htmlType="submit" >{!data ? 'Tạo mới' : 'Lưu'}</Button>
                    <Button onClick={handelCancel} style={{ marginLeft: 10 }}>Cancel</Button>
                </Form.Item>
            </Form>
        </Modal >);
}

export default ModalLesson;