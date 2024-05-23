import {useState,useEffect} from 'react';
import axios from 'axios';
import {Avatar,Spin, Tabs, TabPane, Button} from '@douyinfe/semi-ui';
import useSWR from 'swr'
import { updateStudent } from './updateStudent';
import { CallrollTab } from './CallrollTab';
import { CallrollGroup } from './CallrollTabs';
import {IconArrowLeft} from '@douyinfe/semi-icons';
import { useNavigate, useParams } from "react-router-dom";

function App() {
    const [calledStudents, setCalledStudents] = useState([]);
    const params = useParams().courseId
    const { data:students, error, isLoading, mutate } = useSWR(`http://localhost:4000/${params}`, url => axios.get(url).then(res => res.data))
    const navigate = useNavigate()
    
    useEffect(() => {
        if (students && students.length === calledStudents.length) {
            setCalledStudents([]);
        }
    }, [calledStudents, students]);
    
    function back(){
        navigate("/courses")
    }
    
    useEffect(()=>{
        if(students){
            const uncalledStudents = students.filter(dataItem => !dataItem.selected);
            if (uncalledStudents.length === 0){
                const updatePromises = students.map(student =>
                    updateStudent({
                      id: student.id,
                      data: { selected: false },
                    }),
                  );
                  Promise.all(updatePromises).then(()=>{
                    mutate()
                  })
            }
        }
    },[students,mutate])

    if(isLoading){
        return <Spin></Spin>
    }

    if(error){
        return <div>目前没有这个课 回去吧孩子</div>
    }

    return (
        <div>
            <Button
            icon={<IconArrowLeft />}
            onClick={back}
            ></Button>
            <Avatar
            alt="logo"
            src="//s.moonshotacademy.cn/public/8/b/4de522-1fb5e2-2f1652.600.png"
            style={{ margin: 4 }}
        />
            <Tabs>
                <TabPane tab="单个点名" itemKey="1">
                <CallrollTab></CallrollTab>
                </TabPane> 
                <TabPane tab='分组点名'>
                <CallrollGroup></CallrollGroup>
                </TabPane>
            </Tabs>
        </div>
    );
}

export default App;
