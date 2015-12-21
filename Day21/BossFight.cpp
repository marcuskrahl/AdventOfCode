#include "BossFight.hpp"

bool boss_fight(unsigned int player_health, unsigned int player_damage,unsigned int player_armor,unsigned int monster_health,unsigned int monster_damage, unsigned int monster_armor) {
    while(true) {
        unsigned int dealt_damage = player_damage - monster_armor;
        if (dealt_damage >= monster_health) { 
            return true;     
        } else {
            monster_health -= dealt_damage;
        }
        dealt_damage = monster_damage - player_armor;
        if (dealt_damage >= player_health) { 
            return false;     
        } else {
            player_health -= dealt_damage;
        }
    }
}
