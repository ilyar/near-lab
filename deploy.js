require('dotenv/config')
const near = require('@4ire-labs/near-sdk')

async function main() {
  console.log('[NEAR] DEPLOY IN PROGRESS')
  const helperCode = await near.fetchContract('near', 'mainnet')
  const sender = near.parseAccountNetwork()
  const deployResult = await near.deployContract(sender, helperCode)
  console.log('[NEAR] Created helper account:', {
    accountId: deployResult.account.accountId,
    transactionId: deployResult.outcome.transactionId,
  })
  console.log('[NEAR] DEPLOY DONE')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
