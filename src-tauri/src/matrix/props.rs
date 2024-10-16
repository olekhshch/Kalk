pub fn mtx_n_of_rows<T: PartialOrd>(mtx: &Vec<Vec<T>>) -> usize {
    mtx.iter().count()
}

// returns None if not every row has the same number of entries
pub fn mtx_n_of_columns<T: PartialOrd>(mtx: &Vec<Vec<T>>) -> Option<usize> {
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

pub fn mtx_is_square<T: PartialOrd>(mtx: &Vec<Vec<T>>) -> bool {
    let rows = mtx_n_of_rows(mtx);
    let columns = mtx_n_of_columns(mtx);

    match columns {
        None => false,
        Some(n_of_col) => n_of_col == rows,
    }
}
