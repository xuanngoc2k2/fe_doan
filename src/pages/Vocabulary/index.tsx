import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import CardVocab from "../../components/card-vocab-list";
import './vocab.scss'
import { useEffect, useState } from "react";
import { getAllListVocab, postNewList } from "../../apis";
import { IListVocab } from "../../custom/type";
function Vocabulary() {
    const [showModal, setShowModal] = useState(false);
    const [newList, setNewList] = useState<IListVocab | null>(null);
    const [listVocabs, setListVocabs] = useState([]);
    const handleShowModel = () => {
        setShowModal(true);
    }
    const handleCancel = () => {
        setNewList(null)
        setShowModal(false)
    }
    const handleOK = async () => {
        console.log(newList);
        if (newList === null || newList.name.trim() === '') {
            message.open({
                type: 'error',
                content: 'Tên list không được để trống'
            },)
            return;
        }
        const res = await postNewList(newList);
        if (res.data) {
            message.open({
                type: 'success',
                content: 'Tạo mới list thành công'
            })
            handleCancel()
            fetch()
            return;
        }
        message.open({
            type: 'error',
            content: 'Thêm lỗi'
        })
        handleCancel()
    }
    const fetch = async () => {
        try {
            const res = await getAllListVocab();
            if (res.data) {
                setListVocabs(res.data);
            }
        }
        catch {
            alert("Lỗi lấy api")
        }
    }
    useEffect(() => {
        fetch()
    }, [])
    console.log(listVocabs)
    return (<>
        <Row>
            <Col span={8} offset={4}>
                <div className="home-title">Từ vựng</div>
            </Col>
        </Row>
        <div style={{ minHeight: 600, display: 'flex', justifyContent: 'center' }}>

            <div className="vocab-container">
                <div className="list-card">
                    <div className="create-new-listVocab" onClick={handleShowModel}>
                        <CardVocab />
                    </div>
                    {listVocabs.map((list) => {
                        return (
                            <CardVocab data={list} />
                        )
                    })}
                </div>
            </div>

        </div>
        {showModal && <>
            <Modal
                title="Tạo mới list từ"
                open={showModal}
                onCancel={handleCancel}
                className="custom-modal"
                footer={
                    <>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button type="primary" onClick={handleOK} >Tạo mới</Button>
                    </>
                }
            >
                <Form layout="vertical">
                    <Form.Item
                        label="Tên danh sách từ"
                        name="listName"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh sách từ!' }]}
                    >
                        <Input
                            value={newList?.name}
                            onChange={(e) => setNewList(prevState => ({ ...prevState, name: e.target.value }))}
                            className="custom-input"
                            placeholder="Nhập tên danh sách từ"
                        />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea value={newList?.description} onChange={(e) => setNewList(prev => ({ ...prev, description: e.target.value }))} className="custom-textarea" placeholder="Nhập mô tả (không bắt buộc)" />
                    </Form.Item>
                </Form>
            </Modal>
        </>}
    </>);
}

export default Vocabulary;