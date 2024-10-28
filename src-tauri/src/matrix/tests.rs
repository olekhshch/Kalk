use serde_json::{json, Value};

use super::matrices::transpose;

#[test]
pub fn transpose_mtx_scenarios() {
    let mtx1 = json!([[1, 2, 3], [10, 20, 30], [100, 200, 300]]);
    let correct_transpose = json!([[1., 10., 100.], [2., 20., 200.], [3., 30., 300.]]);

    let transposed_mtx1 = transpose(Some(mtx1));
    assert_eq!(transposed_mtx1.res, correct_transpose);

    let number = json!(2.03);
    let transpose_num = transpose(Some(number));
    assert_eq!(transpose_num.res, Value::Null);

    let null_val = json!(null);
    let transpose_null = transpose(Some(null_val));
    assert_eq!(transpose_null.res, Value::Null);
}
