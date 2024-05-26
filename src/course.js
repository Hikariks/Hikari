import { Button, Spin, List, Typography, Modal, Radio, Input, SideSheet } from '@douyinfe/semi-ui';
import useSWR from 'swr';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

function Course() {
  const { Text } = Typography;
  const navigate = useNavigate();
  let { id } = useParams();
  const [sideSheetVisible, setSideSheetVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [attendance, setAttendance] = useState({});
  const [nonNormalStudents, setNonNormalStudents] = useState([]);
  const { data: course, error, isLoading, mutate } = useSWR(`http://localhost:4000/Courses/${id}`, url => axios.get(url).then(res => res.data));

  if (isLoading) {
    return <Spin></Spin>;
  }

  if (error) {
    return <div>目前没有这个课 回去吧孩子</div>;
  }

  const style = {
    border: '1px solid var(--semi-color-border)',
    backgroundColor: 'var(--semi-color-bg-2)',
    borderRadius: '3px',
    paddingLeft: '20px',
  };

  const showSheet = () => {
    const nonNormal = course.student.filter(student => student.status !== '正常');
    setNonNormalStudents(nonNormal);
    setSideSheetVisible(true);
  };

  const showAttendanceModal = () => {
    setModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const updatedStudents = course.student.map(student => ({
        ...student,
        status: attendance[student.id]?.status || student.status
      }));

      await axios.put(`http://localhost:4000/Courses/${id}`, {
        ...course,
        student: updatedStudents
      });

      mutate();
    } catch (error) {
      console.error('更新考勤状态失败', error);
    } finally {
      setModalVisible(false);
      setSideSheetVisible(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSheetCancel = () => {
    setSideSheetVisible(false);
  };

  const handleAttendanceChange = (studentId, value) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: value
      }
    }));
  };

  return (
    <div>
      <div>{course.name}</div>
      <List
        grid={{
          gutter: 20,
          span: 8,
        }}
        dataSource={course.student}
        renderItem={item => {
          return (
            <List.Item style={style}>
              <div>
                <Text heading={3}>{item.name}</Text>
              </div>
            </List.Item>
          );
        }}
      />
      <Button onClick={() => { navigate(`/callroll/${course.course_id}`) }}>上课</Button>
      <Button onClick={showSheet}>考勤</Button>
      <SideSheet title="考勤" visible={sideSheetVisible} onCancel={handleSheetCancel} closeOnEsc={true}>
        <Button onClick={showAttendanceModal}>添加考勤</Button>
        <br></br>
        <Text>{course.course_time}</Text>
        <div>
          {nonNormalStudents.map(student => (
            <div key={student.id}>
              <Text>{student.name}: {student.status}</Text>
            </div>
          ))}
        </div>
      </SideSheet>
      <Modal
        title="添加考勤"
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <List
          dataSource={course.student}
          renderItem={student => (
            <List.Item key={student.id}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Text style={{ width: '100px' }}>{student.name}</Text>
                <Radio.Group
                  value={attendance[student.id]?.status}
                  onChange={e => handleAttendanceChange(student.id, e.target.value)}
                  type='button'
                >
                  <Radio value="迟到">迟到</Radio>
                  <Radio value="请假">请假</Radio>
                  <Radio value="缺席">缺席</Radio>
                  <Radio value='正常'>正常</Radio>
                </Radio.Group>
                <Input
                  placeholder="备注"
                  style={{ marginLeft: '10px', width: '200px' }}
                />
              </div>
            </List.Item>
          )}
        />
      </Modal>
      <Button>统计</Button>
    </div>
  );
}

export default Course;
