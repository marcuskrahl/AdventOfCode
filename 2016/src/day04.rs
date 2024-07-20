
struct Room {
    name: String,
    sector_id: u64,
    checksum: String
}

impl Room {

    pub fn parse(input: &str) -> Room {
        let len = input.len();
        let checksum = &input[(len-6)..(len-1)];
        let sector_id: u64 = (&input[(len-10)..(len-7)]).parse().unwrap();
        let name = &input[0..(len-11)];
        Room {
            name: String::from(name),
            sector_id,
            checksum: String::from(checksum)
        }
    }

    pub fn is_real_room(&self) -> bool
    {
        let mut char_count = self
            .get_char_count()
            .to_vec();
        char_count
            .sort_by(|(_, count1), (_, count2)|  count2.cmp(count1));
        let top5: String= char_count.into_iter().take(5).map(|(c,_)| c).collect();
        top5 == self.checksum
    }

    fn get_char_count(&self) -> [(char, u8); 26] {
        let mut result = [(' ', 0); 26];
        let codes = self.name.chars().filter(|c| *c != '-');
        for code in codes {
            let index = code as usize - 97;
            let (_, curr) = result[index];
            result[index] = (code, curr+ 1);
        }
        result
    }

    pub fn decrypt(&self) -> String {
        self.name.chars().map(|c| self.decrypt_char(c)).collect()
    }

    fn decrypt_char(&self, c: char) -> char {
        if c == '-' {
            return ' ';
        }
        let mut c_num = (c as u32) - 97;
        c_num += (self.sector_id as u32 % 26);
        c_num = c_num % 26;
        (c_num + 97) as u8 as char
    }
}

pub fn part1(input: &String) -> u64 {
    input
        .trim()
        .split("\n")
        .map(|l| Room::parse(l))
        .filter(|r| r.is_real_room())
        .map(|r| r.sector_id)
        .sum()
}

pub fn part2(input: &String) -> u64 {
    input
        .trim()
        .split("\n")
        .map(|l| Room::parse(l))
        .filter(|r| r.decrypt().contains("north"))
        .next().unwrap().sector_id
}


#[test]
fn test_part1() {
    let input = String::from("
aaaaa-bbb-z-y-x-123[abxyz]
a-b-c-d-e-f-g-h-987[abcde]
not-a-real-room-404[oarel]
totally-real-room-200[decoy]
");
    assert_eq!(part1(&input),1514);
    assert_eq!(Room::parse("aaaaa-bbb-z-y-x-123[abxyz]").is_real_room(), true);
    assert_eq!(Room::parse("a-b-c-d-e-f-g-h-987[abcde]").is_real_room(), true);
    assert_eq!(Room::parse("not-a-real-room-404[oarel]").is_real_room(), true);
    assert_eq!(Room::parse("totally-real-room-200[decoy]").is_real_room(), false);
}

#[test]
fn test_part2() {
    assert_eq!(Room::parse("qzmt-zixmtkozy-ivhz-343[abcde]").decrypt(), "very encrypted name");
}
