#include "Spells.hpp"

#include <vector>
#include <utility>

#define INITIAL_HP 50
#define INITIAL_MANA 500

#define MAGIC_MISSILE 1
#define DRAIN 2
#define SHIELD 3
#define POISON 4
#define RECHARGE 5

struct Caster {
    int hp;
    int mana;
    int armor;
    int shield_turns;
    int poison_turns;
    int recharge_turns;
    unsigned int mana_spent;

};

struct Boss {
    int hp;
    int damage;
};

void tick_shield(Caster& caster) {
    if (caster.shield_turns > 1) {
        caster.armor = 7;
        caster.shield_turns--;
    } else {
        caster.armor = 0;
        caster.shield_turns = 0;
    }
}

void tick_recharge(Caster& caster) {
    if (caster.recharge_turns > 0) {
        caster.mana += 101;
        caster.recharge_turns--;
    }
} 

void tick_poison(Caster& caster, Boss& boss) {
    if (caster.poison_turns > 0) {
        boss.hp -= 3;
        caster.poison_turns--;
    }
}

unsigned int get_minimum_mana_to_win(unsigned int boss_hp, unsigned int boss_damage) {
    Caster initial_caster;
    initial_caster.hp = 50;
    initial_caster.mana = 500;
    initial_caster.armor = 0;
    initial_caster.shield_turns = 0;
    initial_caster.poison_turns = 0;
    initial_caster.recharge_turns = 0;

    Boss initial_boss;
    initial_boss.hp = boss_hp;
    initial_boss.damage = boss_damage;

    std::vector<std::vector<unsigned int>> spells = 
    {
        { MAGIC_MISSILE, 53,4},
        { DRAIN, 73,2},
        { SHIELD, 113,0},
        { POISON, 173,0},
        { RECHARGE, 229,0}
    };
    std::vector<std::pair<Caster,Boss>> solutions;
    solutions.push_back(std::pair<Caster,Boss>(initial_caster,initial_boss));

    unsigned int minimum_mana = 99999999;

    while (solutions.size() > 0) {
        std::vector<std::pair<Caster,Boss>> new_solutions;
        for (auto solution: solutions) {
            Caster caster = solution.first;
            Boss boss = solution.second;
             
            if (caster.mana_spent >= minimum_mana) {
                continue;
            }
            tick_shield(caster);
            tick_recharge(caster);
            tick_poison(caster,boss);
            if (boss.hp <= 0) {
                if (caster.mana_spent < minimum_mana) {
                    minimum_mana = caster.mana_spent;
                }
                continue;
            }
            for (auto spell: spells) {
                if ((spell[0] == SHIELD) && (caster.shield_turns > 1)) {
                    continue;
                }
                if ((spell[0] == RECHARGE) && (caster.recharge_turns > 1)) {
                    continue;
                }
                if ((spell[0] == POISON) && (caster.poison_turns > 1)) {
                    continue;
                }
                if (spell[1] > caster.mana) {
                    continue;
                }
                Caster new_caster = caster;
                Boss new_boss = boss;
                new_boss.hp -= spell[2];
                new_caster.mana -= spell[1];
                new_caster.mana_spent += spell[1];

                if (spell[0] == RECHARGE) {
                    new_caster.recharge_turns = 5;
                }
                if (spell[0] == SHIELD) {
                    new_caster.shield_turns = 6;
                }
                if (spell[0] == POISON) {
                    new_caster.poison_turns = 6;
                }
                if (spell[0] == DRAIN) {
                    new_caster.hp += 2;
                }

                tick_shield(new_caster);
                tick_recharge(new_caster);
                tick_poison(new_caster,new_boss);

                new_caster.hp -= new_boss.damage - new_caster.armor;

                if (new_boss.hp <= 0) {
                    if (new_caster.mana_spent < minimum_mana) {
                        minimum_mana = new_caster.mana_spent;
                    }
                    continue;
                }
                if (new_caster.hp <= 0) {
                    continue;
                }

                new_solutions.push_back(std::pair<Caster,Boss>(new_caster,new_boss));
            }
        }
        solutions = new_solutions;
    }
    return minimum_mana;
}
