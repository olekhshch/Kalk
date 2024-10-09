use serde_json::Value;

use crate::values::Calculations;

pub fn abs(a: Option<Value>) -> Calculations {
    let mut res = Value::Null;
    let mut errors = Vec::new();

    match a {
        Some(Value::Number(a_num)) => {
            let a64 = a_num.as_f64();
            match a64 {
                Some(a_64) => match serde_json::Number::from_f64(a_64.abs()) {
                    Some(num_value) => res = Value::Number(num_value),
                    _ => {}
                },
                _ => {}
            }
        }

        Some(Value::Array(array)) if array.iter().all(|n| n.is_number()) => {
            let abs_vec = abs_vec(&array);
            match abs_vec {
                Some(vec) => res = Value::Array(vec),
                None => errors.push(format!("200")),
            }
        }

        Some(Value::Array(matrix)) if matrix.iter().all(|v| v.is_array()) => {
            let abs_mtx: Option<Vec<Value>> = matrix
                .into_iter()
                .map(|v| {
                    if let Value::Array(vector) = v {
                        let abs_vec = abs_vec(&vector);
                        match abs_vec {
                            Some(abs_vector) => Some(Value::Array(abs_vector)),
                            None => None,
                        }
                    } else {
                        None
                    }
                })
                .collect();

            match abs_mtx {
                Some(mtx) => res = Value::Array(mtx),
                None => {
                    errors.push(format!("200"));
                }
            }
        }

        _ => {}
    }

    Calculations { res, errors }
}

fn abs_vec(vec: &Vec<Value>) -> Option<Vec<Value>> {
    let abs_array = vec
        .into_iter()
        .map(|n| {
            if let Value::Number(num) = n {
                if let Some(num_f64) = num.as_f64() {
                    match serde_json::Number::from_f64(num_f64.abs()) {
                        Some(abs_val) => Some(Value::Number(abs_val)),
                        _ => None,
                    }
                } else {
                    None
                }
            } else {
                None
            }
        })
        .collect();

    abs_array
}

pub fn power(a: Option<Value>, b: Option<Value>) -> Calculations {
    let mut res = Value::Null;
    let mut errors = Vec::new();

    // b should be a number only
    match b {
        Some(Value::Number(num_b)) => {
            if let Some(exp) = num_b.as_f64() {
                match a {
                    Some(Value::Number(num)) => {
                        if let Some(base_f64) = num.as_f64() {
                            let res_f64 = base_f64.powf(exp);
                            if let Some(res_val) = serde_json::Number::from_f64(res_f64) {
                                res = Value::Number(res_val);
                            }
                        }
                    }
                    Some(Value::Array(matrix)) if matrix.iter().all(|v| v.is_array()) => {
                        let res_mtx: Option<Vec<Value>> = matrix
                            .into_iter()
                            .map(|v| {
                                if let Value::Array(vec) = v {
                                    let res_vec = power_vec_entries(&vec, &exp);
                                    match res_vec {
                                        Some(result_row) => Some(Value::Array(result_row)),
                                        None => None,
                                    }
                                } else {
                                    None
                                }
                            })
                            .collect();

                        if let Some(mtx_exp) = res_mtx {
                            res = Value::Array(mtx_exp);
                        } else {
                            errors.push(format!("200"))
                        }
                    }
                    Some(Value::Array(vector)) => {
                        let res_vec = power_vec_entries(&vector, &exp);
                        match res_vec {
                            Some(result) => res = Value::Array(result),
                            None => {
                                errors.push(format!("200"));
                            }
                        }
                    }
                    _ => {}
                }
            }
        }
        None => {}
        _ => errors.push(format! {"102"}),
    }

    Calculations { res, errors }
}

fn power_vec_entries(vector: &Vec<Value>, exp: &f64) -> Option<Vec<Value>> {
    let vec: Option<Vec<Value>> = vector
        .into_iter()
        .map(|n| {
            if let Value::Number(num) = n {
                if let Some(n_f64) = num.as_f64() {
                    match serde_json::Number::from_f64(n_f64.powf(*exp)) {
                        Some(result) => Some(Value::Number(result)),
                        None => None,
                    }
                } else {
                    None
                }
            } else {
                None
            }
        })
        .collect();

    vec
}
