import styles from './index.module.scss'
import { Button, Input} from '@douyinfe/semi-ui';
import { Title } from '@douyinfe/semi-ui/lib/es/skeleton/item';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Image } from '@douyinfe/semi-ui';
import http from '../http';

function App() {
  const [accountName, setAccountName] = useState()
  const [accountKey, setAccountKey] = useState()
  const [isLoginDisabled, setIsLoginDisabled] = useState(true);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate()
  const [data, setData] = useState('');
  
  useEffect(() => {
    http.post('/teacher', {
      user_name: '李真',
      password: '114514'
    })
      .then(res => {
        console.log(res.data.token)
        localStorage.setItem('token', res.data.token)
      })
  }, []);

  const test = () => {
    http.get('/teacher').then(res => setData(res.data));
  }

  function Login() {
    const state = Math.random();
    const check = new Promise((resolve, reject) => {
      if (state > 0.5) {
        resolve('登陆成功')
      } else {
        reject('登陆失败，重新输入密码吧')
      }
    })
    check
      .then(statevalue => {
        console.log(statevalue);
        navigate("/courses")
        setLoginError("");
      })
      .catch(statevalue => {
        console.log(statevalue);
        setLoginError(statevalue);
      })
  }

  useEffect(() => {
    setIsLoginDisabled(!accountName || !accountKey);
  }, [accountName, accountKey]);
  
  return  (
    <div className={styles.root}>
      <div className={styles.pic_contain}>
        <Image 
        
        src="logo.svg"
        className={styles.logo}
        />
      </div>
      <div className={styles.cont_contain}>
        <Title className={styles.title}>欢迎登录教师点名系统</Title>
        <Input className={styles.input_acc}
        autoFocus placeholder='请输入账户' size='large' value={accountName} onChange={(changeValue) => { setAccountName(changeValue); console.log(accountName) }}></Input>
        <Input className={styles.input_key} placeholder='请输入密码' size='large' value={accountKey} onChange={(changeValue) => { setAccountKey(changeValue); console.log(accountKey); }}></Input>
        {loginError && <Text className={styles.error} style={{color:'red'}}>{loginError}</Text>}
        <Button
          className={styles.button}
          onClick={Login} disabled={isLoginDisabled}
        >登陆</Button>
        <br></br>
        <Text className={styles.note}>如果还没有账号请点击这里注册</Text>
        <button onClick={test}>test</button>
        {console.log(data)}
      </div>
      </div>
    
  );
}

export default App;

