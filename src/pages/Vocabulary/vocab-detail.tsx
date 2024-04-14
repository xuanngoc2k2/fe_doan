import { Button, Card, Col, Collapse, Form, Input, message, Modal, Row, Select, Space, Upload } from "antd";
import { Link, useParams } from "react-router-dom";
import {
    callUploadSingleFile,
    creatNewVocabOfList, deleteVocabOfList, getVocabOfList
} from "../../apis";
import { useEffect, useState } from "react";
import { IListVocabDetail, IVocabulary } from "../../custom/type";
import './vocab-detail.scss'
import { PlusOutlined } from "@ant-design/icons";
import CardVocabItem from "../../components/card-vocab-item";
import { Option } from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";
import { UploadChangeParam } from "antd/es/upload/interface";

function VocabularyDetail() {
    const { idList } = useParams();
    const [listVocabDetail, setListVocabDetail] = useState<IListVocabDetail | null>(null);
    const [newVocab, setNewVocab] = useState<IVocabulary | null>(null);
    const [showModal, setShowModal] = useState(false);
    const fetch = async () => {
        try {
            const res = await getVocabOfList(String(idList));
            if (res.data) {
                setListVocabDetail(res.data)
            }
        }
        catch {
            console.log("looi")
        }
    }
    const handleCancel = () => {
        setNewVocab(null);
        setShowModal(false);
    }
    const handleOK = async () => {
        if (!newVocab?.word || !newVocab?.meaning || !newVocab?.level || !newVocab?.partOfSpeech || !newVocab?.spell) {
            message.error("Vui lòng điền đầy đủ thông tin trước khi tạo mới từ vựng.");
            return;
        }
        try {
            console.log(newVocab);
            const response = await creatNewVocabOfList(Number(idList), newVocab);
            if (response.data) {
                message.success(response.data)
                fetch()
                handleCancel()
            }
            else {
                message.error("Thêm lỗi")
                handleCancel()
            }
        }
        catch {
            message.error("Thêm lỗi")
        }
        // setShowModal(false);
    }
    useEffect(() => {
        fetch()
    }, [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleChangeUpload = async (info: UploadChangeParam) => {
        const { file } = info; // Lấy thông tin về tệp từ đối tượng UploadChangeParam
        if (!file.type?.includes('image') && file.status === 'error') {
            message.error("Phải upload file ảnh")
            return
        }
        const uploadedFile = file.originFileObj as File;
        if (uploadedFile != null && file.status == 'error') {
            file.status = 'done'
            try {
                const res = await callUploadSingleFile(uploadedFile, 'vocabulary');
                if (res.fileName) {
                    message.success(`Thành công ${res.fileName}`);
                    setNewVocab(prevState => ({ ...prevState, image: res.fileName }))
                }
                return true;
            } catch (error) {
                message.error("Lỗi")
            }
        }
    };
    const handelRemove = async (idWord: number) => {
        console.log(idWord)
        try {
            const res = await deleteVocabOfList(Number(idList), idWord);
            if (res) {
                message.success("Xóa thành công");
                fetch();
            }
            else {
                message.error("Xóa lỗi");
            }
        }
        catch {
            message.error("Lỗi API")
        }
    }

    return (
        <>
            <div style={{ minHeight: 600 }}>
                <div className="vocab-detail-container">
                    <Row>
                        <Col span={8} offset={4}>
                            <div className="home-title">{listVocabDetail?.name}</div>
                        </Col>
                    </Row>
                    <Row style={{ justifyContent: 'center', marginBottom: 30 }}>
                        <Col span={10}>
                            <Card className="card-vocab-detail">
                                <div className="card-item-vocab-detail">
                                    <h2>
                                        {listVocabDetail?.totalWords}
                                    </h2>
                                    <p>Tổng số từ</p>
                                </div >
                                <div className="card-item-vocab-detail">
                                    <h2>
                                        {listVocabDetail && listVocabDetail?.totalWords - listVocabDetail?.needRemember}
                                    </h2>
                                    <p>Đã nhớ</p>
                                </div>
                                <div className="card-item-vocab-detail">
                                    <h2>
                                        {listVocabDetail?.needRemember}
                                    </h2>
                                    <p>Cần ôn tập</p>
                                </div>
                            </Card>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                                <Button onClick={() => setShowModal(true)} className="btn-add-new-word" type='primary'><PlusOutlined /> Thêm từ mới</Button>
                                <Link style={{ width: '100%' }} to={`/flashcards/${idList}`}><Button block className="btn-do-flascards">Luyện tập flascards</Button></Link>
                            </div>
                        </Col>
                    </Row>
                    <Row justify={'center'}>
                        <Col span={12}>
                            {listVocabDetail?.vocabs.map((vocab) => {
                                return (
                                    <Row>
                                        <CardVocabItem handelRemove={handelRemove} word={vocab.vocab} />
                                    </Row>
                                )
                            })}
                        </Col>
                    </Row>
                </div>
            </div>
            {showModal && <>
                <Modal
                    title="Tạo mới từ vựng"
                    open={showModal}
                    onCancel={handleCancel}
                    className="custom-modal"
                    footer={
                        <>
                            {/* <Button onClick={handleCancel}>Cancel</Button> */}
                            {/* <Button type="primary" onClick={handleOK} >Tạo mới</Button> */}
                        </>
                    }
                >
                    <Form layout="vertical">
                        <Form.Item
                            style={{ marginBottom: 0 }}
                            label="Từ mới"
                            name={'word-name'}
                            rules={[{ required: true, message: 'Vui lòng nhập từ mới!' }]}
                        >
                            <Input
                                value={newVocab?.word}
                                onChange={(e) => setNewVocab(prevState => ({ ...prevState, word: e.target.value }))}
                                className="custom-input"
                                placeholder="Nhập tên danh sách từ"
                            />
                        </Form.Item>
                        <Form.Item
                            style={{ marginBottom: 0 }}
                            label="Định nghĩa"
                            name={'word-meaning'}
                            rules={[{ required: true, message: 'Vui lòng nhập định nghĩa từ!' }]}
                        >
                            <Input
                                value={newVocab?.meaning}
                                onChange={(e) => setNewVocab(prevState => ({ ...prevState, meaning: e.target.value }))}
                                className="custom-input"
                                placeholder="Nhập nhập định nghĩa từ"
                            />
                        </Form.Item>
                        <Form.Item
                            style={{ marginBottom: 0 }}
                            required
                            name={'description'}
                            label="Mô tả"
                        >
                            <Space.Compact>
                                <Form.Item
                                    name={['level']}
                                    noStyle
                                    rules={[{ required: true, message: 'Cấp độ từ là bắt buộc' }]}
                                >
                                    <Select onSelect={(value) => setNewVocab(prevState => ({ ...prevState, level: Number(value) }))} placeholder="Chọn cấp độ">
                                        <Option value="1">TOPIK 1</Option>
                                        <Option value="2">TOPIK 2</Option>
                                        <Option value="3">TOPIK 3</Option>
                                        <Option value="4">TOPIK 4</Option>
                                        <Option value="5">TOPIK 5</Option>
                                        <Option value="6">TOPIK 6</Option>
                                    </Select>

                                </Form.Item>
                                <Form.Item
                                    name={['partOfSpeech']}
                                    noStyle
                                    rules={[{ required: true, message: 'Loại từ là bắt buộc' }]}
                                >
                                    <Input onChange={(e) => setNewVocab(prevState => ({ ...prevState, partOfSpeech: e.target.value }))} style={{ width: '100%' }} placeholder="Nhập loại từ" />
                                </Form.Item>
                                <Form.Item
                                    name={['spell']}
                                    noStyle
                                    rules={[{ required: true, message: 'Phiên âm từ là bắt buộc' }]}
                                >
                                    <Input onChange={(e) => setNewVocab(prevState => ({ ...prevState, spell: e.target.value }))} style={{ width: '100%' }} placeholder="Nhập phiên âm" />
                                </Form.Item>
                            </Space.Compact>
                        </Form.Item>
                        <Collapse style={{ marginBottom: 10, marginTop: 10 }} size="small" items={[{
                            key: '1',
                            label: 'Thêm ảnh/ví dụ',
                            children:
                                (<>
                                    <Form.Item style={{ marginBottom: 0 }} label="Hình ảnh" valuePropName="fileList" getValueFromEvent={normFile}>
                                        <Upload
                                            // action={`${backEndUrl}/file/upload`}
                                            onChange={handleChangeUpload}
                                            maxCount={1} listType="picture-card">
                                            <button style={{ border: 0, background: 'none' }} type="button">
                                                <PlusOutlined />
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </button>
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item style={{ marginBottom: 0 }} label="Ví dụ">
                                        <TextArea onChange={(e) => setNewVocab(prevState => ({ ...prevState, example: e.target.value }))} rows={2} />
                                    </Form.Item>
                                </>)
                        }]} />
                        <Form.Item>
                            <Button type="primary" htmlType="submit" onClick={handleOK}>Tạo mới</Button>
                            <Button style={{ marginLeft: 10 }} onClick={handleCancel}>Cancel</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </>}
        </>);
}

export default VocabularyDetail;