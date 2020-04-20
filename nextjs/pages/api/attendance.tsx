import withConnect from '../../db/withConnect';
import AttendanceModel from '../../db/models/attendance';
import { withSession } from 'next-session';

const Attendance = (req, res) => {
  if (req.method === 'GET') {
    AttendanceModel.find({
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
  } else if (req.method === 'POST') {
    if (req.session.user && req.session.user.username === 'admin') {
      AttendanceModel.findOneAndUpdate(
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
    }
  }
};

export default withSession(withConnect(Attendance));
