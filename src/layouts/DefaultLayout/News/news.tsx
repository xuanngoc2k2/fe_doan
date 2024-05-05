import { CloseCircleOutlined, NotificationOutlined } from '@ant-design/icons';
import './news.scss'
import { useEffect, useState } from 'react';
import { Divider, Modal, notification } from 'antd';
import NewsCom from '../../../components/news-com';
import { INews } from '../../../custom/type';
import { getAllNews } from '../../../apis';
function News() {
    const [listNews, setListNews] = useState<INews[]>();
    useEffect(() => {
        try {
            const fetch = async () => {
                const res = await getAllNews();
                if (res && res.data) {
                    setListNews(res.data);
                }
                else {
                    notification.error({ message: "Đã xảy ra lỗi!" })
                }
            }
            fetch();
        } catch (error) {
            notification.error({ message: String(error) })
        }
    }, [])
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
            {listNews!.map((news) => {
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