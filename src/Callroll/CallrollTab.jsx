import { useState } from 'react';
import { List, Button, Modal, Typography, Spin, Descriptions, InputNumber } from '@douyinfe/semi-ui';
import { IconUser } from '@douyinfe/semi-icons'
import axios from 'axios';
import useSWR from 'swr'
import { useParams } from 'react-router-dom'
import { IconDelete } from '@douyinfe/semi-icons';

export const CallrollTab = () => {
  const params = useParams().courseId
  const { data: students, error, isLoading, mutate } = useSWR(`http://localhost:4000/${params}`, url => axios.get(url).then(res => res.data))
  const [selectedStudent, setSelectedStudent] = useState({});
  const [visible, setVisible] = useState(false);
  const [warning, setWarning] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState();
  const [calledStudents, setCalledStudents] = useState([]);
  const [ishand, setishand] = useState()
  const { Text } = Typography
  const updateStudent = ({ id, data }) => axios.patch(`http://localhost:4000/${params}/${id}`, data)
  const highestScore = Math.max(...students.map(student => student.points));
  const lowestScore = Math.min(...students.map(student => student.points));
  if (isLoading) {
    return <Spin></Spin>
  }

  if (error) {
    return <div>{error.message}</div>
  }
  const handleScoreChange = (id, points) => {
    const updatedStudents = students.map(student => 
      student.id === id ? { ...student, points: points } : student
    );
    mutate(updatedStudents, false);
  };

  const handleSaveScores = () => {
    students.forEach(student => {
      axios.put(`http://localhost:4000/${params}/${student.id}`, {
        ...student,
        points: student.points
      })
      .then(response => {
        console.log('Score updated successfully', response);
      })
      .catch(error => {
        console.error('There was an error updating the score!', error);
      });
    });
    setishand(false);
  };

  const showDialog = () => {
    const uncalledStudents = students.filter(dataItem => !dataItem.selected);
    const randomIndex = Math.floor(Math.random() * uncalledStudents.length);
    const student = uncalledStudents[randomIndex];
    setSelectedStudent(student);
    setCalledStudents(nowlist => [...nowlist, student.name]);
    setVisible(true);
  };

  const handleOk = async () => {
    await updateStudent({
      id: selectedStudent.id,
      data: { points: selectedStudent.points + 1, selected: true }
    }).then(() => mutate())
    setSelectedStudent({})
    setVisible(false);
  };

  const handleCancel = async () => {
    await updateStudent({
      id: selectedStudent.id,
      data: { points: selectedStudent.points, selected: true }
    }).then(() => mutate())
    setVisible(false);
  };

  const style = {
    border: '1px solid var(--semi-color-border)',
    backgroundColor: 'var(--semi-color-bg-2)',
    borderRadius: '3px',
    paddingLeft: '20px',
  };

  const normalStyle = {
    color: 'var(--semi-color-text-0)',
    fontWeight: 500
  }
  const getGray = {
    color: "gray",
    fontWeight: 500,
  }

  const showWarning = (id) => {
    setDeleteStudentId(id)
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
    setDeleteStudentId()
    setWarning(false)
  }

  const changestate =() =>{
    setishand(true)
  }

  return (
    <div>
      <Text>分数最高：👑  分数最低：🤡  </Text>
      <Button onClick={changestate}>手动改分</Button>
      {ishand && (
        <Button onClick={handleSaveScores}>保存</Button>
      )}
      <List
        grid={{
          gutter: 20,
          span: 8,
        }}
        dataSource={students}
        renderItem={item => {
          const isCalled = calledStudents.includes(item.name)
          if (item.points === highestScore) {
            return (<List.Item style={style}>
              <div>
                <Text heading={3} delete={isCalled ? true : false} style={isCalled ? getGray : normalStyle}>👑{item.name}</Text>
                <Descriptions
                  align="center"
                  size="small"
                  row
                  data={[{
                    key: '分数', 
                    value: ishand ? (
                      <InputNumber 
                        min={0} 
                        max={100} 
                        value={item.points} 
                        onChange={(value) => handleScoreChange(item.id, value)}
                      />
                    ) : item.points
                  }]}
                />
                <Button icon={<IconDelete />} onClick={()=>showWarning(item.id)}>删除学生</Button>

              </div>
            </List.Item>)
          }
          if (item.points === lowestScore) {
            return (<List.Item style={style}>
              <div>
                <Text heading={3} delete={isCalled ? true : false} style={isCalled ? getGray : normalStyle}>🤡{item.name}</Text>
                <Descriptions
                  align="center"
                  size="small"
                  row
                  data={[{
                    key: '分数', 
                    value: ishand ? (
                      <InputNumber 
                        min={0} 
                        max={100} 
                        value={item.points} 
                        onChange={(value) => handleScoreChange(item.id, value)}
                      />
                    ) : item.points
                  }]}
                />
                <Button icon={<IconDelete />} onClick={() => showWarning(item.id)}>删除学生</Button>
               
              </div>
            </List.Item>)
          }
          else {
            return (<List.Item style={style}>
              <div>
                <Text heading={3} delete={isCalled ? true : false} style={isCalled ? getGray : normalStyle}>{item.name}</Text>
                <Descriptions
                  align="center"
                  size="small"
                  row
                  data={[{
                    key: '分数', 
                    value: ishand ? (
                      <InputNumber 
                        min={0} 
                        max={100} 
                        value={item.points} 
                        onChange={(value) => handleScoreChange(item.id, value)}
                      />
                    ) : item.points
                  }]}
                />
                <Button icon={<IconDelete />} onClick={()=>showWarning(item.id)}>删除学生</Button>
            
              </div>
            </List.Item>
            )
          }
        }
        }
      />
      <Modal
        title="警告"
        visible={warning}
        onOk={() => deletestudent(deleteStudentId)}
        onCancel={warningcancel}
      >
        {'确定删除？' + deleteStudentId}
      </Modal>
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