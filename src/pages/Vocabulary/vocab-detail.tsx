import { Button, Card, Col, Row } from "antd";
import { useParams } from "react-router-dom";
import { getVocabOfList } from "../../apis";
import { useEffect, useState } from "react";
import { IListVocabDetail } from "../../custom/type";
import './vocab-detail.scss'
import { PlusOutlined } from "@ant-design/icons";
import CardVocabItem from "../../components/card-vocab-item";

function VocabularyDetail() {
    const { idList } = useParams();
    const [listVocabDetail, setListVocabDetail] = useState<IListVocabDetail | null>(null)
    const fetch = async () => {
        try {
            const res = await getVocabOfList(String(idList));
            if (res.data) {
                console.log(res.data);
                setListVocabDetail(res.data)
            }
        }
        catch {
            console.log("looi")
        }
    }
    useEffect(() => {
        fetch()
    }, [])
    return (
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
                            <Button className="btn-add-new-word" type='primary'><PlusOutlined /> Thêm từ mới</Button>
                            <Button block className="btn-do-flascards">Luyện tập flascards</Button>
                        </div>
                    </Col>
                </Row>
                <Row justify={'center'}>
                    <Col span={12}>
                        {listVocabDetail?.vocabs.map((vocab) => {
                            return (
                                <Row>
                                    <CardVocabItem word={vocab} />
                                </Row>
                            )
                        })}
                    </Col>
                </Row>
            </div>
        </div>);
}

export default VocabularyDetail; <h1>Vocab Detail</h1>