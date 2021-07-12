# NEAR Lab

## Setup

```shell
yarn
```

## Only for local net
```shell
yarn local-setup
yarn create-accounts
yarn delete-accounts
```

## For test net
create file `.env`
```ini
NEAR_ENV=testnet
NEAR_SENDER_ID=<account-name>.testnet
NEAR_SENDER_PRIVATE_KEY=ed25519:<secret-data>
NEAR_INIT_BALANCE=0.003
NEAR_COUNT=1000
NEAR_CONCURRENCY=4
NEAR_CREDENTIALS_PATH=.key
```
> optional `NEAR_NODE_URL=https://near-testnet--rpc.datahub.figment.io/apikey/<YOUR_API_KEY>`

run:
```shell
yarn deploy
yarn create-accounts
yarn delete-accounts
```
