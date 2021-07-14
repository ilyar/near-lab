require('dotenv/config')
const BN = require('bn.js')
const near = require('@4ire-labs/near-sdk')
const {
  printAccount,
} = require('./util')

const NEAR_CLONE_ID = process.env.NEAR_CLONE_ID
const NEAR_CLONE_ENV = process.env.NEAR_CLONE_ENV || 'testnet'

async function createSender(sender, local) {
  if (await near.isExistAccount(sender)) {
    await near.deleteAccount(sender, local)
  }
  let amount = '100'
  const source = near.parseAccountNetwork(NEAR_CLONE_ID, null, NEAR_CLONE_ENV)
  if (await near.isExistAccount(source)) {
    const state = await near.stateAccount(source)
    amount = (new BN(state.amount)).div(new BN(10).pow(new BN(24))).toString() // TODO use near.toNear(state.amount) after fix https://github.com/4IRE-Labs/near-sdk/issues/16
  }
  const trx = await near.createAccount(local, sender, amount)
  printAccount(sender, trx)
}

async function main() {
  const local = near.parseAccountNetwork('local');
  console.log(`[NEAR ${local.networkId}] SETUP IN PROGRESS`)
  const sender = near.parseAccountNetwork()
  await createSender(sender, local);
  console.log(`[NEAR ${local.networkId}] ${sender.networkId}:`, await near.stateAccount(sender))
  console.log(`[NEAR ${local.networkId}] SETUP DONE`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
