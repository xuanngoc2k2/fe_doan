/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, Form, GetProp, Input, message, Modal, Upload, UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { IAnswer } from "../../../custom/type";
import { addAnswer, backEndUrl, callUploadSingleFile, updateAnswer } from "../../../apis";
import { PlusOutlined } from "@ant-design/icons";

function ModalAnswer({
    data, open, handleCancel,
    handleSubmitAnswer,
    id
}: {
    id?: number | undefined,
    data?: IAnswer | null,
    open: boolean,
    handleCancel: () => void,
    handleSubmitAnswer: (an: IAnswer, isEdit: boolean) => void
}) {
    const [answer, setAnswer] = useState<IAnswer | null>();
    const [upload, setUpload] = useState(false);
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
    const [fileList, setFileList] = useState<UploadFile[]>(
        data && data.isImage ? [
            {
                uid: '-1',
                name: data.answer,
                status: 'done',
                url: `${backEndUrl}/images/answer/${data.answer}`,
            },
        ] : []
    );
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
    const upLoadFile = async (file: UploadFile) => {
        const uploadedFile = file.originFileObj as File;
        if (uploadedFile != null) {
            try {
                const res = await callUploadSingleFile(uploadedFile, 'answer');
                const answerInfo = { ...(answer || {}), answer: res.fileName, isImage: true } as IAnswer;
                setAnswer(answerInfo);
                return answerInfo;
            }
            catch (error) {
                message.error("Lỗi");
            }
        }
        return null; // Trả về null nếu có lỗi xảy ra
    };
    useEffect(() => {
        try {
            if (data) {
                setAnswer(data)
            }
        }
        catch {
            console.error("Lỗi lấy data")
        }
    }, [])
    const handleSubmit = async () => {
        let updateData = answer;
        if (upload) {
            if (fileList.length) {
                updateData = await upLoadFile(fileList[0]) || answer;
            }
            console.log(updateData);
            if (data) {
                const res = await updateAnswer(answer!.id, updateData!);
                if (res && res.data) {
                    handleSubmitAnswer(answer!, true);
                    handleCancel()
                }
            }
            else if (updateData && id) {
                const res = await addAnswer(updateData!, id!);
                if (res && res.data) {
                    handleSubmitAnswer(res.data, false);
                    handleCancel()
                }
            }
        }
        else {
            if (answer?.answer.trim() != "" && data) {
                const res = await updateAnswer(answer!.id, { ...updateData!, isImage: false });
                if (res && res.data) {
                    handleSubmitAnswer(answer!, true);
                    handleCancel()
                }
            }
            else if (answer?.answer.trim() != '' && answer && id) {
                let newData = answer;
                if (fileList.length && upload) {
                    newData = await upLoadFile(fileList[0]) || answer;
                }
                const res = await addAnswer(newData, id);
                if (res && res.data) {
                    handleSubmitAnswer(res.data, false);
                    handleCancel()
                }
            }
        }
    }
    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            footer={false}
        >
            <Form layout="vertical" initialValues={{
                answer: data?.answer || '',
                explain: data?.explain || ''
            }}>

                <Form.Item
                    label={(<div>
                        Đáp án
                        <Checkbox onChange={(e) => {
                            if (e.target.checked == true) {
                                setUpload(true)
                            }
                            else {
                                setUpload(false)
                            }
                        }} style={{ marginLeft: 20 }}>Hình ảnh</Checkbox>
                    </div>)}
                    getValueFromEvent={normFile}
                    name={'answer'}
                    rules={[{ required: true, message: 'Vui lòng nhập đáp án!' }]}
                >
                    {upload ? <Upload
                        listType="picture-card"
                        name="answer"
                        maxCount={1}
                        onPreview={onPreview}
                        fileList={fileList}
                        onChange={onChangeUpload}
                    >
                        <div><PlusOutlined /> Upload</div>
                    </Upload> :
                        <Input
                            value={answer?.answer}
                            onChange={(e) => setAnswer((prev) => ({ ...prev!, answer: e.target.value }))}
                            className="custom-input"
                            placeholder="Nhập đáp án"
                        />}
                </Form.Item>
                <Form.Item
                    label="Giải thích"
                    name={'explain'}
                >
                    <Input
                        value={answer?.explain}
                        onChange={(e) => setAnswer((prev) => ({ ...prev!, explain: e.target.value }))}
                        className="custom-input"
                        placeholder="Nhập giải thích"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={handleSubmit}>OK</Button>
                    <Button style={{ marginLeft: 10 }} onClick={() => { setAnswer(null); handleCancel() }}>Cancel</Button>
                </Form.Item>
            </Form>
        </Modal >);
}

export default ModalAnswer;