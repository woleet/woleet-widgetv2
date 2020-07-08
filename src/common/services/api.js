import constants from 'Common/constants';

/**
 * Verify user receipt
 * @param receipt
 * @param receiptVerificationUrl
 * @return {Promise}
 */
export function verifyReceipt(receipt, receiptVerificationUrl) {
  if (!receiptVerificationUrl) {
    receiptVerificationUrl = constants.RECEIPT_VERIFICATION_URL;
  }

  return new Promise(function (resolve, reject) {
    const req = new XMLHttpRequest();
    req.open('post', receiptVerificationUrl);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onload = function () {
      if (req.status === 200) {
        try {
          resolve(JSON.parse(req.response));
        } catch (e) {
          resolve(req.response);
        }
      } else {
        reject(Error(req.statusText));
      }
    };
    req.onerror = function () {
      reject(Error('Network Error'));
    };
    req.send(JSON.stringify(receipt));
  });
}

export default {
  receipt: { verify: verifyReceipt }
};
