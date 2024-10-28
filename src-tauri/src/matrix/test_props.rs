use num::traits::ops::inv;
use serde_json::{json, Value};

use crate::matrix::props::{mtx_from_json, mtx_is_squared, mtx_n_of_columns, mtx_n_of_rows};

#[test]
pub fn basic_operations() {
    let vec1 = vec![1., 2., 3.];
    let vec1_json = json!(&vec1);

    let vec2 = vec![0, 11, 25];
    let vec2_json = json!(&vec2);

    let vec3 = vec![1, 237, -65];
    let vec3_json = json!(&vec3);

    let mtx1 = vec![vec![1, 2, 3], vec![0, 11, 23], vec![30, 20, 19]];

    let row_num_mtx1 = mtx_n_of_rows(&mtx1);
    assert_eq!(row_num_mtx1, 3);

    let col_num_mtx1 = mtx_n_of_columns(&mtx1);
    assert_eq!(col_num_mtx1, Some(3));

    let invalid_mtx = vec![vec![1, 2, 3], vec![1, 0, 0], vec![1]];
    let row_num_invalid = mtx_n_of_rows(&invalid_mtx);
    let col_num_invalid = mtx_n_of_columns(&invalid_mtx);
    assert_eq!(row_num_invalid, 3, "number of rows in unvalid matrix");
    assert_eq!(
        col_num_invalid, None,
        "num of cols in invalid matrix = None"
    );

    let is_sqr_mtx1 = mtx_is_squared(&mtx1);
    let is_sqr_invalid = mtx_is_squared(&invalid_mtx);
    assert_eq!(is_sqr_mtx1, true);
    assert_eq!(is_sqr_invalid, false);

    let mtx1_json = json!(&mtx1);
    let mtx2 = mtx_from_json(Some(mtx1_json)); // mtx2 should be the same as mtx1
    assert_ne!(mtx2, None);

    if let Some(matrix_2) = mtx2 {
        let rows_mtx2 = mtx_n_of_rows(&matrix_2);
        let cols_mtx2 = mtx_n_of_columns(&matrix_2);

        assert_eq!(rows_mtx2, 3);
        assert_eq!(cols_mtx2, Some(3));
    }
}
