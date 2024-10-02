use serde::Serialize;
// utils to work with passed values
use serde_json::Value;

#[derive(Serialize)]
pub struct Calculations {
    // pub suc: bool,
    pub res: Value,
    pub errors: Vec<String>,
}
