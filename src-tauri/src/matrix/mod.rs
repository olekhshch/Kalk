use serde_json::Value;

use crate::values::Calculations;

// creates identity matrix with the size n
#[tauri::command]
pub fn make_identity_mtx(n: Option<Value>) -> Calculations {
    let mut res = Value::Null;
    let errors = Vec::new();

    // n can only be a number
    match n {
        Some(Value::Number(num)) => {
            // number is integer
            if let Some(n_int) = num.as_u64() {
                let mut mtx: Vec<Value> = Vec::new();

                for i in 0..n_int {
                    let mut vector: Vec<Value> = Vec::new();

                    for j in 0..n_int {
                        let entry: i8 = if j == i { 1 } else { 0 };

                        vector.push(Value::Number(serde_json::Number::from(entry)))
                    }

                    let vector_serde = Value::Array(vector);

                    mtx.push(vector_serde);
                }

                res = Value::Array(mtx)
            }
        }
        _ => {}
    }

    Calculations { res, errors }
}
