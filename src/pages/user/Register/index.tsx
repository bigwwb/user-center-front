import Footer from '@/components/Footer';
import {register} from '@/services/ant-design-pro/api';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  // @ts-ignore
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import { history } from 'umi';
import styles from './index.less';
import {SYSTEM_LOGO} from "@/constant";

const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');
  //表单提交
  const handleSubmit = async (values: API.RegisterParams) => {
    try {
      // @ts-ignore
      const { userPassword, checkPassword } = values
      //简单校验
      if (userPassword !== checkPassword){
        const defaultLoginFailureMessage = '两次密码输入不一致，请重新输入';
        message.error(defaultLoginFailureMessage);
        return;
      }
      //注册
      const userId = await register(values);

      if (userId > 0){
        const defaultLoginFailureMessage = '注册成功';
        message.success(defaultLoginFailureMessage);

        /** 此方法会跳转到 redirect 参数所在的位置 */
        if(!history) return;
        const { query } = history.location;
        const { redirect } = query as {
          redirect: string;
        };

        history.push("/user/login?redirect=" + redirect);
        return;
      }
      throw new Error(`redirect is fail, Id is ${userId}`)
    }catch (error){
      const defaultLoginFailureMessage = '注册失败，请重试';
      message.error(defaultLoginFailureMessage);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          submitter={{
            searchConfig: {
              submitText: '注册'
            }
          }
          }
          logo={<img alt="logo" src={SYSTEM_LOGO} />}
          title="快乐星球"
          subTitle={'什么是快乐星球，什么是快乐星球！'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values: API.RegisterParams) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab={'账号密码注冊'} />
          </Tabs>
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder="请输入账号"
                rules={[
                  {
                    required: true,
                    message: '账号是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder="请输入密码"
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    message: '密码不少于8个字符',
                  }
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder="请再次输入密码"
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    message: '密码不少于8个字符',
                  }
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Register;
