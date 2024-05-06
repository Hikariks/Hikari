import {useState,useEffect} from 'react';
import axios from 'axios';
import { List, Button, Modal,Avatar,Typography,Spin,Descriptions, Tabs, TabPane} from '@douyinfe/semi-ui';
import {IconUser,IconUserGroup} from '@douyinfe/semi-icons'
import useSWR from 'swr'

function App() {
    const [groupHistory, setGroupHistory] = useState([]);
    const [studentScores, setStudentScores] = useState({});
    const [selectedStudent, setSelectedStudent] = useState(null); 
    const [currentGroup, setCurrentGroup] = useState([]);
    const [visible, setVisible] = useState(false);
    const [visible_group, setVisible_group] = useState(false)
    const{Text} = Typography
    const [calledStudents, setCalledStudents] = useState([]);
    
    const [calledStudents_group,setCalledStudents_group] = useState([])
    const { data:students, error, isLoading } = useSWR('http://localhost:3000/students', url => axios.get(url).then(res => res.data))
    
    useEffect(() => {
        if (students && students.length === calledStudents.length) {
            setCalledStudents([]);
        }
    }, [calledStudents, students]);

    useEffect(() => {
        if (students && students.length === calledStudents_group.length) {
            setCalledStudents_group([]);
        }
    }, [calledStudents_group, students]);
    useEffect(() => {
        if (students && students.length /3 === groupHistory.length) {
            setGroupHistory([]);
        }
    }, [groupHistory, students]);
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
        if (!studentScores[student.name]) {
            setStudentScores(prev => ({ ...prev, [student.name]: student.points }));
        }
        setCalledStudents(nowlist => [...nowlist, student.name]);
        setVisible(true);
    };
    
    const showGroupDialog = () => {
        const uncalledStudents_group = students.filter(student => !calledStudents_group.includes(student.name));
        let group = [];
        for (let i = 0; i < 3; i++) {
            if (uncalledStudents_group.length === 0) {
                break;
        }
            const randomIndex = Math.floor(Math.random() * uncalledStudents_group.length);
            const student = uncalledStudents_group[randomIndex];
            group.push(student.name);
            setCalledStudents_group(nowlist => [...nowlist, student.name]);
            uncalledStudents_group.splice(randomIndex, 1);
    }
        setVisible_group(true);
        if (group.length > 0) {
            setGroupHistory(prev => [...prev, group]); 
            setCurrentGroup(group); 
            setVisible_group(true); 
        }
    }

    const handleOk = () => {
        setStudentScores(prevScores => ({
            ...prevScores,
            [selectedStudent]: (prevScores[selectedStudent] || 0) + 1
        }));
        setVisible(false);
    };

    const handleCancel = () => {
        setStudentScores(prevScores => ({
            ...prevScores,
            [selectedStudent]: (prevScores[selectedStudent] || 0) - 1
        }));
        setVisible(false);
    };
    const handleok = () => {
        setVisible_group(false)
    }
    const handlecancel = () => {
        setVisible_group(false)
    }
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
    const score_check = Object.values(studentScores)

    return (
        <div>
            <Avatar
            alt="logo"
            src="//s.moonshotacademy.cn/public/8/b/4de522-1fb5e2-2f1652.600.png"
            style={{ margin: 4 }}
        />
            <Tabs type='button'>
                <TabPane tab="单个点名" itemKey="1">
                <List
                grid={{
                    gutter: 20,
                    span: 8,
                }}
                dataSource={students}
                renderItem={item => {
                    const isCalled = calledStudents.includes(item.name)
                    if (studentScores[item.name] === Math.min(score_check)) {                   
                        return(<List.Item style={style}>
                        <div>
                            <Text heading={3} delete={isCalled?true:false}style={isCalled ? getGray : normalStyle}>🤡{item.name}</Text>
                            <Descriptions
                                align="center"
                                size="small"
                                row
                                data={[{ key: '分数', value: studentScores[item.name] || item.points }]}
                            />
                        </div>
                    </List.Item>)
                    } else {
                        return(<List.Item style={style}>
                        <div>
                            <Text heading={3} delete={isCalled?true:false} style={isCalled ? getGray : normalStyle}>🥰{item.name}</Text>
                            <Descriptions
                                align="center"
                                size="small"
                                row
                                data={[{ key: '分数', value:studentScores[item.name] || item.points }]}
                            />
                        </div>
                    </List.Item>
    )}
                }
                }
                />
                <Button
                icon={<IconUser />}
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
                </TabPane>
                <TabPane tab='分组点名'>
                    
                <List
                grid={{
                    gutter: 20,
                    span: 8,
                }}
                dataSource={students}
                renderItem={item => { 
                        const isCalled = calledStudents_group.includes(item.name)                
                        return(<List.Item style={style}>
                        <div>
                        <Text heading={3} delete={isCalled?true:false} style={isCalled ? getGray : normalStyle}>{item.name}</Text>
                        <Descriptions
                            align="center"
                            size="small"
                            row
                        />
                        </div>
                    </List.Item>)}
                }
                />
                <Button
                icon={<IconUserGroup />}
                block onClick={showGroupDialog}>开始分组</Button>
                <Modal
                title="分组情况"
                onOk={handleok}
                onCancel={handlecancel}
                visible={visible_group}
                closeOnEsc={true} 
            >
                <Text>{currentGroup.join(" and ")}</Text>
            </Modal>
                <Text heading={1}>{groupHistory}</Text>
                
                </TabPane>
            </Tabs>
        </div>
    );
}

export default App;
