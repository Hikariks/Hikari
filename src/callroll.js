import {useState,useEffect} from 'react';
import axios from 'axios';
import { List, Button, Modal,Avatar,Typography,Spin,Descriptions} from '@douyinfe/semi-ui';
import {IconIdCard} from '@douyinfe/semi-icons'
import useSWR from 'swr'

function App() {
    const [selectedStudent, setSelectedStudent] = useState(null); 
    const [visible, setVisible] = useState(false);
    const{Text} = Typography
    const [calledStudents, setCalledStudents] = useState([]);
    const { data:students, error, isLoading } = useSWR('http://localhost:3000/students', url => axios.get(url).then(res => res.data))
    useEffect(() => {
        if (students && students.length === calledStudents.length) {
            setCalledStudents([]);

        }
    }, [calledStudents, students]);
    if(isLoading){
        return <Spin size='large'></Spin>
    }
    if(error){
        return <div>{error.message}</div>
    }
    

    const showDialog = () => {
        const uncalledStudents = students.filter(student => !calledStudents.includes(student.name));
        const randomIndex = Math.floor(Math.random() * uncalledStudents.length);
        const student = uncalledStudents[randomIndex];
        setSelectedStudent(student.name);
        setCalledStudents(nowlist => [...nowlist, student.name]);
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
    const normalStyle ={
        color: 'var(--semi-color-text-0)',
        fontWeight: 500 
    }
    const getGray ={
        color: "gray",
        fontWeight: 500,
        
    }
    return (
        <div>
            <Avatar
            alt="logo"
            src="//s.moonshotacademy.cn/public/8/b/4de522-1fb5e2-2f1652.600.png"
            style={{ margin: 4 }}
        />
            <List
                grid={{
                    gutter: 20,
                    span: 8,
                }}
                dataSource={students}
                renderItem={item => {
                    const isCalled = calledStudents.includes(item.name)
                    if (item.name==='赵胤轩') {                   
                        return(<List.Item style={style}>
                        <div>
                            <h3 style={isCalled ? getGray : normalStyle}>🤡{item.name}</h3>
                            <Descriptions
                                align="center"
                                size="small"
                                row
                                data={[{ key: '分数', value: item.points }]}
                            />
                        </div>
                    </List.Item>)
                    } else {
                        return(<List.Item style={style}>
                        <div>
                            <h3 style={isCalled ? getGray : normalStyle}>{item.name}</h3>
                            <Descriptions
                                align="center"
                                size="small"
                                row
                                data={[{ key: '分数', value: item.points }]}
                            />
                        </div>
                    </List.Item>
    )}
                }
                }
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
