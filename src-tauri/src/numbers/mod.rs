use evalexpr::eval;
use num::Zero;
use rounding::do_rounding_operation;
use serde_json::Value;
use trigonometry::{trigonometric_fn, AngleFormat};

use crate::values::Calculations;

mod operations;
mod rounding;
mod trigonometry;

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
                    } else {
                        errors.push(format!("103"));
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

#[tauri::command]
pub fn to_rad(a: Option<Value>) -> Calculations {
    trigonometry::convert_angle(a, AngleFormat::RAD)
}

#[tauri::command]
pub fn to_deg(a: Option<Value>) -> Calculations {
    trigonometry::convert_angle(a, AngleFormat::DEG)
}

fn get_angle_format_from_string(value: String) -> Option<AngleFormat> {
    match value.as_str() {
        "DEG" => Some(AngleFormat::DEG),
        "RAD" => Some(AngleFormat::RAD),
        _ => None,
    }
}

#[tauri::command]
pub fn sin(a: Option<Value>, format: String) -> Calculations {
    let a_format = get_angle_format_from_string(format);

    if let Some(angle_format) = a_format {
        trigonometric_fn(a, trigonometry::TrigonometricFn::SIN, angle_format)
    } else {
        Calculations {
            res: Value::Null,
            errors: vec![format!("Invalid angle format")],
        }
    }
}

#[tauri::command]
pub fn cos(a: Option<Value>, format: String) -> Calculations {
    let a_format = get_angle_format_from_string(format);

    if let Some(angle_format) = a_format {
        trigonometric_fn(a, trigonometry::TrigonometricFn::COS, angle_format)
    } else {
        Calculations {
            res: Value::Null,
            errors: vec![format!("Invalid angle format")],
        }
    }
}

#[tauri::command]
pub fn tg(a: Option<Value>, format: String) -> Calculations {
    let a_format = get_angle_format_from_string(format);

    if let Some(angle_format) = a_format {
        trigonometric_fn(a, trigonometry::TrigonometricFn::TG, angle_format)
    } else {
        Calculations {
            res: Value::Null,
            errors: vec![format!("Invalid angle format")],
        }
    }
}

#[tauri::command]
pub fn ctg(a: Option<Value>, format: String) -> Calculations {
    let a_format = get_angle_format_from_string(format);

    if let Some(angle_format) = a_format {
        trigonometric_fn(a, trigonometry::TrigonometricFn::CTG, angle_format)
    } else {
        Calculations {
            res: Value::Null,
            errors: vec![format!("Invalid angle format")],
        }
    }
}

#[tauri::command]
pub fn floor(a: Option<Value>) -> Calculations {
    do_rounding_operation(rounding::RoundingOperation::Floor, a)
}

#[tauri::command]
pub fn ceil(a: Option<Value>) -> Calculations {
    do_rounding_operation(rounding::RoundingOperation::Ceil, a)
}
