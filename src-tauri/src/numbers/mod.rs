use evalexpr::eval;
use num::{Float, NumCast, Zero};
use serde::Serialize;
use serde_json::Value;

use crate::values::Calculations;

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
        _ => {}
    }
    // match evaluation {
    //     Ok(res) => match res {
    //         evalexpr::Value::Float(n) => res = serde_json::Value::Number(Value::Number(n)),
    //         evalexpr::Value::Int(n) => res = Value::Number(n),
    //     },
    //     Err(err_msg) => {
    //         return Calculations {
    //             res: Value::Null,
    //             errors,
    //         }
    //     }
    // }

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

        _ => {}
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
        _ => {}
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
        _ => {}
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
        _ => {}
    }

    Calculations { res, errors }
}
