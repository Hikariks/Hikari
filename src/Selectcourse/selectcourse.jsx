import styles from './selectcourse.module.scss'
import { Input, List, Button, Modal, Typography, Spin, Descriptions, Image } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import useSWR from 'swr'
import { IconDelete } from '@douyinfe/semi-icons';
import http from '../http';


function App() {
  const { Title } = Typography
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [coursename, setCoursename] = useState()
  const { data: courses, error, isLoading, mutate } = useSWR(`/courses`, url => http.get(url).then(res => res.data))
  if (isLoading) {
    return <Spin></Spin>
  }

  if (error) {
    return <div>{error.message}</div>
  }
  const showDialog = () => {
    setVisible(true)
  }
  const handleOk = () => {
    http.post('/addcourse', { name: coursename })
    .then(response => {
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      mutate();
      setVisible(false);
      setCoursename('');
    })
    .catch(error => {
      console.error('Error adding course:', error);
    });
  }


  const deletecourse = (id) => {
    http.delete(`/deletecourse/${id}`)
    .then(response => {
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      mutate();
    })
    .catch(error => {
      console.error('Error adding course:', error);
    });
  };

  const handleCancle = () => {
    setCoursename()
    setVisible(false)
  }

  const style = {
    border: '1px solid var(--semi-color-border)',
    backgroundColor: 'var(--semi-color-bg-2)',
    borderRadius: '3px',
    paddingLeft: '20px',
  };
  return (
    <div className={styles.root}>
      <Title>选择课程</Title>
      <div className={styles.addcontain}>
        <Button onClick={showDialog} className={styles.addcourse}>新建课程</Button>
      </div>
      <Modal
        title="新建课程"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancle}
        closeOnEsc={true}
        okText={'好的，加上'}
        cancelText={'不加了'}
      >
        <Input autoFocus placeholder="输入新建课程名字" size='large' value={coursename} onChange={(changeValue) => { setCoursename(changeValue) }}></Input>
      </Modal>
      <List
        grid={{
          gutter: 12,
          xs: 0,
          sm: 0,
          md: 12,
          lg: 8,
          xl: 8,
          xxl: 6,
        }}
        dataSource={courses}
        renderItem={item => {
          function go() {
            navigate(`/course/${item.id}`)
          }
          return (<List.Item style={style}>
            <div>
              <Button onClick={go}>{item.id}</Button>
              <Descriptions
                align="center"
                size="small"
                row
                data={[{ key: '课程名称', value: item.name }]}
              />
              <Button
                icon={<IconDelete />}
                onClick={() => deletecourse(item.id)}></Button>
            </div>
          </List.Item>)
        }}
      />
      <Image
        className={styles.logo}
        width={474}
        height={400}
        src="msabgpic.png"
      />
    </div>
  )
}
export default App