import React, { createRef } from 'react';

import { withSession } from 'next-session';

import axios from 'axios';

import { Modal, Button, List, Row, Col, DatePicker, TimePicker, Input } from 'antd';

const { confirm } = Modal;
const { Search } = Input;

import { LeftOutlined, RightOutlined, SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import Router from 'next/router';

import moment from 'moment';

import '../public/css/antd.less';

axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : '';

moment.locale('ko', {
  weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  weekdaysShort: ['일', '월', '화', '수', '목', '금', '토'],
});

interface MainProps {
  user: any;
}
interface MainState {
  visible: boolean;
  isLoading: boolean;
  memberList: any;
  viewMemberList: any;
  viewDate: any;
  attendanceData: any;
}

class Main extends React.Component<MainProps, MainState> {
  newMemberNameInput;
  newMemberPositionInput;
  static getInitialProps: ({ req, res }: { req: any; res: any }) => Promise<{ user: any[] }>;

  constructor(props: Readonly<MainProps>) {
    super(props);
    this.state = {
      visible: false,
      isLoading: false,
      memberList: [],
      viewMemberList: [],
      viewDate: moment(),
      attendanceData: {
        date: moment().format('YYYY-MM'),
        memberAttendanceList: [],
      },
    };
    this.newMemberNameInput = createRef();
    this.newMemberPositionInput = createRef();
  }

  componentDidMount() {
    if (!this.props.user) {
      Router.push('/');
    } else {
      this.fetchInitialData();
    }
  }

  fetchInitialData = async () => {
    this.setState({
      isLoading: true,
    });
    const rs = await axios.get('/api/member');
    const memberList = rs.data.memberList;
    this.setState(
      {
        isLoading: true,
        memberList,
      },
      () => {
        this.fetchAttendanceData();
      },
    );
  };

  fetchAttendanceData = () => {
    const { viewDate } = this.state;
    axios
      .get('/api/attendance', {
        params: {
          date: viewDate.format('YYYY-MM'),
        },
      })
      .then(({ data }) => {
        data.attendanceData.memberAttendanceList = data.attendanceData.memberAttendanceList
          ? data.attendanceData.memberAttendanceList
          : [];
        this.setState({
          attendanceData: data.attendanceData,
          isLoading: false,
        });
      });
  };

  openModal = async () => {
    const rs = await axios.get('/api/member');
    this.setState({
      memberList: rs.data.memberList,
      visible: true,
    });
  };

  modalHandleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  modalHandleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  onChangeDatePicker = (date) => {
    this.setState(
      {
        viewDate: date,
        isLoading: true,
      },
      () => {
        this.fetchAttendanceData();
      },
    );
  };

  onChangeTimePicker = (time, memberAttendance, date, type) => {
    const { attendanceData, viewDate } = this.state;
    const { memberAttendanceList } = attendanceData;
    let targetMemberAttendance;
    for (var i in memberAttendanceList) {
      if (memberAttendanceList[i].memberId === memberAttendance._id) {
        targetMemberAttendance = memberAttendanceList[i];
      }
    }
    if (!targetMemberAttendance) {
      targetMemberAttendance = {
        memberId: memberAttendance._id,
      };
      memberAttendanceList.push(targetMemberAttendance);
    }
    targetMemberAttendance[date.format] = targetMemberAttendance[date.format]
      ? targetMemberAttendance[date.format]
      : {};
    targetMemberAttendance[date.format][type] = time;
    this.saveData(viewDate.format('YYYY-MM'), memberAttendanceList);
  };

  saveData = (date, memberAttendanceList) => {
    this.setState({
      isLoading: true,
    });
    axios
      .post('/api/attendance', {
        date: date,
        memberAttendanceList: memberAttendanceList,
      })
      .then((rs) => {
        this.setState({
          isLoading: false,
        });
      });
  };

  addMember = () => {
    const name = this.newMemberNameInput.current.input.value;
    const position = this.newMemberPositionInput.current.input.value;

    if (name && position) {
      axios
        .post('/api/member', {
          name,
          position,
        })
        .then((rs) => {
          console.log(rs);
          if (!rs.data.isErr) {
            this.state.memberList.push(rs.data.member);
            this.forceUpdate();
          }
          this.newMemberNameInput.current.input.value = '';
          this.newMemberPositionInput.current.input.value = '';
          this.newMemberNameInput.current.state.value = '';
          this.newMemberPositionInput.current.state.value = '';
        });
    }
  };

  showDeleteConfirm = (id) => {
    let _this = this;
    confirm({
      title: '정말 삭제하시겠습니까?',
      icon: <ExclamationCircleOutlined />,
      content: '복구될 수 없습니다.',
      okText: '확인',
      okType: 'danger',
      cancelText: '취소',
      onOk() {
        axios
          .delete('/api/member', {
            params: {
              id,
            },
          })
          .then(() => {
            const { memberList } = _this.state;
            for (var i in memberList) {
              if (memberList[i]['_id'] === id) {
                memberList.splice(i, 1);
                _this.forceUpdate();
                break;
              }
            }
          });
      },
    });
  };

  render() {
    if (!this.props.user) {
      return false;
    }
    const { username } = this.props.user;
    const isAdmin = username === 'admin' ? true : false;
    const { memberList, viewDate, visible, attendanceData } = this.state;
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

    const viewMemberList = memberList.slice();
    const { memberAttendanceList } = attendanceData;
    viewMemberList.map((member) => {
      let index = 0;
      const exist = memberAttendanceList.some((memberAttendance) => {
        index++;
        return memberAttendance.memberId === member._id;
      });
      console.log(exist);
      if (exist) {
        index--;
        member.attendance = memberAttendanceList[index];
      } else {
        member.attendance = {
          memberId: member._id,
        };
      }
    });

    return (
      <div className="main-page-wrap">
        <Row align="middle" style={{ padding: '16px 8px' }}>
          <Col className="" span="11">
            <img src="/images/logo_horizontal.png" style={{ height: '40px', verticalAlign: 'middle' }} />
            <SyncOutlined
              style={{ fontSize: '25px', marginLeft: '15px', verticalAlign: 'middle' }}
              spin={this.state.isLoading}
            />
          </Col>
          <Col className="text-right" offset="4" span="9">
            {isAdmin ? (
              <>
                <Button style={{ marginRight: '5px' }} type="primary" onClick={this.openModal}>
                  구성원 관리
                </Button>
                <Modal
                  title="구성원 관리"
                  visible={visible}
                  onOk={this.modalHandleOk}
                  onCancel={this.modalHandleCancel}
                  okText="확인"
                  cancelText="닫기"
                >
                  <List
                    size="small"
                    bordered
                    dataSource={memberList}
                    renderItem={({ name, position, _id }) => (
                      <List.Item key={_id} className="clearfix">
                        <Col>
                          {name}({position})
                        </Col>
                        <Col>
                          <Button
                            type="link"
                            danger
                            onClick={() => {
                              this.showDeleteConfirm(_id);
                            }}
                          >
                            관리 대상 제외
                          </Button>
                        </Col>
                      </List.Item>
                    )}
                  />
                  <Row style={{ padding: '5px 0' }}>
                    <Col span="10" style={{ paddingRight: '5px' }}>
                      <Input placeholder="구성원 이름" ref={this.newMemberNameInput}></Input>
                    </Col>
                    <Col span="10" style={{ paddingRight: '5px' }}>
                      <Input placeholder="구성원 직급" ref={this.newMemberPositionInput}></Input>
                    </Col>
                    <Col span="4">
                      <Button type="primary" onClick={this.addMember}>
                        추가하기
                      </Button>
                    </Col>
                  </Row>
                </Modal>
              </>
            ) : null}

            <Button
              type="primary"
              onClick={() => {
                axios.post('/api/logout').then((rs) => {
                  Router.push('/');
                });
              }}
            >
              로그아웃
            </Button>
          </Col>
        </Row>
        <Row style={{ padding: '16px 8px' }}>
          <Col>
            <Row className="date-nav-box">
              <Button
                icon={<LeftOutlined />}
                onClick={() => {
                  const { viewDate } = this.state;
                  this.onChangeDatePicker(viewDate.subtract(1, 'month').clone());
                }}
              />
              <DatePicker
                onChange={this.onChangeDatePicker}
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
                  this.onChangeDatePicker(viewDate.add(1, 'month').clone());
                }}
              />
            </Row>
            {daysList.map((item) => {
              return (
                <Row key={item.format} className={`day-item day-${item.day}`} justify="center" align="middle">
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
          <Col style={{ display: 'flex', overflow: 'auto', flex: 1 }}>
            <Row style={{ flexFlow: 'row' }}>
              {viewMemberList.map((member) => {
                console.log(member);
                return (
                  <Col key={member._id} className="member-attendance-box">
                    <Row className="header-item" align="middle">
                      <Col className="text-center" span="24">
                        {member.name} ({member.position})
                      </Col>
                    </Row>
                    {daysList.map((date) => {
                      let times = member.attendance[date.format];
                      times = times ? times : {};
                      console.log(isAdmin);
                      if (isAdmin) {
                        let startMoment;
                        let endMoment;
                        if (times.start) {
                          startMoment = moment();
                          startMoment.hour(times.start.split(':')[0]);
                          startMoment.minute(times.start.split(':')[1]);
                        }
                        if (times.end) {
                          endMoment = moment();
                          endMoment.hour(times.end.split(':')[0]);
                          endMoment.minute(times.end.split(':')[1]);
                        }
                        return (
                          <Row key={date.format} className={`day-item day-${date.day}`} justify="center">
                            <Col className="time-box hour" span="12">
                              <TimePicker
                                value={startMoment ? startMoment.clone() : ''}
                                format={'HH:mm'}
                                size="small"
                                placeholder="출근"
                                onChange={(e, value) => {
                                  this.onChangeTimePicker(value, member, date, 'start');
                                }}
                              />
                            </Col>
                            <Col className="time-box" span="12">
                              <TimePicker
                                value={endMoment ? endMoment.clone() : ''}
                                format={'HH:mm'}
                                size="small"
                                placeholder="퇴근"
                                onChange={(e, value) => {
                                  this.onChangeTimePicker(value, member, date, 'end');
                                }}
                              />
                            </Col>
                          </Row>
                        );
                      } else {
                        return (
                          <Row key={date.format} className={`day-item day-${date.day} text-center`} justify="center">
                            <Col className="time-box hour" span="12">
                              {times.start ? times.start : '-'}
                            </Col>
                            <Col className="time-box" span="12">
                              {times.end ? times.end : '-'}
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
  return {
    user: req.session.user,
  };
};

export default withSession(Main);
