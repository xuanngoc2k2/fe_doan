import { BarChartOutlined } from "@ant-design/icons";
import { Col, message, Row } from "antd";
import './result.scss';
import { useEffect, useState } from "react";
import { getListResult } from "../../apis";
import { IResult } from "../../custom/type";
import { Link } from "react-router-dom";

function Result() {
    const [listResult, setListResult] = useState<IResult[]>([])
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getListResult();
                if (res.data) {
                    setListResult(res.data);
                }
            }
            catch {
                message.open({
                    type: 'error',
                    content: 'lỗi lấy data'
                })
            }
        }
        fetch();
    }, [])
    return (
        <div style={{ minHeight: 600 }}>
            <Row>
                <Col span={8} offset={4}>
                    <div className="home-title"><BarChartOutlined style={{ fontSize: 35, marginRight: 10 }} />Thống kê kết quả luyện thi</div>
                </Col>
            </Row>
            <Row>
                {listResult.map((result) => {
                    return (<>
                        <Col span={10} offset={4}>
                            <div className='result-container'>
                                <div className="result-score">
                                    <p className={result.exam.type === 'TOPIK I' ? result.score > 80 ? "green" : "red" : result.score > 120 ? "green" : "red"}>{result.score}</p>
                                </div>
                                <div className="result-info">
                                    <div className="result-info-test">
                                        <h1>{result.exam.exam_name}</h1>
                                        <p>Thời gian thi: {result.createdAt}</p>
                                        <p>Lần thi: {result.count}</p>
                                    </div>
                                    <div className="result-view-detail">
                                        <Link to={`/result-detail/${result.id}`} style={{ color: 'white' }}><p>CHI TIẾT</p></Link>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </>)
                })}
            </Row>
        </div>);
}

export default Result;