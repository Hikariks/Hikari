import {useState} from 'react';
import { List, Button, Modal,Typography,Spin,Descriptions} from '@douyinfe/semi-ui';
import {IconUser} from '@douyinfe/semi-icons'
import axios from 'axios';
import useSWR from 'swr'
import { updateStudent } from './updateStudent';
function findlowest(students){
  let lowestScore = students[0].points;
  let lowestStudents = [students[0]];
  for (let i = 1; i < students.length; i++) {
    if (students[i].points < lowestScore) {
        lowestScore = students[i].points;
        lowestStudents = [students[i]];
    } else if (students[i].points === lowestScore) {
        lowestStudents.push(students[i]);
    }
}
return lowestStudents;
}

export const CallrollTab =() =>{
  const { data:students, error, isLoading,mutate } = useSWR('http://localhost:4000/students', url => axios.get(url).then(res => res.data))
  const [selectedStudent, setSelectedStudent] = useState({}); 
  const [visible, setVisible] = useState(false);
  const [calledStudents, setCalledStudents] = useState([]);
  const{Text} = Typography
  const lowestStudents = students ? findlowest(students) : [];  
  if(isLoading){
      return <Spin></Spin>
  }

  if(error){
      return <div>{error.message}</div>
  }

  const showDialog = () => {
    const uncalledStudents = students.filter(dataItem => !dataItem.selected);
    const randomIndex = Math.floor(Math.random() * uncalledStudents.length);
    const student = uncalledStudents[randomIndex];
    setSelectedStudent(student);
    setCalledStudents(nowlist => [...nowlist, student.name]);
    setVisible(true);
  };

  const handleOk = async() => {
    await updateStudent({
        id: selectedStudent.id,
        data: {points:selectedStudent.points + 1, selected: true}
    }).then(()=>mutate())
    setSelectedStudent({})
    setVisible(false);
  };

  const handleCancel = async() => {
    await updateStudent({
        id: selectedStudent.id,
        data: {points:selectedStudent.points, selected: true}
    }).then(()=>mutate())
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

  

    return(
      <div>
        <List
                    grid={{
                        gutter: 20,
                        span: 8,
                    }}
                    dataSource={students}
                    renderItem={item => {
                        const isCalled = calledStudents.includes(item.name)
                        if (item.name === lowestStudents.name) {                   
                            return(<List.Item style={style}>
                            <div>
                                <Text heading={3} delete={isCalled?true:false}style={isCalled ? getGray : normalStyle}>🤡{item.name}</Text>
                                <Descriptions
                                    align="center"
                                    size="small"
                                    row
                                    data={[{ key: '分数', value: item.points }]}
                                />
                            </div>
                        </List.Item>)
                        }
                         else {
                            return(<List.Item style={style}>
                            <div>
                                <Text heading={3} delete={isCalled?true:false} style={isCalled ? getGray : normalStyle}>🥰{item.name}</Text>
                                <Descriptions
                                    align="center"
                                    size="small"
                                    row
                                    data={[{ key: '分数', value:item.points }]}
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
                    cancelText={'答错了，不加分'}    
                >
                <Text type='danger'>{selectedStudent.name}</Text>
                </Modal>
      </div>   
    )
  }
  
  



