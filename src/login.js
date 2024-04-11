import { Button, Input } from '@douyinfe/semi-ui';
import { Title } from '@douyinfe/semi-ui/lib/es/skeleton/item';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
function App() {
  const [accountName, setAccountName] = useState()
  const [accountKey, setAccountKey] = useState()
  const [isLoginDisabled, setIsLoginDisabled] = useState(true);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate()
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
        navigate("./callroll")
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
  return (
    <>
      <Title>欢迎登录教师点名系统</Title>
      <Input autoFocus placeholder='请输入账户' size='large' value={accountName} onChange={(changeValue) => { setAccountName(changeValue); console.log(accountName) }}></Input>
      <Input placeholder='请输入密码' size='large' value={accountKey} onChange={(changeValue) => { setAccountKey(changeValue); console.log(accountKey); }}></Input>
      {loginError && <Text style={{color: 'red'}}>{loginError}</Text>}
      <Button
        onClick={Login} disabled={isLoginDisabled}
      >登陆</Button>
      <br></br>
      <Text>如果还没有账号请点击这里注册</Text>
    </>
  );
}

export default App;

 
