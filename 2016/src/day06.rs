
struct Counter {
    counts: [u8; 26 * 8]
}

impl Counter {

    pub fn new() -> Counter {
        Counter {
            counts: [0; 26*8]
        }
    }

    pub fn add_count(&mut self, input: &str) -> () {
        for (pos, e) in input.chars().enumerate() {
            let index = pos * 26 + (((e as u32) - 97) as usize);
            self.counts[index] += 1;
        }
    }

    pub fn result(&self) -> String {
        let mut result = String::from("");
        for i in 0..8 {
            let slice = self.counts.iter().skip(i*26).take(26);
            let ( max_char, count) = slice.enumerate().max_by(|(_,a), (_,b)| a.cmp(b)).unwrap();
            if *count == 0 {
                continue;
            }
            result.push(((max_char as u8) + 97 ) as char);
        }
        result
    }

    pub fn result_min(&self) -> String {
        let mut result = String::from("");
        for i in 0..8 {
            let slice = self.counts.iter().skip(i*26).take(26);
            let res = slice.enumerate().filter(|(_, v)| **v > 0).min_by(|(_,a), (_,b)| a.cmp(b));
            match res {
                Some((pos, v)) => result.push(((pos as u8) + 97 ) as char),
                None => ()
            }
            
        }
        result
    }
}


pub fn part1(input: &String) -> String {
    let mut counter = Counter::new();
    input.trim().split("\n").for_each(|l| counter.add_count(l));
    counter.result()
}

pub fn part2(input: &String) -> String {
    let mut counter = Counter::new();
    input.trim().split("\n").for_each(|l| counter.add_count(l));
    counter.result_min()
}


#[test]
fn test_part1() {
    let input = String::from("
eedadn
drvtee
eandsr
raavrd
atevrs
tsrnev
sdttsa
rasrtv
nssdts
ntnada
svetve
tesnvt
vntsnd
vrdear
dvrsen
enarar");
    assert_eq!(part1(&input),"easter");
}

#[test]
fn test_part2() {
    let input = String::from("
eedadn
drvtee
eandsr
raavrd
atevrs
tsrnev
sdttsa
rasrtv
nssdts
ntnada
svetve
tesnvt
vntsnd
vrdear
dvrsen
enarar");
    assert_eq!(part2(&input),"advent");
}
