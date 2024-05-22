import {Button, Spin} from '@douyinfe/semi-ui';
import useSWR from 'swr'
import axios from 'axios';
import { useNavigate} from "react-router-dom";
import { useParams } from 'react-router-dom';


function Course(){
  
  let { id } = useParams();
  const { data:course, error, isLoading,mutate } = useSWR(`http://localhost:4000/Courses/${id}`, url => axios.get(url).then(res => res.data))
  if(isLoading){
    return <Spin></Spin>
}

if(error){
    return <div>目前没有这个课 回去吧孩子</div>
}

  return(
    <div>
      <div>{course.name}</div>
    </div>
  )
}

export default Course