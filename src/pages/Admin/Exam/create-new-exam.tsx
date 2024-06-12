import { useNavigate, useParams } from "react-router-dom";
import { Button, Collapse, Form, Input, notification, Select, Space, Tag, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { CreateNewGroupQuestion, IAnswer, IExam, IGroupQuestion, IQuestion } from "../../../custom/type";
import { EditOutlined, MinusOutlined, RedoOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import { adminGetListQuestionExam, backEndUrl, createNewExam, getAllGroupQuestion, getAllQuestionByGroupQuestion, getAnswer, updateExam } from "../../../apis";
import { DatePicker } from 'antd';
import type { DatePickerProps, GetProps } from 'antd';
import dayjs from 'dayjs';
import ModalAnswer from "../Question/modal-answer";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const { RangePicker } = DatePicker;

const AdminExamDetail: React.FC = () => {
    const [dataEditAnswer, setDataEditAnswer] = useState<IAnswer | null>();
    const [dataListGroupQuestion, setDataListGroupQuestion] = useState<IGroupQuestion[] | []>([]);
    const [groupQuestions, setGroupQuestions] = useState<IGroupQuestion[]>([{ ...CreateNewGroupQuestion } as IGroupQuestion]);
    const [open, setOpen] = useState(false);
    const [exam, setExam] = useState<IExam | null>();
    const { id } = useParams();
    const [form] = Form.useForm();
    const navigator = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [score, setScore] = useState<number>(0);
    const fetch = async () => {
        try {
            const res = await getAllGroupQuestion();
            if (res && res.data) {
                setDataListGroupQuestion(res.data);
            }
            if (id != 'create-new' && id != '' && !isNaN(Number(id))) {
                const resExam = await adminGetListQuestionExam(Number(id)!);
                if (resExam && resExam.data) {
                    setExam(resExam.data)
                    setGroupQuestions(resExam.data.examGrquestions)
                    form.setFieldValue('exam_name', resExam.data.exam_name)
                    form.setFieldValue('exam_duration', resExam.data.duration)
                    form.setFieldValue('exam_type', resExam.data.type)
                    form.setFieldValue('exam_desc', resExam.data.description)
                    form.setFieldValue('exam_date', [dayjs(resExam.data.startAt), dayjs(res.data.endAt)]);
                    form.setFieldValue('group_question-0', resExam.data.examGrquestions[0].content)
                    form.setFieldValue('type_question_0', resExam.data.examGrquestions[0].type)
                    form.setFieldValue('des_groupquestion_0', resExam.data.examGrquestions[0].description)
                    if (resExam.data.examGrquestions) {
                        countScore(resExam.data.examGrquestions)
                    }
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
    }, [id])

    useEffect(() => {
        console.log(exam);
        form.resetFields();
        if (exam) {
            form.setFieldValue('exam_date', [dayjs(exam?.startAt), dayjs(exam?.endAt)]);
        }
    }, [groupQuestions.length])

    const countScore = (groupQuestions: IGroupQuestion[]) => {
        setScore(0)
        groupQuestions.forEach((gr: IGroupQuestion) => {
            gr.questions.forEach((question: IQuestion) => {
                setScore((prev) => prev += question.score);
            });
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleCancel = () => {
        setOpen(false);
        setDataEditAnswer(null);
    }
    const handleSubmitAnswer = (an: IAnswer, isEdit: boolean) => {
        console.log(an, isEdit);
        fetch();
    }
    const handleAddGroupQuestion = () => {
        const newGroupQuestion = { ...CreateNewGroupQuestion } as IGroupQuestion
        setGroupQuestions([...groupQuestions, newGroupQuestion]);
        // form.setFieldValue(`group_question-${groupQuestions.length}`, null);
    };
    const handleReset = async (idGroup: number) => {
        const res = await getAllQuestionByGroupQuestion(idGroup);
        if (res.data.questions) {
            setGroupQuestions((prev) => {
                const updatedGroupQuestions = prev.map((group) => {
                    if (group.id === idGroup) {
                        return {
                            ...group,
                            questions: res.data.questions, // giả sử `res.questions` chứa danh sách câu hỏi mới
                        };
                    }
                    return group;
                });
                return updatedGroupQuestions;
            });
        }
    }
    const handleRemoveGr = (indexGr: number) => {
        if (indexGr == 0 && groupQuestions.length == 1) {
            notification.error({
                message: "Không thể xóa hết"
            })
            return
        }
        setGroupQuestions((prev) => {
            const updatedQuestions = [...prev];
            updatedQuestions.splice(indexGr, 1);
            countScore(updatedQuestions);
            return updatedQuestions;
        });
    }
    const handleDeleteQuestion = (indexGr: number, index: number) => {
        setGroupQuestions((prev) => {
            const updatedQuestions = [...prev];
            const groupQuestions = updatedQuestions[indexGr];
            // Xóa câu hỏi khỏi nhóm câu hỏi
            groupQuestions.questions.splice(index, 1);
            countScore(updatedQuestions);
            return updatedQuestions;
        })
    }
    const handleSubmit = async () => {
        await form.validateFields();
        if (id != 'create-new' && id != '' && !isNaN(Number(id)) && exam) {
            const listQuestion: IQuestion[] = groupQuestions.flatMap(groupQuestion => groupQuestion.questions);
            const examData = {
                exam_name: exam.exam_name,
                duration: exam.duration,
                type: exam.type,
                description: exam.description,
                id: exam.id,
                startAt: exam.startAt,
                endAt: exam.endAt,
            };
            const res = await updateExam(Number(id), examData as IExam, listQuestion);
            if (res && res.data) {
                notification.success({ message: "Cập nhật thành công" })
                return
            }
        }
        if (exam && groupQuestions.length) {
            try {
                const listQuestion: IQuestion[] = groupQuestions.flatMap(groupQuestion => groupQuestion.questions);
                const res = await createNewExam(exam, listQuestion);
                if (res && res.data) {
                    notification.success({
                        message: "Thêm thành công"
                    })
                    navigator('/admin/exam')
                }
                else {
                    notification.error({ message: "Đã xảy ra lỗi!" })
                }
            }
            catch (error) { notification.error({ message: String(error) }) }
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
        // console.log('onOk: ', value);
    };
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
    return (
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
                <h2>{id === 'create-new' ? 'Thêm mới đề thi' : 'Thông tin đề hỏi'}</h2>
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
                    initialValues={{
                        exam_name: exam?.exam_name || '',
                        exam_duration: exam?.duration || '',
                        exam_type: exam?.type || undefined,
                        exam_desc: exam?.description || ''
                    }}
                    form={form}>
                    <Form.Item
                        rules={[{ required: true, message: 'Tên bài thi không được để trống!' }]}
                        name={`exam_name`}
                        label="Tên bài thi"
                    ><Input
                            value={exam?.exam_name}
                            placeholder="Nhập tên bài thi"
                            onChange={(e) => {
                                setExam((prev) => ({ ...prev!, exam_name: e.target.value }))
                            }}
                            allowClear />
                    </Form.Item>
                    <div style={{ display: 'flex' }}>
                        <Form.Item
                            rules={[{ required: true, message: 'Thời gian làm bài không được để trống!' }]}
                            name={`exam_duration`}
                            label="Thời gian làm bài"
                        ><Input type="number"
                            value={exam?.duration}
                            onChange={(e) => {
                                setExam((prev) => ({ ...prev!, duration: Number(e.target.value) }))
                            }}
                            placeholder="Nhập thời gian bài thi"
                            allowClear />
                        </Form.Item>
                        <Form.Item
                            style={{ marginLeft: 20 }}
                            rules={[{ required: true, message: 'Thời gian khả dụng bài thi không được để trống!' }]}
                            name={`exam_date`}
                            label="Thời gian khả dụng bài thi"
                        >
                            <RangePicker
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                onChange={(value, dateString) => {
                                    setExam((prev) => ({
                                        ...prev!,
                                        startAt: value[0]!.toDate(), // Chuyển đổi moment sang đối tượng Date
                                        endAt: value[1]!.toDate()    // Chuyển đổi moment sang đối tượng Date và sửa tên biến endAt
                                    }));
                                }}
                                onOk={onOk}
                            />
                        </Form.Item>
                        <Form.Item
                            style={{ marginLeft: 20 }}
                            rules={[{ required: true, message: 'Loại bài thi không được để trống!' }]}
                            name={`exam_type`}
                            label="Loại bài thi"
                        >
                            <Select
                                value={exam?.type}
                                onChange={(value) => setExam((prev) => ({ ...prev!, type: value }))}
                                style={{ minWidth: 100 }}
                                placeholder="Chọn loại bài thi">
                                <Select.Option value={`TOPIK I`}>TOPIK I</Select.Option>
                                <Select.Option value={`TOPIK II`}>TOPIK II</Select.Option>
                                <Select.Option value={`EPS`}>EPS</Select.Option>
                            </Select>
                        </Form.Item>
                        <Tag color="red" style={
                            {
                                marginTop: -20,
                                marginLeft: 20,
                                borderRadius: '50%',
                                width: 70,
                                height: 70,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }
                        }>
                            <b>Điểm</b>
                            <h3>{score}</h3>
                        </Tag>
                    </div>
                    <Form.Item
                        name={`exam_desc`}
                        label="Mô tả">
                        <Input.TextArea
                            value={exam?.description}
                            onChange={(e) => {
                                setExam((prev) => ({ ...prev!, description: e.target.value }))
                            }}
                            rows={2} />
                    </Form.Item>
                    {groupQuestions.map((groupQuestion, indexGr) => {
                        const isAlreadySelected = (id: number) => groupQuestions.some(gq => gq.id === id);
                        return (
                            <div style={{ position: 'relative', padding: 10, border: '1px solid #ccc', borderRadius: 10, marginBottom: 20 }}>
                                <MinusOutlined onClick={() => { handleRemoveGr(indexGr) }} />
                                <div key={indexGr} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Form.Item
                                        initialValue={groupQuestion.id || undefined}
                                        rules={[{ required: true, message: 'Nhóm câu không được để trống!' }]}
                                        name={`group_question-${indexGr}`}
                                        label="Nhóm câu hỏi"
                                        style={{ minWidth: 350, width: '90%' }}
                                    >
                                        <Select
                                            value={groupQuestion.id ? groupQuestion.id : undefined} // Thay đổi giá trị của value
                                            onChange={(selected) => {
                                                setGroupQuestions((prev) => {
                                                    const selectedGroupQuestion = dataListGroupQuestion.find((group) =>
                                                        group.id === Number(selected));
                                                    if (selectedGroupQuestion) {
                                                        const updatedGroupQuestions = [...prev];
                                                        updatedGroupQuestions[indexGr] = selectedGroupQuestion;
                                                        countScore(updatedGroupQuestions)
                                                        form.setFieldValue(`type_question_${indexGr}`, updatedGroupQuestions[indexGr].type);
                                                        form.setFieldValue(`des_groupquestion_${indexGr}`, updatedGroupQuestions[indexGr].description);
                                                        return updatedGroupQuestions;
                                                    }
                                                    return prev;
                                                });
                                            }}
                                            placeholder="Chọn nhóm câu hỏi"
                                        >
                                            {dataListGroupQuestion.map((g) =>
                                                !isAlreadySelected(g.id) ? (
                                                    <Select.Option key={g.id} value={g.id}>
                                                        {g.content}
                                                    </Select.Option>
                                                ) : null
                                            )}
                                            <Select.Option selected key={groupQuestion.id} value={groupQuestion.id}>
                                                {groupQuestion.content}
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>

                                    <div style={{ fontSize: 20, marginLeft: 10, marginRight: 10, display: 'flex', height: 32 }}>
                                        <RedoOutlined onClick={() => handleReset(groupQuestion.id)} />
                                    </div>
                                </div >
                                <div style={{ display: 'flex' }}>
                                    <Form.Item
                                        label="Loại nhóm câu hỏi"
                                        name={`type_question_${indexGr}`}
                                        initialValue={groupQuestion.type ? String(groupQuestion.type) : undefined}
                                    // rules={[{ required: true, message: 'Nhóm câu không được để trống!' }]}
                                    >
                                        <Select
                                            disabled
                                            style={{ maxWidth: 150 }}
                                            placeholder="Chọn loại câu hỏi"
                                        >
                                            <Option value={`Reading`}>Reading</Option>
                                            <Option value={`Listening`}>Listening</Option>
                                        </Select>
                                    </Form.Item>
                                    {groupQuestion?.type == "Listening" &&
                                        <Form.Item
                                            getValueFromEvent={normFile}
                                            style={{ marginLeft: 20 }}
                                            label="File nghe"
                                            name={'audio'}
                                        >
                                            <audio controls>
                                                <source src={`${backEndUrl}/audio/${groupQuestion.audio}`} />
                                            </audio>
                                        </Form.Item>
                                    }
                                </div>
                                {
                                    (groupQuestion.image) && <Form.Item label="Hình ảnh" valuePropName="fileList"
                                        name={'image'}
                                        getValueFromEvent={normFile}
                                    >
                                        <div style={{ display: 'flex' }}>
                                            {groupQuestion?.image && <img width={600} src={backEndUrl + '/images/question/' + groupQuestion.image} />}
                                        </div>
                                    </Form.Item>
                                }
                                <Form.Item
                                    name={`des_groupquestion_${indexGr}`}
                                    label="Mô tả">
                                    <Input.TextArea
                                        disabled
                                        value={groupQuestion?.description}
                                        rows={1} />
                                </Form.Item>
                                <>{
                                    groupQuestion.questions.map((question, index) => {
                                        return (
                                            <>
                                                <div style={{ position: 'relative', padding: 10, border: '1px solid #ccc', borderRadius: 10, marginBottom: 20 }}>
                                                    <MinusOutlined onClick={() => {
                                                        if (index == 0 && groupQuestion.questions.length == 1) {
                                                            notification.error({
                                                                message: "Không thể xóa hết câu hỏi"
                                                            })
                                                            return
                                                        }
                                                        handleDeleteQuestion(indexGr, index);
                                                    }} />
                                                    <div className='question'>
                                                        <section key={question?.id}>
                                                            <Collapse accordion>
                                                                <Collapse.Panel
                                                                    key={question?.id}
                                                                    header={<h3>Câu hỏi: {question?.question} <Tag color="cyan">({question.score} 점)</Tag></h3>}
                                                                >
                                                                    <div>
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                            {question.image && <img width={500} src={`${backEndUrl}/images/question/${question.image}`} />}
                                                                        </div>
                                                                        {question?.answers.map((answer, index) => (
                                                                            <div key={index} style={{
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
                                                                                {answer.isImage ? <img width={150} src={backEndUrl + '/images/answer/' + answer.answer} /> : <h3>{answer.answer}</h3>}
                                                                                <div style={{ width: '10%', justifyContent: 'flex-end', display: 'flex' }}>
                                                                                    <Space>
                                                                                        <EditOutlined
                                                                                            style={{
                                                                                                fontSize: 20,
                                                                                                color: '#ffa500',
                                                                                            }}
                                                                                            onClick={() => {
                                                                                                handleEditAnswer(answer.id!);
                                                                                            }}
                                                                                        />
                                                                                    </Space>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </Collapse.Panel>
                                                            </Collapse>
                                                        </section>
                                                    </div>
                                                </div >
                                            </>
                                        )
                                    })
                                }
                                </>
                            </div>)
                    })}
                    <Button onClick={handleAddGroupQuestion}>Thêm mới nhóm câu hỏi</Button>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleSubmit} htmlType="submit" type="primary">{(id != 'create-new' && id != '' && !isNaN(Number(id))) ? "Cập nhật" : "Thêm"}</Button>
                    </div>
                </Form>
            </div>
            {open && <ModalAnswer
                handleSubmitAnswer={handleSubmitAnswer}
                data={dataEditAnswer} open={open} handleCancel={handleCancel} />}
        </Content >
    );
}

export default AdminExamDetail;
