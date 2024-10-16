use serde_json::Value;

use crate::values::Calculations;

pub fn vector_norm(vec: Option<Value>) -> Calculations {
    let mut res = Value::Null;
    let mut errors = Vec::new();

    match vec {
        Some(Value::Array(vector)) => {
            let squared_and_sumed: Option<f64> = vector
                .into_iter()
                .map(|n| {
                    if let Value::Number(num) = n {
                        if let Some(n_f64) = num.as_f64() {
                            Some(n_f64.powi(2))
                        } else {
                            None
                        }
                    } else {
                        None
                    }
                })
                .sum();

            match squared_and_sumed {
                Some(vec_norm) => {
                    if let Some(result) = serde_json::Number::from_f64(vec_norm) {
                        res = Value::Number(result);
                    } else {
                        errors.push(String::from("200"));
                    }
                }
                _ => {}
            }
        }
        None => {}
        _ => errors.push(String::from("101")),
    }

    Calculations { res, errors }
}

pub fn dot_product(vec1: Option<Value>, vec2: Option<Value>) -> Calculations {
    let mut res = Value::Null;
    let mut errors = Vec::new();

    match (vec1, vec2) {
        (Some(Value::Array(v1)), Some(Value::Array(v2))) => {
            let v1_length = v1.len();
            let v2_length = v2.len();

            if v1_length.ne(&v2_length) {
                errors.push(format!("201"))
            } else {
                for (idx, _) in v1.iter().enumerate() {
                    let val_1 = &v1[idx];
                    let val_2 = &v2[idx];

                    match (val_1, val_2) {
                        (Value::Number(n_1), Value::Number(n_2)) => {
                            match (n_1.as_f64(), n_2.as_f64()) {
                                (Some(n1_f64), Some(n2_f64)) => {
                                    let prod = n1_f64 * n2_f64;
                                    if let Some(num_val) = serde_json::Number::from_f64(prod) {
                                        res = Value::Number(num_val)
                                    }
                                }
                                _ => {}
                            }
                        }
                        _ => {}
                    }
                }
            }
        }
        (Some(_), Some(_)) => errors.push(format!("101")),
        _ => {}
    }

    Calculations { res, errors }
}
