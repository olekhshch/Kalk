use serde_json::{Number, Value};

use crate::values::{in_domain, Calculations};

pub enum AngleFormat {
    DEG,
    RAD,
}

pub enum TrigonometricFn {
    SIN,
    COS,
    TG,
    CTG,
}

pub enum ReverseTrigFn {
    ASIN,
    ACOS,
    ATG,
}

// works with Numbers, Vectors and Matrices
pub fn convert_angle(a: Option<Value>, to: AngleFormat) -> Calculations {
    let mut res: Value = Value::Null;
    let mut errors = Vec::new();

    match a {
        Some(Value::Number(num)) => {
            if let Some(n_f64) = num.as_f64() {
                let res_f64 = match to {
                    AngleFormat::DEG => n_f64.to_degrees(),
                    AngleFormat::RAD => n_f64.to_radians(),
                };
                if let Some(res_value) = serde_json::Number::from_f64(res_f64) {
                    res = Value::Number(res_value)
                }
            }
        }

        // Vector
        Some(Value::Array(array)) if array.iter().all(|row| row.is_number()) => {
            let res_vector = vec_convert_angle(&array, &to);
            match res_vector {
                Some(vector) => res = Value::Array(vector),
                None => {
                    errors.push(format!("200"));
                }
            }
        }

        // Matrix
        Some(Value::Array(mtx)) => {
            let res_mtx: Option<Vec<Value>> = mtx
                .into_iter()
                .map(|v| {
                    if let Value::Array(row) = v {
                        let res_vec = vec_convert_angle(&row, &to);

                        match res_vec {
                            Some(vector) => Some(Value::Array(vector)),
                            None => {
                                errors.push(format!("200"));
                                None
                            }
                        }
                    } else {
                        errors.push(format!("200"));
                        None
                    }
                })
                .collect();

            match res_mtx {
                Some(mtx) => res = Value::Array(mtx),
                None => {}
            }
        }
        _ => {}
    }

    Calculations { res, errors }
}

fn vec_convert_angle(v: &Vec<Value>, to: &AngleFormat) -> Option<Vec<Value>> {
    let vector_res: Option<Vec<Value>> = v
        .into_iter()
        .map(|n| {
            if let Value::Number(entry) = n {
                if let Some(num) = entry.as_f64() {
                    let value_f64 = match to {
                        AngleFormat::DEG => num.to_degrees(),
                        AngleFormat::RAD => num.to_radians(),
                    };

                    match serde_json::Number::from_f64(value_f64) {
                        Some(res) => Some(Value::Number(res)),
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

    vector_res
}

pub fn trigonometric_fn(
    angle: Option<Value>,
    function: TrigonometricFn,
    angle_format: AngleFormat,
) -> Calculations {
    let mut res = Value::Null;
    let mut errors = Vec::new();

    match angle {
        Some(Value::Number(n)) => {
            let num_value = trig_fn_num(&Value::Number(n), &function, &angle_format);

            match num_value {
                Some(value) => res = value,
                None => errors.push(format!("101")),
            }
        }

        Some(Value::Array(vector)) if vector.iter().all(|n| n.is_number()) => {
            let res_vec = trig_fn_vec(&Value::Array(vector), &function, &angle_format);

            match res_vec {
                Some(value) => res = value,
                None => {
                    errors.push(format!("200"));
                }
            }
        }

        Some(Value::Array(matrix)) => {
            let res_mtx: Option<Vec<Value>> = matrix
                .into_iter()
                .map(|v| trig_fn_vec(&v, &function, &angle_format))
                .collect();

            match res_mtx {
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

fn trig_fn_num(
    angle: &Value,
    function: &TrigonometricFn,
    angle_format: &AngleFormat,
) -> Option<Value> {
    if let Value::Number(num) = angle {
        if let Some(n_f64) = num.as_f64() {
            let angle_rad = match angle_format {
                AngleFormat::DEG => n_f64.to_radians(),
                AngleFormat::RAD => n_f64,
            };
            let result = match function {
                TrigonometricFn::SIN => Some(angle_rad.sin()),
                TrigonometricFn::COS => Some(angle_rad.cos()),
                TrigonometricFn::TG => {
                    if angle_rad.cos().eq(&0.) {
                        None
                    } else {
                        Some(angle_rad.tan())
                    }
                }
                TrigonometricFn::CTG => {
                    if angle_rad.sin().eq(&0.) {
                        None
                    } else {
                        Some(1. / angle_rad.tan())
                    }
                }
            };

            match result {
                Some(res_f64) => match serde_json::Number::from_f64(res_f64) {
                    Some(value) => Some(Value::Number(value)),
                    None => None,
                },
                None => None,
            }
        } else {
            None
        }
    } else {
        None
    }
}

fn trig_fn_vec(v: &Value, function: &TrigonometricFn, angle_format: &AngleFormat) -> Option<Value> {
    if let Value::Array(vector) = v {
        let res_vector: Option<Value> = vector
            .into_iter()
            .map(|n| trig_fn_num(&n, &function, &angle_format))
            .collect();

        res_vector
    } else {
        None
    }
}

pub fn reverse_trigonometry(
    val: Option<Value>,
    function: ReverseTrigFn,
    angle_format: AngleFormat,
) -> Calculations {
    let mut res = Value::Null;
    let mut errors = Vec::new();

    match val {
        Some(Value::Number(n)) => {
            let res_num = reverse_trigonometry_number(&n, &function, &angle_format);

            match res_num {
                Some(value) => res = value,
                None => errors.push(format!("101")),
            }
        }
        Some(Value::Array(vec)) if vec.iter().all(|e| e.is_number()) => {
            let res_vec = reverse_trigonometry_vector(vec, &function, &angle_format);

            match res_vec {
                Some(values) => res = Value::Array(values),
                None => {}
            }
        }
        Some(Value::Array(mtx)) => {
            let res_mtx = reverse_trigonometry_mtx(mtx, &function, &angle_format);

            match res_mtx {
                Some(values) => res = Value::Array(values),
                None => {}
            }
        }
        _ => {}
    }

    Calculations { res, errors }
}

fn reverse_trigonometry_number(
    n: &Number,
    function: &ReverseTrigFn,
    angle_format: &AngleFormat,
) -> Option<Value> {
    let n_f64 = n.as_f64();
    if let Some(arg) = n_f64 {
        let res_0: Option<f64> = match function {
            ReverseTrigFn::ASIN => match in_domain(&arg, &Some(-1.), &Some(1.), true, true) {
                false => None,
                true => Some(arg.asin()),
            },
            &ReverseTrigFn::ACOS => match in_domain(&arg, &Some(-1.), &Some(1.), true, true) {
                false => None,
                true => Some(arg.atan()),
            },
            &ReverseTrigFn::ATG => Some(arg.atan()),
        };

        match res_0 {
            Some(angle_rad) => match angle_format {
                AngleFormat::RAD => Some(serde_json::json!(angle_rad)),
                AngleFormat::DEG => Some(serde_json::json!(angle_rad.to_degrees())),
            },
            None => None,
        }
    } else {
        None
    }
}

fn reverse_trigonometry_vector(
    vector: Vec<Value>,
    function: &ReverseTrigFn,
    angle_format: &AngleFormat,
) -> Option<Vec<Value>> {
    let res_vec: Option<Vec<Value>> = vector
        .into_iter()
        .map(|n| {
            if let Value::Number(num) = n {
                let res_num = reverse_trigonometry_number(&num, function, angle_format);
                match res_num {
                    Some(Value::Number(num_value)) => Some(Value::Number(num_value)),
                    _ => None,
                }
            } else {
                None
            }
        })
        .collect();

    res_vec
}

fn reverse_trigonometry_mtx(
    mtx: Vec<Value>,
    function: &ReverseTrigFn,
    angle_format: &AngleFormat,
) -> Option<Vec<Value>> {
    let res_mtx: Option<Vec<Value>> = mtx
        .into_iter()
        .map(|v| {
            if let Value::Array(v) = v {
                let vec_res = reverse_trigonometry_vector(v, function, angle_format);

                match vec_res {
                    Some(vec_values) => Some(Value::Array(vec_values)),
                    _ => None,
                }
            } else {
                None
            }
        })
        .collect();

    res_mtx
}
