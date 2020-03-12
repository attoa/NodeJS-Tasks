/*
Проект 1. Быки и коровы

Компьютер загадывает число из нескольких различающихся цифр (от 3 до 6). Игроку дается несколько 
попыток на то, чтобы угадать это число.

После каждой попытки компьютер сообщает количество совпавших цифр стоящих не на своих местах, 
а также количество правильных цифр на своих местах.

Например загаданное число: 56478 предположение игрока: 52976

ответ: совпавших цифр не на своих местах - 1 (6), цифр на своих местах - 2 (5 и 7)

игра ведется до окончания количества ходов либо до отгадывания
*/

const readline = require('readline-sync');

//Длина загадываемого числа
let numLength = +readline.question('Длина числа ? (3 - 6) ', {
    limit: input => input >= 3 && input <= 6,
    limitMessage: 'Введено некорректное значение'
});

let num = generateNum(numLength);   //Загаданное число
let leftSteps = numLength*2;        //Кол-во оставшихся ходов
let guessed = false;                //Отгадано ли число

//Игра
while (leftSteps && !guessed) {
    console.log('Осталось попыток: %d', leftSteps);
    guessed = check(num, readline.questionInt('Число ? '));
    leftSteps--;
}

//Печать результата
if (guessed)
    console.log('Число отгадано: %d', num);
else
    console.log('Игра окончена. Загаданное число: %d', num);


//Генерация числа
function generateNum(length) {
    let arr = [];
    for (let i = 0; i < length ; i++) {
        let digit = 0;      //Генерируемая уникальная цифра

        do digit = Math.ceil(Math.random() * 8);
        while (arr.includes(digit));

        arr.push(digit);
    }
    return +arr.join('');
}

//Проверка чисел
function check(num1, num2) {
    const arr1 = Array.from(num1.toString());
    const arr2 = Array.from(num2.toString());

    let onRightPlaceCount = 0;  //Кол-во угаданных цифр на своих местах
    let onWrongPlaceCount = 0;  //Кол-во угаданных цифр не на своих местах

    //Подсчет цифр
    arr1.forEach((digit, i) => {
        //Цифра на своем месте
        if (arr2.indexOf(digit) === i)
            onRightPlaceCount++;

        //Цифра не на своем месте
        else if (arr2.includes(digit))
            onWrongPlaceCount++;
    });

    console.log('совпавших цифр на своих местах - %d', onRightPlaceCount);
    console.log('совпавших цифр не на своих местах - %d', onWrongPlaceCount);

    return onRightPlaceCount === arr1.length;
}