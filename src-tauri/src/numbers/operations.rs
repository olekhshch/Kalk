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

        // Some(Value::Array(array)) => {
        //     // checks if array is a Vector
        //     if array.iter().all(|num| num.is_f64()) {
        //         let vec_abs = array.iter().map(|num| {
        //             if let Some(num_f64) = num.as_f64() {
        //                 num_f64.abs()
        //             } else {
        //             }
        //         });
        //     }
        // }
        _ => {}
    }

    Calculations { res, errors }
}

pub fn power(a: Option<Value>, b: Option<Value>) -> Calculations {
    let mut res = Value::Null;
    let errors = Vec::new();

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
                    _ => {}
                }
            }
        }
        _ => {}
    }

    Calculations { res, errors }
}
