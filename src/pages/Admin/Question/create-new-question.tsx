/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { CreateNewQuestion, IAnswer, IGroupQuestion, IQuestion } from "../../../custom/type";
import { backEndUrl, callUploadAudio, callUploadSingleFile, createNewQuestion, getAllGroupQuestion, updateGroupQuestion } from "../../../apis";
import { Button, Form, GetProp, Input, message, notification, Radio, Select, theme, Upload, UploadFile, UploadProps } from "antd";
import { Content } from "antd/es/layout/layout";
import { CloseOutlined, EditOutlined, MinusOutlined, PlusOutlined, RedoOutlined, UploadOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
// import ModalAnswer from "./modal-answer";
import './question.scss';
import { UploadChangeParam } from "antd/es/upload";

const Create_NewQuestion: React.FC = () => {
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
    const [dataListGroupQuestion, setDataListGroupQuestion] = useState<IGroupQuestion[] | []>([]);
    const [groupQuestion, setGroupQuestion] = useState<IGroupQuestion | null>();
    const [dataQuestion, setDataQuestion] = useState<IQuestion[] | []>([CreateNewQuestion as IQuestion]);
    const [addNew, setAddNew] = useState(false);
    const [editGr, setEditGr] = useState(false);
    const [fileAudio, setFileAudio] = useState<UploadFile>();
    const [fileImage, setFileImage] = useState<UploadFile | null>();
    const [fileListImageQuestion, setFileListImageQuestion] = useState<{ newFile: UploadFile; index: number }[] | []>([]);
    const [fileListImageAnswer, setFileListImageAnswer] = useState<{ newFile: UploadFile; index: number, indexAnswer: number }[] | []>([]);
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
                    const isMp3 = uploadedFile.name.endsWith('.mp3');
                    if (!isMp3) {
                        notification.error({ message: "Chỉ cho phép upload file audio dạng mp3!" });
                        return null;
                    }
                    const res = await callUploadAudio(uploadedFile, 'audio');
                    if (res.fileName && audio) {
                        const groupInfo = { ...(groupQuestion || {}), audio: res.fileName } as IGroupQuestion;
                        setGroupQuestion(groupInfo); // Cập nhật userInfo.image
                        return groupInfo; // Trả về userInfo đã được cập nhật
                    }
                }
                else {
                    const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;
                    const isImage = imageExtensions.test(uploadedFile.name);
                    if (!isImage) {
                        notification.error({ message: "Chỉ cho phép upload file hình ảnh dạng ['jpg', 'jpeg', 'png', 'gif']!" });
                        return null;
                    }
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
    const upLoadFileImageQuestion = async (file: UploadFile, index: number) => {
        const uploadedFile = file.originFileObj as File;
        if (uploadedFile != null) {
            try {
                const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;
                const isImage = imageExtensions.test(uploadedFile.name);
                if (!isImage) {
                    notification.error({ message: "Chỉ cho phép upload file hình ảnh dạng ['jpg', 'jpeg', 'png', 'gif']!" });
                    return null;
                }
                const res = await callUploadSingleFile(uploadedFile, 'question');
                const question = dataQuestion[index];
                const questionUpdate = { ...(question || {}), image: res.fileName } as IQuestion;
                return questionUpdate;
            } catch (error) {
                message.error("Lỗi");
            } finally {
                // setUploading(false); // Đặt lại trạng thái uploading
            }
        }
    };

    const upLoadFileImageAnswer = async (index: number) => {
        let question = dataQuestion[index];
        if (fileListImageAnswer.find((item) => item.index == index)) {
            const answerUpdate = dataQuestion[index].answers;
            for (const file of fileListImageAnswer) {
                if (file.index == index && file.newFile.originFileObj) {
                    const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;
                    const isImage = imageExtensions.test(file.newFile.name);
                    if (!isImage) {
                        notification.error({ message: "Chỉ cho phép upload file hình ảnh dạng ['jpg', 'jpeg', 'png', 'gif']!" });
                        break;
                    }
                    const resUpAnswer = await callUploadSingleFile(file.newFile.originFileObj, 'answer');
                    if (resUpAnswer.fileName) {
                        const a = dataQuestion[index].answers[file.indexAnswer];
                        const updateA = { ...(a || {}), answer: resUpAnswer.fileName } as IAnswer;
                        answerUpdate[file.indexAnswer] = updateA;
                    }
                }
            }
            question = { ...question, answers: answerUpdate } as IQuestion;
        }
        return question;
    };

    const onChangeUpload: UploadProps['onChange'] = ({ file: newFile }) => {
        newFile.status = 'done';
        setFileImage(newFile);
    };
    const onChangeUploadAudio: UploadProps['onChange'] = ({ file: newFile }) => {
        newFile.status = 'done';
        setFileAudio(newFile);
    };
    const handleOnChangeImageQuestion = (index: number, newFile: UploadFile<any>, e: UploadChangeParam<UploadFile<any>>) => {
        newFile.status = 'done';
        setFileListImageQuestion((prev: any) => {
            if (e.fileList.length) {
                const existingIndex = prev.findIndex((item: any) => item.newFile.originFileObj === newFile.originFileObj);
                if (existingIndex !== -1) {
                    const updatedList = [...prev];
                    updatedList[existingIndex] = { newFile, index };
                    return updatedList;
                } else {
                    return [...prev, { newFile, index }];
                }
            } else {
                return prev.filter((item: any) => item.index !== index);
            }
        });
    }
    const handleOnChangeImageAnswer = (index: number, indexAnswer: number, newFile: UploadFile<any>, e: UploadChangeParam<UploadFile<any>>) => {
        newFile.status = 'done';
        setFileListImageAnswer((prev) => {
            if (e.fileList.length) {
                const existingIndex = prev.findIndex((item) => item.index === index && item.indexAnswer === indexAnswer);
                if (existingIndex !== -1) {
                    const updatedList = [...prev];
                    updatedList[existingIndex] = { newFile, index, indexAnswer };
                    return updatedList;
                } else {
                    return [...prev, { newFile, index, indexAnswer }];
                }
            } else {
                return prev.filter((item) => !(item.index === index && item.indexAnswer === indexAnswer));
            }
        });
    };
    const fetch = async () => {
        try {
            const res = await getAllGroupQuestion();
            if (res && res.data) {
                setDataListGroupQuestion(res.data);
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
    }, [groupQuestion?.id])

    const handleSubmit = async () => {
        // console.log(fileListImageQuestion);
        let data = dataQuestion;
        if (fileListImageQuestion.length) {
            for (const file of fileListImageQuestion) {
                const question = await upLoadFileImageQuestion(file.newFile, file.index) as IQuestion;
                data = data.map((d, index) => {
                    if (index === file.index) {
                        return { ...d, image: question.image }
                    }
                    else {
                        return d as IQuestion;
                    }
                })
            }
        }
        if (fileListImageAnswer.length) {
            const processedIndexes = new Set<number>();
            for (const file of fileListImageAnswer) {
                if (!processedIndexes.has(file.index)) {
                    data[file.index] = await upLoadFileImageAnswer(file.index);
                    processedIndexes.add(file.index);
                }
            }
        }
        console.log(data);
        await form.validateFields()
        if (dataQuestion && groupQuestion?.content != '') {
            try {
                let newGr = groupQuestion;
                if (fileAudio) {
                    newGr = await upLoadFile(fileAudio, true);
                }
                if (fileImage) {
                    newGr = await upLoadFile(fileImage);
                }
                console.log(data);
                const res = await createNewQuestion(data as IQuestion[], newGr!)
                if (res && res.data) {
                    notification.success({
                        message: "Tạo mới câu hỏi thành công"
                    });
                    setDataQuestion([{ ...CreateNewQuestion } as IQuestion]);
                    setGroupQuestion(null);
                    fetch();
                    form.resetFields();
                    setDataListGroupQuestion([]);
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
            resetFieldAnswer(questionIndex, updatedQuestions[questionIndex].answers)
            console.log(answerIndex, questionIndex);
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
                let newGr = groupQuestion;
                if (fileAudio) {
                    newGr = await upLoadFile(fileAudio, true) as IGroupQuestion;
                }
                if (fileImage) {
                    newGr = await upLoadFile(fileImage) as IGroupQuestion;
                }
                console.log(newGr);
                const res = await updateGroupQuestion(newGr!.id, newGr!);
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
    const resetFieldAnswer = (questionIndex: number, answers: IAnswer[]) => {
        answers.map((ans, index) => {
            form.setFieldValue(`answer-${questionIndex}-${index}`, ans.answer)
        });
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
                <h2>Thêm mới câu hỏi</h2>
            </div>
            <div
                style={{
                    marginTop: 20,
                    background: colorBgContainer,
                    padding: 24,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Form
                    form={form}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Form.Item
                            rules={[{ required: true, message: 'Nhóm câu không được để trống!' }]}
                            name={'group_question'}
                            label="Nhóm câu hỏi"
                            style={{ minWidth: 350, width: '80%' }}
                        >
                            {addNew || editGr ? <Input.TextArea
                                name="group_question"
                                placeholder="Nhập nhóm câu hỏi"
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
                                            <Select.Option key={groupQuestion.id} value={`${groupQuestion.id}`} title={groupQuestion.content}>{groupQuestion.content}</Select.Option>
                                        )
                                    })}
                                </Select>}
                        </Form.Item>
                        <div style={{ fontSize: 20, marginLeft: 10, marginRight: 10, display: 'flex', height: 32 }}>
                            {groupQuestion?.id && <EditOutlined style={{ marginRight: 10 }} onClick={() => { setEditGr(true) }} />}
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
                            <div>
                                <Form.Item
                                    getValueFromEvent={normFile}
                                    style={{ marginLeft: 20 }}
                                    rules={[{ required: true, message: 'File nghe không được để trống!' }]}
                                    label="File nghe"
                                    name={'audio'}
                                >
                                    {(editGr || addNew) && <Upload
                                        onChange={onChangeUploadAudio}
                                        disabled={!(addNew || editGr)}
                                        name="audio"
                                        maxCount={1}
                                    >
                                        <Button type="primary">
                                            <div><PlusOutlined /> Upload</div>
                                        </Button>
                                    </Upload>}
                                </Form.Item>

                                {groupQuestion?.audio &&
                                    <audio controls>
                                        <source src={`${backEndUrl}/audio/${groupQuestion.audio}`} />
                                    </audio>}
                            </div>
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
                        // rules={[{ required: true, message: 'Mô tả nhóm câu hỏi không được để trống!' }]}
                        label="Mô tả">
                        <Input.TextArea
                            disabled={(!addNew && !editGr)}
                            value={groupQuestion?.description}
                            onChange={(e) => {
                                setGroupQuestion((prev) => ({ ...prev!, description: e.target.value }))
                            }}
                            rows={1} />
                    </Form.Item>
                    {editGr && groupQuestion?.id && <Button onClick={handleUpdateGroup}
                        style={{ marginBottom: 20 }}>Lưu</Button>}
                    {dataQuestion.map((question, index) => {
                        return (
                            <div key={`question-${index}`} style={{ position: 'relative', padding: 10, border: '1px solid #ccc', borderRadius: 10, marginBottom: 20 }}>
                                <MinusOutlined onClick={() => {
                                    if (index == 0 && dataQuestion.length == 1) {
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
                                <Form.Item
                                    name={`question-image-${index}`}
                                    label="Hình ảnh"
                                >
                                    <Upload
                                        name="question-image"
                                        maxCount={1}
                                        listType="picture-card"
                                        onChange={(e) => {
                                            // handleChangeUploadImageQuestion(e);
                                            handleOnChangeImageQuestion(index, e.file, e);
                                        }}
                                        onPreview={onPreview}
                                    >
                                        <button style={{ border: 0, background: 'none' }} type="button">
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </button>
                                    </Upload>
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
                                <div>
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
                                                        <div key={`answer-${index}-${ix}`} style={{ display: 'flex', alignItems: 'center', paddingBottom: 10 }}>
                                                            <Form.Item
                                                                style={{ width: '85%', marginBottom: 0 }}
                                                                name={`answer-${index}-${ix}`}
                                                                rules={[{ required: true, message: 'Câu trả lời không được để trống!' }]}
                                                            >
                                                                {_.isImage ?
                                                                    <div style={{ display: 'flex', padding: '4px 11px', border: '1px solid #d9d9d9', borderRadius: 6 }}>
                                                                        <CloseOutlined style={{ marginRight: 5 }} onClick={() => handleRemoveAnswer(index, ix)} />
                                                                        <Upload
                                                                            name={`answer-${index}-${ix}`}
                                                                            maxCount={1}
                                                                            listType="picture-card"
                                                                            onChange={(e) => {
                                                                                handleOnChangeImageAnswer(index, ix, e.file, e);
                                                                            }}
                                                                            onPreview={onPreview}
                                                                        >
                                                                            <button style={{ border: 0, background: 'none' }} type="button">
                                                                                <PlusOutlined />
                                                                                <div style={{ marginTop: 8 }}>Upload</div>
                                                                            </button>
                                                                        </Upload>
                                                                    </div> :
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
                                                                        suffix={<p style={{ cursor: 'pointer', display: 'flex' }} onClick={() => {
                                                                            setDataQuestion((prev) => {
                                                                                const updatedQuestions = [...prev];
                                                                                updatedQuestions[index].answers[ix] = {
                                                                                    ...updatedQuestions[index].answers[ix],
                                                                                    isImage: true,
                                                                                };
                                                                                return updatedQuestions;
                                                                            });
                                                                        }}>
                                                                            <UploadOutlined style={{ fontSize: 18, marginRight: 5 }} />
                                                                            <p>Hình ảnh</p>
                                                                        </p>}
                                                                        style={{ height: 45 }} placeholder="Nhập câu trả lời" />
                                                                }
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
                                                    answer: '',
                                                    is_true: isTrue,
                                                    isImage: false
                                                } as IAnswer
                                            ];
                                            const updatedQuestions = [...prev.slice(0, index), updatedQuestion, ...prev.slice(index + 1)];
                                            resetFieldAnswer(index, updatedQuestion.answers)
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
            </div >
        </Content >
    </>);
}

export default Create_NewQuestion;