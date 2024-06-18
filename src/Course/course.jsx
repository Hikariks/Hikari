import { Button, Spin, List, Typography, Modal, Radio, Input, SideSheet, Table, Image } from '@douyinfe/semi-ui';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { IconArrowLeft, IconDelete } from '@douyinfe/semi-icons';
import http from '../http';
import styles from './course.module.scss'

function Course() {
  const { Text } = Typography;
  const { Title } = Typography
  const navigate = useNavigate();
  const params = useParams().courseId;
  const [sideSheetVisible, setSideSheetVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [attendance, setAttendance] = useState({});
  const [scoreVisible, setScoreVisible] = useState(false);
  const [addmodal, setaddmodal] = useState(false)
  const [newName, setnewname] = useState()

  const { data: course, error, isLoading } = useSWR(`http://localhost:4000/Courses/${params}`, url => axios.get(url).then(res => res.data));
  const { data: attendances, mutate: mutateAttendances } = useSWR(`http://localhost:4000/Attendance`, url => axios.get(url).then(res => res.data));
  const { data: scores } = useSWR(`http://localhost:4000/Score`, url => axios.get(url).then(res => res.data));
  const { data: students, mutate: mutateStudents} = useSWR(`/getstudents/${params}/students`, url =>http.get(url).then(res => res.data));
  console.log(params);

  const transformedScores = useMemo(() => {
    if (!scores) return { dates: [], transformedData: [] };
    const dates = [...new Set(scores.map(score => score.time))];
    const studentMap = {};
    scores.forEach(score => {
      score.detail.forEach(detail => {
        if (!studentMap[detail.name]) {
          studentMap[detail.name] = { name: detail.name, id: detail.id };
        }
        studentMap[detail.name][score.time] = detail.points;
      });
    });
    const transformedData = Object.values(studentMap).map(student => {
      const scoreChange = dates.length >= 2 ? (student[dates[1]] || 0) - (student[dates[0]] || 0) : 0;
      return { ...student, scoreChange };
    });

    return { dates, transformedData };
  }, [scores]);

  const back = () => {
    navigate(`/courses`)
  }

  const scoreColumns = useMemo(() => {
    if (!transformedScores.dates.length) return [];

    const dateColumns = transformedScores.dates.map(date => ({
      title: date,
      dataIndex: date,
      width: 100,
    }));

    return [
      {
        title: '学生',
        dataIndex: 'name',
        fixed: 'left',
        width: 75,
      },
      ...dateColumns,
      {
        title: '分数变化',
        dataIndex: 'scoreChange',
        fixed: 'right',
        width: 60,
        render: (text, record) => (
          <Text style={{ color: record.scoreChange >= 0 ? 'green' : 'red' }}>
            {record.scoreChange >= 0 ? `+${record.scoreChange}` : record.scoreChange}
          </Text>
        ),
      },
    ];
  }, [transformedScores.dates]);

  if (isLoading) {
    return <Spin />;
  }

  if (error) {
    return <div>目前没有这个课 回去吧孩子</div>;
  }
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
      dataIndex: 'detail',
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
    const existingAttendance = attendances.find(att => att.time === currentTime);
    const detail = course.student
      .filter(student => attendance[student.id]?.status && attendance[student.id]?.status !== '正常')
      .map(student => ({
        [student.name]: attendance[student.id]?.status
      })); 
    if (existingAttendance) {
      await fetch(`http://localhost:4000/Attendance/${existingAttendance.id}`,
        {
          method: 'PATCH', // 请求方法
          headers: {
            'Content-Type': 'application/json', // 设置内容类型
          },
          body: JSON.stringify({
            detail: detail
          }),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          mutate();
        });
    } else {
      await fetch(`http://localhost:4000/Attendance`,
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
        })
    }
    await mutateAttendances();
    setModalVisible(false);
    setSideSheetVisible(true);
  }

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

  const handleScoreCancel = () => {
    setScoreVisible(false);
  };

  const addstudent =() =>{
    http.post(`/addstudents/${params}/students`, { name: newName })
    .then(response => {
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      mutateStudents();
    })
    .catch(error => {
      console.error('Error adding course:', error);
    });
    setaddmodal(false)
    setnewname()
  }
  const canceladd =() => {
    setaddmodal(false)
    setnewname()
  }

  const deletestudent =(id) => {
    http.delete(`/deletestudents/${params}/students/${id}`)
    .then(response => {
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      mutateStudents();
    })
    .catch(error => {
      console.error('Error adding course:', error);
    });
  }
  return (
    <div className={styles.root}>
      <Button
        icon={<IconArrowLeft />}
        onClick={back}
      ></Button> 
      <Title heading={1}>{course.name}</Title>
      <Title heading={3} className={styles.intro}>学生列表</Title>
      <Button onClick={() => setaddmodal(true)}>添加学生</Button>
      <Modal
        title="添加学生"
        visible={addmodal}
        onOk={addstudent}
        onCancel={canceladd}
      >
      <Input placeholder="输入学生名字"value={newName}onChange={(changeValue) => {setnewname(changeValue)}} ></Input>
      </Modal>
      <List
        grid={{
          gutter: 20,
          span: 8,
        }}
        dataSource={students}
        renderItem={item => {
          return (
            <List.Item className={styles.studentlist}>
              <div>
                <Text heading={3}>{item.name}</Text>
                <Button
                icon={<IconDelete />}
                onClick={() => deletestudent(item.id)}
                ></Button>
              </div>
            </List.Item>
          );
        }}
      />
      <SideSheet title="考勤" visible={sideSheetVisible} onCancel={handleSheetCancel} closeOnEsc={true}>
        <Button onClick={showAttendanceModal}>添加考勤</Button>
        <Text link={{ href: 'https://passport.seiue.com/' }}>打开希悦</Text>
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
          className={styles.list}
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
      <SideSheet title="统计" visible={scoreVisible} onCancel={handleScoreCancel} closeOnEsc={true}>
        <Table columns={scoreColumns} dataSource={transformedScores.transformedData} pagination={false} scroll={{ x: '100%' }} />
      </SideSheet>
      <div className={styles.cardlist}>
        <div className={styles.cardclass}>
          <Image className={styles.logoclass}
            width={144}
            height={144}
            src="/class.png"
            preview={false}
          />
          <div className={styles.containerclass}>
            <Title className={styles.textclass}>上课</Title>
            <Button className={styles.buttonclass} onClick={() => { navigate(`/callroll/${course.id}`) }}>进入点名</Button>
          </div>
        </div>
        <div className={styles.cardattendance}>
          <Image className={styles.logoattendance}
            width={144}
            height={144}
            src="/attendance.png"
            preview={false}
          />
          <div className={styles.containerattendance}>
            <Title className={styles.textattendance}>考勤</Title>
            <Button className={styles.buttonattendance} onClick={showSheet}>查看考勤</Button>
          </div>
        </div>
        <div className={styles.cardstatic}>
          <Image className={styles.logostatic}
            width={144}
            height={144}
            src="/static.png"
            preview={false}
          />
          <div className={styles.containerstatic}>
            <Title className={styles.textstatic}>统计</Title>
            <Button className={styles.buttonstatic} onClick={() => setScoreVisible(true)}>查看统计</Button>
          </div>
        </div>
      </div>
      <Image
        className={styles.logo}
        width={474}
        height={380}
        src="/msabgpic.png"
        preview={false}
      />
    </div>
  );
}

export default Course;
