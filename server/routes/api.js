const express = require('express');

const router = express.Router();

const Info = require('../models/attendance');

// 일자별 조회
router.get('/collection/:page', function (req, res, next) {
  let page, query;

  query = {};
  page = req.params.page;

  const options = {
    sort: { [req.query.sortType]: -1 },
    limit: 10,
    page: page ? page : 1,
  };

  Info.paginate(query, options)
    .then(function (result) {
      res.json(result);
    })
    .catch(function () {
      res.status(500).send();
    });
  // Info.paginate({});
  // Info.find({})
  //   .sort({ time: "desc" })
  //   .exec(function(err, docs) {
  //     if (!err) {
  //       res.json(docs);
  //     } else {
  //       res.status(500).send();
  //     }
  //   });
});

function requestData() {
  // serviceKey: decodeURIComponent(SEARCH_KEY),
  //         sigunguCd: searchCode.slice(0, 5),
  //         bjdongCd: searchCode.slice(5, 10),
  //         platGbCd: "0",
  //         bun: "",
  //         ji: "",
  //         startDate: moment()
  //           .subtract(SEARCH_MONTH, "months")
  //           .format("YYYYMMDD"),
  //         endDate: moment().format("YYYYMMDD"),
  //         numOfRows: "10",
  //         pageNo: tablePage == 0 ? 1 : tablePage
}

module.exports = router;
