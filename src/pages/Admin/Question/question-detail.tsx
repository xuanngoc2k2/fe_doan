import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CreateNewQuestion, IAnswer, IGroupQuestion, IQuestion } from "../../../custom/type";
import { backEndUrl, getAllGroupQuestion, getDetailQuestion } from "../../../apis";
import { Button, Form, GetProp, Input, notification, Popconfirm, Radio, Select, Space, theme, Upload, UploadFile, UploadProps } from "antd";
import { Content } from "antd/es/layout/layout";
import { CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";

const QuestionDetail: React.FC = () => {
    const { id } = useParams();
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
    const [dataListGroupQuestion, setDataListGroupQuestion] = useState<IGroupQuestion[] | []>([]);
    const [groupQuestion, setGroupQuestion] = useState<IGroupQuestion | null>();
    const [question, setQuestion] = useState<IQuestion | null>();
    const [dataQuestion, setDataQuestion] = useState<IQuestion[] | []>([CreateNewQuestion as IQuestion]);
    // const [answer, setAnswer] = useState<IAnswer[] | []>([]);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
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

    const onChangeUpload: UploadProps['onChange'] = ({ file: newFileList }) => {
        newFileList.status = 'done';
        setFileList([newFileList]);
    };
    useEffect(() => {
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
        fetch();
    }, [id, groupQuestion?.id])
    const [form] = Form.useForm();
    const disable = groupQuestion ? true : false;
    const handleSubmit = () => {
        console.log(dataQuestion);
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
                                    <Select allowClear
                                        onChange={(value) => {
                                            const rs = dataListGroupQuestion.find((gr) => gr.id == Number(value));
                                            setGroupQuestion(rs);
                                            form.setFieldValue('type_question', rs?.type);
                                            form.setFieldValue('des_groupquestion', rs?.description);
                                        }}
                                        value={groupQuestion}
                                        placeholder="Chọn nhóm câu hỏi">
                                        {dataListGroupQuestion.map((groupQuestion) => {
                                            return (
                                                <Option value={`${groupQuestion.id}`}>{groupQuestion.content}</Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>
                                <Button onClick={() => {
                                }} style={{ marginRight: 20, width: '15%' }} icon={<PlusOutlined />} type="primary">Thêm mới nhóm câu hỏi</Button>

                            </div>
                            <div style={{ display: 'flex' }}>
                                <Form.Item
                                    label="Loại nhóm câu hỏi"
                                    name={'type_question'}
                                    rules={[{ required: true, message: 'Nhóm câu không được để trống!' }]}
                                >
                                    <Select
                                        disabled={disable}
                                        onChange={(value) => {
                                            disable && setGroupQuestion((prev) => ({ ...prev!, type: value }))
                                        }}
                                        allowClear
                                        style={{ maxWidth: 150 }}
                                        placeholder="Chọn loại câu hỏi"
                                    >
                                        <Option value={`Reading`}>Reading</Option>
                                        <Option value={`Listening`}>Listening</Option>
                                    </Select>
                                </Form.Item>
                                {groupQuestion?.type === 'Listening' &&
                                    <Form.Item
                                        style={{ marginLeft: 20 }}
                                        label="File nghe"
                                    >
                                        <Upload
                                            name="content"
                                            maxCount={1}
                                        >
                                            <Button type="primary">
                                                <div><PlusOutlined /> Upload</div>
                                            </Button>
                                        </Upload>
                                    </Form.Item>
                                }
                            </div>
                            <Form.Item label="Hình ảnh" valuePropName="fileList"
                                name={'image'}
                                // rules={[{ required: true, message: 'Hình ảnh không được để trống!' }]}
                                getValueFromEvent={normFile}
                            >
                                <div style={{ display: 'flex' }}>
                                    {groupQuestion?.image && <img src={backEndUrl + '/images/question/' + groupQuestion.image} />}
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
                                </div>
                            </Form.Item>
                            <Form.Item
                                name={'des_groupquestion'}
                                rules={[{ required: true, message: 'Mô tả nhóm câu hỏi không được để trống!' }]}
                                label="Mô tả">
                                <Input.TextArea rows={1} />
                            </Form.Item>
                            {dataQuestion.map((question, index) => {
                                return (
                                    <div style={{ padding: 10, border: '1px solid #ccc', borderRadius: 10, marginBottom: 20 }}>
                                        <Form.Item
                                            name={'question'}
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
                                                label="Level"
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
                                                name={"score"}
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
                                            {question.answers.length > 1 || form.getFieldValue(`type_question_${index}`) == "multiple-choice" ?
                                                <Form.Item
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                                        <h3 style={{ width: '18%', textAlign: 'center' }}>Đáp án đúng</h3>
                                                    </div>
                                                    <Radio.Group
                                                        defaultValue={'0'}
                                                        style={{ width: '100%' }}>
                                                        {question.answers.map((_, ix) => {
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
                                                                    <Radio checked={true} style={{ height: 45, width: '15%', justifyContent: 'center' }} key={`${index}-${ix}`} value={`${index}-${ix}`}>
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
                                                        <Input style={{ height: 45 }} placeholder="Nhập câu trả lời" />
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
                                                    updatedQuestion.answers = [
                                                        { answer: '' } as IAnswer,
                                                        ...updatedQuestion.answers
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
                            <img src={`${backEndUrl}/images/question/${question?.group_question?.image}`} alt='question' />
                        </div>
                        <div className='question'>
                            <section key={question?.id}>
                                <div style={{ display: 'flex' }}>
                                    <h3>Câu hỏi: {question?.question}</h3>
                                </div>
                                <div >
                                    {question?.answers.map((answer) => {
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
                                    })}
                                    <div
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
                            </section>
                        </div>
                    </>
                }
            </div >
        </Content >
    </>);
}

export default QuestionDetail;