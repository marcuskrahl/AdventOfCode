#include "BossFight.hpp"

#include <vector>

#define WEAPON 1
#define ARMOR 2
#define RINGS 3

bool boss_fight(unsigned int player_health, unsigned int player_damage,unsigned int player_armor,unsigned int monster_health,unsigned int monster_damage, unsigned int monster_armor) {
    while(true) {
        unsigned int dealt_damage = player_damage <= monster_armor ? 1 : player_damage - monster_armor;
        if (dealt_damage >= monster_health) { 
            return true;     
        } else {
            monster_health -= dealt_damage;
        }
        dealt_damage = monster_damage <= player_armor ? 1 : monster_damage - player_armor;
        if (dealt_damage >= player_health) { 
            return false;     
        } else {
            player_health -= dealt_damage;
        }
    }
}

unsigned int find_lowest_gold_to_win(unsigned int monster_health, unsigned int monster_damage, unsigned int monster_armor) {
    std::vector<std::vector<unsigned int>> equipment;
    equipment.push_back({0,0,0,WEAPON});
    equipment.push_back({4,0,8,WEAPON});
    equipment.push_back({5,0,10,WEAPON});
    equipment.push_back({6,0,25,WEAPON});
    equipment.push_back({7,0,40,WEAPON});
    equipment.push_back({8,0,74,WEAPON});

    equipment.push_back({0,0,0,ARMOR});
    equipment.push_back({0,1,13,ARMOR});
    equipment.push_back({0,2,31,ARMOR});
    equipment.push_back({0,3,53,ARMOR});
    equipment.push_back({0,4,75,ARMOR});
    equipment.push_back({0,5,102,ARMOR});

    equipment.push_back({0,0,0,RINGS});
    equipment.push_back({1,0,25,RINGS});
    equipment.push_back({2,0,50,RINGS});
    equipment.push_back({3,0,100,RINGS});
    equipment.push_back({0,1,20,RINGS});
    equipment.push_back({0,2,40,RINGS});
    equipment.push_back({0,3,80,RINGS});

    for(std::size_t i = 13; i<= 17; i++) {
        for(std::size_t j = i+1; j<= 18; j++) {
            unsigned int total_damage = equipment[i][0]+equipment[j][0];
            unsigned int total_armor = equipment[i][1]+equipment[j][1];
            unsigned int total_cost = equipment[i][2]+equipment[j][2];
            equipment.push_back({total_damage,total_armor,total_cost,RINGS});
        }
    }

    unsigned int min_gold_to_beat = 999999;
    for (std::size_t i = 0; i < equipment.size();i++) {
        if (equipment[i][3] != WEAPON) {
            continue;
        }
        for (std::size_t j = 0; j < equipment.size();j++) {
            if (equipment[j][3] != ARMOR) {
                continue;
            }
            for (std::size_t k = 0; k < equipment.size();k++) {
                if (equipment[k][3] != RINGS) {
                    continue;
                }
                unsigned int total_damage = equipment[i][0] + equipment[k][0];
                unsigned int total_armor = equipment[j][1] + equipment[k][1];
                unsigned int total_cost = equipment[i][2] + equipment[j][2] + equipment[k][2];
                if (total_cost < min_gold_to_beat) {
//                    std::cout << total_damage << " " << total_armor << " " << total_cost << std::endl;
                    if (boss_fight(100,total_damage,total_armor,monster_health,monster_damage,monster_armor)) {
                        min_gold_to_beat = total_cost;
                    }
                }
            }
        }
    }
    return min_gold_to_beat;
}

unsigned int find_lowest_gold_to_lose(unsigned int monster_health, unsigned int monster_damage, unsigned int monster_armor) {
    std::vector<std::vector<unsigned int>> equipment;
    equipment.push_back({4,0,8,WEAPON});
    equipment.push_back({5,0,10,WEAPON});
    equipment.push_back({6,0,25,WEAPON});
    equipment.push_back({7,0,40,WEAPON});
    equipment.push_back({8,0,74,WEAPON});

    equipment.push_back({0,0,0,ARMOR});
    equipment.push_back({0,1,13,ARMOR});
    equipment.push_back({0,2,31,ARMOR});
    equipment.push_back({0,3,53,ARMOR});
    equipment.push_back({0,4,75,ARMOR});
    equipment.push_back({0,5,102,ARMOR});

    equipment.push_back({0,0,0,RINGS});
    equipment.push_back({1,0,25,RINGS});
    equipment.push_back({2,0,50,RINGS});
    equipment.push_back({3,0,100,RINGS});
    equipment.push_back({0,1,20,RINGS});
    equipment.push_back({0,2,40,RINGS});
    equipment.push_back({0,3,80,RINGS});

    for(std::size_t i = 12; i<= 16; i++) {
        for(std::size_t j = i+1; j<= 17; j++) {
            unsigned int total_damage = equipment[i][0]+equipment[j][0];
            unsigned int total_armor = equipment[i][1]+equipment[j][1];
            unsigned int total_cost = equipment[i][2]+equipment[j][2];
            equipment.push_back({total_damage,total_armor,total_cost,RINGS});
        }
    }

    unsigned int min_gold_to_beat = 0;
    for (std::size_t i = 0; i < equipment.size();i++) {
        if (equipment[i][3] != WEAPON) {
            continue;
        }
        for (std::size_t j = 0; j < equipment.size();j++) {
            if (equipment[j][3] != ARMOR) {
                continue;
            }
            for (std::size_t k = 0; k < equipment.size();k++) {
                if (equipment[k][3] != RINGS) {
                    continue;
                }
                unsigned int total_damage = equipment[i][0] + equipment[k][0];
                unsigned int total_armor = equipment[j][1] + equipment[k][1];
                unsigned int total_cost = equipment[i][2] + equipment[j][2] + equipment[k][2];
                if (total_cost > min_gold_to_beat) {
//                    std::cout << total_damage << " " << total_armor << " " << total_cost << std::endl;
                    if (!boss_fight(100,total_damage,total_armor,monster_health,monster_damage,monster_armor)) {
                        min_gold_to_beat = total_cost;
                    }
                }
            }
        }
    }
    return min_gold_to_beat;
}
