import withConnect from '../../db/withConnect';
import User from '../../db/models/user';
import { withSession } from 'next-session';

const Logout = (req, res) => {
  req.session.destroy();
  res.status(200).json({
    isErr: false,
  });
};

export default withSession(withConnect(Logout));
