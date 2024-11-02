use serde_json::{json, Value};

use crate::values::Calculations;

use super::props::{mtx_from_json, mtx_n_of_columns, mtx_n_of_rows};

#[tauri::command]
pub fn transpose(m: Option<Value>) -> Calculations {
    let mut res = Value::Null;
    let mut errors = Vec::new();

    let mtx_num = mtx_from_json(m);

    match mtx_num {
        Some(matrix) => {
            // let ref_mtx = matrix.clone();
            let col_num = mtx_n_of_columns(&matrix);

            if let Some(cols) = col_num {
                let mut transposed: Vec<Vec<f64>> = vec![];

                for j in 0..cols {
                    let mut new_row_vec = vec![];
                    for row_vec in matrix.iter() {
                        let entry = row_vec[j];
                        new_row_vec.push(entry);
                    }
                    transposed.push(new_row_vec);
                }

                res = json!(transposed)
            }
        }

        None => {
            errors.push(format!("101"));
        }
    }

    Calculations { res, errors }
}

#[tauri::command]
pub fn multiply_matrices(a: Option<Value>, b: Option<Value>) -> Calculations {
    let mut res = Value::Null;
    let mut errors = vec![];

    let mtx_a = mtx_from_json(a);
    let mtx_b = mtx_from_json(b);

    match (mtx_a, mtx_b) {
        (Some(matrix_a), Some(matrix_b)) => {
            let cols_a = mtx_n_of_columns(&matrix_a).unwrap_or(0);
            let rows_a = mtx_n_of_rows(&matrix_a);
            let rows_b = mtx_n_of_rows(&matrix_b);
            let cols_b = mtx_n_of_columns(&matrix_b).unwrap_or(0);

            if cols_a == rows_b && cols_b > 0 {
                let mut res_mtx: Vec<Vec<f64>> = vec![];

                for i in 0..rows_a {
                    let mut new_row_vec = vec![];

                    for j in 0..cols_b {
                        let row_vec = matrix_a[i].clone();
                        let entry =
                            row_vec
                                .into_iter()
                                .enumerate()
                                .fold(0., |acc, (idx, entry_a)| {
                                    let entry_b = matrix_b[idx][j];
                                    acc + entry_a * entry_b
                                });
                        // if let Some(entry_number) = entry {
                        // }
                        new_row_vec.push(entry);
                    }
                    res_mtx.push(new_row_vec);
                }

                res = json!(res_mtx);
            }
        }
        _ => {}
    }

    Calculations { res, errors }
}
