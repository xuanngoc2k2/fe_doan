import { Button, Form, Radio } from 'antd';
import './styles/question-exam.scss';

const listQuestion = [
    {
        groupquestion: {
            description: '[31～33] 무엇에 대한 이야기입니까? <보기>와 같이 알맞은 것을 고르십시오.',
            image: './31-34.png'
        },
        questions: [
            {
                idQuestion: 1,
                question: '저는 김민수입니다. 이 사람은 제임스입니다.',
                answer: [
                    {
                        id: 1,
                        answer: '시간'
                    },
                    {
                        id: 2,
                        answer: '장소'
                    },
                    {
                        id: 3,
                        answer: '이름'
                    }, {
                        id: 4,
                        answer: '주말'
                    }
                ]
            },
            {
                idQuestion: 2,
                question: '저는 김민수입니다. 이 사람은 제임스입니다.',
                answer: [
                    {
                        id: 1,
                        answer: '시간'
                    },
                    {
                        id: 2,
                        answer: '장소'
                    },
                    {
                        id: 3,
                        answer: '이름'
                    }, {
                        id: 4,
                        answer: '주말'
                    }
                ]
            },
            {
                idQuestion: 3,
                question: '저는 김민수입니다. 이 사람은 제임스입니다.',
                answer: [
                    {
                        id: 1,
                        answer: '시간'
                    },
                    {
                        id: 2,
                        answer: '장소'
                    },
                    {
                        id: 3,
                        answer: '이름'
                    }, {
                        id: 4,
                        answer: '주말'
                    }
                ]
            }
        ]
    },
    {
        groupquestion: {
            description: '[34～39] <보기>와 같이 (   )에 들어갈 가장 알맞은 것을 고르십시오.< 보 기 >날씨가 좋습니다. ( )이 맑습니다..',
            image: '31-34.png'
        },
        questions: [
            {
                idQuestion: 4,
                question: '몇 시(   )옵니까?',
                answer: [
                    {
                        id: 1,
                        answer: '가'
                    },
                    {
                        id: 2,
                        answer: '는'
                    },
                    {
                        id: 3,
                        answer: '를'
                    }, {
                        id: 4,
                        answer: '에'
                    }
                ]
            },
            {
                idQuestion: 5,
                question: '몇 시(   )옵니까?',
                answer: [
                    {
                        id: 1,
                        answer: '가'
                    },
                    {
                        id: 2,
                        answer: '는'
                    },
                    {
                        id: 3,
                        answer: '를'
                    }, {
                        id: 4,
                        answer: '에'
                    }
                ]
            },
            {
                idQuestion: 6,
                question: '몇 시(   )옵니까?',
                answer: [
                    {
                        id: 1,
                        answer: '가'
                    },
                    {
                        id: 2,
                        answer: '는'
                    },
                    {
                        id: 3,
                        answer: '를'
                    }, {
                        id: 4,
                        answer: '에'
                    }
                ]
            }
        ]
    }
];

function QuestionExam() {
    const handleSubmit = (values: unknown) => {
        console.log('Submitted values:', values);
    }
    return (
        <div>
            <Form className='question-exam-container' onFinish={handleSubmit}>
                <div className='list-question-content'>
                    {listQuestion.map((groupQuestion) => (
                        <div key={groupQuestion.groupquestion.description} className='group-question'>
                            <h3>{groupQuestion.groupquestion.description}</h3>
                            <img src={groupQuestion.groupquestion.image} alt="question" />
                            <div className='list-question'>
                                {groupQuestion.questions.map((question) => (
                                    <section key={question.idQuestion}>
                                        <h4>{question.question}</h4>
                                        <Form.Item name={`question-${question.idQuestion}`}>
                                            <Radio.Group>
                                                {question.answer.map((answer) => {
                                                    return (
                                                        <Radio value={answer.id}>{answer.answer}</Radio>
                                                    )
                                                })}
                                            </Radio.Group>
                                        </Form.Item>
                                    </section>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className='list-question-icon'>
                    <h2>Câu hỏi</h2>
                    <div className='list-question-btn'></div>
                    <Button htmlType='submit'>Nộp bài</Button>
                    <p>Thời gian làm bài</p>
                </div>
            </Form>
        </div>
    );
}

export default QuestionExam;
