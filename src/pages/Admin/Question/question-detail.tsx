import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CreateNewQuestion, IAnswer, IGroupQuestion, IQuestion } from "../../../custom/type";
import { backEndUrl, callUploadAudio, callUploadSingleFile, createNewQuestion, deleteAnswer, getAllGroupQuestion, getAnswer, getDetailQuestion, updateGroupQuestion, updateQuestion } from "../../../apis";
import { Button, Form, GetProp, Input, message, notification, Popconfirm, Radio, Select, Space, theme, Upload, UploadFile, UploadProps } from "antd";
import { Content } from "antd/es/layout/layout";
import { CloseOutlined, DeleteOutlined, EditOutlined, MinusOutlined, PlusOutlined, RedoOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import ModalAnswer from "./modal-answer";
import './question.scss';

const QuestionDetail: React.FC = () => {
    const { id } = useParams();
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
    const [dataListGroupQuestion, setDataListGroupQuestion] = useState<IGroupQuestion[] | []>([]);
    const [groupQuestion, setGroupQuestion] = useState<IGroupQuestion | null>();
    const [question, setQuestion] = useState<IQuestion | null>();
    const [dataQuestion, setDataQuestion] = useState<IQuestion[] | []>([CreateNewQuestion as IQuestion]);
    const [addNew, setAddNew] = useState(false);
    const [editGr, setEditGr] = useState(false);
    const [open, setOpen] = useState(false);
    const [fileAudio, setFileAudio] = useState<UploadFile>();
    const [fileImage, setFileImage] = useState<UploadFile | null>();
    const [dataEditAnswer, setDataEditAnswer] = useState<IAnswer | null>();
    const [form] = Form.useForm();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
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

    const upLoadFile = async (file: UploadFile, audio?: boolean) => {
        const uploadedFile = file.originFileObj as File;
        if (uploadedFile != null) {
            try {
                if (audio) {
                    const res = await callUploadAudio(uploadedFile, 'audio');
                    if (res.fileName && audio) {
                        // message.success(`Thành công ${res.fileName}`);
                        const groupInfo = { ...(groupQuestion || {}), audio: res.fileName } as IGroupQuestion;
                        setGroupQuestion(groupInfo); // Cập nhật userInfo.image
                        return groupInfo; // Trả về userInfo đã được cập nhật
                    }
                }
                else {
                    const res = await callUploadSingleFile(uploadedFile, 'question');
                    const groupInfo = { ...(groupQuestion || {}), image: res.fileName } as IGroupQuestion;
                    setGroupQuestion(groupInfo); // Cập nhật userInfo.image
                    return groupInfo; // Trả về userInfo đã được cập nhật
                }
            } catch (error) {
                message.error("Lỗi");
            } finally {
                // setUploading(false); // Đặt lại trạng thái uploading
            }
        }
        return null; // Trả về null nếu có lỗi xảy ra
    };
    const onChangeUpload: UploadProps['onChange'] = ({ file: newFile }) => {
        newFile.status = 'done';
        setFileImage(newFile);
    };
    const onChangeUploadAudio: UploadProps['onChange'] = ({ file: newFile }) => {
        newFile.status = 'done';
        setFileAudio(newFile);
    };
    const fetch = async () => {
        try {
            const res = await getAllGroupQuestion();
            if (res && res.data) {
                setDataListGroupQuestion(res.data);
            }
            if (id != 'create-new') {
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
        }
        catch (error) {
            notification.error({
                message: String(error)
            })
        }
    }
    useEffect(() => {
        fetch();
    }, [id, groupQuestion?.id])
    const handleSubmit = async () => {
        if (dataQuestion && groupQuestion?.content != '') {
            try {
                let newGr = groupQuestion;
                if (fileAudio) {
                    newGr = await upLoadFile(fileAudio, true);
                }
                if (fileImage) {
                    newGr = await upLoadFile(fileImage);
                }
                const res = await createNewQuestion(dataQuestion, newGr!)
                if (res && res.data) {
                    notification.success({
                        message: "Tạo mới câu hỏi thành công"
                    });
                    setDataQuestion([{ ...CreateNewQuestion } as IQuestion]);
                    setGroupQuestion(null);
                }
                else {
                    notification.error({
                        message: "Đã xảy ra lỗi"
                    });
                }
            }
            catch (error) {
                notification.error({
                    message: String(error)
                })
            }
        }
    }
    const handleRemoveAnswer = (questionIndex: number, answerIndex: number) => {
        setDataQuestion((prev) => {
            const updatedQuestions = [...prev];
            updatedQuestions[questionIndex].answers.splice(answerIndex, 1);
            if (updatedQuestions[questionIndex].answers.length == 0) {
                form.setFieldValue(`type_question_${questionIndex}`, undefined)
            }
            return updatedQuestions;
        });
    };
    const handleRadioChange = (questionIndex: number, answerIndex: number) => {
        setDataQuestion((prevData) => {
            const newData = [...prevData];
            newData[questionIndex].answers.forEach((answer, index) => {
                if (index === answerIndex) {
                    newData[questionIndex].answers[index].is_true = true;
                } else {
                    newData[questionIndex].answers[index].is_true = false;
                }
            });
            return newData;
        });
    };
    const Reset = () => {
        setGroupQuestion(null);
        form.setFieldValue('group_question', null);
        form.setFieldValue('type_question', undefined);
        form.setFieldValue('des_groupquestion', '');
        setFileImage(null);
    }
    const handleReset = () => {
        setAddNew(false);
        setEditGr(false);
        Reset()
    }
    const handleAddNew = () => {
        setAddNew(true);
        Reset();
    }
    const handleUpdateGroup = async () => {
        try {
            if (groupQuestion?.id && groupQuestion) {
                const res = await updateGroupQuestion(groupQuestion!.id, groupQuestion!);
                if (res && res.data) {
                    notification.success({ message: "Update thành công" })
                }
                else {
                    notification.error({ message: "Đã xảy ra lỗi update" })
                }

            }
        }
        catch (error) {
            notification.error({ message: String(error) })
        }
    }
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
    const handleSetEditQuestion = () => {
        form2.setFieldValue('question-edit', question?.question)
        form2.setFieldValue('level', String(question?.level))
        form2.setFieldValue('score', question?.score)
        setEditQ(!editQ);
    }
    const handleEditQuestion = async () => {
        if (question?.id) {
            const res = await updateQuestion(question?.id, question);
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
                <h2>{id === 'create-new' ? 'Thêm mới câu hỏi' : 'Thông tin câu hỏi'}</h2>
            </div>
            <div
                style={{
                    marginTop: 20,
                    background: colorBgContainer,
                    padding: 24,
                    borderRadius: borderRadiusLG,
                }}
            >
                {id === 'create-new' ?
                    <>
                        <Form
                            form={form}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Form.Item
                                    rules={[{ required: true, message: 'Nhóm câu không được để trống!' }]}
                                    name={'group_question'}
                                    label="Nhóm câu hỏi"
                                    style={{ minWidth: 350, width: '80%' }}
                                >
                                    {addNew || editGr ? <Input
                                        name="group_question"
                                        placeholder="Nhập tên nhóm câu hỏi"
                                        value={groupQuestion?.content}
                                        allowClear
                                        onChange={(e) => {
                                            setGroupQuestion((prev) => ({ ...prev!, content: e.target.value }))
                                        }} />
                                        :
                                        <Select allowClear
                                            onChange={(value) => {
                                                const rs = dataListGroupQuestion.find((gr) => gr.id == Number(value));
                                                setGroupQuestion(rs);
                                                form.setFieldValue('type_question', rs?.type);
                                                form.setFieldValue('des_groupquestion', rs?.description);
                                                form.setFieldValue("group_question", rs?.content);
                                            }}
                                            value={groupQuestion}
                                            placeholder="Chọn nhóm câu hỏi">
                                            {dataListGroupQuestion.map((groupQuestion) => {
                                                return (
                                                    <Select.Option value={`${groupQuestion.id}`}>{groupQuestion.content}</Select.Option>
                                                )
                                            })}
                                        </Select>}
                                </Form.Item>
                                <div style={{ fontSize: 20, marginLeft: 10, marginRight: 10, display: 'flex', height: 32 }}>
                                    {groupQuestion && <EditOutlined style={{ marginRight: 10 }} onClick={() => { setEditGr(true) }} />}
                                    <RedoOutlined onClick={handleReset} />
                                </div>
                                <Button onClick={handleAddNew} style={{ marginRight: 20, width: '15%' }} icon={<PlusOutlined />} type="primary">Thêm mới nhóm câu hỏi</Button>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <Form.Item
                                    label="Loại nhóm câu hỏi"
                                    name={'type_question'}
                                    rules={[{ required: true, message: 'Nhóm câu không được để trống!' }]}
                                >
                                    <Select
                                        disabled={(!addNew)}
                                        onChange={(value) => {
                                            setGroupQuestion((prev) => ({ ...prev!, type: value }))
                                        }}
                                        allowClear
                                        style={{ maxWidth: 150 }}
                                        placeholder="Chọn loại câu hỏi"
                                    >
                                        <Option value={`Reading`}>Reading</Option>
                                        <Option value={`Listening`}>Listening</Option>
                                    </Select>
                                </Form.Item>
                                {(groupQuestion?.type == "Listening" ||
                                    form.getFieldValue('type_question') == "Listening") &&
                                    <Form.Item
                                        getValueFromEvent={normFile}
                                        style={{ marginLeft: 20 }}
                                        rules={[{ required: true, message: 'File nghe không được để trống!' }]}
                                        label="File nghe"
                                        name={'audio'}
                                    >
                                        <Upload
                                            onChange={onChangeUploadAudio}
                                            disabled={(!addNew && editGr)}
                                            name="audio"
                                            maxCount={1}
                                        >
                                            <Button type="primary">
                                                <div><PlusOutlined /> Upload</div>
                                            </Button>
                                        </Upload>
                                    </Form.Item>
                                }
                            </div>
                            {(groupQuestion || addNew) && <Form.Item label="Hình ảnh" valuePropName="fileList"
                                name={'image'}
                                // rules={[{ required: true, message: 'Hình ảnh không được để trống!' }]}
                                getValueFromEvent={normFile}
                            >
                                <div style={{ display: 'flex' }}>
                                    {groupQuestion?.image && !addNew && <img src={backEndUrl + '/images/question/' + groupQuestion.image} />}
                                    <Upload
                                        name="image"
                                        maxCount={1}
                                        listType="picture-card"
                                        // fil={fileImage}
                                        onChange={onChangeUpload}
                                        onPreview={onPreview}
                                    >
                                        <button style={{ border: 0, background: 'none' }} type="button">
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </button>
                                    </Upload>
                                </div>
                            </Form.Item>}
                            <Form.Item
                                name={'des_groupquestion'}
                                rules={[{ required: true, message: 'Mô tả nhóm câu hỏi không được để trống!' }]}
                                label="Mô tả">
                                <Input.TextArea
                                    disabled={(!addNew && !editGr)}
                                    value={groupQuestion?.description}
                                    onChange={(e) => {
                                        setGroupQuestion((prev) => ({ ...prev!, description: e.target.value }))
                                    }}
                                    rows={1} />
                            </Form.Item>
                            {editGr && <Button onClick={handleUpdateGroup}
                                style={{ marginBottom: 20 }}>Lưu</Button>}
                            {dataQuestion.map((question, index) => {
                                return (
                                    <div style={{ position: 'relative', padding: 10, border: '1px solid #ccc', borderRadius: 10, marginBottom: 20 }}>
                                        <MinusOutlined onClick={() => {
                                            if (index == 0) {
                                                notification.error({
                                                    message: "Không thể xóa hết câu hỏi"
                                                })
                                                return
                                            }
                                            setDataQuestion((prev) => {
                                                const updatedQuestions = [...prev];
                                                updatedQuestions.splice(index, 1);
                                                return updatedQuestions;
                                            });
                                        }} />
                                        <Form.Item
                                            name={`question-${index}`}
                                            rules={[{ required: true, message: 'Câu hỏi không được để trống!' }]}
                                            label="Câu hỏi"
                                        >
                                            <Input placeholder="Nhập câu hỏi"
                                                value={dataQuestion[index].question || ''}
                                                onChange={(e) => {

                                                    setDataQuestion((prev) => {
                                                        const updatedQuestions = [...prev];
                                                        updatedQuestions[index] = {
                                                            ...updatedQuestions[index],
                                                            question: e.target.value
                                                        };
                                                        return updatedQuestions;
                                                    });
                                                }} />
                                        </Form.Item>
                                        <div style={{ display: 'flex' }}>
                                            <Form.Item
                                                label={'Level'}
                                                name={`Level-${index}`}
                                            >
                                                <Select
                                                    value={dataQuestion[index].level}
                                                    onChange={(value) => {
                                                        setDataQuestion((prev) => {
                                                            const updatedQuestions = [...prev];
                                                            updatedQuestions[index] = {
                                                                ...updatedQuestions[index],
                                                                level: value
                                                            };
                                                            return updatedQuestions;
                                                        });
                                                    }}
                                                    placeholder="Chọn Level" style={{ minWidth: 100 }}>
                                                    <Option value="1">1</Option>
                                                    <Option value="2">2</Option>
                                                    <Option value="3">3</Option>
                                                    <Option value="4">4</Option>
                                                    <Option value="5">5</Option>
                                                    <Option value="6">6</Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                label="Kiểu câu hỏi"
                                                rules={[{ required: true, message: 'Kiêu câu hỏi không được để trống!' }]}
                                                name={`type_question_${index}`}
                                                style={{ marginLeft: 20 }}
                                            >
                                                <Select
                                                    value={dataQuestion[index].type}
                                                    onChange={(value) => {
                                                        setDataQuestion((prev) => {
                                                            const updatedQuestions = [...prev];
                                                            updatedQuestions[index] = {
                                                                ...updatedQuestions[index],
                                                                type: value
                                                            };
                                                            return updatedQuestions;
                                                        });
                                                    }} placeholder="Chọn kiểu câu hỏi" style={{ minWidth: 200 }}>
                                                    <Option value="multiple-choice">Trắc nghiệm</Option>
                                                    {!(question.answers.length > 1) && <Option value="fill">Điền vào chỗ trống</Option>}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                style={{ marginLeft: 20 }}
                                                label="Điểm"
                                                rules={[{ required: true, message: 'Điểm của câu hỏi không được để trống!' }]}
                                                name={`score-${index}`}
                                            >
                                                <Input value={dataQuestion[index].score} onChange={(e) => {
                                                    setDataQuestion((prev) => {
                                                        const updatedQuestions = [...prev];
                                                        updatedQuestions[index] = {
                                                            ...updatedQuestions[index],
                                                            score: +Number(e.target.value)
                                                        };
                                                        return updatedQuestions;
                                                    });
                                                }} placeholder='Nhập điểm' type="number" />
                                            </Form.Item>
                                        </div>
                                        <div >
                                            {/* {question?.answers.map((answer) => {
                                                return (
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
                                                        {answer.isImage ? <img width={150} src={backEndUrl + '/images/question/' + answer.answer} /> : <h3>{answer.answer}</h3>}
                                                        <div style={{ width: '10%', justifyContent: 'flex-end', display: 'flex' }}>
                                                            <Space>
                                                                <EditOutlined
                                                                    style={{
                                                                        fontSize: 20,
                                                                        color: '#ffa500',
                                                                    }}
                                                                    onClick={() => {
                                                                    }}
                                                                />
                                                                <Popconfirm
                                                                    placement="leftTop"
                                                                    title={"Xác nhận xóa bài học"}
                                                                    description={"Bạn có chắc chắn muốn xóa bài học này ?"}
                                                                    // onConfirm={() => handleDeleteLesson(record.id)}
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
                                                                </Popconfirm>
                                                            </Space>
                                                        </div>
                                                    </div>
                                                )
                                            })} */}
                                            {question.answers.length >= 1 && form.getFieldValue(`type_question_${index}`) == "multiple-choice" ?
                                                <Form.Item
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                                        <h3 style={{ width: '18%', textAlign: 'center' }}>Đáp án đúng</h3>
                                                    </div>
                                                    <Radio.Group
                                                        defaultValue={`${index}-0`}
                                                        style={{ width: '100%' }}>
                                                        {question.answers.map((_, ix) => {

                                                            const isAnswerTrue = dataQuestion[index].answers[ix].is_true;
                                                            return (
                                                                <div style={{ display: 'flex' }}>
                                                                    <Form.Item
                                                                        style={{ width: '85%' }}
                                                                        name={`answer-${index}-${ix}`}
                                                                        rules={[{ required: true, message: 'Câu trả lời không được để trống!' }]}
                                                                    >
                                                                        <Input
                                                                            value={dataQuestion[index].answers[ix].answer}
                                                                            onChange={(e) => {
                                                                                setDataQuestion((prev) => {
                                                                                    const updatedQuestions = [...prev];
                                                                                    updatedQuestions[index].answers[ix] = {
                                                                                        ...updatedQuestions[index].answers[ix],
                                                                                        answer: e.target.value
                                                                                    };
                                                                                    return updatedQuestions;
                                                                                });
                                                                            }}
                                                                            prefix={<CloseOutlined onClick={() => handleRemoveAnswer(index, ix)} />}
                                                                            style={{ height: 45 }} placeholder="Nhập câu trả lời" />
                                                                    </Form.Item>
                                                                    <Radio onChange={() => handleRadioChange(index, ix)}
                                                                        checked={isAnswerTrue} style={{ height: 45, width: '15%', justifyContent: 'center' }} key={`${index}-${ix}`} value={`${index}-${ix}`}>
                                                                    </Radio>
                                                                </div >
                                                            )
                                                        })}
                                                    </Radio.Group>
                                                </Form.Item>
                                                : (question.answers.length == 1 && form.getFieldValue(`type_question_${index}`)) ?
                                                    <Form.Item
                                                        name={`answer-${index}`}
                                                        rules={[{ required: true, message: 'Câu trả lời không được để trống!' }]}>
                                                        <Input
                                                            value={dataQuestion[index].answers[0].answer}
                                                            onChange={(e) => {
                                                                setDataQuestion((prev) => {
                                                                    const updatedQuestions = [...prev];
                                                                    updatedQuestions[index].answers[0] = {
                                                                        ...updatedQuestions[index].answers[0],
                                                                        answer: e.target.value
                                                                    };
                                                                    return updatedQuestions;
                                                                });
                                                            }}
                                                            style={{ height: 45 }} placeholder="Nhập câu trả lời" />
                                                    </Form.Item> : <></>}
                                            <div onClick={() => {
                                                if (form.getFieldValue(`type_question_${index}`) === 'fill' && question.answers.length >= 1) {
                                                    notification.info({
                                                        message: 'Loại câu hỏi điền vào chỗ trống chỉ có 1 đáp án'
                                                    })
                                                    return
                                                }
                                                if (!form.getFieldValue(`type_question_${index}`)) {
                                                    notification.error({
                                                        message: 'Chọn loại câu hỏi trước'
                                                    })
                                                    return
                                                }
                                                setDataQuestion((prev) => {
                                                    const updatedQuestion = { ...prev[index] };
                                                    const isTrue = updatedQuestion.answers.length == 0 ? true : false;
                                                    updatedQuestion.answers = [
                                                        ...updatedQuestion.answers,
                                                        {
                                                            answer: '', is_true: isTrue
                                                        } as IAnswer
                                                    ];
                                                    const updatedQuestions = [...prev.slice(0, index), updatedQuestion, ...prev.slice(index + 1)];
                                                    return updatedQuestions;
                                                });
                                            }} style={{
                                                cursor: 'pointer',
                                                display: 'flex',
                                                backgroundColor: '#e6fffb',
                                                padding: 10,
                                                paddingLeft: 30,
                                                margin: 5,
                                                justifyContent: 'space-between',
                                                border: '1px solid #ccc',
                                            }}>
                                                <h3><PlusOutlined /> Thêm câu trả lời</h3>
                                            </div>

                                        </div>
                                    </div>
                                )
                            })}
                            <div onClick={() => {
                                setDataQuestion((prev) => {
                                    const updatedQuestions = [...prev, { ...CreateNewQuestion, answers: [] as IAnswer[] } as IQuestion];
                                    return updatedQuestions;
                                });
                            }}
                                style={{ marginTop: 10, cursor: 'pointer' }}>
                                <PlusOutlined /> Thêm câu hỏi
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                                <Button onClick={handleSubmit} type="primary" htmlType="submit">Thêm</Button>
                            </div>
                        </Form>
                    </> :
                    <>
                        <div>
                            {question?.group_question?.type === 'Listening' ?
                                <>
                                    <p>※{question.group_question.content}</p>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <audio controls>
                                            <source src={`${backEndUrl}/audio/${question.group_question.audio}`} />
                                        </audio>
                                    </div>
                                </> :
                                <>
                                    <h3>※{question?.group_question?.description}</h3>
                                    <p>※{question?.group_question?.content}</p>
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
                                                <Input value={question?.score} onChange={(e) => setQuestion((prev) => ({ ...prev!, score: Number(e.target.value) }))} type="number" placeholder="Nhập điểm" />
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
                                    <div >

                                        <Radio.Group
                                            style={{ width: '100%' }}
                                            defaultValue={
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
                                            onClick={() => setOpen(true)}
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
                }
            </div >
        </Content >
    </>);
}

export default QuestionDetail;