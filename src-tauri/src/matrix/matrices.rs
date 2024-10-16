use serde_json::Value;

use crate::values::Calculations;

use super::props::mtx_is_square;

pub fn transpose(m: Option<Value>) -> Calculations {
    let mut res = Value::Null;
    let mut errors = Vec::new();

    match m {
        Some(Value::Array(mtx)) => {}
        _ => {}
    }

    Calculations { res, errors }
}
