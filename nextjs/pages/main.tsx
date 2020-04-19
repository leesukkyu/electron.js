import React from 'react';

import { withSession } from 'next-session';

import axios from 'axios';

import { Modal, Button, List, Row, Col, DatePicker, TimePicker } from 'antd';

import { LeftOutlined, RightOutlined, PoweroffOutlined } from '@ant-design/icons';

import moment from 'moment';

import '../public/css/antd.less';

axios.defaults.baseURL = 'http://localhost:3000';

moment.locale('ko', {
  weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  weekdaysShort: ['일', '월', '화', '수', '목', '금', '토'],
});

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      memberList: props.data.memberList,
      viewDate: moment(),
      attendanceData: {
        date: '2020-04',
        memberAttendanceList: [
          {
            memberId: '5e9c76c5d9bfd75946787707',
            '2020-04-01': { start: '09:15', end: '21:05' },
            '2020-04-15': { start: '09:15', end: '21:05' },
          },
        ],
      },
    };
    console.log(props);
  }

  showModal = async () => {
    const rs = await axios.get('/api/member');
    this.state.memberList = rs.data.memberList;
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  onChange = (date, dateString) => {
    this.setState({
      viewDate: date,
    });
    console.log(date);
    console.log(date, dateString);
  };

  render() {
    const { memberList, viewDate, attendanceData, visible } = this.state;
    const { memberAttendanceList } = attendanceData;
    const daysList = [];

    for (var i = 1; i <= viewDate.daysInMonth(); i++) {
      viewDate.date(i);
      daysList.push({
        number: viewDate.format('DD'),
        dayStr: viewDate.format('dddd'),
        day: viewDate.day(),
        format: viewDate.format('YYYY-MM-DD'),
      });
    }

    return (
      <div className="main-page-wrap">
        <Row align="middle" style={{ padding: '8px' }}>
          <Col offset="10" span="4">
            <img src="/images/logo_horizontal.svg" />
          </Col>
          <Col offset="7" span="3">
            <Button type="primary" onClick={this.showModal}>
              구성원 관리
            </Button>
            <Modal title="구성원 관리" visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
              <List
                size="small"
                bordered
                dataSource={memberList}
                renderItem={(item) => (
                  <List.Item className="clearfix">
                    <Col>
                      {item.name}({item.position})
                    </Col>
                    <Col>
                      <Button type="link" danger>
                        관리 대상 제외
                      </Button>
                    </Col>
                  </List.Item>
                )}
              />
            </Modal>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row className="date-nav-box">
              <Button
                icon={<LeftOutlined />}
                onClick={() => {
                  const { viewDate } = this.state;
                  this.setState({
                    viewDate: viewDate.subtract(1, 'month').clone(),
                  });
                }}
              />
              <DatePicker
                onChange={this.onChange}
                format="YYYY-MM"
                value={viewDate}
                picker="month"
                style={{
                  marginLeft: '-1px',
                }}
              />
              <Button
                icon={<RightOutlined />}
                style={{
                  marginLeft: '-1px',
                }}
                onClick={() => {
                  const { viewDate } = this.state;
                  this.setState({
                    viewDate: viewDate.add(1, 'month').clone(),
                  });
                }}
              />
            </Row>
            {daysList.map((item) => {
              return (
                <Row key={item.number} className={`day-item day-${item.day}`} justify="center" align="middle">
                  <Col className="text-center" span="12">
                    {item.number}
                  </Col>
                  <Col className="text-center" span="12">
                    {item.dayStr}
                  </Col>
                </Row>
              );
            })}
          </Col>
          <Col>
            <Row>
              {memberAttendanceList.map((memberAttendance) => {
                return (
                  <Col className="member-attendance-box">
                    <Row className="header-item" align="middle">
                      <Col className="text-center" span="24">
                        {memberAttendance.memberId}
                      </Col>
                    </Row>
                    {daysList.map((item) => {
                      let times = memberAttendance[item.format];
                      if (times) {
                        let startMoment = moment();
                        let endMoment = moment();
                        if (times.start) {
                          startMoment.hour(times.start.split(':')[0]);
                          startMoment.minute(times.start.split(':')[1]);
                        }
                        if (times.end) {
                          endMoment.hour(times.end.split(':')[0]);
                          endMoment.minute(times.end.split(':')[1]);
                        }
                        return (
                          <Row key={item.number} className={`day-item day-${item.day}`} justify="center">
                            <Col className="time-box hour" span="12">
                              <TimePicker value={startMoment} format={'HH:mm'} size="small" placeholder="출근" />
                            </Col>
                            <Col className="time-box" span="12">
                              <TimePicker value={endMoment} format={'HH:mm'} size="small" placeholder="퇴근" />
                            </Col>
                          </Row>
                        );
                      } else {
                        return (
                          <Row key={item.number} className={`day-item day-${item.day}`} justify="center">
                            <Col className="time-box hour" span="12">
                              <TimePicker format={'HH:mm'} size="small" placeholder="출근" />
                            </Col>
                            <Col className="time-box" span="12">
                              <TimePicker format={'HH:mm'} size="small" placeholder="퇴근" />
                            </Col>
                          </Row>
                        );
                      }
                    })}
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

// TODO: 로그인 처리는 HOC에서
Main.getInitialProps = async ({ req, res }) => {
  let result = {
    data: [],
  };
  if (typeof window === 'undefined') {
    //
    if (!req.session.user) {
      if (res.writeHead) {
        res.writeHead(302, { Location: '/' });
        res.end();
      }
    } else {
      const rs = await axios.get('/api/member');
      debugger;
      result.data = rs.data;
    }
  }
  return result;
};

export default withSession(Main);
