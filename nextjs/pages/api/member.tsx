import withConnect from '../../db/withConnect';
import MemberModel from '../../db/models/member';
import { withSession } from 'next-session';

const Member = (req, res) => {
  debugger;
  MemberModel.find({})
    .then((doc, b) => {
      res.status(200).json({
        memberList: doc,
      });
    })
    .catch((a, b) => {
      res.status(200).json({
        isErr: true,
      });
    });
};

export default withSession(withConnect(Member));
