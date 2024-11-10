use std::vec;

use serde_json::{json, Value};

use crate::{
    numbers::{divide, multiply, subtract},
    // values::Calculations,
};

use super::add;

mod operations;
mod rounding;

#[test]
pub fn arithmetic_invalid_values() {
    let add_nulls = add(Some(Value::Null), Some(Value::Null));
    assert_eq!(add_nulls.res, Value::Null);

    let add_undefined = add(None, None);
    assert_eq!(add_undefined.res, Value::Null);

    let num_1 = serde_json::Number::from(1);
    let add_num_undefined = add(None, Some(Value::Number(num_1)));
    assert_eq!(add_num_undefined.res, Value::Null);

    let vector = serde_json::json!([0, 1, 2]);
    let number = serde_json::json!(100);
    let number_2 = number.clone();
    let divide_1 = divide(Some(vector), Some(number));
    assert_eq!(divide_1.res, Value::Null);

    let zero = serde_json::json!(0);
    let divide_2 = divide(Some(number_2), Some(zero));
    assert_eq!(divide_2.res, Value::Null);
}

#[test]
pub fn simple_arythmetics() {
    let n_1_f64 = 1.;
    let n_2_f64 = 2.;
    let add_1_f64 = n_1_f64 + n_2_f64;

    let n1_val = serde_json::json!(n_1_f64);
    let n2_val = serde_json::json!(n_2_f64);
    let res_val = serde_json::json!(add_1_f64);
    let add_1 = add(Some(n1_val), Some(n2_val));
    assert_eq!(add_1.res, res_val);

    let mul_1_f64 = add_1_f64 * n_2_f64;
    let mul_val = serde_json::json!(mul_1_f64);
    let mul_1 = multiply(Some(serde_json::json!(n_2_f64)), Some(res_val));
    assert_eq!(mul_1.res, mul_val);

    let a = serde_json::json!(-2);
    let b = serde_json::json!(9.);
    let c = a.clone();
    let d = b.clone();
    let expected = serde_json::json!(9. - 2.);
    let expected_2 = serde_json::json!(9. + 2.);

    let add_2 = add(Some(a), Some(b));
    let sub_1 = subtract(Some(d), Some(c));
    assert_eq!(add_2.res, expected);
    assert_eq!(sub_1.res, expected_2);

    let mul_on_zero = multiply(Some(serde_json::json!(23.45)), Some(serde_json::json!(0)));
    assert_eq!(mul_on_zero.res, serde_json::json!(0.));
}

#[test]
fn with_state() {
    let n1 = 11.2;
    let n2 = 2;
    let n3 = n1 + (n2 as f64);

    let n3_calc = add(Some(json!(n1)), Some(json!(n2)));
    assert_eq!(n3_calc.res, json!(n3))
}
