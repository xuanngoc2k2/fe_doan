/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams } from "react-router-dom";
import { Button, Collapse, Form, GetProp, Input, notification, Popconfirm, Radio, Select, Space, theme, Upload, UploadFile, UploadProps } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
// import { callUploadAudio, callUploadSingleFile } from "../../../apis";
import { CreateNewGroupQuestion, IExam, IGroupQuestion, IQuestion } from "../../../custom/type";
import { DeleteOutlined, EditOutlined, MinusOutlined, PlusOutlined, RedoOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import { adminGetListQuestionExam, backEndUrl, createNewExam, getAllGroupQuestion, getAllQuestionByGroupQuestion, getExamById, getListQuestionOfExam, updateExam } from "../../../apis";
import { DatePicker } from 'antd';
import type { DatePickerProps, GetProps } from 'antd';
import dayjs from 'dayjs';
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const { RangePicker } = DatePicker;

const AdminExamDetail: React.FC = () => {
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
    const [fileListAudio, setFileListAudio] = useState<UploadFile[]>();
    const [fileListImage, setFileListImage] = useState<UploadFile[] | []>();
    const [dataListGroupQuestion, setDataListGroupQuestion] = useState<IGroupQuestion[] | []>([]);
    const [addNew, setAddNew] = useState<boolean[]>([false]);
    const [groupQuestions, setGroupQuestions] = useState<IGroupQuestion[]>([{ ...CreateNewGroupQuestion } as IGroupQuestion]);
    const [exam, setExam] = useState<IExam | null>();
    const { id } = useParams();
    const [form] = Form.useForm();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    useEffect(() => {
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
                        form.setFieldValue('group_question-0', resExam.data.examGrquestions[0].content)
                        form.setFieldValue('type_question_0', resExam.data.examGrquestions[0].type)
                        form.setFieldValue('des_groupquestion_0', resExam.data.examGrquestions[0].description)
                        form.setFieldValue('exam_date', [dayjs(resExam.data.startAt), dayjs(res.data.endAt)]);
                    }
                }
                // else {
                //     notification.error({
                //         message: "Đã xảy ra lỗi lấy dữ liệu"
                //     })
                // }
                // }
            }
            catch (error) {
                notification.error({
                    message: String(error)
                })
            }
        }
        fetch();
    }, [id])
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

    const onChangeUpload: UploadProps['onChange'] = ({ file: newFile }) => {
        newFile.status = 'done';
        setFileListImage([newFile]);
    };
    const onChangeUploadAudio: UploadProps['onChange'] = ({ file: newFile }) => {
        newFile.status = 'done';
        setFileListAudio([newFile]);
    };
    // const uploadFile = async (file: UploadFile, audio?: boolean) => {
    //     const uploadedFile = file.originFileObj as File;
    //     if (uploadedFile != null) {
    //         try {
    //             if (audio) {
    //                 const res = await callUploadAudio(uploadedFile, 'audio');
    //                 if (res.fileName && audio) {
    //                     return res.fileName;
    //                 }
    //             }
    //             else {
    //                 const res = await callUploadSingleFile(uploadedFile, 'question');
    //                 return res.fileName;
    //             }
    //         } catch (error) {
    //             message.error("Lỗi");
    //         }
    //     }
    //     return null;
    // };
    const handleAddGroupQuestion = () => {
        const newGroupQuestion = { ...CreateNewGroupQuestion } as IGroupQuestion
        setGroupQuestions([...groupQuestions, newGroupQuestion]);
        setAddNew((prev) => ([...prev, false]))
    };
    const handleAddNew = (indexGr: number) => {
        setAddNew((prev) => {
            const updatedAddNew = prev.map((value, index) => {
                return index === indexGr ? true : value;
            });
            return updatedAddNew;
        });
        form.setFieldValue(`group_question-${indexGr}`, null);
        console.log(groupQuestions)
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
        // setAddNew((prev) => {
        //     const updatedAddNew = prev.map((value, index) => {
        //         return index === indexGr ? false : value;
        //     });
        //     return updatedAddNew;
        // });
    }
    const handleRemoveGr = (indexGr: number) => {
        if (indexGr == 0) {
            notification.error({
                message: "Không thể xóa hết"
            })
            return
        }
        setGroupQuestions((prev) => {
            const updatedQuestions = [...prev];
            updatedQuestions.splice(indexGr, 1);
            return updatedQuestions;
        });
        setAddNew((prev) => {
            const updatedAddNew = [...prev];
            updatedAddNew.splice(indexGr, 1);
            return updatedAddNew;
        })
    }
    const handleDeleteQuestion = (indexGr: number, index: number) => {
        setGroupQuestions((prev) => {
            const updatedQuestions = [...prev];
            const groupQuestions = updatedQuestions[indexGr];
            // Xóa câu hỏi khỏi nhóm câu hỏi
            groupQuestions.questions.splice(index, 1);
            return updatedQuestions;
        })
    }
    const handleSubmit = async () => {
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
                }
                else {
                    notification.error({ message: "Đã xảy ra lỗi!" })
                }
            }
            catch (error) { notification.error({ message: String(error) }) }
        }
    }
    const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
        // console.log('onOk: ', value);
    };
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
                                        initialValue={groupQuestion.id ? String(groupQuestion.content) : ''}
                                        rules={[{ required: true, message: 'Nhóm câu không được để trống!' }]}
                                        name={`group_question-${indexGr}`}
                                        label="Nhóm câu hỏi"
                                        style={{ minWidth: 350, width: '90%' }}
                                    >
                                        {addNew[indexGr] ? <Input
                                            placeholder="Nhập tên nhóm câu hỏi"
                                            allowClear />
                                            :
                                            <Select
                                                labelInValue
                                                value={{ value: groupQuestion.id, label: groupQuestion.content }}
                                                onChange={(selected) => {
                                                    setGroupQuestions((prev) => {
                                                        const selectedGroupQuestion = dataListGroupQuestion.find((group) => group.id === Number(selected.value));
                                                        if (selectedGroupQuestion) {
                                                            const updatedGroupQuestions = [...prev];
                                                            updatedGroupQuestions[indexGr] = selectedGroupQuestion;
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
                                                        <Select.Option key={g.id} value={`${g.id}`}>
                                                            {g.content}
                                                        </Select.Option>
                                                    ) : null
                                                )}
                                            </Select>
                                        }
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
                                        rules={[{ required: true, message: 'Nhóm câu không được để trống!' }]}
                                    >
                                        <Select
                                            disabled={(!addNew[indexGr])}
                                            allowClear
                                            style={{ maxWidth: 150 }}
                                            placeholder="Chọn loại câu hỏi"
                                        >
                                            <Option value={`Reading`}>Reading</Option>
                                            <Option value={`Listening`}>Listening</Option>
                                        </Select>
                                    </Form.Item>
                                    {(groupQuestion?.type == "Listening" ||
                                        form.getFieldValue(`type_question_${indexGr}`) == "Listening") &&
                                        <Form.Item
                                            getValueFromEvent={normFile}
                                            style={{ marginLeft: 20 }}
                                            // rules={[{ required: true, message: 'File nghe không được để trống!' }]}
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
                                    (groupQuestion || addNew[indexGr]) && <Form.Item label="Hình ảnh" valuePropName="fileList"
                                        name={'image'}
                                        // rules={[{ required: true, message: 'Hình ảnh không được để trống!' }]}
                                        getValueFromEvent={normFile}
                                    >
                                        <div style={{ display: 'flex' }}>
                                            {groupQuestion?.image && !addNew[indexGr] && <img src={backEndUrl + '/images/question/' + groupQuestion.image} />}
                                            {addNew[indexGr] && <Upload
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
                                            </Upload>}
                                        </div>
                                    </Form.Item>
                                }
                                <Form.Item
                                    name={`des_groupquestion_${indexGr}`}
                                    // rules={[{ required: true, message: 'Mô tả nhóm câu hỏi không được để trống!' }]}
                                    label="Mô tả">
                                    <Input.TextArea
                                        disabled={(!addNew[indexGr])}
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
                                                                    header={<h3>Câu hỏi: {question?.question}</h3>}
                                                                >
                                                                    <div>
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
        </Content >
    );
}

export default AdminExamDetail;
