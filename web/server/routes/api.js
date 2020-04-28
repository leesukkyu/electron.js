const express = require('express');

const router = express.Router();

const User = require('../db/models/user');

const Member = require('../db/models/member');

const Attendance = require('../db/models/attendance');

function checkAuth(req) {
  return !!req.session.user;
}

// 로그인하기
router.post('/login', function (req, res, next) {
  User.find({
    username: {
      $eq: req.body.username,
    },
    password: {
      $eq: req.body.password,
    },
  })
    .then((doc) => {
      if (doc.length) {
        req.session.user = doc[0];
        res.status(200).json({
          isErr: false,
        });
      } else {
        res.status(200).json({
          isErr: true,
        });
      }
    })
    .catch(() => {
      res.status(200).json({
        isErr: true,
      });
    });
});

// 로그아웃하기
router.post('/logout', function (req, res, next) {
  req.session.destroy(() => {
    res.status(200).json({
      isErr: false,
    });
  });
});

// 멤버리스트 가져오기
router.get('/member', function (req, res, next) {
  Member.find({})
    .then((doc) => {
      res.status(200).json({
        memberList: doc,
        isErr: false,
      });
    })
    .catch(() => {
      res.status(200).json({
        isErr: true,
      });
    });
});

// 멤버 저장하기
router.post('/member', function (req, res, next) {
  Member.create({ name: req.body.name, position: req.body.position })
    .then((doc) => {
      res.status(200).json({
        member: doc,
        isErr: false,
      });
    })
    .catch(() => {
      res.status(200).json({
        isErr: true,
      });
    });
});

// 멤버 삭제하기
router.delete('/member', function (req, res, next) {
  if (!checkAuth(req)) {
    res.status(200).json({
      isErr: true,
    });
  }
  const id = req.query.id;
  Member.findByIdAndRemove(id)
    .then(() => {
      res.status(200).json({
        isErr: false,
      });
    })
    .catch(() => {
      res.status(200).json({
        isErr: true,
      });
    });
});

// 출석부 불러오기
router.get('/attendance', function (req, res, next) {
  Attendance.find({
    date: {
      $eq: req.query.date,
    },
  })
    .then((doc) => {
      res.status(200).json({
        attendanceData: doc[0] ? doc[0] : {},
      });
    })
    .catch(() => {
      res.status(200).json({
        isErr: true,
      });
    });
});

// 출석부 저장하기
router.post('/attendance', function (req, res, next) {
  if (!checkAuth(req)) {
    res.status(200).json({
      isErr: true,
    });
  }
  Attendance.findOneAndUpdate(
    {
      date: {
        $eq: req.body.date,
      },
    },
    {
      date: req.body.date,
      memberAttendanceList: req.body.memberAttendanceList,
    },
    { upsert: true },
  )
    .then(() => {
      res.status(200).json({
        isErr: false,
      });
    })
    .catch(() => {
      res.status(200).json({
        isErr: true,
      });
    });
});

module.exports = router;
