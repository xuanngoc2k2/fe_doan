/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { IListVocab } from "../../../custom/type";
import { postNewList, updateListVocab } from "../../../apis";

function ModalList({ data, open, handelCancel }: { data?: IListVocab | null; open: boolean, handelCancel: () => void }) {
    const [dataListVocab, setDataListVocab] = useState<IListVocab | undefined>();

    useEffect(() => {
        if (data) {
            setDataListVocab(data);
        }
    }, []);
    const handleSubmit = async () => {
        if (data) {
            if (dataListVocab?.name.trim() !== '') {
                const res = await updateListVocab(data.id, { name: dataListVocab?.name, description: dataListVocab?.description } as IListVocab);
                if (res && res.data) {
                    notification.success({ message: "Cập nhật thành công!" })
                    handelCancel();
                }
                else {
                    notification.error({ message: "Đã xảy ra lỗi!" })
                }
            }
        }
        else {
            if (dataListVocab) {
                const res = await postNewList(dataListVocab!);
                if (res && res.data) {
                    notification.success({ message: "Thêm mới thành công!" })
                    handelCancel();
                }
                else {
                    notification.error({ message: "Đã xảy ra lỗi!" })
                }
            }
        }
    }
    return (
        <Modal
            title={data ? 'Thông tin danh sách' : 'Thêm mới danh sách'}
            onCancel={handelCancel}
            open={open}
            width={700}
            footer={false}
        >
            <Form layout="vertical" initialValues={{
                name: data?.name || '',
                description: data?.description || ''
            }}>
                <Form.Item
                    label="Tên danh sách"
                    name={'name'}
                    rules={[{ required: true, message: 'Vui lòng nhập tên danh sách!' }]}
                >
                    <Input
                        onChange={(e) => setDataListVocab((prev) => ({ ...prev!, name: e.target.value }))}
                        name="content"
                        value={dataListVocab?.name}
                    />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name={'description'}
                >
                    <Input
                        onChange={(e) => setDataListVocab((prev) => ({ ...prev!, description: e.target.value }))}
                        name="description"
                        value={dataListVocab?.description} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={handleSubmit}>{data ? "Lưu" : "Tạo mới"}</Button>
                    <Button style={{ marginLeft: 10 }} onClick={handelCancel}>Cancel</Button>
                </Form.Item>
            </Form>
        </Modal>);
}

export default ModalList;