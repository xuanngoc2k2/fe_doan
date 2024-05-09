import { Col, message, Pagination, Row } from "antd";
import ExamRanking from "../../components/exam-ranking";
import CardExam from "../../components/card-exam";
import './exams.scss'
import { useEffect, useState } from "react";
import { getExamByType } from "../../apis";
import { useParams } from "react-router-dom";
const fakeDataRanking = [
    {
        full_name: "Nguyễn Như Ý",
        score: 98,
        date: "April 4, 2024, 7:59 p.m",
        image: "https://onthitopik.vn/media/images/default.png"
    },
    {
        full_name: "pham thi oanh",
        score: 97,
        date: "April 5, 2024, 10:10 a.m"
    },
    {
        full_name: "thu hang",
        score: 90,
        date: "April 1, 2024, 9:58 p.m."
    },
    {
        full_name: "HO VAN THAI",
        score: 86,
        date: "April 1, 2024, 9:58 p.m."
    },
    {
        full_name: "tien",
        score: 85,
        date: "April 1, 2024, 9:58 p.m."
    },
    {
        full_name: "tien",
        score: 85,
        date: "April 1, 2024, 9:58 p.m."
    },
    {
        full_name: "tien",
        score: 85,
        date: "April 1, 2024, 9:58 p.m."
    },
    {
        full_name: "tien",
        score: 85,
        date: "April 1, 2024, 9:58 p.m.qqqqqqqqqqqqq"
    },
    {
        full_name: "tien",
        score: 85,
        date: "April 1, 2024, 9:58 p.m."
    },
    {
        full_name: "tien",
        score: 85,
        date: "April 1, 2024, 9:58 p.m."
    },
]

//chưa phân trang
function Exams() {
    const [listExam, setListExam] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;
    const indexOfLastExam = currentPage * pageSize;
    const indexOfFirstExam = indexOfLastExam - pageSize;
    const currentExams = listExam.slice(indexOfFirstExam, indexOfLastExam);
    const typeExam = useParams();
    // Xử lý sự kiện khi chuyển trang
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (typeExam.typeExam) {
                    const res = await getExamByType(String(typeExam.typeExam));
                    if (res.data) {
                        setListExam(res.data);
                    }
                }
            }
            catch {
                message.open({
                    type: 'error',
                    content: 'Lỗi lấy data'
                })
            }
        }
        fetchData()
    }, [typeExam.typeExam])
    return (
        <>
            <Row>
                <Col span={2} offset={4}>
                    <div className="home-title">Đề thi</div>
                </Col>
            </Row>
            <Row className="exams-container">
                <Row className="exams-list">
                    {currentExams.map((exam, index) => {
                        return <>
                            <Col key={index}>
                                <CardExam exam={exam} />
                            </Col>
                        </>
                    })}
                    <Row style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={listExam.length}
                                onChange={handlePageChange}
                            />
                        </Col>
                    </Row>
                </Row >
                <Row className="exams-ranking">
                    <ExamRanking data={fakeDataRanking} />
                </Row >
            </Row>
        </>
    );
}

export default Exams;