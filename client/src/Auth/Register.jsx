import React from 'react';
import'../Auth.css'
import { Card, Flex, Form, Input, Typography, Button, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import registerImage from '../assets/register.png';
import useSignUp from '../hooks/useSignUp';
import { useEffect } from 'react';
const Register = () => {
  useEffect(() => {
    document.body.classList.add('auth-body');
    return () => {
        document.body.classList.remove('auth-body');
    };
  }, []);
  const { loading, error, registerUser } = useSignUp();
  const handleRegister = (values) => {
    registerUser(values);
  };

  return (
    <Card className='form-container'>
      <Flex gap="large" align='center'>
        {/* <RegisterForm /> */}
        <Flex vertical flex={1}>
          <div className=' flex mb-4'>
            <div className=" link-back">
              <Link to="/">← </Link>
            </div>
            <span className='mr-7 ml-7'></span>
            <h1 className='inline-block font-bold text-3xl'>Create an</h1>
            <span className='mr-2'></span>
            <h1 className='inline-block font-bold text-3xl color1'> Account</h1>
          </div>
          <Typography.Text type='secondary' strong className='slogan'>
            Let's own creativity effortlessly!
          </Typography.Text>
          <Form
            layout='vertical'
            onFinish={handleRegister}
            autoComplete='off'
          >
            <Form.Item
              label='Full Name'
              name='name'
              rules={[
                {
                  required: true,
                  message: 'Please input your full name'
                }
              ]}
            >
              <Input placeholder='Enter your full name' />
            </Form.Item>
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
            <Form.Item
              label='Confirm Password'
              name='passwordConfirm'
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password'
                }
              ]}
            >
              <Input.Password size='large' placeholder='Re-enter your password' />
            </Form.Item>

            {error && (
              <Alert
                description={error}
                type="error"
                showIcon
                className="alert"
              />
            )}
            <Form.Item>
              <Button
                type={`${loading ? '' : 'auth-btn'}`}
                htmlType='submit'
                size='large'
                className='text-white auth-btn'
              >
                {loading ? <Spin /> : 'Sign Up'}
              </Button>
            </Form.Item>
            <div className='text-center -mt-2'>
              <p>Already have an account? <Link to='/login' className='font-medium text-primary-600 hover:text-red-700'>Sign In</Link></p>
            </div>
          </Form>

        </Flex>
        {/* Image */}
        <Flex flex={1}>
          <img src={registerImage} className='auth-image' />
        </Flex>
      </Flex>
    </Card>
  );
};
export default Register;
