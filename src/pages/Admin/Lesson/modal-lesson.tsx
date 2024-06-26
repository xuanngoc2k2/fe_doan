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
    createNewLesson,
    getAllGroupQuestion,
    getAllQuestionByGroupQuestion,
    getCourseWithLessons,
    updateLesson,
} from "../../../apis";

function ModalLesson({ dataListCourse, data, open, handelCancel }: { dataListCourse: ICourse[], data?: ILesson | null; open: boolean, handelCancel: () => void }) {
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
    const [uploading, setUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dataLesson, setDataLesson] = useState<ILesson | undefined>();
    const [isVideo, setIsVideo] = useState(data ? data.isQuestion ? false : true : true);
    const [audio, setAudio] = useState();
    const [groupQuestion, setGroupQuestion] = useState<IGroupQuestion[] | []>([]);
    const [idGroup, setIdGroup] = useState(0);
    const [form] = Form.useForm();
    const [listQuestion, setListQuestion] = useState<IQuestion[] | []>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);

    const [fileListVideo, setFileListVideo] = useState<UploadFile[]>(
        (data && !data?.isQuestion) ? [
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
                    const isMp4 = uploadedFile.name.endsWith('.mp4') || uploadedFile.name.endsWith('.avi') || uploadedFile.name.endsWith('.mov');
                    if (!isMp4) {
                        notification.error({ message: "Chỉ cho phép upload file video dạng mp4/avi/mov!" });
                        setUploading(false);
                        return null;
                    }
                    const res = await callUploadVideo(uploadedFile, 'video');
                    if (res.fileName && content) {
                        const lessonInfo = { ...(dataLesson || {}), content: res.fileName } as ILesson;
                        setDataLesson(lessonInfo);
                        setUploading((false))
                        return lessonInfo;
                    }
                }
                else {
                    const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;
                    const isImage = imageExtensions.test(uploadedFile.name);
                    if (!isImage) {
                        notification.error({ message: "Chỉ cho phép upload file hình ảnh dạng ['jpg', 'jpeg', 'png', 'gif']!" });
                        setUploading(false);
                        return null;
                    }
                    const res = await callUploadSingleFile(uploadedFile, 'lesson');
                    const lessonInfo = { ...(dataLesson || {}), thumbnail: res.fileName } as ILesson;
                    setDataLesson(lessonInfo);
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
            if (data.isQuestion) {
                const idGroup = data.question.group_question?.id;
                setIdGroup(Number(idGroup));
            }
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
            }
            fetch();
        }
        catch (error) {
            notification.error({
                message: String(error)
            })
        }
    }, [data])

    useEffect(() => {
        const fetch = async () => {
            if (idGroup) {
                const res = await getAllQuestionByGroupQuestion(idGroup)
                setDataLesson((prev) => {
                    return { ...prev!, isQuestion: true };
                })
                if (res && res.data) {
                    setAudio(res.data.audio);
                    setListQuestion(res.data.questions);
                    const selectedQ = res.data.questions.find((question: IQuestion) => question.id == dataLesson?.questionId);
                    console.log(selectedQ)
                    setSelectedQuestion(selectedQ || null);
                }
                else {
                    notification.error({
                        message: 'Đã xảy ra lỗi lấy dữ liệu question'
                    })
                }
            }
        }
        fetch();
    }, [idGroup])
    const handleSubmit = async () => {
        await form.validateFields();

        if (!data) {
            let newLesson = dataLesson; // Khởi tạo updatedUserInfo bằng userInfo ban đầu
            if (fileList[0] && fileList[0].originFileObj) {
                newLesson = await upLoadFile(fileList[0]) || newLesson;
                if (newLesson?.thumbnail) {
                    newLesson = { ...newLesson!, thumbnail: newLesson.thumbnail }
                }
            }
            if (fileListVideo[0] && fileListVideo[0].originFileObj) {
                const temp = await upLoadFile(fileListVideo[0], true) || newLesson;
                if (temp?.content) {
                    newLesson = { ...newLesson!, content: temp.content }
                }
                const video = document.createElement('video');
                video.src = `${backEndUrl}/video/${newLesson?.content}`;
                await new Promise<void>((resolve, reject) => {
                    video.onloadedmetadata = function () {
                        const durationMinutes = Math.floor(video.duration / 60);
                        const durationSeconds = Math.floor(video.duration % 60);
                        const formattedDuration = `${durationMinutes}:${durationSeconds}`;
                        newLesson = { ...newLesson, duration: formattedDuration } as ILesson;
                        resolve();
                    };
                });
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
                dataUpdateLesson = await upLoadFile(fileList[0]) || dataUpdateLesson; // Nếu upLoadFile trả về null, giữ nguyên userInfo
            }
            if (fileListVideo[0] && fileListVideo[0].originFileObj) {
                const temp = await upLoadFile(fileListVideo[0], true) || dataUpdateLesson;
                if (temp?.content) {
                    dataUpdateLesson = { ...dataUpdateLesson!, content: temp.content }
                }
                const video = document.createElement('video');
                video.src = `${backEndUrl}/video/${dataUpdateLesson?.content}`;
                await new Promise<void>((resolve, reject) => {
                    video.onloadedmetadata = function () {
                        const durationMinutes = Math.floor(video.duration / 60);
                        const durationSeconds = Math.floor(video.duration % 60);
                        const formattedDuration = `${durationMinutes}:${durationSeconds}`;
                        dataUpdateLesson = { ...dataUpdateLesson, duration: formattedDuration } as ILesson;
                        resolve();
                    };
                });
            }
            const res = await updateLesson(dataUpdateLesson!.id, dataUpdateLesson!);
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
    const handleSetOrder = async (index: number) => {
        const res = await getCourseWithLessons(index);
        if (res && res.data) {
            const order = res.data.lessons.length;
            if (order) {
                form.setFieldValue('order', Number(order) + 1)
                setDataLesson((prev) => ({ ...prev!, order: (order) + 1 }))
            }
            else {
                form.setFieldValue('order', 1)
                setDataLesson((prev) => ({ ...prev!, order: 1 }))
            }
        }
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
            <Form form={form} layout="vertical"
                initialValues={{
                    lesson_name: data?.lesson_name || '',
                    lesson_des: data?.description || '',
                    course: data?.course!.id ? String(data.course!.id) : undefined,
                    order: data?.order || '',
                    idGroup: data?.isQuestion ? String(data.question.group_question?.id) : undefined,
                    content: data?.isQuestion ? String(data?.questionId) : undefined,
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
                            handleSetOrder(value);
                        }}
                        placeholder="Chọn khóa học">
                        {dataListCourse.map((course) =>
                            <Option value={`${course.id}`}>{course.course_name}</Option>
                        )}
                    </Select>
                </Form.Item>
                <Form.Item name='order' label="Thứ tự bài học">
                    <Input
                        disabled
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
                <Form.Item label={(
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        Nội dung
                        <Switch onChange={handleChange} style={{ marginLeft: 20 }} checkedChildren="Video" unCheckedChildren="Câu hỏi"
                            defaultChecked={switchDefaultChecked}
                        />
                        {!isVideo && audio && <audio controls>
                            <source src={`${backEndUrl}/audio/${audio}`} />
                        </audio>}
                        {/* {!isVideo && <Switch onChange={handleChangeTypeQuestion} style={{ marginLeft: 20 }} checkedChildren="Reading" unCheckedChildren="Listening" defaultChecked />} */}
                    </div>
                )} valuePropName="fileListVideo"
                    name={data ? undefined : 'content'}
                    rules={[{ required: isVideo, message: 'Video không được để trống!' }]}
                    getValueFromEvent={normFile}
                >
                    {/* có thể nhúng video */}
                    {isVideo ? <Upload
                        name="content"
                        maxCount={1}
                        fileList={fileListVideo}
                        accept="video/*"
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
                                        setSelectedQuestion(null);
                                        form.setFieldValue('content', undefined)
                                    }}
                                    placeholder="Chọn nhóm câu hỏi">
                                    {groupQuestion.map((group) =>
                                        <Option value={`${group.id}`}>{group.content}</Option>
                                    )}
                                </Select>
                            </Form.Item>
                            {idGroup != 0 && groupQuestion.find(gr => gr.id == idGroup)?.image && <img width={400} src={`${backEndUrl}/images/question/${groupQuestion.find(gr => gr.id == idGroup)?.image}`} />}
                            {idGroup != 0 &&
                                <>
                                    <Form.Item
                                        label="Câu hỏi"
                                        name={'content'}
                                        rules={[{ required: true, message: 'Câu hỏi không được để trống!' }]}
                                    >
                                        <Select
                                            onChange={(value) => {
                                                const selected = listQuestion.find(question => question.id == value);
                                                setSelectedQuestion(selected || null);
                                                setDataLesson((prev: ILesson | undefined) => {
                                                    if (prev) {
                                                        return { ...prev, questionId: value };
                                                    }
                                                    return { ...prev!, questionId: value };
                                                });
                                            }}
                                            placeholder="Chọn câu hỏi">
                                            {listQuestion.map((question) =>
                                                <Option key={`${question.id}`} value={`${question.id}`}>{question.question}</Option>
                                            )}
                                        </Select>
                                    </Form.Item>
                                    {selectedQuestion?.image && <img width={300} src={`${backEndUrl}/images/question/${selectedQuestion.image}`} />}
                                </>
                            }
                        </>}
                </Form.Item >
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
            </Form >
        </Modal >);
}

export default ModalLesson;