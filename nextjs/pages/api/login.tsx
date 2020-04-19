import withConnect from '../../db/withConnect';
import User from '../../db/models/user';
import { withSession } from 'next-session';

const Login = (req, res) => {
  User.find({
    username: {
      $eq: req.body.username,
    },
    password: {
      $eq: req.body.password,
    },
  })
    .then((doc, b) => {
      if (doc.length) {
        req.session.user = doc[0];
        res.status(200).json({
          isErr: false,
        });
      }
    })
    .catch((a, b) => {
      res.status(200).json({
        isErr: true,
      });
    });
};

export default withSession(withConnect(Login));
