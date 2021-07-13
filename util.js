const near = require('@4ire-labs/near-sdk')

class Helper extends near.Contract {
  create_account(new_account_id, new_public_key, attachedDeposit) {
    return this.callRaw({
      methodName: 'create_account',
      args: {
        new_account_id,
        new_public_key,
      },
      attachedDeposit
    })
  }
}

function helperContract(sender, contractAddress) {
  contractAddress = contractAddress || sender.accountId
  return near.Contract.connect(Helper, contractAddress, sender)
}

function printAccount(account, trx) {
  const out = {
    accountId: account.accountId,
  }
  if (trx) {
    out.transactionId = trx.transactionId
  }
  console.log(out)
}

const now = (unit) => {
  const hrTime = process.hrtime();
  switch (unit) {
    case 'milli':
      return hrTime[0] * 1000 + hrTime[1] / 1000000
    case 'micro':
      return hrTime[0] * 1000000 + hrTime[1] / 1000
    case 'nano':
    default:
      return hrTime[0] * 1000000000 + hrTime[1]
  }
}

const resultToString = (results = [], errors = []) => {
  const percentErrors = errors.length > 0 ? Math.round(1 / results.length * errors.length * 10000) / 100 : 0
  return `result ${results.length} error: ${errors.length} (${percentErrors}%)`
}

module.exports = {
  resultToString,
  printAccount,
  helperContract,
  now,
}
