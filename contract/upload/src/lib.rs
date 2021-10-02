use near_sdk::{
    env,
    json_types::Base64VecU8,
    serde::Deserialize,
    serde_json,
};

#[derive(Deserialize)]
#[serde(crate = "near_sdk::serde")]
struct Param {
    pub data: Base64VecU8,
}

#[no_mangle]
pub extern "C" fn upload() {
    env::setup_panic_hook();
    let input = env::input().unwrap();
    let param: Param = serde_json::from_slice(&input).unwrap();
    env::log_str(&format!("size: {}", param.data.0.len()));
    let checksum = hex::encode(env::sha256(&param.data.0));
    env::log_str(&format!("hash: {}", checksum));
}
