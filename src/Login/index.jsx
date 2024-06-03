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


  function isSucceed() {
    new Promise(() => {
      http
        .post('/teacher', {
          user_name: accountName,
          password: accountKey,
        })
        .then(res => {
          if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            console.log(res.data.token);
            navigate('/courses');
            setLoginError("")
          }else{
            setLoginError("密码或账号错误")
          }
        })
        .catch(statevalue => {
          setLoginError(statevalue);
     });
})}

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
        autoFocus placeholder='请输入账户' size='large' value={accountName} onChange={(changeValue) => { setAccountName(changeValue)}}></Input>
        <Input className={styles.input_key} placeholder='请输入密码' size='large' value={accountKey} onChange={(changeValue) => { setAccountKey(changeValue) }}></Input>
        {loginError && <Text className={styles.error} style={{color:'red'}}>{loginError}</Text>}
        <Button
          className={styles.button}
          onClick={isSucceed} disabled={isLoginDisabled}
        >登陆</Button>
        <br></br>
        <Text className={styles.note}>如果还没有账号请点击这里注册</Text>
      </div>
      </div>
    
  );
}

export default App;

