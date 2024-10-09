use std::vec;

use serde_json::Value;

use crate::values::Calculations;

// creates identity matrix with the size n
#[tauri::command]
pub fn make_identity_mtx(n: Option<Value>) -> Calculations {
    let mut res = Value::Null;
    let mut errors = Vec::new();

    // n can only be a number
    match n {
        Some(Value::Number(num)) => {
            // number is integer
            if let Some(n_int) = num.as_u64() {
                if n_int < 1 {
                    errors.push(format!("300"))
                } else {
                    let mtx = i_mtx(n_int);

                    res = Value::Array(mtx)
                }
            } else if let Some(float) = num.as_f64() {
                let floored_n = float.floor() as u64;

                if floored_n.lt(&1) {
                    errors.push(format!("300"));
                } else {
                    let mtx = i_mtx(floored_n);
                    res = Value::Array(mtx);
                }
            }
        }
        Some(_) => errors.push(format!("101")),
        _ => {}
    }

    Calculations { res, errors }
}

fn i_mtx(n: u64) -> Vec<Value> {
    let mut mtx: Vec<Value> = Vec::new();

    for i in 0..n {
        let mut vector: Vec<Value> = Vec::new();

        for j in 0..n {
            let entry: i8 = if j == i { 1 } else { 0 };

            vector.push(Value::Number(serde_json::Number::from(entry)))
        }

        let vector_serde = Value::Array(vector);

        mtx.push(vector_serde);
    }

    mtx
}

#[tauri::command]
pub fn scalar_multiplication(a: Option<Value>, v: Option<Value>) -> Calculations {
    let mut res = Value::Null;
    let mut errors = Vec::new();

    match a {
        Some(Value::Number(a_num)) => {
            if let Some(a_f64) = a_num.as_f64() {
                match v {
                    Some(Value::Array(vector)) if vector.iter().all(|n| n.is_number()) => {
                        let res_vec: Option<Vec<Value>> = scalar_mult_vec(&vector, &a_f64);

                        match res_vec {
                            Some(result) => res = Value::Array(result),
                            None => errors.push(format!("200")),
                        }
                    }

                    Some(Value::Array(matrix)) => {
                        let mtx = scalar_mult_mtx(&matrix, &a_f64);

                        match mtx {
                            Some(values) => res = Value::Array(values),
                            None => errors.push(format!("200")),
                        }
                    }

                    Some(_) => errors.push(format!("101")),
                    _ => {}
                }
            }
        }
        Some(_) => {
            errors.push(format!("201"));
        }
        _ => {}
    }

    Calculations { res, errors }
}

fn scalar_mult_vec(v: &Vec<Value>, a: &f64) -> Option<Vec<Value>> {
    let vec_res: Option<Vec<Value>> = v
        .into_iter()
        .map(|n| {
            if let Value::Number(num) = n {
                if let Some(n_f64) = num.as_f64() {
                    match serde_json::Number::from_f64(n_f64 * a) {
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

    vec_res
}

fn scalar_mult_mtx(mtx: &Vec<Value>, a: &f64) -> Option<Vec<Value>> {
    let mtx_res: Option<Vec<Value>> = mtx
        .into_iter()
        .map(|v| {
            if let Value::Array(vector) = v {
                let vec_row = scalar_mult_vec(vector, a);
                match vec_row {
                    Some(vals) => Some(Value::Array(vals)),
                    None => None,
                }
            } else {
                None
            }
        })
        .collect();

    mtx_res
}

#[tauri::command]
pub fn add_vecs_matrices(a: Option<Value>, b: Option<Value>) -> Calculations {
    let mut res = Value::Null;
    let mut errors = Vec::new();

    match (a, b) {
        (Some(Value::Array(vec_a)), Some(Value::Array(vec_b))) => {
            // checking if both are vectors
            let is_vec_a = vec_a.iter().all(|n| n.is_number());
            let is_vec_b = vec_a.iter().all(|n| n.is_number());

            match (is_vec_a, is_vec_b) {
                (true, true) => {
                    if vec_a.len() == vec_b.len() {
                        let res_vec: Option<Vec<Value>> = add_vectors(&vec_a, &vec_b);

                        if let Some(result) = res_vec {
                            res = Value::Array(result);
                        }
                    } else {
                        errors.push(String::from("202"));
                    }
                }
                (true, false) | (false, true) => errors.push(String::from("203")),
                (false, false) => {
                    // two matrices
                    if vec_a.len() == vec_b.len() {
                        let mtx_res: Option<Vec<Value>> = add_matrices(&vec_a, &vec_b);

                        match mtx_res {
                            Some(val_mtx) => res = Value::Array(val_mtx),
                            None => {}
                        }
                    } else {
                        errors.push(String::from("202"))
                    }
                }
            }
        }
        (Some(_), Some(_)) => errors.push(String::from("101")),
        _ => {}
    }

    Calculations { res, errors }
}

fn add_vectors(v1: &Vec<Value>, v2: &Vec<Value>) -> Option<Vec<Value>> {
    let res_vec: Option<Vec<Value>> = v1
        .into_iter()
        .enumerate()
        .map(|(idx, val_1)| {
            let val_2 = &v2[idx];
            match (val_1.as_f64(), val_2.as_f64()) {
                (Some(num_a), Some(num_b)) => match serde_json::Number::from_f64(num_a + num_b) {
                    Some(val) => Some(Value::Number(val)),
                    _ => None,
                },
                _ => None,
            }
        })
        .collect();

    res_vec
}

fn add_matrices(mtx_1: &Vec<Value>, mtx_2: &Vec<Value>) -> Option<Vec<Value>> {
    let res_mtx: Option<Vec<Value>> = mtx_1
        .into_iter()
        .enumerate()
        .map(|(idx, arr_1)| {
            let arr_2 = &mtx_2[idx];
            match (arr_1.as_array(), arr_2.as_array()) {
                (Some(vec_1), Some(vec_2)) => {
                    let added_vec = add_vectors(vec_1, vec_2);
                    match added_vec {
                        Some(vec_val) => Some(Value::Array(vec_val)),
                        None => None,
                    }
                }
                _ => None,
            }
        })
        .collect();

    res_mtx
}

#[tauri::command]
pub fn sum_all(a: Option<Value>) -> Calculations {
    let mut res = Value::Null;
    let mut errors = Vec::new();

    match a {
        Some(Value::Array(array)) => {
            let sum_f64: Option<f64> = array
                .into_iter()
                .map(|entry| match entry {
                    Value::Number(n) => n.as_f64(),
                    Value::Array(vec) => {
                        let vec_sum = sum_vec_entries(&vec);
                        vec_sum
                    }
                    _ => None,
                })
                .sum();

            if let Some(sum) = sum_f64 {
                if let Some(sum_value) = serde_json::Number::from_f64(sum) {
                    res = Value::Number(sum_value);
                }
            }
        }
        Some(_) => errors.push(String::from("101")),
        _ => {}
    }

    Calculations { res, errors }
}

fn sum_vec_entries(vec: &Vec<Value>) -> Option<f64> {
    let vec_f64_sum: Option<f64> = vec
        .into_iter()
        .map(|num| match num {
            Value::Number(n) => {
                if let Some(n_f64) = n.as_f64() {
                    Some(n_f64)
                } else {
                    None
                }
            }
            _ => None,
        })
        .sum();

    vec_f64_sum
}
