use transpose;

fn line_to_numbers(str: &str) -> Vec<u32>{
    str.split(" ").filter(|&s| !s.is_empty()).map(|n| n.parse().unwrap()).collect()
}
fn parse_triangle(str: &str) -> (u32, u32, u32) {
    let res = line_to_numbers(str);
    (res[0], res[1], res[2])
}

fn is_valid_triangle((a,b,c): (u32, u32, u32)) -> bool {
    a + b > c && a + c > b && b + c > a
}

pub fn part1(input: &String) -> u64 {
    input
        .trim()
        .split("\n")
        .map(|line| parse_triangle(line))
        .filter(|t| is_valid_triangle(*t))
        .count() as u64
}

pub fn part2(input: &String) -> u64 {
    let binding = input
        .trim()
        .split("\n")
        .map(|line| line_to_numbers(line))
        .collect::<Vec<Vec<u32>>>();
    let res: Vec<Vec<u32>>= binding
        .chunks(3)
        .map(|c| c.to_vec())
        .collect::<Vec<Vec<Vec<u32>>>>()
        .into_iter()
        .map(|c| {
            let input: Vec<u32> = c.iter().flatten().map(|i| *i).collect();
            let mut output = vec![0; 9];
            transpose::transpose(&input, &mut output, 3,3);
            output.chunks(3).map(|c| c.to_vec()).collect::<Vec<Vec<u32>>>()
        })
        .flatten()
        .collect()
        
    ;
    res.into_iter().filter(|c| is_valid_triangle((c[0],c[1],c[2]))).count() as u64
        /*        .filter(|c| is_valid_triangle((c[0],c[1],c[2])))
        .count();*/
}


#[test]
fn test_part1() {
    assert_eq!(is_valid_triangle((2,3,4)),true);
    assert_eq!(is_valid_triangle((2,3,6)),false);
}

#[test]
fn test_part2() {
    let input = String::from("
101 301 501
102 302 502
103 303 503
201 401 601
202 402 602
203 403 603");
    assert_eq!(part2(&input),6);
}
