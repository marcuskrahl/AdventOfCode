use md5;

fn get_password_hash(input: &str) -> u64 {
    let mut rounds = 0;
    let mut pos = 0;
    let mut hash: u64 = 0;
    while rounds < 8 {
        if pos % 1_000_000 == 0 {
            //println!("{}", pos);
        }
        let hash_input = format!("{}{}", input, pos);
        let digest= md5::compute(&hash_input); 
        let bytes = <[u8;16]>::from(digest);
        pos += 1;
        if bytes[0] == 0 && bytes[1] == 0 && bytes[2] < 16 {
            //println!("{}", pos);
            hash = hash * 16 + bytes[2] as u64;
            //println!("{:x}", hash);
            rounds = rounds + 1;
        }
        //println!("{:?}", current);
    }
    hash

}

fn get_password_hash_2(input: &str) -> u64 {
    let mut rounds = 0;
    let mut pos = 0;
    let mut hash: u64 = 0;
    let mut result: [u8; 8] = [255; 8];
    while rounds < 8 {
        if pos % 1_000_000 == 0 {
            //println!("{}", pos);
        }
        let hash_input = format!("{}{}", input, pos);
        let digest= md5::compute(&hash_input); 
        let bytes = <[u8;16]>::from(digest);
        if bytes[0] == 0 && bytes[1] == 0 && bytes[2] < 16 {
            //println!("{}", pos);
            let byte_pos = bytes[2] as usize;
            if byte_pos < 8 && result[byte_pos] == 255 {
                result[byte_pos] = bytes[3] >> 4;
                //println!("{:?}", result);
                rounds = rounds + 1;
            }
        }
        pos += 1;
        //println!("{:?}", current);
    }
    result[7] as u64
        + ((result[6] as u64) << 4)
        + ((result[5] as u64) << 8 )
        + ((result[4] as u64) << 12)
        + ((result[3] as u64) << 16)
        + ((result[2] as u64) << 20)
        + ((result[1] as u64) << 24)
        + ((result[0] as u64) << 28)

}

pub fn part1(input: &String) -> String {
    let hash = get_password_hash(input.trim());
    format!("{:x}",hash)
}

pub fn part2(input: &String) -> String {
    let hash = get_password_hash_2(input.trim());
    format!("{:x}",hash)
}


#[test]
fn test_part1() {
    let input = String::from("abc");
    //assert_eq!(part1(&input),"18f47a30");
}

#[test]
fn test_part2() {
    let input = String::from("abc");
    assert_eq!(part2(&input),"5ace8e3");
}
