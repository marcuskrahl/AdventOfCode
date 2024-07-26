#[derive(Debug)]
enum Mode {
    Normal,
    Skip(u64),
    MarkerLeft(u64),
    MarkerRight(u64, u64)
}

fn decompress(input: &str) -> u64 {
    let mut count = 0;
    let mut mode = Mode::Normal;
    for c in input.chars().filter(|c| !c.is_whitespace()) {
        //println!("{} {:?}", c, mode);
        match (&mode, c) {
            (Mode::Normal, '(') => {
                mode = Mode::MarkerLeft(0);
            },
            (Mode::Normal, _) => {
                count += 1;
            }, 
            (Mode::Skip(1), _) => {
                mode = Mode::Normal;
            }
            (Mode::Skip(v), _) => {
                mode = Mode::Skip(v -1);
            },
            (Mode::MarkerLeft(l), 'x') => {
                mode = Mode::MarkerRight(*l, 0)
            },
            (Mode::MarkerLeft(l), d) => {
                mode = Mode::MarkerLeft(l * 10 + (d as u64) - 48)
            },
            (Mode::MarkerRight(l,r), ')') => {
                count += l * r;
                mode = Mode::Skip(*l);
            },
            (Mode::MarkerRight(l, r), d) => {
                mode = Mode::MarkerRight(*l, r * 10 + (d as u64) - 48);
            } 
        }
    }
    count
}

struct Factor {
    factor: u64,
    steps: u64
}

impl Factor {
    pub fn advance_by(&mut self, advance_count: u64) -> u64 {
        if self.steps < advance_count{
            self.steps = 0;
            1
        } else {
            self.steps -= advance_count;
            self.factor
        } 
    }
    pub fn advance(&mut self) -> u64 {
        self.advance_by(1)
    }
}

fn advance_factors(factors: &mut Vec<Factor>, advance_count: u64) -> () {
    for factor in factors.iter_mut() {
        factor.advance_by(advance_count);
    }
    loop {
        let last = factors.last();
        if last.is_none() {
            break;
        }
        if last.unwrap().steps > 0 {
            break;
        }
        factors.pop();
    }
}

fn decompress2(input: &str) -> u64 {
    let mut count = 0;
    let mut chars = input.chars().filter(|c| !c.is_whitespace());
    let mut factors: Vec<Factor> = Vec::new();
    loop {
        let c = chars.next();
        if c.is_none() {
            break;
        }
        let c = c.unwrap();
        if c != '(' {
            let mut total = 1;
            for factor in &mut factors {
                total *= factor.advance() 
            }
            count += total;
            continue;
        } else {
            let mut factor = 0; 
            let mut steps = 0;
            
            let mut advance_count = 1;

            loop {
                let next_c = chars.next().unwrap();
                advance_count += 1;
                if next_c == 'x' {
                    break;
                } else {
                    steps = steps * 10 + (next_c as u64) - 48;
                }
            }

            loop {
                let next_c = chars.next().unwrap();
                advance_count += 1;
                if next_c == ')' {
                    break;
                } else {
                    factor = factor * 10 + (next_c as u64) - 48;
                }
            }
            advance_factors(&mut factors, advance_count);
            factors.push(Factor { factor, steps});
        }

    }
    count
}

pub fn part1(input: &String) -> u64 {
    decompress(input)
}

pub fn part2(input: &String) -> u64 {
    decompress2(input)
}


#[test]
fn test_part1() {
    assert_eq!(decompress("ADVENT"), 6);
    assert_eq!(decompress("A(1x5)BC"), 7);
    assert_eq!(decompress("(3x3)XYZ"), 9);
    assert_eq!(decompress("A(2x2)BCD(2x2)EFG"), 11);
    assert_eq!(decompress("(6x1)(1x3)A"), 6);
    assert_eq!(decompress("X(8x2)(3x3)ABCY"), 18);
}

#[test]
fn test_part2() {
    assert_eq!(decompress2("(3x3)XYZ"), 9);
    assert_eq!(decompress2("X(8x2)(3x3)ABCY"), 20);
    assert_eq!(decompress2("(27x12)(20x12)(13x14)(7x10)(1x12)A"), 241920);
    assert_eq!(decompress2("(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN"), 445);
}
