import { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Descriptions, Button, Modal,Avatar,Typography} from '@douyinfe/semi-ui';
import {IconIdCard} from '@douyinfe/semi-icons'

function App() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null); 
    const [visible, setVisible] = useState(false);
    const{Text} = Typography
    useEffect(() => {
        axios.get('http://localhost:3000/students')
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);
    const showDialog = () => {
        const randomIndex = Math.floor(Math.random() * students.length);
        const student = students[randomIndex];
        setSelectedStudent(student.name);
        setVisible(true); 
    };
    const handleOk = () => {
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const style = {
        border: '1px solid var(--semi-color-border)',
        backgroundColor: 'var(--semi-color-bg-2)',
        borderRadius: '3px',
        paddingLeft: '20px',
    };
    return (
        <div>
            <Avatar
            alt="logo"
            src="//s.moonshotacademy.cn/public/8/b/4de522-1fb5e2-2f1652.600.png"
            style={{ margin: 4 }}
        />
            <List
                grid={{
                    gutter: 12,
                    span: 8,
                }}
                dataSource={students}
                renderItem={item => (
                    <List.Item style={style}>
                        <div>
                            <h3 style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>{item.name}</h3>
                            <Descriptions
                                align="center"
                                size="small"
                                row
                                data={[{ key: '分数', value: item.points }]}
                            />
                        </div>
                    </List.Item>
                )}
            />
            <Button 
            icon={<IconIdCard />}
            block onClick={showDialog}>开始点名</Button>
            <Modal
                title="幸运儿"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                closeOnEsc={true}
                okText={'答对了，加一分'}
                cancelText={'答错了，减一分'}    
            >
            <Text type='danger'>{selectedStudent}</Text>
            </Modal>
        </div>
    );
}

export default App;
