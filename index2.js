/*
Проект 2. RPG баттл

Боевой маг Евстафий сражается с лютым монстром.

Бой идет по ходам. Каждый ход компьютер (Лютый) случайно выбирает одно из доступных действий 
и сообщает, что он собирается делать. В ответ на это игрок (Евстафий) должен выбрать свое действие.

После происходит взаимное нанесение урона. Магическая броня блокирует магический урон, 
физическая броня блокирует физический урон.

После совершения действия, оно не может быть повторно выбрано в течение cooldown ходов

Бой идет до победы одного из противников.

Перед началом боя игрок выбирает сложность (начальное здоровье Евстафия)
*/

//Монстр
const monster = {
    maxHealth: 10,
    name: "Лютый",
    moves: [
        {
            "name": "Удар когтистой лапой",
            "physicalDmg": 3, // физический урон
            "magicDmg": 0,    // магический урон
            "physicArmorPercents": 20, // физическая броня
            "magicArmorPercents": 20,  // магическая броня
            "cooldown": 0     // ходов на восстановление
        },
        {
            "name": "Огненное дыхание",
            "physicalDmg": 0,
            "magicDmg": 4,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "name": "Удар хвостом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 50,
            "magicArmorPercents": 0,
            "cooldown": 2
        },
    ]
};

//Маг
const wizard = {
    maxHealth: 10,
    name: "Евстафий",
    moves: [
        {
            "name": "Удар боевым кадилом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 50,
            "cooldown": 0
        },
        {
            "name": "Вертушка левой пяткой",
            "physicalDmg": 4,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 4
        },
        {
            "name": "Каноничный фаербол",
            "physicalDmg": 0,
            "magicDmg": 5,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "name": "Магический блок",
            "physicalDmg": 0,
            "magicDmg": 0,
            "physicArmorPercents": 100,
            "magicArmorPercents": 100,
            "cooldown": 4
        },
    ]
};

const readline = require('readline-sync');

//Массивы счетчиков ходов, прошедших после действий
const monsterMovesLeft = [];
const wizardMovesLeft = [];

//Заполнение массивов
monster.moves.forEach(m => {
    monsterMovesLeft.push({"name": m.name, "usedAgo": m.cooldown})
});
wizard.moves.forEach(m => {
    wizardMovesLeft.push({"name": m.name, "usedAgo": m.cooldown})
});

//Ввод сложности
wizard.maxHealth = +readline.question('Сложность ? (10 - 14) ', { 
    limit: input => input >= 10 && input <= 14,
    limitMessage: 'Введено некорректное значение'
});

//Игра
while (wizard.maxHealth > 0 && monster.maxHealth > 0) {
    //Выбор номера действия монстра
    let mMoveNum;
    do mMoveNum = Math.floor(Math.random() * monster.moves.length);
    while (monsterMovesLeft[mMoveNum].usedAgo < monster.moves[mMoveNum].cooldown);
    
    //Печать доступных действий мага
    console.log('Доступные действия:');
    console.log('№\tур.ф.\tур.м\tзащ.ф\tзащ.м\tназвание');
    wizard.moves.forEach((m, i) => {
        if (wizardMovesLeft[i].usedAgo >= m.cooldown)
            console.log(`${i}.\t${m.physicalDmg}\t${m.magicDmg}\t${m.physicArmorPercents}\t${m.magicArmorPercents}\t${m.name}`);
    });

    //Выбор номера действия мага
    let wMoveNum = +readline.question('Номер действия ? ', {
        limit: input => input >= 0 && input <= wizard.moves.length-1
            && wizardMovesLeft[input].usedAgo >= wizard.moves[input].cooldown,
        limitMessage: 'Введен некорректный номер'
    });

    //Действия
    const mMove = monster.moves[mMoveNum];
    const wMove = wizard.moves[wMoveNum];

    //Урон монстру
    monster.maxHealth -= (wMove.physicalDmg * (100 - mMove.physicArmorPercents)/100 
        + wMove.magicDmg * (100 - mMove.magicArmorPercents)/100);
    monster.maxHealth = +monster.maxHealth.toFixed(1);  //Округление до 0.1

    //Урон магу
    wizard.maxHealth -= (mMove.physicalDmg * (100 - wMove.physicArmorPercents)/100 
        + mMove.magicDmg * (100 - wMove.magicArmorPercents)/100);
    wizard.maxHealth = +wizard.maxHealth.toFixed(1);    //Округление до 0.1

    //Обновление счетчиков ходов
    monsterMovesLeft.forEach((m, i) => {
        i !== mMoveNum ? m.usedAgo++ : m.usedAgo = 0;
    });
    wizardMovesLeft.forEach((m, i) => {
        i !== wMoveNum ? m.usedAgo++ : m.usedAgo = 0;
    });

    console.log('%s выбрал "%s"', monster.name, mMove.name);
    console.log('%s выбрал "%s"', wizard.name, wMove.name);

    console.log('Здоровье монстра: %d', monster.maxHealth);
    console.log('Здоровье мага: %d\n', wizard.maxHealth);
}

//Печать результата
if (wizard.maxHealth <= 0 && monster.maxHealth <= 0)
    console.log('Ничья!');
else {
    if (wizard.maxHealth <= 0) console.log('%s победил!', monster.name);
    if (monster.maxHealth <= 0) console.log('%s победил!', wizard.name);
}