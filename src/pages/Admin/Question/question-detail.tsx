import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IGroupQuestion, IQuestion } from "../../../custom/type";
import { backEndUrl, getAllGroupQuestion, getDetailQuestion } from "../../../apis";
import { Button, Form, GetProp, Input, notification, Popconfirm, Select, Space, theme, Upload, UploadFile, UploadProps } from "antd";
import { Content } from "antd/es/layout/layout";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";

const QuestionDetail: React.FC = () => {
    const { id } = useParams();
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
    const [dataListGroupQuestion, setDataListGroupQuestion] = useState<IGroupQuestion[] | []>([]);
    const [question, setQuestion] = useState<IQuestion | null>();
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
    }, [id])
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
                        <Form>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Form.Item
                                    label="Nhóm câu hỏi"
                                    style={{ minWidth: 350, width: '80%' }}
                                >
                                    <Select allowClear
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
                                >
                                    <Select
                                        allowClear
                                        style={{ maxWidth: 150 }}
                                        placeholder="Chọn loại câu hỏi"
                                    >
                                        <Option value={`Reading`}>Reading</Option>
                                        <Option value={`Listening`}>Listening</Option>
                                    </Select>
                                </Form.Item>


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
                            </div>
                            <Form.Item label="Hình ảnh" valuePropName="fileList"
                                name={'image'}
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
                            <Form.Item label="Mô tả">
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item
                                label="Câu hỏi"
                            >
                                <Input />
                            </Form.Item>
                            <div style={{ display: 'flex' }}>
                                <Form.Item
                                    label="Level"
                                >
                                    <Select placeholder="Chọn Level">
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
                                    style={{ marginLeft: 20 }}
                                >
                                    <Select placeholder="Chọn kiểu câu hỏi">
                                        <Option value="multiple-choice">Trắc nghiệm</Option>
                                        <Option value="fill">Điền vào chỗ trống</Option>
                                    </Select>
                                </Form.Item>
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
                                < div style={{
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
                                    < div style={{
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