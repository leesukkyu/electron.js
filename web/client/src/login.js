import React from 'react';
import { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { TextField, Grid, Box, Button, makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import axios from 'axios';

import './public/css/common.scss';

import logo_horizontal from './public/images/logo_horizontal.svg';
axios.defaults.baseURL = process.env.NODE_ENV == 'development' ? 'http://localhost:5500' : '';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
    marginTop: 20,
  },
  fabProgress: {
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const Login = props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();

  const onClickSubmit = () => {
    setIsLoading(true);
    axios
      .post('/api/login', {
        username: username,
        password: password,
      })
      .then(rs => {
        setIsLoading(false);
        console.log(rs);
        if (!rs.data.isErr) {
          localStorage.setItem('username', username);
          window.location.reload();
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  return (
    <Grid container justify="center" alignItems="center" className="full-height">
      <Grid container justify="center" direction="column" item xs={4}>
        <Grid container>
          <Grid item xs={5}>
            <img src={logo_horizontal} className="full-width"></img>
          </Grid>
        </Grid>
        <Grid>
          <Box className="pt-3">
            <TextField
              type="text"
              className="full-width"
              size="medium"
              label="아이디"
              value={username}
              onChange={e => {
                setUsername(e.target.value);
              }}
            />
          </Box>
          <Box>
            <TextField
              type="password"
              className="full-width"
              size="medium"
              label="비밀번호"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
              }}
            />
          </Box>
        </Grid>
        <Grid container justify="flex-end">
          <div className={classes.wrapper}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              disabled={isLoading || !username || !password}
              onClick={onClickSubmit}
            >
              로그인
            </Button>
            {isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

ReactDOM.render(<Login />, document.getElementById('root'));
