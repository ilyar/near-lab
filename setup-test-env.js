require('dotenv/config')
const near = require('@4ire-labs/near-sdk')
const {
  custodianAccount
} = require('./util')

async function main() {
  console.log('[NEAR] SETUP IN PROGRESS')
  const sender = near.parseAccountNetwork('local');
  await custodianAccount(sender, near.accountIdBySlug('sybil'), '788.7029434818221807')
  console.log('[NEAR] SETUP DONE')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
