import withConnect from '../../db/withConnect';
import MemberModel from '../../db/models/member';
import { withSession } from 'next-session';

const Member = (req, res) => {
  if (!req.session.user) {
    res.status(400).json({});
  }
  if (req.method === 'GET') {
    MemberModel.find({})
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
  } else if (req.method === 'POST') {
    MemberModel.create({ name: req.body.name, position: req.body.position })
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
  } else if (req.method === 'DELETE') {
    debugger;
    if (req.session.user && req.session.user.username === 'admin') {
      const id = req.query.id;
      MemberModel.findByIdAndRemove(id)
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

export default withSession(withConnect(Member));
