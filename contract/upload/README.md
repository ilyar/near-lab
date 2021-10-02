# Near upload

```shell
cargo install cargo-run-script
cargo run-script build # or build-in-docker
near dev-deploy
source neardev/dev-account.env
near --accountId $CONTRACT_NAME call $CONTRACT_NAME upload "$(printf '{"data": "%s"}' "$(head -c 98292 </dev/urandom | base64 -w0)")" --gas 300000000000000
near delete $CONTRACT_NAME $NEAR_DEV_ACCOUNT
```
