import { MinusOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import './styles/card-vocab-list.scss';
import { IListVocabDetail } from "../custom/type";

interface CardVocabListProps {
    onClick?: () => void;
    data?: IListVocabDetail;
    handleRemove?: (idList: number) => void;
}
const CardVocabList: React.FC<CardVocabListProps> = ({ data, handleRemove }) => {
    return (
        <>
            {data ?
                <div className={`card-vocab-list ${data.isMine}`}>
                    <Card >
                        {handleRemove &&
                            <Popconfirm
                                placement="leftTop"
                                title={"Xác nhận xóa danh sách từ vựng"}
                                description={"Bạn có chắc chắn muốn xóa danh sách từ vựng này ?"}
                                onConfirm={() => handleRemove(data.id)}
                                okText="Xác nhận"
                                cancelText="Hủy"
                            >
                                <span>
                                    <MinusOutlined className="icon-delete" />
                                </span>
                            </Popconfirm>
                        }
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
                            <Link to={`/vocab-detail/${data.id}`}><Button block type='primary' ghost>Học</Button></Link>
                        </div>
                    </Card>
                </div> :
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