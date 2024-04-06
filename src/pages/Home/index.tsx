import { Carousel, Col, Row } from "antd";
import CardQuestion from "../../components/card-question";

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
function Home() {
    return (
        <><div className="home-container">
            <Row>
                <Col className="home-carousel" span={10} offset={7}>
                    <Carousel
                        dots={{ "className": "home-carousel-dot" }}
                        style={{ overflow: "hidden", borderRadius: 10 }}
                        pauseOnHover={true}
                        pauseOnDotsHover={true}
                        autoplay
                        draggable
                    >
                        {fakeQuestion.map((question) => {
                            return <CardQuestion isQuestion={question.isQuestion} title={question.title} description={question.description} answer={question.answer} />
                        })}
                    </Carousel>
                </Col>
            </Row>
        </div></>);
}

export default Home;