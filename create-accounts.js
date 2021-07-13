require('dotenv/config')
const near = require('@4ire-labs/near-sdk')
const {
  resultToString,
  helperContract,
  now,
} = require('./util')
const PromisePool = require('@supercharge/promise-pool')
const NEAR_CONCURRENCY = parseInt(process.env.NEAR_CONCURRENCY || 1)
const NEAR_INIT_BALANCE = process.env.NEAR_INIT_BALANCE || '0.003'
const NEAR_COUNT = parseInt(process.env.NEAR_COUNT || 100)

async function main() {
  const sender = near.parseAccountNetwork()
  console.log(`[NEAR ${sender.networkId}] IN PROGRESS`)
  const helper = await helperContract(sender)
  const list = Array.from(Array(NEAR_COUNT).keys())
  const {results, errors} = await PromisePool
    .for(list)
    .withConcurrency(NEAR_CONCURRENCY)
    .process(async (i) => {
      const newAccount = near.custodianAccount(`${i}-${now()}.${sender.accountId}`)
      const status = await helper.create_account(
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
      })
      console.log(status)
      return status
    })
  console.log('errors:', errors)
  console.log(`[NEAR ${sender.networkId}] ${resultToString(results, errors)}`)
  console.log(`[NEAR ${sender.networkId}] DONE`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
