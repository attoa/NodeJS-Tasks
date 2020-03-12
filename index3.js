/*
Проект 3. Викторина

В папке лежит некоторое количество файлов. Каждый файл состоит из следующих строк

текст вопроса
номер правильного ответа
ответ 1
ответ 2
...
ответ n

Нужно написать программу-викторину, которая выбирает 5 случайных файлов вопросов и в командной 
строке по очереди задает их пользователю, получая от него варианты ответов. После получения 
всех ответов, программа выводит итоговое количество правильных ответов.
*/

const fs = require('fs');
const readline = require('readline-sync');

const dirName = 'for_3';                    //Имя папки с файлами вопросов
const filesNames = fs.readdirSync(dirName); //Массив имен файлов

const questions = [];       //Массив объектов вопросов
const userAnswers = [];     //Массив ответов пользователя

let wrongAnswersCount = 0;  //Кол-во неправильных ответов

//Чтение случайных 5-ти файлов
for (let i = 0; i < 5 && i < filesNames.length; i++) {
    let n;  //Номер имени файла в массиве

    do n = Math.floor(Math.random() * filesNames.length);
    while (questions.find(q => q.fileName === filesNames[n]));

    parseFile(filesNames[n]);
}

//Спрашивание вопросов
questions.forEach((q, i) => {
    //Печать вопроса и вариантов ответа
    console.log('\n' + q.question);
    q.answers.forEach((a, j) => console.log('%d. %s', j+1, a));

    //Ввод номера ответа пользователя
    const n = +readline.question('Номер ответа ? ', {
        limit: input => input >= 1 && input <= q.answers.length,
        limitMessage: 'Некорректный номер ответа'
    });
    userAnswers.push({'questionN': i, 'answerN': n});

    //Подсчет неправильных ответов
    if (q.rightN !== n)
        wrongAnswersCount++;
});

//Печать результата
if (wrongAnswersCount) {
    console.log('\nНеправильных ответов: %d', wrongAnswersCount);

    //Печать вопросов, на которые был дан неправильный ответ
    userAnswers.forEach(a => {
        const q = questions[a.questionN];   //Соответствующий объект-вопрос из массива
        if (a.answerN !== q.rightN)
            console.log('"%s" Правильный ответ: %s', q.question, q.answers[q.rightN-1]);
    });
}
else
    console.log('\nВсе ответы верны!');


//Разбор файла
function parseFile(fileName) {
    try {
        //Массив строк файла
        const text = fs.readFileSync(dirName + '/' + fileName, 'utf8').split('\r\n');

        //Добавление объекта-вопроса в массив
        questions.push({
            'question': text[0], 
            'rightN': +text[1], 
            'answers': text.slice(2), 
            'fileName': fileName
        });
    }
    catch (err) {
        console.error(err)
    }
}