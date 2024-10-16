use num::NumCast;
use serde::Serialize;
use serde_json::Value;

// utils to work with JSON values passed from frontend + common operations on values

// basic result struct returned by invoke handle to calculate node's value
#[derive(Serialize)]
pub struct Calculations {
    // pub suc: bool,
    pub res: Value,
    pub errors: Vec<String>,
}

// checks if number (f64, u32 etc) x is in domain [x_min; x_max]
pub fn in_domain<T: num::traits::Num + PartialOrd>(
    x: &T,
    x_min: &Option<T>,
    x_max: &Option<T>,
    min_included: bool,
    max_included: bool,
) -> bool {
    match (x_min, x_max) {
        (None, None) => true,
        (Some(min), None) => {
            if min_included {
                x.ge(&min)
            } else {
                x.gt(&min)
            }
        }
        (None, Some(max)) => {
            if max_included {
                x.le(&max)
            } else {
                x.lt(&max)
            }
        }
        (Some(min), Some(max)) => {
            let min_ok: bool = match min_included {
                true => x.ge(&min),
                false => x.gt(&min),
            };
            if (!min_ok) {
                false
            } else {
                let max_ok = match max_included {
                    true => x.le(&max),
                    false => x.lt(&max),
                };

                max_ok
            }
        }
        _ => false,
    }
}
