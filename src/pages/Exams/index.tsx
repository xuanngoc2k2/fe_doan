import { Col, Row } from "antd";
import ExamRanking from "../../components/exam-ranking";
import CardExam from "../../components/card-exam";
import './exams.scss'
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
    }, {
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

const fakeExam = [
    {
        exam_name: 'Sơ cấp 1 chính thức',
        description: 'Kiến thức nhập môn tiếng Hàn',
        id: 1,
        duration: 40,
        countUser: 230,
        countTypeQuestion: 10,
        countQuestion: 200,
        type: 'TOPIK I'
    },
    {
        exam_name: 'Sơ cấp 2 chính thức',
        id: 1,
        description: 'Kiến thức nhập môn tiếng Hàn',
        duration: 40,
        countUser: 230,
        countTypeQuestion: 10,
        countQuestion: 200,
        type: 'TOPIK I'
    },
    {
        exam_name: 'Trung cấp 3 chính thức',
        id: 1,
        description: 'Kiến thức nhập môn tiếng Hàn',
        duration: 40,
        countUser: 230,
        countTypeQuestion: 10,
        countQuestion: 200,
        type: 'TOPIK I'
    },
    {
        id: 1,
        exam_name: 'Trung cấp 4 chính thức',
        description: 'Kiến thức nhập môn tiếng Hàn',
        duration: 40,
        countUser: 230,
        countTypeQuestion: 10,
        countQuestion: 200,
        type: 'TOPIK I'
    },
    {
        id: 12,
        exam_name: 'Trung cấp 3 chính thức',
        description: 'Kiến thức nhập môn tiếng Hàn',
        duration: 40,
        countUser: 230,
        countTypeQuestion: 10,
        countQuestion: 200,
        type: 'TOPIK I'
    },
    {
        id: 3,
        exam_name: 'Trung cấp 4 chính thức',
        description: 'Kiến thức nhập môn tiếng Hàn',
        duration: 40,
        countUser: 230,
        countTypeQuestion: 10,
        countQuestion: 200,
        type: 'TOPIK I'
    },
    {
        id: 4,
        exam_name: 'Trung cấp 3 chính thức',
        description: 'Kiến thức nhập môn tiếng Hàn',
        duration: 40,
        countUser: 230,
        countTypeQuestion: 10,
        countQuestion: 200,
        type: 'TOPIK II'
    },
    {
        id: 5,
        exam_name: 'Trung cấp 4 chính thức',
        description: 'Kiến thức nhập môn tiếng Hàn',
        duration: 40,
        countUser: 230,
        countTypeQuestion: 10,
        countQuestion: 200,
        type: 'TOPIK II'
    },
    {
        id: 5,
        exam_name: 'Trung cấp 4 chính thức',
        description: 'Kiến thức nhập môn tiếng Hàn',
        duration: 40,
        countUser: 230,
        countTypeQuestion: 10,
        countQuestion: 200,
        type: 'TOPIK II'
    },
    {
        id: 6,
        exam_name: 'Trung cấp 4 chính thức',
        description: 'Kiến thức nhập môn tiếng Hàn',
        duration: 40,
        countUser: 230,
        countTypeQuestion: 10,
        countQuestion: 200,
        type: 'TOPIK II'
    }
]
//chưa phân trang
function Exams() {
    return (
        <>
            <Row>
                <Col span={2} offset={4}>
                    <div className="home-title">Đề thi</div>
                </Col>
            </Row>
            <Row className="exams-container">
                <Row className="exams-list">
                    {fakeExam.map((exam, index) => {
                        return <>
                            <Col key={index}>
                                <CardExam exam={exam} />
                            </Col>
                        </>
                    })}
                </Row >
                <Row className="exams-ranking">
                    <ExamRanking data={fakeDataRanking} />
                </Row >
            </Row>
        </>
    );
}

export default Exams;