import { Button, Spin, List, Typography, Modal, Radio, Input, SideSheet, Table } from '@douyinfe/semi-ui';
import useSWR from 'swr';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

function Course() {
  const { Text } = Typography;
  const navigate = useNavigate();
  const params = useParams().courseId;
  const [sideSheetVisible, setSideSheetVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [attendance, setAttendance] = useState({});
  const { data: course, error, isLoading, mutate } = useSWR(`http://localhost:4000/Courses/${params}`, url => axios.get(url).then(res => res.data));
  const { data: attendances, mutate: mutateAttendances } = useSWR(`http://localhost:4000/Attendance`, url => axios.get(url).then(res => res.data));

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
    setSideSheetVisible(true);
  };

  const showAttendanceModal = () => {
    setModalVisible(true);
  };

  const columns = [
    {
      title: '日期',
      dataIndex: 'time',
    },
    {
      title: '详情',
      dataIndex: 'size',
      render: (text, record) => {
        return (
          record.detail.map(x => Object.entries(x).map(y => y))
        );
      },
    },
  ];

  const handleOk = async () => {
    const currentDate = new Date();
    const yourDate = currentDate.toLocaleDateString('zh-CN');
    const period = currentDate.getHours() >= 12 ? '下午' : '上午';
    const currentTime = `${yourDate}${period}`;
    const detail = course.student
      .filter(student => attendance[student.id]?.status && attendance[student.id]?.status !== '正常')
      .map(student => ({
        [student.name]: attendance[student.id]?.status
      }));

    if (attendances.time != currentTime) {
      await fetch('http://localhost:4000/Attendance', 
    {
      method: 'POST', // 请求方法
      headers: {
        'Content-Type': 'application/json', // 设置内容类型
      },
      body: JSON.stringify({
        time: currentTime,
        detail: detail
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      mutate();
    });
    await mutateAttendances(); 
    }else{
      await fetch(`http://localhost:4000/Attendance${attendances.id}`, 
    {
      method: 'PUT', // 请求方法
      headers: {
        'Content-Type': 'application/json', // 设置内容类型
      },
      body: JSON.stringify({
        time: currentTime,
        detail: detail
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      mutate();
    });
    await mutateAttendances(); 
    }
    

    

    setModalVisible(false);
    setSideSheetVisible(true);
    setAttendance([])
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
        <Table columns={columns} dataSource={attendances} pagination={false} />
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