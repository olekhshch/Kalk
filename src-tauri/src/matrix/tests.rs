use serde_json::{json, Value};

use super::matrices::{multiply_matrices, transpose};

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

    let undefined_res = transpose(None);
    assert_eq!(undefined_res.res, Value::Null);

    let non_sqr_mtx = json!([[1., 2.], [3., 4.], [5., 6.]]);
    let transposed_non_sqr = transpose(Some(non_sqr_mtx)).res;
    let expected = json!([[1., 3., 5.], [2., 4., 6.]]);
    assert_eq!(transposed_non_sqr, expected);

    let vector = json!([1, 2, 3]);
    let transposed_vector = transpose(Some(vector)).res;
    assert_eq!(transposed_vector, Value::Null)
}

#[test]
pub fn mtx_multiplication() {
    let mtx_a = json!([[2., 0.], [1., 1.]]);
    let mtx_b = json!([[1., 0], [3., 1.]]);

    let expected_1 = json!([[2., 0.], [4., 1.]]);
    let mtx_c = multiply_matrices(Some(mtx_a), Some(mtx_b.clone())).res;
    assert_eq!(mtx_c, expected_1, "2x2 * 2x2, both valid");

    let vec_a = json!([1, 2]);
    let mtx_c = multiply_matrices(Some(vec_a), Some(mtx_b)).res;
    assert_eq!(mtx_c, Value::Null, "Vec * mtx");

    let mtx3x4 = json!([[1, 0, 2, -3], [0, 2, 2, 2], [-10, 11, 1, 1]]);
    let mtx4x2 = json!([[10, -2], [1, 2], [1, 1], [0, -1]]);
    let expected_2 = json!([[12., 3.], [4., 4.], [-88., 42.]]);
    let mtx3x2 = multiply_matrices(Some(mtx3x4), Some(mtx4x2.clone())).res;
    assert_eq!(mtx3x2, expected_2, "3x4 * 4x2 = 3x2, valid");

    let mtx1x1 = json!([[101.]]);
    let mtx_c = multiply_matrices(Some(mtx4x2), Some(mtx1x1)).res;
    assert_eq!(mtx_c, Value::Null, "4x2 * 1x1 (invalid)");

    let vec_a = json!([1., 2., 3.]);
    let vec_b = json!([10.]);
    let vec_mult = multiply_matrices(Some(vec_a), Some(vec_b)).res;
    assert_eq!(
        vec_mult,
        Value::Null,
        "vec * vec as mtx multiplication, invalid"
    );
}
