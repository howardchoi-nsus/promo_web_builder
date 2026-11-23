const { createReviewHandler } = require("../../../_promo-service-v3-actions");
module.exports = createReviewHandler();

module.exports=require('../../../_work-log.js').withWorkLog('v3/promo-requests/[id]/review.js',module.exports);
