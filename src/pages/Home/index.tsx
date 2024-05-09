import {
    Carousel, Col, Divider, Input,
    message,
    // message,
    Row
} from "antd";
import CardQuestion from "../../components/card-question";
import './home.scss'
import CardCourse from "../../components/card-course";
import CardExam from "../../components/card-exam";
import ExamRanking from "../../components/exam-ranking";
import { SearchProps } from "antd/es/input";
import WordInfo from "../../components/word-info";
import { useEffect, useState } from "react";
import { getListCourses, getListExams, getRandomQuestion } from "../../apis";
import { IQuestion } from "../../custom/type";

// const fakeQuestion = [
//     {
//         title: "오늘은 뭘 할거에요?",
//         answer: "학교에 가요.",
//         isQuestion: true
//     },
//     {
//         title: "Kì thi TOPIK 94 sắp bắt đầu",
//         description: `Đăng ký tại khu vực miền Nam: từ 15h00 ngày 06/03/2024 -12/03/2024
//         Hàn Quốc:       
//         Đăng ký từ 12/03/2024-18/03/2024: Seoul, Gangwon, Gyeongnam, Gyeongbuk, Jeonnam, Jeonbuk, Jeju, South Chungcheong, North Chungcheong
//         Đăng ký từ 13/03/2024-18/03/2024: Gyeonggi,Incheon, Daejeon, Daegu, Gwangju, Busan, Ulsan
//         Đăng ký từ 14/03/2024-18/03/2024: Khu vực khác`,
//         isQuestion: false
//     },
//     {
//         title: "오늘은 뭘 할거에요?",
//         answer: "학교에 가요.",
//         isQuestion: true
//     },
// ]
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

// function isKorean(text: string) {
//     const koreanRegex = /[\uac00-\ud7a3]/;
//     return koreanRegex.test(text);
// }
function Home() {
    // const [messageApi, contextHolder] = message.useMessage();
    const [word, setWord] = useState('');
    const [search, setSearch] = useState(false);
    const [listCourse, setListCourse] = useState([]);
    const [listExam, setListExam] = useState([]);
    const [questions, setQuestion] = useState<IQuestion[] | []>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getListCourses();
                if (response.data) {
                    setListCourse(response.data.slice(0, 2));
                }
                const res = await getListExams();
                if (res.data) {
                    setListExam(res.data.slice(0, 8));
                }
                const resq = await getRandomQuestion();
                if (resq && resq.data) {
                    setQuestion(resq.data)
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
    }, [])
    // const error = (message: string) => {
    //     messageApi.open({
    //         type: 'error',
    //         content: message,
    //         style: {
    //             marginTop: '20vh',
    //         },
    //     });
    // };
    const onSearch: SearchProps['onSearch'] = (value) => {
        //     if (value === '' && search) {
        //         error('Không được để trống !')
        //     }
        //     else if (!isKorean(value) && search) {
        //         error('Ngôn ngữ nhập vào phải là Tiếng hàn')
        //     }
        //     else {
        if (value) {
            setSearch(true)
        }
        //     }
    };
    return (
        <>
            {/* {contextHolder} */}
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
                            {questions.map((question, index) => {
                                return <CardQuestion key={index} question={question} title={question.question} answers={question.answers} />
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
                    {listCourse.map((course, index) => {
                        return <>
                            <Col style={{ marginBottom: 20 }} span={8} offset={2}>
                                <CardCourse course={course} key={index} />
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
                        {listExam.map((exam, index) => {
                            return <>
                                <Col key={index}>
                                    <CardExam exam={exam} />
                                </Col>
                            </>
                        })}
                    </Row >
                    <Row className="home-exam-ranking">
                        <ExamRanking data={fakeDataRanking} />
                    </Row >
                </Row>
                <Divider />
                <Row>
                    <Col span={2} offset={4}>
                        <div className="home-title">Từ vựng</div>
                    </Col>
                </Row>
                <Row style={{ alignItems: 'center', flexFlow: 'column' }}>
                    <Col className="home-search">
                        <Input.Search
                            placeholder="Nhập từ mới"
                            size="large"
                            allowClear
                            onChange={(e) => { setWord(e.target.value); setSearch(false) }}
                            className="home-search-input"
                            onSearch={onSearch}
                            value={word}
                        />
                    </Col>
                    <br />
                    {search && <div className="home-seach-word-info"><WordInfo word={word} /></div>}
                </Row>
            </div></>);
}

export default Home;