import {Button,Spin,List,Typography} from '@douyinfe/semi-ui';
import useSWR from 'swr'
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {useParams} from 'react-router-dom'


function Course(){
  const {Text} = Typography
  const navigate = useNavigate()
  let { id } = useParams();
  
  const { data:course, error, isLoading } = useSWR(`http://localhost:4000/Courses/${id}`, url => axios.get(url).then(res => res.data))
  if(isLoading){
    return <Spin></Spin>
  }

  if(error){
      return <div>目前没有这个课 回去吧孩子</div>
  }

  const style = {
    border: '1px solid var(--semi-color-border)',
    backgroundColor: 'var(--semi-color-bg-2)',
    borderRadius: '3px',
    paddingLeft: '20px',
  };
  
  
  
  return(
    <div>
      <div>{course.name}</div>
      <List 
            grid={{
                gutter: 20,
                span: 8,
            }}
            dataSource={course.student}
            renderItem={item => {              
                    return(<List.Item style={style}>
                    <div>
                    <Text heading={3}>{item.name}</Text>
                    </div>
                </List.Item>)}
            }
            />
      <Button onClick={()=>{navigate(`/callroll/${course.course_id}`)}}>上课</Button>
      <Button>考勤</Button>
      <Button>统计</Button>
    </div>
  )
}


export default Course