import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { Link } from "react-router-dom";
import './styles/card-vocab-list.scss';

interface CardVocabListProps {
    onClick?: () => void;
    data?: {
        id: number;
        name: string;
        totalWords: number;
        needRemember: number;
        remembered: number;
        description: string;
    }
}
const CardVocabList: React.FC<CardVocabListProps> = ({ data }) => {

    return (
        <>
            {data ?
                <Link className='card-vocab-list' to={`/vocab-detail/${data.id}`}>
                    <Card >
                        <h2 className='card-vocab-list-title'>
                            {data.name}
                        </h2>
                        <div className='card-vocab-list-detail'>
                            <p className="total-word">{data.totalWords} từ</p>
                            <p>Cần ôn tập: <span style={{ color: 'red', fontWeight: 'bold' }}>{data.needRemember}</span></p>
                            <p>Đã nhớ: {data.remembered}</p>
                        </div>
                        {/* <div className='card-vocab-list-des'>
                            <p>{data.description}</p>
                        </div> */}
                        <div className='card-vocab-list-btn'>
                            <Button block type='primary' ghost>Học</Button>
                        </div>
                    </Card>
                </Link> :
                <Card className='card-vocab-list'>
                    <div className=''>
                        <div>
                            <Button className="btn-create-new-list" block type='primary' ghost><PlusCircleOutlined />
                                <p>Tạo list từ</p></Button>
                        </div>
                    </div>
                </Card>}
        </>
    );
}

export default CardVocabList;