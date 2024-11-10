use num::pow::Pow;
use serde_json::{json, Value};

use crate::numbers;
use crate::numbers::power;

#[test]
pub fn abs() {
    let num_1 = json!(-1);
    let calc_1 = numbers::abs(Some(num_1));
    assert_eq!(calc_1.res, json!(1.));

    let undefined_abs = numbers::abs(None);
    assert_eq!(undefined_abs.res, Value::Null);
    assert_eq!(undefined_abs.errors.len(), 0);

    let null_abs = numbers::abs(Some(Value::Null));
    assert_eq!(null_abs.res, Value::Null);
    assert_eq!(null_abs.errors.len(), 0);

    let num_positive = json!(123.);
    let calc_2 = numbers::abs(Some(num_positive));
    assert_eq!(calc_2.res, json!(123.));
    assert_eq!(calc_2.errors.len(), 0);

    let vec_val = json!([1, 0, -111]);
    let calc_3 = numbers::abs(Some(vec_val));
    assert_eq!(calc_3.res, json!([1., 0., 111.]));
    assert_eq!(calc_3.errors.len(), 0);

    let mtx_val = json!([[-20, -10, 20], [10, 20, -10]]);
    let calc_4 = numbers::abs(Some(mtx_val));
    assert_eq!(calc_4.res, json!([[20., 10., 20.], [10., 20., 10.]]));
    assert_eq!(calc_4.errors.len(), 0);

    let inv_vec = vec![json!(2.), Value::Null, json!(-10.)];
    let calc = numbers::abs(Some(json!(inv_vec)));
    assert_eq!(calc.res, Value::Null);

    let invalid_inputs = vec![
        vec![json!(-2.), json!(10), Value::Null, json!(0.)],
        vec![Value::Null],
    ];
    invalid_inputs.iter().for_each(|input| {
        let val = json!(input);
        let calc = numbers::abs(Some(val));
        assert_eq!(calc.res, Value::Null);
    });
}

#[test]
pub fn power_tests() {
    let num_a = json!(2);
    let num_b = json!(3.);
    let expected = json!(2_f64.powf(3.));
    let calc_1 = power(Some(num_a), Some(num_b));
    assert_eq!(calc_1.res, expected);

    let a_null = Value::Null;
    let num_b = json!(2.);
    let calc_2 = power(Some(a_null), Some(num_b));
    assert_eq!(calc_2.res, Value::Null);

    let a_num = json!(6.23);
    let calc_3 = power(Some(a_num), None);
    assert_eq!(calc_3.res, Value::Null);

    let a_vec = json!([0., 1., 2., 3.]);
    let b_num = json!(3);
    let calc_4 = power(Some(a_vec.clone()), Some(b_num));
    assert_eq!(calc_4.res, json!([0., 1., 8., 27.]));

    let b_vec = json!([1., 2.]);
    let calc_5 = power(Some(b_vec), Some(a_vec));
    assert_eq!(calc_5.res, Value::Null);

    let a_mtx = json!([[1., 2., 3., 44.55], [2.2, 3.3, 4.4, 55.55]]);
    let b_num = json!(0);
    let calc_6 = power(Some(a_mtx), Some(b_num));
    assert_eq!(calc_6.res, json!([[1., 1., 1., 1.], [1., 1., 1., 1.]]));

    let negative_a = json!(-3);
    let b_num = json!(4);
    let calc_7 = power(Some(negative_a), Some(b_num));
    assert_eq!(calc_7.res, json!((-3_f64).powi(4)));

    let neg_a = json!(-2.);
    let b_num = json!(3);
    let calc_8 = power(Some(neg_a), Some(b_num));
    assert_eq!(calc_8.res, json!((-2_i32.pow(3)) as f64));

    let calc_9 = power(Some(json!(2.34)), Some(json!(0)));
    assert_eq!(calc_9.res, json!(1.));

    let float_a = json!(2.5);
    let int_b = json!(3);
    let expected = 2.5_f32.powi(3);
    let calc = power(Some(float_a), Some(int_b));
    assert_eq!(calc.res, json!(expected));

    let inputs = vec![(-1.001, 2.), (101., 4.)];

    inputs.iter().for_each(|(a, b)| {
        let val_a = json!(a);
        let val_b = json!(b);

        let exp = (*a).pow(b);
        let calc = power(Some(val_a), Some(val_b));
        assert_eq!(calc.res, json!(exp));
    });

    let inputs = vec![(2., -2., 0.25)];
    inputs.iter().for_each(|(a, b, exp)| {
        let val_a = json!(a);
        let val_b = json!(b);
        let exp_val = json!(exp);

        let calc = power(Some(val_a), Some(val_b));
        assert_eq!(calc.res, exp_val);
    });
}
