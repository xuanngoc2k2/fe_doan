import { CloseCircleOutlined, NotificationOutlined } from '@ant-design/icons';
import './news.scss'
import { useState } from 'react';
import { Divider, Modal } from 'antd';
import NewsCom from '../../../components/news-com';
const fakeNews = [
    {
        content: `
        <h1>Ra mắt Server Discord F8 - Học Lập Trình Không Khó</h1>
        Học lập trình một mình sao bằng có bạn bè cùng tiến? Đừng để bản thân phải lạc lõng, hãy ghé qua Discord của F8 và cảm nhận sự khác biệt nhé!
        <ul>
        <li>Cùng nhau xây dựng team code siêu chất, học hỏi lẫn nhau và cùng tiến bộ!</li>
        <li>Cùng nhau học hỏi từ người đi trước, có thêm động lực và sự tự giác trong học tập!</li>
        <li>Nơi mà sự tiêu cực không có chỗ đứng, câu hỏi nào cũng được trả lời, không sợ bị đánh giá toxic, chỉ có sự hỗ trợ và tôn trọng lẫn nhau!</li>
        </ul>`,
        image: 'https://files.fullstack.edu.vn/f8-prod/public-images/6603da227f20c.png'
    },
    {
        content: `#Ra mắt Server Discord F8 - Học Lập Trình Không Khó
        Học lập trình một mình sao bằng có bạn bè cùng tiến? Đừng để bản thân phải lạc lõng, hãy ghé qua Discord của F8 và cảm nhận sự khác biệt nhé!
        
        Cùng nhau xây dựng team code siêu chất, học hỏi lẫn nhau và cùng tiến bộ!
        Cùng nhau học hỏi từ người đi trước, có thêm động lực và sự tự giác trong học tập!
        Nơi mà sự tiêu cực không có chỗ đứng, câu hỏi nào cũng được trả lời, không sợ bị đánh giá toxic, chỉ có sự hỗ trợ và tôn trọng lẫn nhau!`,
        image: 'https://files.fullstack.edu.vn/f8-prod/public-images/6603da227f20c.png'
    },
    {
        content: `#Ra mắt Server Discord F8 - Học Lập Trình Không Khó
        Học lập trình một mình sao bằng có bạn bè cùng tiến? Đừng để bản thân phải lạc lõng, hãy ghé qua Discord của F8 và cảm nhận sự khác biệt nhé!
        
        Cùng nhau xây dựng team code siêu chất, học hỏi lẫn nhau và cùng tiến bộ!
        Cùng nhau học hỏi từ người đi trước, có thêm động lực và sự tự giác trong học tập!
        Nơi mà sự tiêu cực không có chỗ đứng, câu hỏi nào cũng được trả lời, không sợ bị đánh giá toxic, chỉ có sự hỗ trợ và tôn trọng lẫn nhau!`,
        image: 'https://files.fullstack.edu.vn/f8-prod/public-images/6603da227f20c.png'
    },
    {
        content: `#Ra mắt Server Discord F8 - Học Lập Trình Không Khó
        Học lập trình một mình sao bằng có bạn bè cùng tiến? Đừng để bản thân phải lạc lõng, hãy ghé qua Discord của F8 và cảm nhận sự khác biệt nhé!
        
        Cùng nhau xây dựng team code siêu chất, học hỏi lẫn nhau và cùng tiến bộ!
        Cùng nhau học hỏi từ người đi trước, có thêm động lực và sự tự giác trong học tập!
        Nơi mà sự tiêu cực không có chỗ đứng, câu hỏi nào cũng được trả lời, không sợ bị đánh giá toxic, chỉ có sự hỗ trợ và tôn trọng lẫn nhau!`,
        image: 'https://files.fullstack.edu.vn/f8-prod/public-images/6603da227f20c.png'
    }
]
function News() {
    const [open, setOpen] = useState(false);
    return (<>
        <div className='news-model' onClick={() => { setOpen(true) }}>
            <div className='new-model-icon'>
                <NotificationOutlined style={{
                    fontSize: 30,
                    color: '#1677ff',
                }} />
            </div>
        </div>
        <Modal
            title={<div>
                <div>Hey Korean - Thông báo!!</div>
                <CloseCircleOutlined onClick={() => {
                    setOpen(false)
                }} className='new-model-button-close' />
            </div>}
            open={open}
            onCancel={() => setOpen(false)}
            width={1000}
            className='new-model-detail'
            footer={<></>}
        >
            {fakeNews.map((news) => {
                return <>
                    <NewsCom content={news.content} image={news.image} />
                    <Divider />
                </>
            })}
        </Modal>
    </>
    );
}

export default News;