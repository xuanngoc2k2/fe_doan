import { Carousel, Col, Divider, Row } from "antd";
import CardQuestion from "../../components/card-question";
import './home.scss'
import CardCourse from "../../components/card-course";
import CardExam from "../../components/card-exam";
import ExamRanking from "../../components/exam-ranking";

const fakeQuestion = [
    {
        title: "오늘은 뭘 할거에요?",
        answer: "학교에 가요.",
        isQuestion: true
    },
    {
        title: "Kì thi TOPIK 94 sắp bắt đầu",
        description: `Đăng ký tại khu vực miền Nam: từ 15h00 ngày 06/03/2024 -12/03/2024
        Hàn Quốc:       
        Đăng ký từ 12/03/2024-18/03/2024: Seoul, Gangwon, Gyeongnam, Gyeongbuk, Jeonnam, Jeonbuk, Jeju, South Chungcheong, North Chungcheong
        Đăng ký từ 13/03/2024-18/03/2024: Gyeonggi,Incheon, Daejeon, Daegu, Gwangju, Busan, Ulsan
        Đăng ký từ 14/03/2024-18/03/2024: Khu vực khác`,
        isQuestion: false
    },
    {
        title: "오늘은 뭘 할거에요?",
        answer: "학교에 가요.",
        isQuestion: true
    },
]
const fakeCourse = [
    {
        name: 'Sơ cấp 1',
        descriptions: 'Kiến thức nhập môn tiếng Hàn'
    },
    {
        name: 'Sơ cấp 2',
        descriptions: 'Kiến thức nhập môn tiếng Hàn'
    },
    // {
    //     name: 'Trung cấp 3',
    //     descriptions: 'Kiến thức nhập môn tiếng Hàn'
    // },
    // {
    //     name: 'Trung cấp 4',
    //     descriptions: 'Kiến thức nhập môn tiếng Hàn'
    // }
]
const fakeExam = [
    {
        name: 'Sơ cấp 1',
        descriptions: 'Kiến thức nhập môn tiếng Hàn'
    },
    {
        name: 'Sơ cấp 2',
        descriptions: 'Kiến thức nhập môn tiếng Hàn'
    },
    {
        name: 'Trung cấp 3',
        descriptions: 'Kiến thức nhập môn tiếng Hàn'
    },
    {
        name: 'Trung cấp 4',
        descriptions: 'Kiến thức nhập môn tiếng Hàn'
    },
    {
        name: 'Trung cấp 3',
        descriptions: 'Kiến thức nhập môn tiếng Hàn'
    },
    {
        name: 'Trung cấp 4',
        descriptions: 'Kiến thức nhập môn tiếng Hàn'
    },
    {
        name: 'Trung cấp 3',
        descriptions: 'Kiến thức nhập môn tiếng Hàn'
    },
    {
        name: 'Trung cấp 4',
        descriptions: 'Kiến thức nhập môn tiếng Hàn'
    },
    {
        name: 'Trung cấp 4',
        descriptions: 'Kiến thức nhập môn tiếng Hàn'
    },
    {
        name: 'Trung cấp 4',
        descriptions: 'Kiến thức nhập môn tiếng Hàn'
    }
]
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
function Home() {
    return (
        <>
            <div className="home-container">
                <Row className="home-header">
                    <Col className="home-carousel" span={10} offset={7}>
                        <Carousel
                            dots={{ "className": "home-carousel-dot" }}
                            style={{ overflow: "hidden", borderRadius: 10 }}
                            pauseOnHover={true}
                            pauseOnDotsHover={true}
                            autoplay
                            draggable
                        >
                            {fakeQuestion.map((question, index) => {
                                return <CardQuestion key={index} isQuestion={question.isQuestion} title={question.title} description={question.description} answer={question.answer} />
                            })}
                        </Carousel>
                    </Col>
                </Row>
                {/* <Divider /> */}
                <Row
                    style={{ marginTop: 20 }}
                >
                    <Col span={2} offset={4}>
                        <div className="home-title">Khóa học</div>
                    </Col>
                </Row>
                <Row
                    style={{ marginLeft: 120 }}
                >
                    {fakeCourse.map((course, index) => {
                        return <>
                            <Col style={{ marginBottom: 20 }} span={8} offset={2}>
                                <CardCourse key={index} />
                            </Col>
                        </>
                    })}
                </Row>
                <Divider />
                <Row>
                    <Col span={2} offset={4}>
                        <div className="home-title">Đề thi</div>
                    </Col>
                </Row>
                <Row >
                    <Row className="home-exam">
                        {fakeExam.map(() => {
                            return <>
                                <Col>
                                    <CardExam />
                                </Col>
                            </>
                        })}
                    </Row >
                    <Row className="home-exam-ranking">
                        <ExamRanking data={fakeDataRanking} />
                    </Row >
                </Row>
                <Divider />
            </div></>);
}

export default Home;