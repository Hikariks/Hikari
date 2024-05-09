import {useState} from 'react';
import styles from './CallrollTabs.module.scss';
import { List, Button,Typography,Spin,Descriptions,InputNumber,Space,Card} from '@douyinfe/semi-ui';
import {IconUserGroup} from '@douyinfe/semi-icons'
import axios from 'axios';
import useSWR from 'swr'
export const CallrollGroup =() => {
  const { data:students, error, isLoading} = useSWR('http://localhost:4000/students', url => axios.get(url).then(res => res.data))
  const{Text} = Typography
  const{Title} = Typography
  const [groups,setGroups] = useState([])
  const [groupSize, setGroupSize] = useState(2)
  if(isLoading){
    return <Spin></Spin>
}
  const style = {
    border: '1px solid var(--semi-color-border)',
    backgroundColor: 'var(--semi-color-bg-2)',
    borderRadius: '3px',
    paddingLeft: '20px',
  };
  const group = () => {
    const students_t = getShuffledArr(students);
    const totalPeople = students_t.length;
    let groupCount = Math.floor(totalPeople / groupSize);
    let remainder = totalPeople % groupSize;
  
    if (remainder === 1) {
      remainder++;
      groupCount--;
    }
    const groups = [];
  
    let startIndex = 0;
    for (let i = 0; i < groupCount; i++) {
      const group = students_t.slice(startIndex, startIndex + groupSize);
      groups.push(group);
      startIndex += groupSize;
    }
  
    if (remainder > 0) {
      const lastGroup = students_t.slice(startIndex);
      groups.push(lastGroup);
    }
    setGroups(groups);
  };

  const getShuffledArr = arr => {
    const newArr = arr.slice();
    for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
    }
    return newArr;
  };

if(error){
    return <div>{error.message}</div>
}

  return(
    <div className={styles.root}>
      <div className={styles.listblock}>
        <List
            
            grid={{
                gutter: 20,
                span: 8,
            }}
            dataSource={students}
            renderItem={item => {              
                    return(<List.Item style={style}>
                    <div>
                    <Text heading={3}>{item.name}</Text>
                    <Descriptions
                        align="center"
                        size="small"
                        row
                    />
                    </div>
                </List.Item>)}
            }
            />
      </div>
      <div className={styles.rest}>
        <Title strong heading={1} className={styles.people}>每组分成<InputNumber min={2} max={6} defaultValue={2} value={groupSize} onChange={(changeValue) => { setGroupSize(changeValue)}}/>人</Title>
          <Button
          className={styles.button}
          icon={<IconUserGroup />}
          block onClick={() => {
              group()
          }}>开始分组</Button>
        <Title strong>分组结果</Title>
          <Space className={styles.totalresult}>
              {groups.map(group => (<Space className={styles.result} vertical>{group.map(student => (<div className={styles.luckyboy}><Card bordered={true}>{student.name}</Card></div>))}</Space>))}
          </Space>
      </div>
    </div>
  )
}