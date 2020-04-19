import database from './config/database';

const withConnect = (handler) => async (req, res) => {
  debugger;
  if (!database.getReadyState()) {
    await database.connect();
  }
  return handler(req, res);
};

export default withConnect;
