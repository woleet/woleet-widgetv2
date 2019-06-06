import constants from "Common/constants";

/**
 * Verifies user receipt
 * @param receipt
 * @return {Promise}
 */
export function verifyReceipt(receipt) {
  return new Promise(function(resolve, reject) {
    const req = new XMLHttpRequest();
    req.open('post', constants.RECEIPT_VERIFICATION_URL);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onload = function() {
      if (req.status === 200) {
        try {
          resolve(JSON.parse(req.response))
        } catch (e) {
          resolve(req.response)
        }
      } else {
        reject(Error(req.statusText));
      }
    };
    req.onerror = function() {
      reject(Error("Network Error"));
    };
    req.send(JSON.stringify(receipt));
  });
}

export default  {
  receipt: { verify: verifyReceipt }
}
