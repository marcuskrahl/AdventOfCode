use std::{fs, time::Instant};

mod day02;

fn main() {

    let input =  fs::read_to_string("input/day02.txt").unwrap();
    println!("Start");
    
    let start = Instant::now();
    println!("part 1: {}", day02::part1(&input));
    println!("part 2: {}", day02::part2(&input));
    println!("Time: {:?}", start.elapsed())
}
