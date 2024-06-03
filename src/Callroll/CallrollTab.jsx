import {useState} from 'react';
import { List, Button, Modal,Typography,Spin,Descriptions} from '@douyinfe/semi-ui';
import {IconUser} from '@douyinfe/semi-icons'
import axios from 'axios';
import useSWR from 'swr'
import {useParams} from 'react-router-dom'
import {IconDelete} from '@douyinfe/semi-icons';

export const CallrollTab =() =>{
  const params = useParams().courseId
  const { data:students, error, isLoading,mutate } = useSWR(`http://localhost:4000/${params}`, url => axios.get(url).then(res => res.data))
  const [selectedStudent, setSelectedStudent] = useState({}); 
  const [visible, setVisible] = useState(false);
  const [warning, setWarning] = useState(false);
  const [calledStudents, setCalledStudents] = useState([]);
  const{Text} = Typography
  const updateStudent = ({ id, data }) => axios.patch(`http://localhost:4000/${params}/${id}`, data)
  const highestScore = Math.max(...students.map(student => student.points));
  const lowestScore = Math.min(...students.map(student => student.points));
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

  const showWarning =() => {
    setWarning(true)
  }

  const deletestudent = (id) => {
    fetch(`http://localhost:4000/${params}/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        mutate();
      });
    setWarning(false)
  };

  const warningcancel = () => {
    setWarning(false)
  }

  

    return(
      <div>
        <Text>分数最高：👑  分数最低：🤡  </Text>
        <List
              grid={{
                  gutter: 20,
                  span: 8,
              }}
              dataSource={students}
              renderItem={item => {
                  const isCalled = calledStudents.includes(item.name)
                  if (item.points === highestScore) {                   
                      return(<List.Item style={style}>
                      <div>
                          <Text heading={3} delete={isCalled?true:false}style={isCalled ? getGray : normalStyle}>👑{item.name}</Text>
                          <Descriptions
                              align="center"
                              size="small"
                              row
                              data={[{ key: '分数', value: item.points }]}
                          />
                          <Button
                          icon={<IconDelete/>}
                          onClick={showWarning}></Button>
                          <Modal
                          title="警告"
                          visible={warning}
                          onOk={() => deletestudent(item.id)}
                          onCancel={warningcancel}
                          ><Text>确定删除该学生吗</Text>
                          </Modal>
                      </div>
                  </List.Item>)
                  }
                  if (item.points === lowestScore) {                   
                    return(<List.Item style={style}>
                    <div>
                        <Text heading={3} delete={isCalled?true:false}style={isCalled ? getGray : normalStyle}>🤡{item.name}</Text>
                        <Descriptions
                            align="center"
                            size="small"
                            row
                            data={[{ key: '分数', value: item.points }]}
                        />
                        <Button
                          icon={<IconDelete/>}
                          onClick={showWarning}></Button>
                          <Modal
                          title="警告"
                          visible={warning}
                          onOk={() => deletestudent(item.id)}
                          onCancel={warningcancel}
                          ><Text>确定删除该学生吗</Text>
                          </Modal>
                    </div>
                </List.Item>)
                }
                else {
                    return(<List.Item style={style}>
                      <div>
                          <Text heading={3} delete={isCalled?true:false} style={isCalled ? getGray : normalStyle}>{item.name}</Text>
                          <Descriptions
                              align="center"
                              size="small"
                              row
                              data={[{ key: '分数', value:item.points }]}
                          />
                           <Button
                          icon={<IconDelete/>}
                          onClick={showWarning}></Button>
                          <Modal
                          title="警告"
                          visible={warning}
                          onOk={() => deletestudent(item.id)}
                          onCancel={warningcancel}
                          ><Text>确定删除该学生吗</Text>
                          </Modal>
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