import { BarChartOutlined } from "@ant-design/icons";
import { Col, message, Pagination, Row, Tag } from "antd";
import './result.scss';
import { useEffect, useState } from "react";
import { getListResult } from "../../apis";
import { IResult } from "../../custom/type";
import { Link } from "react-router-dom";
import dayjs from 'dayjs';

function Result() {
    const [listResult, setListResult] = useState<IResult[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;
    const indexOfLastCourse = currentPage * pageSize;
    const indexOfFirstCourse = indexOfLastCourse - pageSize;
    const currentResults = listResult.slice(indexOfFirstCourse, indexOfLastCourse);

    // Xử lý sự kiện khi chuyển trang
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }
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
                <Col md={{ span: 10, offset: 4 }} xs={{ span: 18, offset: 2 }} >
                    <div className="home-title"><BarChartOutlined style={{ fontSize: 35, marginRight: 10 }} />Thống kê kết quả luyện thi</div>
                </Col>
            </Row>
            <Row>
                {currentResults.map((result) => {
                    return (<>
                        <Col className="col-result">
                            <div className='result-container'>
                                <div className="result-score">
                                    <p className={result.totalScore ? result.score / result.totalScore >= 0.4 ? "green" : "red" : "green"}>{result.score}</p>
                                </div>
                                <div className="result-info">
                                    <div className="result-info-test">
                                        <h1>{result.exam.exam_name}</h1>
                                        <p>Thời gian thi: <b>{dayjs(result.createdAt).format('DD/MM/YYYY')}</b></p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Tag color="cyan">Lần thi: <b>{result.count}</b></Tag>
                                            <Tag color="red">Điểm tối đa: <b>{result.totalScore}</b></Tag>
                                        </div>
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
            <Row>
                <Col span={24} style={{ textAlign: 'center', marginTop: 50, marginBottom: 50 }}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={listResult.length}
                        onChange={handlePageChange}
                    />
                </Col>
            </Row>
        </div >);
}

export default Result;