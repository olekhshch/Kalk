use serde_json::Value;

use crate::values::Calculations;

pub enum RoundingOperation {
    Floor,
    Ceil,
}

pub fn do_rounding_operation(operation: RoundingOperation, a: Option<Value>) -> Calculations {
    let mut res = Value::Null;
    let mut errors = Vec::new();

    match a {
        Some(Value::Number(num_a)) => {
            let result = rounding_on_num(&operation, &Value::Number(num_a));
            if let Some(val) = result {
                res = val
            }
        }
        Some(Value::Array(vec_a)) if vec_a.iter().all(|n| n.is_number()) => {
            let res_vec = rounding_on_vec(&operation, &vec_a);

            match res_vec {
                Some(values) => res = Value::Array(values),
                None => errors.push(String::from("200")),
            }
        }

        Some(Value::Array(mtx)) => {
            let res_mtx = rounding_on_mtx(&operation, &mtx);

            match res_mtx {
                Some(values) => res = Value::Array(values),
                None => {
                    errors.push(String::from("200"));
                }
            }
        }
        _ => {}
    }

    Calculations { res, errors }
}

fn rounding_on_num(operation: &RoundingOperation, a: &Value) -> Option<Value> {
    match a {
        Value::Number(num_a) => {
            if let Some(a_f64) = num_a.as_f64() {
                let res_f64 = match operation {
                    RoundingOperation::Ceil => a_f64.ceil(),
                    RoundingOperation::Floor => a_f64.floor(),
                };
                if let Some(res_val) = serde_json::Number::from_f64(res_f64) {
                    Some(Value::Number(res_val))
                } else {
                    None
                }
            } else {
                None
            }
        }
        _ => None,
    }
}

fn rounding_on_vec(operation: &RoundingOperation, a: &Vec<Value>) -> Option<Vec<Value>> {
    let res_vec: Option<Vec<Value>> = a
        .into_iter()
        .map(|n| {
            let res_n = rounding_on_num(operation, &n);

            match res_n {
                Some(Value::Number(number)) => Some(Value::Number(number)),
                _ => None,
            }
        })
        .collect();

    // match res_vec {
    //     Some(vector) => Some(vector),
    //     None => None,
    // }

    res_vec
}

fn rounding_on_mtx(operation: &RoundingOperation, mtx: &Vec<Value>) -> Option<Vec<Value>> {
    let res_mtx: Option<Vec<Value>> = mtx
        .into_iter()
        .map(|vec| {
            if let Value::Array(vec_values) = vec {
                let res_vec = rounding_on_vec(operation, vec_values);

                match res_vec {
                    Some(values) => Some(Value::Array(values)),
                    None => None,
                }
            } else {
                None
            }
        })
        .collect();

    res_mtx
}
