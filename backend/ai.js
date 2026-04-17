const fetch = require('node-fetch'); 

const API_KEY = "KEY-HERE"; // КЛЮЧ

async function generateScenario(data){

    const systemPrompt = `Ты эксперт-методист и опытный педагог. Твоя задача разработать подробный образовательный сценарий мероприятия о культуре народов России.
Ты должен строго соблюдать структуру из 7 пунктов. Используй заголовки Markdown формата (###) для каждого пункта. Текст должен быть увлекательным, логичным и учитывать предоставленные данные.`;

    const userPrompt = `
Создай сценарий на основе следующих параметров:
- Тема: ${data.theme}
- Аудитория: ${data.audience}
- Количество участников: ${data.people}
- Длительность: ${data.duration}
- Опыт ведущего: ${data.experience} (дай совет в тексте с учетом этого)
- Пол ведущего: ${data.gender} (адаптируй окончания глаголов)
- Доступные инструменты: ${data.tools} (обязательно интегрируй их в основную часть)

СТРУКТУРА СЦЕНАРИЯ (Обязательно используй заголовки ###):
### Название урока
(креативное название)

### Для какого возраста
(укажи возраст и адаптацию)

### Цель
(что узнают и чему научатся участники)

### Как начать
(интересное вступление: загадка, короткое видео или карта)

### Основная часть
(игры, обсуждения, творческие задания. Обязательно впиши использование инструментов: ${data.tools})

### Рефлексия
(облако слов, мини-опрос или фотоколлаж)

### Главный вывод урока
(философский или обучающий итог)
`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions",{
        method:"POST",
        headers:{
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "deepseek/deepseek-chat", // Можно поменять на openai/gpt-4o-mini
            messages:[
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.7
        })
    });

    const json = await res.json();
    return { text: json.choices?.[0]?.message?.content || "Произошла ошибка при генерации ответа нейросетью." };
}

module.exports = { generateScenario };