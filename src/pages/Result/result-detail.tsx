import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IGroupQuestion, IQuestion, IResult } from "../../custom/type";
import { getResultInfo, getResultQuestionDetail } from "../../apis";
import { Button, Col, Divider, Form, message, Radio, Row } from "antd";
import './result-detail.scss'
function ResultDetail() {
    const { resultId } = useParams();
    const [resultInfo, setResultInfo] = useState<IResult | null>(null);
    const [listQuestion, setListQuestion] = useState<IGroupQuestion[]>([]);
    // const { idExam } = useParams();
    const questionRefs = useRef<(HTMLHeadingElement | null)[]>([]);
    const navigator = useNavigate();
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getResultInfo(Number(resultId));
                if (res) {
                    setResultInfo(res.data);
                    const respn = await getResultQuestionDetail(Number(res.data.id));
                    if (respn) {
                        setListQuestion(respn.listQuestion)
                    }
                }
            } catch {
                message.open({
                    type: 'error',
                    content: 'Lỗi lấy data question'
                });
            }
        };
        fetch();
    }, [resultId]);
    const totalQuestions = listQuestion.reduce((total, groupQuestion) => {
        return total + groupQuestion.questions.length;
    }, 0);


    const scrollToQuestion = (index: number) => {
        if (questionRefs.current[index]) {
            questionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    const listDa: boolean[] = [];
    const handleRetest = () => {
        navigator(`/exam/questions/${resultInfo?.examId}`)
    }
    return (<>
        <Row>
            <Col span={8} offset={4}>
                <div className="home-title">Chi tiết làm bài</div>
            </Col>
        </Row>
        <div className='question-exam-container'>
            <Form name='exam-result'>
                <div className='list-question-content'>
                    {listQuestion.map((groupQuestion, groupIndex) => {
                        let num = 0;
                        if (groupIndex !== 0) {
                            for (let i = 0; i < groupIndex; i++) {
                                num += listQuestion[i].questions.length;
                            }
                        }
                        return (
                            <div key={groupIndex} className='group-question'>
                                <h3>※{groupQuestion.description}</h3>
                                <p>※{groupQuestion.content}</p>
                                <img src={groupQuestion.image} alt='question' />
                                <div className='list-question'>
                                    {groupQuestion.questions.map((question: IQuestion, questionIndex) => {
                                        const numberQuestion = num + questionIndex + 1;
                                        let dv = 0;
                                        let isTrue = false;
                                        question.result_details?.map((rs) => {
                                            dv = Number(rs.user_answer);
                                            isTrue = rs.is_correct;
                                        })
                                        listDa.push(isTrue);
                                        return (
                                            <section key={question.id}>
                                                <div style={{ display: 'flex' }} ref={el => (questionRefs.current[numberQuestion - 1] = el)} id={`#${numberQuestion}`}>
                                                    <h3 style={{ marginRight: 5 }}>Câu {numberQuestion}:</h3>
                                                    <p>{question.question}</p>
                                                </div>
                                                {question.answers.length && (
                                                    <Form.Item name={`${question.id}`}>
                                                        <Radio.Group key={`question-${question.id}`} defaultValue={dv}>
                                                            {question.answers.map(a => {
                                                                return <Radio className={(a.id === dv) ? isTrue ? 'da-true' : 'da-false' : (a.is_true ? dv == 0 ? 'not-do' : 'need-true' : '')} key={a.id} disabled value={a.id}>{a.answer}</Radio>;
                                                            })}
                                                        </Radio.Group>
                                                    </Form.Item>

                                                )}
                                                <Divider />
                                            </section>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Form>
            <div>
                <div className='list-question-icon'>
                    <h2>Câu hỏi</h2>
                    <div className='list-question-btn'>
                        {[...Array(totalQuestions)].map((_, index) => (
                            <button className={listDa[index] ? 'btn-da-true' : 'btn-da-false'} key={index} onClick={() => scrollToQuestion(index)}>
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <Button onClick={handleRetest}>Làm lại</Button>
                </div>
            </div>
        </div>
    </>);
}

export default ResultDetail;