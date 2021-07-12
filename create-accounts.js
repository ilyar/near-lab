require('dotenv/config')
const near = require('@4ire-labs/near-sdk')
const {
  helperContract,
  now,
} = require('./util')

const NEAR_INIT_BALANCE = process.env.NEAR_INIT_BALANCE || '0.003'
const NEAR_COUNT = process.env.NEAR_COUNT || 100
const NEAR_BATCH = process.env.NEAR_BATCH || 10

async function main() {
  const sender = near.parseAccountNetwork()
  console.log(`[NEAR ${sender.networkId}] IN PROGRESS`)
  const helper = await helperContract(sender)
  let result = 0
  let batch = []
  for (let i = 1; i <= NEAR_COUNT; i += 1) {
    const newAccount = near.custodianAccount(`${now()}.${sender.accountId}`)
    batch.push(helper.create_account(
      newAccount.accountId,
      newAccount.keyPair.publicKey.toString(),
      NEAR_INIT_BALANCE,
    ).then(async (trx) => {
      await near.writeUnencryptedFileSystemKeyStore(newAccount)
      return {
        accountId: newAccount.accountId,
        transactionId: trx.transactionId,
        status: trx.value,
      }
    }))
    if (i % NEAR_BATCH === 0) {
      await Promise.all(batch).then((trxList) => {
        console.log(trxList)
        result += trxList.reduce((previousValue, currentValue) => {
          if (currentValue.status) {
            previousValue += 1
          }
          return previousValue
        }, 0)
      })
      batch = []
    }
  }
  console.log(`[NEAR ${sender.networkId}] create ${result} accounts`)
  console.log(`[NEAR ${sender.networkId}] DONE`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
