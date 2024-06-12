/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IAnswer, IQuestion } from "../../../custom/type";
import { backEndUrl, callUploadSingleFile, deleteAnswer, getAnswer, getDetailQuestion, updateQuestion } from "../../../apis";
import { Button, Form, GetProp, Input, message, notification, Popconfirm, Radio, Select, Space, theme, Upload, UploadFile, UploadProps } from "antd";
import { Content } from "antd/es/layout/layout";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import ModalAnswer from "./modal-answer";
import './question.scss';

const QuestionDetail: React.FC = () => {
    const { id } = useParams();
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
    const [question, setQuestion] = useState<IQuestion | null>();
    const [open, setOpen] = useState(false);
    const [dataEditAnswer, setDataEditAnswer] = useState<IAnswer | null>();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
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

    const fetch = async () => {
        try {
            const res = await getDetailQuestion(id!);
            if (res && res.data) {
                setQuestion(res.data)
            }
            else {
                notification.error({
                    message: "Đã xảy ra lỗi lấy dữ liệu"
                })
            }
        }
        catch (error) {
            notification.error({
                message: String(error)
            })
        }
    }
    useEffect(() => {
        fetch();
    }, [id])
    const handleCancel = () => {
        setOpen(false);
        setDataEditAnswer(null);
    }
    const handleEditAnswer = async (id: number) => {
        try {
            const res = await getAnswer(id);
            if (res && res.data) {
                setDataEditAnswer(res.data);
            }
            else {
                setDataEditAnswer(null);
            }
        }
        catch {
            console.log("lỗi")
        }
        setOpen(true)
    }
    // const disable = (!addNew && editGr) ? true : false;
    const handleChangeAnswerIsTrue = (value: number) => {
        const answers = question?.answers.map((answer) => {
            if (answer.id == value) {
                return { ...answer, is_true: true }
            }
            else return { ...answer, is_true: false }
        }) as IAnswer[];
        setQuestion((prev) => {
            return {
                ...prev!, answers: answers
            }
        })
    }
    const handleSubmitAnswer = (an: IAnswer, isEdit: boolean) => {
        let answers = question?.answers as IAnswer[];
        if (isEdit) {
            answers = question?.answers.map((answer) => {
                if (answer.id == an.id) {
                    return { ...an }
                }
                else return { ...answer }
            }) as IAnswer[];
        }
        else {
            answers = [...answers, { ...an } as IAnswer]
        }
        setQuestion((prev) => {
            return {
                ...prev!, answers: answers
            }
        })
        fetch()
    }
    const handleDeleteAnswer = async (id: number) => {
        const res = await deleteAnswer(id);
        if (res && res.data) {
            const updatedAnswers = question?.answers.filter(answer => answer.id !== id) || [];
            setQuestion(prev => ({
                ...prev!,
                answers: updatedAnswers
            }));
            notification.success({ message: "Xóa thành công" })
        }
        else {
            console.log("Lỗi")
        }
    }
    const [form2] = Form.useForm();
    const [editQ, setEditQ] = useState(false);
    const [fileImageEdit, setFileImageEdit] = useState<UploadFile | null>();
    const onChangeUploadImageEdit: UploadProps['onChange'] = ({ file: newFile }) => {
        newFile.status = 'done';
        setFileImageEdit(newFile);
    };
    const upLoadFileImageEdit = async (file: UploadFile) => {
        const uploadedFile = file.originFileObj as File;
        if (uploadedFile != null) {
            try {
                const res = await callUploadSingleFile(uploadedFile, 'question');
                const questionInfo = { ...(question || {}), image: res.fileName } as IQuestion;
                setQuestion(questionInfo); // Cập nhật userInfo.image
                return questionInfo; // Trả về userInfo đã được cập nhật
            } catch (error) {
                message.error("Lỗi");
            } finally {
                // setUploading(false); // Đặt lại trạng thái uploading
            }
        }
        return null; // Trả về null nếu có lỗi xảy ra
    };
    const handleSetEditQuestion = () => {
        form2.setFieldValue('question-edit', question?.question)
        form2.setFieldValue('level', String(question?.level))
        form2.setFieldValue('score', question?.score)
        setEditQ(!editQ);
    }
    const handleEditQuestion = async () => {
        if (question?.id) {
            let questionUpdate = question;
            if (fileImageEdit) {
                questionUpdate = await upLoadFileImageEdit(fileImageEdit) as IQuestion;
            }
            console.log(questionUpdate)
            const res = await updateQuestion(question?.id, questionUpdate);
            if (res && res.data) {
                notification.success({ message: "Cập nhật câu hỏi thành công" });
                setEditQ(false)
                fetch()
            }
            else {
                notification.error({ message: "Cập nhật lỗi" })
            }
        }
    }
    return (<>
        <Content style={{ padding: '0 48px', marginBottom: 20 }}>
            <div
                style={{
                    background: colorBgContainer,
                    height: 70,
                    lineHeight: '70px',
                    borderRadius: borderRadiusLG,
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <h2>Thông tin câu hỏi</h2>
            </div>
            <div
                style={{
                    marginTop: 20,
                    background: colorBgContainer,
                    padding: 24,
                    borderRadius: borderRadiusLG,
                }}
            >
                <>
                    <div>
                        {question?.group_question?.type === 'Listening' ?
                            <>
                                <p>{question.group_question.content}</p>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <audio controls>
                                        <source src={`${backEndUrl}/audio/${question.group_question.audio}`} />
                                    </audio>
                                </div>
                            </> :
                            <>
                                <h3>{question?.group_question?.description}</h3>
                                <p>{question?.group_question?.content}</p>
                            </>}
                        {question?.group_question?.image && <img src={`${backEndUrl}/images/question/${question?.group_question?.image}`} alt='question' />}
                    </div>
                    <div className='question'>
                        <section key={question?.id}>
                            <Form
                                form={form2}
                            >
                                <div style={{ display: 'flex' }}>
                                    <h3>Câu hỏi:</h3>
                                    <Form.Item
                                        name={'question-edit'}
                                        style={{ width: '70%', marginBottom: 0, display: !editQ ? 'none' : '' }}

                                    >
                                        <Input
                                            onChange={(e) => setQuestion((prev) => ({ ...prev!, question: e.target.value }))}
                                            value={question?.question}
                                            name="question-edit" />
                                    </Form.Item>
                                    <Space.Compact
                                        style={{ width: '20%', marginBottom: 0, display: !editQ ? 'none' : '' }}
                                    >
                                        <Form.Item
                                            name={['level']}
                                            noStyle
                                        >
                                            <Select
                                                value={question?.level}
                                                onChange={(value) => setQuestion((prev) => ({ ...prev!, level: Number(value) }))}
                                                placeholder="Chọn cấp độ">
                                                <Option value="1">TOPIK 1</Option>
                                                <Option value="2">TOPIK 2</Option>
                                                <Option value="3">TOPIK 3</Option>
                                                <Option value="4">TOPIK 4</Option>
                                                <Option value="5">TOPIK 5</Option>
                                                <Option value="6">TOPIK 6</Option>
                                            </Select>

                                        </Form.Item>
                                        <Form.Item
                                            name={['score']}
                                            noStyle
                                        >
                                            <Input
                                                value={question?.score}
                                                onChange={(e) => setQuestion((prev) => ({ ...prev!, score: Number(e.target.value) }))}
                                                type="number"
                                                suffix={'점'} />
                                        </Form.Item>
                                    </Space.Compact>
                                    <h3 style={{ display: editQ ? 'none' : '' }}> {question?.question} (TOPIK {question?.level}) [{question?.score} 점]</h3>
                                    <EditOutlined
                                        style={{
                                            fontSize: 20,
                                            color: '#ffa500',
                                        }}
                                        onClick={handleSetEditQuestion} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {question?.image && <img width={500} src={`${backEndUrl}/images/question/${question.image}`} />}
                                    {editQ &&
                                        <Form.Item
                                            style={{ marginLeft: 20 }}
                                            name={`question-image`}
                                        >
                                            <Upload
                                                name="question-image"
                                                listType="picture-card"
                                                maxCount={1}
                                                onChange={onChangeUploadImageEdit}
                                                onPreview={onPreview}
                                            >
                                                <button style={{ border: 0, background: 'none' }} type="button">
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 8 }}>Upload</div>
                                                </button>
                                            </Upload>
                                        </Form.Item>}
                                </div>
                                <div >
                                    <Radio.Group
                                        style={{ width: '100%' }}
                                        value={
                                            question?.answers.find((a) => a.is_true)?.id
                                        }
                                    >
                                        {question?.answers.map((answer) => {
                                            return (
                                                <>
                                                    <div style={{
                                                        display: 'flex',
                                                        padding: 10,
                                                        paddingLeft: 30,
                                                        margin: 5,
                                                        justifyContent: 'space-between',
                                                        border: '1px solid #ccc',
                                                        borderColor: answer.is_true ? '#b7eb8f' : '#ccc',
                                                        backgroundColor: answer.is_true ? '#f6ffed' : '',
                                                        color: answer.is_true ? '#389e0d' : ''
                                                    }}>
                                                        <div style={{ width: '80%', fontSize: 14, display: 'flex', alignItems: 'center' }}>
                                                            {answer.isImage ? <img width={150} src={backEndUrl + '/images/answer/' + answer.answer} /> :
                                                                <h3 >{answer.answer}</h3>}</div>
                                                        <div style={{ width: '10%', justifyContent: 'flex-end', display: 'flex' }}>
                                                            <Space>
                                                                <EditOutlined
                                                                    style={{
                                                                        fontSize: 20,
                                                                        color: '#ffa500',
                                                                    }}
                                                                    onClick={() => {
                                                                        handleEditAnswer(answer.id);
                                                                    }}
                                                                />

                                                                {!answer.is_true && <Popconfirm
                                                                    placement="leftTop"
                                                                    title={"Xác nhận xóa đáp án này"}
                                                                    description={"Bạn có chắc chắn muốn xóa đáp án này ?"}
                                                                    onConfirm={() => handleDeleteAnswer(answer.id)}
                                                                    okText="Xác nhận"
                                                                    cancelText="Hủy"
                                                                >
                                                                    <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                                                        <DeleteOutlined
                                                                            style={{
                                                                                fontSize: 20,
                                                                                color: '#ff4d4f',
                                                                            }}
                                                                        />
                                                                    </span>
                                                                </Popconfirm>}
                                                            </Space>
                                                        </div>
                                                        <Radio
                                                            checked={answer.is_true}
                                                            style={{ width: '5%', justifyContent: 'center' }}
                                                            key={answer.id}
                                                            value={answer.id}
                                                            onChange={(value) => handleChangeAnswerIsTrue(value.target.value)}
                                                        >
                                                        </Radio>
                                                    </div >
                                                </>
                                            )
                                        })}
                                    </Radio.Group>
                                    <div
                                        onClick={() => {
                                            if (question?.type == 'fill') {
                                                notification.info({ message: "Câu hỏi dạng điền vào chỗ trống chỉ có một đáp án!" })
                                                return
                                            }
                                            setOpen(true)
                                        }}
                                        style={{
                                            cursor: 'pointer',
                                            display: 'flex',
                                            padding: 10,
                                            paddingLeft: 30,
                                            margin: 5,
                                            justifyContent: 'space-between',
                                            border: '1px solid #ccc',
                                        }}>
                                        <h3><PlusOutlined /> Thêm câu trả lời</h3>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button onClick={handleEditQuestion} type="primary" htmlType="submit">Lưu</Button>
                                </div>
                            </Form>
                        </section>
                    </div>
                    {open && <ModalAnswer
                        id={question?.id}
                        handleSubmitAnswer={handleSubmitAnswer}
                        data={dataEditAnswer} open={open} handleCancel={handleCancel} />}
                </>
            </div >
        </Content >
    </>);
}

export default QuestionDetail;