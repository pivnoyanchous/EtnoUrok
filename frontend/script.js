const HISTORY_KEY = 'ethno_scenarios_history';
let historyData = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderHistory();
});

async function generate() {
    const data = {
        theme: document.getElementById('theme').value,
        audience: document.getElementById('audience').value,
        people: document.getElementById('people').value,
        duration: document.getElementById('duration').value,
        experience: document.getElementById('experience').value,
        gender: document.getElementById('gender').value,
        tools: document.getElementById('tools').value
    };

    const loader = document.getElementById('loader');
    const resultContainer = document.getElementById('result-container');
    const result = document.getElementById('result');
    const submitBtn = document.getElementById('submit-btn');

    loader.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Генерация...';

    try {
        const res = await fetch('http://localhost:5000/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error("Ошибка сервера");
        const response = await res.json();
        result.innerHTML = marked.parse(response.text);
        addToHistory(data, response.text);
        resultContainer.classList.remove('hidden');
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (e) {
        alert("Произошла ошибка при генерации. Проверьте подключение к серверу.");
        console.error(e);
    } finally {
        loader.classList.add('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Создать план мероприятия';
    }
}

function addToHistory(params, text) {
    const newItem = {
        id: Date.now(),
        date: new Date().toLocaleDateString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        params,
        text
    };

    historyData.unshift(newItem);
    if (historyData.length > 10) {
        historyData.pop();
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historyData));
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = "";

    if (historyData.length === 0) {
        historyList.innerHTML = `<div style="text-align:center; color:#94a3b8; margin-top:20px;">История пуста</div>`;
        return;
    }

    historyData.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = "history-item";
        div.innerHTML = `
            <div class="history-item-title">${item.params.theme}</div>
            <div class="history-item-meta">
                <span><i class="fa-regular fa-clock"></i> ${item.date}</span>
                <span><i class="fa-solid fa-users"></i> ${item.params.audience.split(' ')[0]}</span>
            </div>
        `;
        div.onclick = () => loadHistory(index);
        historyList.appendChild(div);
    });
}

function loadHistory(index) {
    const item = historyData[index];
    const resultContainer = document.getElementById('result-container');
    const result = document.getElementById('result');

    result.innerHTML = marked.parse(item.text);
    resultContainer.classList.remove('hidden');
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearHistory() {
    if (confirm('Вы уверены, что хотите очистить историю запросов?')) {
        historyData = [];
        localStorage.removeItem(HISTORY_KEY);
        renderHistory();
    }
}