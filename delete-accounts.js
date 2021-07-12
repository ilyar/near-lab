require('dotenv/config')
const near = require('@4ire-labs/near-sdk')
const path = require('path')
const fs = require('fs')

async function main() {
  console.log('[NEAR] IN PROGRESS')
  const sender = near.parseAccountNetwork()
  const directoryPath = path.join(__dirname, process.env.NEAR_CREDENTIALS_PATH, sender.networkId);
  const deleteList = fs.readdirSync(directoryPath)
    .filter((file) => file.includes(sender.accountId))
    .map((file) => file.slice(0, file.length - 5))
    .map(async (accountId) => {
      const account = await near.readUnencryptedFileSystemKeyStore(accountId)
      const out = {
        accountId: account.accountId,
        status: false,
      }
      if (await near.isExistAccount(account)) {
        try {
          const trx = await near.deleteAccount(account, sender);
          out.transactionId = trx.transactionId
          out.status = true
        } catch (error) {
          out.error = error.toString()
        }
      }
      return out
    }, [])
  const result = await Promise.all(deleteList).then((resultList) => {
    return resultList.reduce((acc, item) => {
      if (item.status) {
        console.log(`account ${item.accountId} deleted trx:${item.transactionId}`)
        acc += 1
      } else if (item.error) {
        console.log(`account ${item.accountId} error: ${item.error}`)
      } else {
        console.log(`account ${item.accountId} skip`)
      }
      return acc
    }, 0)
  })
  console.log(`[NEAR] delete ${result} accounts`)
  console.log('[NEAR] DONE')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})