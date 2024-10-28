use serde_json::Value;

pub fn mtx_n_of_rows<T>(mtx: &Vec<Vec<T>>) -> usize {
    mtx.iter().count()
}

// returns None if not every row has the same number of entries
pub fn mtx_n_of_columns<T>(mtx: &Vec<Vec<T>>) -> Option<usize> {
    let mut n_of_col = 0;
    for vector in mtx.iter() {
        let n_of_entries = vector.len();
        if n_of_entries > n_of_col {
            n_of_col = n_of_entries;
        }
        if n_of_entries < n_of_col {
            return None;
        }
    }

    Some(n_of_col)
}

pub fn mtx_is_squared<T>(mtx: &Vec<Vec<T>>) -> bool {
    let rows = mtx_n_of_rows(mtx);
    let columns = mtx_n_of_columns(mtx);

    match columns {
        None => false,
        Some(n_of_col) => n_of_col == rows,
    }
}

pub fn mtx_from_json(input: Option<Value>) -> Option<Vec<Vec<f64>>> {
    match input {
        Some(Value::Array(array)) => {
            let mtx_num: Option<Vec<Vec<f64>>> = array
                .into_iter()
                .map(|entry| match entry {
                    Value::Array(vec) => {
                        let num_row_vec: Option<Vec<f64>> = vec
                            .into_iter()
                            .map(|e| match e {
                                Value::Number(num) => num.as_f64(),
                                _ => None,
                            })
                            .collect();

                        num_row_vec
                    }
                    _ => None,
                })
                .collect();
            mtx_num
        }
        _ => None,
    }
}
