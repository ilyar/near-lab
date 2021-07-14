require('dotenv/config')
const near = require('@4ire-labs/near-sdk')
const path = require('path')
const fs = require('fs')
const PromisePool = require('@supercharge/promise-pool')
const {
  resultToString,
} = require('../util')
const NEAR_CONCURRENCY = parseInt(process.env.NEAR_CONCURRENCY || 1)

async function main() {
  const sender = near.parseAccountNetwork()
  console.log(`[NEAR ${sender.networkId}] IN PROGRESS`)
  const directoryPath = path.join(__dirname, process.env.NEAR_CREDENTIALS_PATH, sender.networkId)
  const deleteList = fs.readdirSync(directoryPath)
    .filter((file) => file.includes(sender.accountId))
    .map((file) => file.slice(0, file.length - 5))
  const {results, errors} = await PromisePool
    .for(deleteList)
    .withConcurrency(NEAR_CONCURRENCY)
    .process(async accountId => {
      const account = await near.readUnencryptedFileSystemKeyStore(accountId)
      const out = {
        accountId: account.accountId,
        status: false,
        isExistAccount: true,
      }
      if (await near.isExistAccount(account)) {
        const trx = await near.deleteAccount(account, sender);
        out.transactionId = trx.transactionId
        out.status = true
      } else {
        out.isExistAccount = false
      }
      if (out.isExistAccount === false || out.status === true) {
        const keyPath = path.join(directoryPath, `${account.accountId}.json`)
        fs.unlinkSync(keyPath)
      }
      console.log(out)
      return out
    })
  console.log('errors:', errors)
  console.log(`[NEAR ${sender.networkId}] ${resultToString(results, errors)}`)
  console.log(`[NEAR ${sender.networkId}] DONE`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
