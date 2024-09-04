use evalexpr::eval;
use serde::Serialize;

#[derive(Serialize)]
pub struct Calculations {
    success: bool,
    msg: String,
    res: String,
}

#[tauri::command]
pub fn evaluate_expression(expr: String) -> Calculations {
    let evaluation = eval(&expr);

    match evaluation {
        Ok(res) => {
            return Calculations {
                success: true,
                msg: String::from(""),
                res: res.to_string(),
            }
        }
        Err(err_msg) => {
            return Calculations {
                success: false,
                msg: err_msg.to_string(),
                res: String::from(""),
            }
        }
    }
}
