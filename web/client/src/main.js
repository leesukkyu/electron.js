import React, { createRef, useState, useEffect } from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import XLSX from 'xlsx';
import ReactDOM from 'react-dom';

import {
  TextField,
  Grid,
  Box,
  Button,
  makeStyles,
  Modal,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Backdrop,
  Fade,
  Divider,
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';

import InputMask from 'react-input-mask';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import axios from 'axios';

import moment from 'moment';

import 'moment/locale/ko';

moment.locale('ko', {
  weekdays: ['일', '월', '화', '수', '목', '금', '토'],
  weekdaysShort: ['일', '월', '화', '수', '목', '금', '토'],
});

import './public/css/common.scss';

import logo_horizontal from './public/images/logo_horizontal.svg';

axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? 'http://localhost:5500' : '';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: localStorage.getItem('username') === 'admin',
      isLoading: false,
      isModalOpen: false,
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
    this.fetchInitialData();
  }

  fetchInitialData = () => {
    this.setState({
      isLoading: true,
    });
    axios.get('/api/member').then(rs => {
      this.setState(
        {
          isLoading: true,
          memberList: rs.data.memberList,
        },
        () => {
          this.fetchAttendanceData();
        },
      );
    });
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

  onChangeDatePicker = date => {
    if (date.isValid()) {
      if (this.state.viewDate.format('YYYY-MM') !== date.format('YYYY-MM')) {
        this.setState(
          {
            viewDate: date,
            isLoading: true,
          },
          () => {
            this.fetchAttendanceData();
          },
        );
      }
    }
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

  onClickLogoutBtn = () => {
    axios.post('/api/logout').then(rs => {
      localStorage.setItem('username', '');
      window.location.reload();
    });
  };

  onClickDownloadBtn = (viewMemberList, daysList) => {
    var wb = XLSX.utils.book_new();
    wb.Props = {
      Title: 'SheetJS Tutorial',
      Subject: 'Test',
      Author: 'ARSCO',
      CreatedDate: new Date(),
    };
    wb.SheetNames.push('Test Sheet');
    var nameList = viewMemberList.map(member => {
      return member.name;
    });
    nameList.unshift('날짜');
    var ws_data = [nameList];
    daysList.forEach(day => {
      var row = viewMemberList.map(member => {
        if (member.attendance[day.format]) {
          var start = member.attendance[day.format].start;
          var end = member.attendance[day.format].end;
          start = start ? start : '-';
          end = end ? end : '-';
          return start + '/' + end;
        } else {
          return '-';
        }
      });
      row.unshift(day.format);
      ws_data.push(row);
    });
    var ws = XLSX.utils.json_to_sheet(ws_data);
    wb.Sheets['Test Sheet'] = ws;
    console.log(XLSX);
    console.log(wb);
    return XLSX.writeFile(wb, undefined || 'SheetJSTableExport.' + 'xlsx');
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
      .then(rs => {
        this.setState({
          isLoading: false,
        });
      });
  };

  addMember = () => {
    const name = this.newMemberNameInput.current.value;
    const position = this.newMemberPositionInput.current.value;

    if (name && position) {
      axios
        .post('/api/member', {
          name,
          position,
        })
        .then(rs => {
          console.log(rs);
          if (!rs.data.isErr) {
            this.state.memberList.push(rs.data.member);
            this.forceUpdate();
          }
          this.newMemberNameInput.current.value = '';
          this.newMemberPositionInput.current.value = '';
        });
    }
  };

  showDeleteConfirm = id => {
    axios
      .delete('/api/member', {
        params: {
          id,
        },
      })
      .then(() => {
        const { memberList } = this.state;
        for (var i in memberList) {
          if (memberList[i]['_id'] === id) {
            memberList.splice(i, 1);
            this.forceUpdate();
            break;
          }
        }
      });
  };

  render() {
    const { isLoading, isAdmin } = this.state;
    const { memberList, viewDate, isModalOpen, attendanceData } = this.state;
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
    viewMemberList.map(member => {
      let index = 0;
      const exist = memberAttendanceList.some(memberAttendance => {
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
        <div style={{ padding: '10px 8px' }}>
          <div className="col" xs={6}>
            <img
              src={logo_horizontal}
              style={{ height: '40px', verticalAlign: 'middle', marginRight: 15 }}
            />
            {isLoading && <CircularProgress size={24} />}
          </div>
          <div xs={6} className="text-right col">
            {isAdmin ? (
              <>
                <ModalArea>
                  <div>
                    <List style={{ maxHeight: '440px', overflowY: 'auto' }}>
                      {memberList.map(item => {
                        return (
                          <React.Fragment key={item._id}>
                            <ListItem>
                              <ListItemText
                                secondary={`${item.name} ${item.position}`}
                              ></ListItemText>
                              <ListItemSecondaryAction>
                                <AlertDialog
                                  onOk={() => {
                                    this.showDeleteConfirm(item._id);
                                  }}
                                ></AlertDialog>
                              </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                          </React.Fragment>
                        );
                      })}
                    </List>
                    <div style={{ padding: '5px 10px' }}>
                      <TextField
                        id="standard-multiline-flexible"
                        label="이름"
                        inputRef={this.newMemberNameInput}
                        size="small"
                        variant="outlined"
                        style={{ width: '48%', marginRight: '4%' }}
                      />
                      <TextField
                        id="standard-textarea"
                        label="직급"
                        inputRef={this.newMemberPositionInput}
                        size="small"
                        variant="outlined"
                        style={{ width: '48%' }}
                      />
                      <div className="text-right" style={{ marginTop: 10 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          disableElevation
                          onClick={this.addMember}
                          size="small"
                        >
                          구성원 추가
                        </Button>
                      </div>
                    </div>
                  </div>
                </ModalArea>
              </>
            ) : null}

            <IconButton
              onClick={() => {
                this.onClickDownloadBtn(viewMemberList, daysList);
              }}
            >
              <GetAppIcon></GetAppIcon>
            </IconButton>
            <Button type="button" onClick={this.onClickLogoutBtn}>
              로그아웃
            </Button>
          </div>
        </div>
        <div className="row clearfix" style={{ padding: '16px 8px' }}>
          <div className="col date-nav-wrap">
            <div className="row" className="date-nav-box header-height">
              <IconButton
                type="button"
                style={{ padding: '6px' }}
                onClick={() => {
                  const { viewDate } = this.state;
                  const newDate = viewDate.clone();
                  this.onChangeDatePicker(newDate.subtract(1, 'month').clone());
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale="ko">
                <KeyboardDatePicker
                  autoOk
                  variant="inline"
                  views={['year', 'month']}
                  format="YYYY-MM"
                  value={viewDate.toDate()}
                  onChange={this.onChangeDatePicker}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
              <IconButton
                type="button"
                style={{
                  padding: '6px',
                }}
                onClick={() => {
                  const { viewDate } = this.state;
                  const newDate = viewDate.clone();
                  this.onChangeDatePicker(newDate.add(1, 'month').clone());
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </div>
            {daysList.map(item => {
              return (
                <div
                  className="row"
                  key={item.format}
                  className={`day-item day-type-${item.day} item-height`}
                  justify="center"
                  align="middle"
                >
                  <span className="text-center" span="12" style={{ fontSize: '18px' }}>
                    {item.number}
                  </span>
                  <span className="text-center" span="12" style={{ fontSize: '15px' }}>
                    ({item.dayStr})
                  </span>
                </div>
              );
            })}
          </div>
          <div className="col member-attendance-wrap">
            {viewMemberList.map(member => {
              return (
                <div className="col" key={member._id} className="member-attendance-box">
                  <div className="row" className="header-item header-height" align="middle">
                    <div className="col" className="text-center" span="24">
                      {member.name} ({member.position})
                    </div>
                  </div>
                  {daysList.map(date => {
                    let times = member.attendance[date.format];
                    times = times ? times : {};
                    console.log(times.end);
                    if (isAdmin) {
                      return (
                        <div
                          className="row"
                          key={date.format}
                          className={`attendance-item day-type-${date.day} item-height`}
                          justify="center"
                        >
                          <div className="col" className="time-box hour" span="12">
                            <TimeInput
                              placeholder="출근"
                              value={times.start}
                              onSave={(e, value) => {
                                this.onChangeTimePicker(value, member, date, 'start');
                              }}
                            ></TimeInput>
                          </div>
                          <div className="col" className="time-box" span="12">
                            <TimeInput
                              placeholder="퇴근"
                              value={times.end}
                              onSave={(e, value) => {
                                this.onChangeTimePicker(value, member, date, 'end');
                              }}
                            ></TimeInput>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={date.format}
                          className={`attendance-item day-type-${date.day} text-center item-height`}
                          justify="center"
                        >
                          <div className="time-box hour" span="12">
                            {times.start ? times.start : '-'}
                          </div>
                          <div className="time-box" span="12">
                            {times.end ? times.end : '-'}
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

function TimeInput({ value, placeholder, onSave }) {
  const [val, setVal] = useState(value ? value : '');
  useEffect(() => {
    setVal(value ? value : '');
  }, [value]);
  return (
    <InputMask
      value={val}
      placeholder={placeholder}
      mask={'99:99'}
      onBlur={e => {
        if (e.target.value && e.target.value.indexOf('_') === -1) {
          onSave(e, val);
        }
      }}
      onChange={e => {
        setVal(e.target.value);
      }}
    />
  );
}

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: '#fff',
    boxShadow: '0px 0px 6px rgba(0,0,0,0.7)',
    padding: '5px',
    width: '40%',
    maxWidth: '350px',
    minWidth: '250px',
    outline: 'none',
  },
}));

function ModalArea(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <button type="button" onClick={handleOpen}>
        구성원 관리
      </button>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>{props.children}</div>
        </Fade>
      </Modal>
    </>
  );
}

function AlertDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOk = () => {
    setOpen(false);
    props.onOk();
  };

  return (
    <>
      <IconButton edge="end" aria-label="delete" onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'정말 삭제하시겠습니까?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            정말 삭제하시겠습니까? 복구될 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            취소
          </Button>
          <Button onClick={handleOk} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

ReactDOM.render(<Main />, document.getElementById('root'));
