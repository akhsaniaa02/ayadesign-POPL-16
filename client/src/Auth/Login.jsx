import React from 'react'
import'../Auth.css'
import { Card, Flex, Form, Input, Typography, Button, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import loginImage from '../assets/login.png';
import useLogin from '../hooks/useLogin';
import { useEffect } from 'react';



const Login = () => {
  useEffect(() => {
    document.body.classList.add('auth-body');
    return () => {
        document.body.classList.remove('auth-body');
    };
  }, []);
  const { loading, error, loginUser } = useLogin();
  const handleLogin = async (values) => {
    await loginUser(values);
  };
  return (
    <Card className='form-container'>
      <Flex gap="large" align='center'>
        {/* Image */}
        <Flex flex={1}>
          <div className="mt-4 text-center">
            <Link to="/" className="link-back">← </Link>
          </div>
          <img src={loginImage} className='auth-image' />
        </Flex>

        {/* <LoginForm /> */}
        <Flex vertical flex={1}>
          <div className='justify-center flex text-center text-3xl mb-4'>
            <h1 className='inline-block font-bold color1'>Sign</h1>
            <span className='mr-2'></span>
            <h1 className='inline-block font-bold '> In</h1>
          </div>
          <Typography.Text type='secondary' strong className='slogan'>
            Unlock your world
          </Typography.Text>
          <Form
            layout='vertical'
            onFinish={handleLogin}
            autoComplete='off'
          >
            <Form.Item
              label='Email'
              name='email'
              rules={[
                {
                  required: true,
                  message: 'Please input your email'
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email'
                }
              ]}
            >
              <Input placeholder='Enter your email' />
            </Form.Item>
            <Form.Item
              label='Password'
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Please input your password'
                }
              ]}
            >
              <Input.Password size='large' placeholder='Enter your password' />
            </Form.Item>


            {error && (
              <Alert
                description={error}
                type="error"
                showIcon
                closable
                className="alert"
              />
            )}
            <Form.Item>
              <Button
                type={`${loading ? '' : 'auth-btn'}`}
                htmlType='submit'
                size='large'
                className='auth-btn text-white'
              >
                {loading ? <Spin /> : 'Sign In'}
              </Button>
            </Form.Item>
            <div className='text-center -mt-2'>
              <p>Don't have an account? <Link to='/register' className='font-medium text-primary-600 hover:text-red-700'>Sign Up</Link></p>
            </div>

          </Form>

        </Flex>
      </Flex>
    </Card>
  );
}

export default Login