import { Button, Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { IAnswer } from "../../../custom/type";
import { updateAnswer } from "../../../apis";

function ModalAnswer({ data, open, handleCancel }: { data?: IAnswer | null, open: boolean, handleCancel: () => void }) {
    const [answer, setAnswer] = useState<IAnswer | null>();
    useEffect(() => {
        try {
            if (data) {
                setAnswer(data)
            }
        }
        catch {
            console.error("Lỗi lấy data")
        }
    }, [data])

    const handleSubmit = async () => {
        if (answer?.answer.trim() != "" && data) {
            try {
                const res = await updateAnswer(Number(answer?.id), answer!);
                if (res && res.data) {
                    notification.success({ message: "Cập nhật thành công" })
                }
                else {
                    notification.error({ message: "Cập nhật lỗi" })
                }
            }
            catch {
                console.log("Cập nhật lỗi")
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
                    label="Đáp án"
                    name={'answer'}
                    rules={[{ required: true, message: 'Vui lòng nhập đáp án!' }]}
                >
                    <Input
                        value={answer?.answer}
                        onChange={(e) => setAnswer((prev) => ({ ...prev!, answer: e.target.value }))}
                        className="custom-input"
                        placeholder="Nhập đáp án"
                    />
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
                    <Button type="primary" htmlType="submit" onClick={handleSubmit}>{data ? "Lưu" : "Tạo mới"}</Button>
                    <Button style={{ marginLeft: 10 }} onClick={handleCancel}>Cancel</Button>
                </Form.Item>
            </Form>
        </Modal>);
}

export default ModalAnswer;