import { Input,List, Button, Modal,Typography,Spin,Descriptions} from '@douyinfe/semi-ui';
import { useState } from 'react';
import {useNavigate} from "react-router-dom";
import useSWR from 'swr'
import axios from 'axios'
import {IconDelete} from '@douyinfe/semi-icons';

function App(){
  const{Title} = Typography
  const navigate = useNavigate()
  const [visible,setVisible] = useState(false)
  const [coursename, setCoursename] = useState()
  const [courseid,setCourseid] = useState()
  const { data:courses, error, isLoading,mutate} = useSWR(`http://localhost:4000/Courses`, url => axios.get(url).then(res => res.data))
  if(isLoading){
    return <Spin></Spin>
}

if(error){
    return <div>{error.message}</div>
}
  const showDialog =() =>{
    setVisible(true)
  }
  const handleOk =() =>{
    fetch('http://localhost:4000/Courses', {
            method: 'POST', // 请求方法
            headers: {
                'Content-Type': 'application/json', // 设置内容类型
            },
            body: JSON.stringify({
              name: coursename,
              course_id: courseid
            }),
        
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                mutate()
            })

    setVisible(false)
    setCourseid()
    setCoursename()
  }
  
  const deletecourse = (id) => {
    fetch(`http://localhost:4000/Courses/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        mutate();
      });
  };

  const handleCancle =() =>{
    setCoursename()
    setCourseid()
    setVisible(false)
  }
  const style = {
    border: '1px solid var(--semi-color-border)',
    backgroundColor: 'var(--semi-color-bg-2)',
    borderRadius: '3px',
    paddingLeft: '20px',
  };
  return(
    <div>
      <Title>选择课程</Title>
      <Button onClick={showDialog}>新建课程</Button>
      <Modal
        title="新建课程"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancle}
        closeOnEsc={true}
        okText={'好的，加上'}
        cancelText={'不加了'}    
    >
    <Input autoFocus placeholder="输入新建课程名字" size='large' value={coursename} onChange={(changeValue) => { setCoursename(changeValue)}}></Input>
    <Input placeholder="输入新建课程编号" size='large' value={courseid} onChange={(changeValue) => { setCourseid(changeValue)}}></Input>
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
          function go(){
            // navigate(`/callroll/${item.course_id}`)
            navigate(`/course/${item.id}`)
          }           
          return(<List.Item style={style}>
          <div>
              <Button onClick={go}>{item.course_id}</Button>
              <Descriptions
                  align="center"
                  size="small"
                  row
                  data={[{ key: '课程名称', value:item.name }]}
              />
              <Button
              icon={<IconDelete/>}
              onClick={() => deletecourse(item.id)}></Button>
          </div>
      </List.Item>)}}
                  />
    </div>
  )
}
export default App