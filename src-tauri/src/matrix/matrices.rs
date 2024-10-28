use serde_json::{json, Value};

use crate::values::Calculations;

use super::props::{mtx_from_json, mtx_is_squared};

#[tauri::command]
pub fn transpose(m: Option<Value>) -> Calculations {
    let mut res = Value::Null;
    let mut errors = Vec::new();

    let mtx_num = mtx_from_json(m);

    match mtx_num {
        Some(matrix) => match mtx_is_squared(&matrix) {
            true => {
                let ref_mtx = matrix.clone();

                let transposed: Vec<Vec<f64>> = matrix
                    .into_iter()
                    .enumerate()
                    .map(|(r, row_vec)| {
                        let new_row: Vec<f64> = row_vec
                            .into_iter()
                            .enumerate()
                            .map(|(c, entry)| if r == c { entry } else { ref_mtx[c][r] })
                            .collect();
                        new_row
                    })
                    .collect();

                res = json!(transposed)
            }
            false => errors.push(format!("101")),
        },
        None => {
            errors.push(format!("101"));
        }
    }

    Calculations { res, errors }
}
