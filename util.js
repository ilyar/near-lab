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

async function custodianAccount(sender, wallet, amount) {
  const account = near.custodianAccount(wallet, sender)
  const trx = await near.createAccount(sender, account, amount)
  printAccount(account, trx)
  return account
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

module.exports = {
  custodianAccount,
  printAccount,
  helperContract,
  now,
}
