use serde_json::json;

use crate::numbers::{ceil, floor, round};

#[test]
pub fn rounding_integers() {
    let integers = vec![1, 3, -4, 51, 2000, -132212, 0, -10101];

    integers.iter().for_each(|int| {
        let int_val = json!(int);
        let calc_floor = floor(Some(int_val.clone()));
        let calc_ceil = ceil(Some(int_val.clone()));
        let calc_round = round(Some(int_val));
        assert_eq!(calc_floor.res, json!(f64::from(*int)));
        assert_eq!(calc_ceil.res, calc_floor.res);
        assert_eq!(calc_round.res, json!(f64::from(*int)));
        assert_eq!(calc_floor.res, calc_round.res);
    });
}

#[test]
pub fn rounding_floats() {
    let integers_as_floats = vec![1., 2., -20., -23., 102.];

    integers_as_floats.iter().for_each(|num| {
        let val = json!(num);
        let calc_floor = floor(Some(val.clone()));
        let calc_ceil = ceil(Some(val.clone()));
        let calc_round = round(Some(val.clone()));

        assert_eq!(calc_floor.res, val);
        assert_eq!(calc_ceil.res, val);
        assert_eq!(calc_round.res, val);
    });
}
