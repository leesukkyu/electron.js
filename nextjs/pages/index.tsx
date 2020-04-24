import { Form, Input, Button, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { withSession } from 'next-session';
import Router from 'next/router';
import axios from 'axios';

import '../public/css/antd.less';
import { useState, useRef } from 'react';

const Index = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);

  const onClickSubmit = () => {
    setIsLoading(true);
    const username = formRef.current.getFieldValue('username');
    const password = formRef.current.getFieldValue('password');
    axios
      .post('/api/login', {
        username: username,
        password: password,
      })
      .then((rs) => {
        console.log(rs);
        if (!rs.data.isErr) {
          window.location.href = '/main';
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="index-page-wrap">
      <Row className="full-height" justify="center" align="middle">
        <Col span={12}>
          <Row>
            <Col key="1" span={10}>
              <img style={{ width: '100%' }} src="/images/logo_horizontal.png" />
            </Col>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Form
              key="2"
              name="normal_login"
              className="login-form"
              initialValues={{ username: '', password: '' }}
              ref={formRef}
              style={{
                width: '100%',
              }}
            >
              <Form.Item name="username" rules={[{ required: true, message: '아이디를 입력하세요' }]}>
                <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Id" />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: '비밀번호를 입력하세요' }]}>
                <Input
                  size="large"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item className="text-right">
                <Button
                  type="primary"
                  htmlType="button"
                  block
                  size="large"
                  className="login-form-button"
                  loading={isLoading}
                  onClick={onClickSubmit}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

Index.getInitialProps = ({ req, res }) => {
  let views;
  if (typeof window === 'undefined') {
    if (req.session.user) {
      if (res.writeHead) {
        res.writeHead(302, { Location: '/main' });
        res.end();
      }
    }
  }
  return { views };
};

export default withSession(Index);
