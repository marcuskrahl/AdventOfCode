#ifndef BOSS_FIGHT_HPP
#define BOSS_FIGHT_HPP

bool boss_fight(unsigned int player_health, unsigned int player_damage,unsigned int player_armor,unsigned int monster_health,unsigned int monster_damage, unsigned int monster_armor);

unsigned int find_lowest_gold_to_win(unsigned int monster_health, unsigned int monster_damage, unsigned int monster_armor);
unsigned int find_lowest_gold_to_lose(unsigned int monster_health, unsigned int monster_damage, unsigned int monster_armor);
#endif
