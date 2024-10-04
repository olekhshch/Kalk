use evalexpr::eval;
use num::Zero;
use serde_json::Value;

use crate::values::Calculations;

mod operations;

// #[derive(Serialize)]
// pub struct Calculations {
//     msg: Vec<String>,
//     res: Value,
// }

#[tauri::command]
pub fn evaluate_expression(expr: String) -> Calculations {
    let evaluation = eval(&expr);
    let mut errors: Vec<String> = Vec::new();
    let mut res: Value = Value::Null;

    match evaluation {
        Ok(num) => match num {
            evalexpr::Value::Float(v) => match serde_json::Number::from_f64(v) {
                Some(num_f64) => res = Value::Number(num_f64),
                _ => {}
            },
            evalexpr::Value::Int(v) => match serde_json::Number::from_f64(v as f64) {
                Some(num_f64) => res = Value::Number(num_f64),
                _ => {}
            },
            _ => {}
        },
        _ => {
            if expr.len() > 0 {
                errors.push(format!("100"))
            }
        }
    }

    Calculations { res, errors }
}

#[tauri::command]
pub fn add(a: Option<Value>, b: Option<Value>) -> Calculations {
    let mut res: Value = Value::Null;
    let mut errors = Vec::new();

    match (a, b) {
        (Some(Value::Number(a_num)), Some(Value::Number(b_num))) => {
            let a64 = a_num.as_f64();
            let b64 = b_num.as_f64();

            match (a64, b64) {
                (Some(a_64), Some(b_64)) => {
                    let my_res = serde_json::Number::from_f64(a_64 + b_64);
                    if let Some(n) = my_res {
                        res = Value::Number(n)
                    }
                }
                _ => {}
            }
        }
        (Some(_), None) | (None, Some(_)) => {}
        (None, None) => {}
        _ => errors.push(format!("101")),
    }

    Calculations { res, errors }
}

#[tauri::command]
pub fn subtract(a: Option<Value>, b: Option<Value>) -> Calculations {
    let mut res: Value = Value::Null;
    let mut errors = Vec::new();

    match (a, b) {
        (Some(Value::Number(a_num)), Some(Value::Number(b_num))) => {
            let a64 = a_num.as_f64();
            let b64 = b_num.as_f64();

            match (a64, b64) {
                (Some(a_64), Some(b_64)) => {
                    let my_res = serde_json::Number::from_f64(a_64 - b_64);
                    if let Some(n) = my_res {
                        res = Value::Number(n)
                    }
                }
                _ => {}
            }
        }
        (Some(_), None) | (None, Some(_)) => {}
        (None, None) => {}
        _ => errors.push(format!("101")),
    }

    Calculations { res, errors }
}

#[tauri::command]
pub fn multiply(a: Option<Value>, b: Option<Value>) -> Calculations {
    let mut res: Value = Value::Null;
    let mut errors = Vec::new();

    match (a, b) {
        (Some(Value::Number(a_num)), Some(Value::Number(b_num))) => {
            let a64 = a_num.as_f64();
            let b64 = b_num.as_f64();

            match (a64, b64) {
                (Some(a_64), Some(b_64)) => {
                    let my_res = serde_json::Number::from_f64(a_64 * b_64);
                    if let Some(n) = my_res {
                        res = Value::Number(n)
                    }
                }
                _ => {}
            }
        }
        (Some(_), None) | (None, Some(_)) => {}
        (None, None) => {}
        _ => errors.push(format!("101")),
    }

    Calculations { res, errors }
}

#[tauri::command]
pub fn divide(a: Option<Value>, b: Option<Value>) -> Calculations {
    let mut res: Value = Value::Null;
    let mut errors = Vec::new();

    match (a, b) {
        (Some(Value::Number(a_num)), Some(Value::Number(b_num))) => {
            let a64 = a_num.as_f64();
            let b64 = b_num.as_f64();

            match (a64, b64) {
                (Some(a_64), Some(b_64)) => {
                    if !b_64.is_zero() {
                        let my_res = serde_json::Number::from_f64(a_64 / b_64);
                        if let Some(n) = my_res {
                            res = Value::Number(n)
                        }
                    }
                }
                _ => {}
            }
        }
        (Some(_), None) | (None, Some(_)) => {}
        (None, None) => {}
        _ => errors.push(format!("101")),
    }

    Calculations { res, errors }
}

#[tauri::command]
pub fn abs(a: Option<Value>) -> Calculations {
    operations::abs(a)
}

#[tauri::command]
pub fn power(a: Option<Value>, b: Option<Value>) -> Calculations {
    operations::power(a, b)
}
