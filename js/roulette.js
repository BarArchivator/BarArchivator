// ======================================================
// ЖЕРЕБЬЁВКА ТЕХНИКИ
// Бар Архиватор
// Версия 1.3 (оптимизация ленты + подсветка победителя)
// ======================================================

// ---------- НАСТРОЙКИ ----------
const SETTINGS = {
    spinTime: 5000,
    cardWidth: 320,
    gap: 50,
    repeat: false // повторение танков при исчерпании списка
};
console.log("НОВАЯ ВЕРСИЯ JS ЗАГРУЖЕНА", SETTINGS.spinTime);

// ---------- СПИСОКИ ТАНКОВ ----------
const TANKS = {
    TT: [
        "113",
        /* ... остальные танки */
    ],
    ST: [
        "121",
        /* ... остальные танки */
    ],
    PT: [
        "WZ-113G FT",
        /* ... остальные танки */
    ]
};

// ---------- ИСПОЛЬЗОВАННЫЕ ТАНКИ ----------
let used = { TT: [], ST: [], PT: [] };

// ---------- DOM-элементы ----------
const battleButton = document.getElementById("battleButton");
const repeatBox = document.getElementById("repeatMode");

const ttTrack = document.getElementById("ttTrack");
const stTrack = document.getElementById("stTrack");
const ptTrack = document.getElementById("ptTrack");

const ttName = document.getElementById("ttName");
const stName = document.getElementById("stName");
const ptName = document.getElementById("ptName");

const ttResult = document.getElementById("ttResult");
const stResult = document.getElementById("stResult");
const ptResult = document.getElementById("ptResult");

// ======================================================
// КЛАСС ОДНОЙ РУЛЕТКИ
// ======================================================
class RouletteColumn {
    constructor(type, trackElement, nameElement, resultElement) {
        this.type = type;
        this.track = trackElement;
        this.nameBox = nameElement;
        this.resultImg = resultElement;

        this.used = used[type];
        this.tanks = TANKS[type];

        this.running = false;
    }

    getAvailableTanks() {
        if (SETTINGS.repeat) return [...this.tanks];
        let available = this.tanks.filter(tank => !this.used.includes(tank));
        if (!available.length) {
            this.used.length = 0; // сброс используемого списка
            available = [...this.tanks];
        }
        return available;
    }

    chooseTank() {
        const list = this.getAvailableTanks();
        const selected = list[Math.floor(Math.random() * list.length)];
        if (!SETTINGS.repeat) this.used.push(selected);
        return selected;
    }

    createCard(name) {
        const card = document.createElement("div");
        card.className = "tank-card";
        const img = document.createElement("img");
        img.src = `../assets/tanks/${this.type}/${this.tanks.indexOf(name)+1}.png`;
        img.alt = name;
        card.appendChild(img);
        return card;
    }

    // Оптимизировано! Лента всегда заполнена видимыми карточками
    createRoller(selectedTank) {
        this.track.innerHTML = "";
        const sequence = [];
        
        // Определяем сколько всего нужно карточек, чтобы лента была полной
        const cardSize = SETTINGS.cardWidth + SETTINGS.gap;
        const windowWidth = this.track.parentElement.clientWidth;
        const maxCardsInView = Math.floor(windowWidth / cardSize) + 5; // запас сверху/снизу

        while (sequence.length < maxCardsInView) {
            sequence.unshift(this.tanks[Math.floor(Math.random() * this.tanks.length)]);
        }
        sequence.push(selectedTank); // добавляем выбранный танк

        // НЕ ДОБАВЛЯЕМ лишнюю группу после него!
        // for(let i=0;i<20;i++) {...} - убрано

        sequence.forEach(tank => {
            this.track.appendChild(this.createCard(tank));
        });
        return sequence.indexOf(selectedTank);
    }

    spin() {
        if (this.running) return;
        this.running = true;
        const selected = this.chooseTank();
        const position = this.createRoller(selected);
        return { tank: selected, position };
    }
}

function easeOutCubic(x) {
    return 1 - Math.pow(1-x, 2);
}

RouletteColumn.prototype.animate = function(data) {
    const cardSize = SETTINGS.cardWidth + SETTINGS.gap;
    const windowWidth = this.track.parentElement.clientWidth;
    const center = windowWidth/2 - SETTINGS.cardWidth/2;
    const finish = data.position * cardSize - center;
    const start = -cardSize * 40;
    const distance = finish + 2000 - start;
    let startTime = null;
    
    requestAnimationFrame(animate);

    function animate(time) {
        if (!startTime) startTime = time;
        let progress = (time-startTime)/SETTINGS.spinTime;
        if (progress > 1) progress = 1;
        const smooth = easeOutCubic(progress);
        const current = start + distance*smooth;
        this.track.style.transform = `translateX(${-current}px)`;

        if (progress >= 1) {
            // Подсветка выбранной карточки в ленте
            [...this.track.children].find(card => card.querySelector('img').alt === data.tank)?.classList.add("selected");
            
            // Итоговая картинка (result-tank)
            const imgPath = `../assets/tanks/${this.type}/${this.tanks.indexOf(data.tank)+1}.png`;
            console.log("Итоговая картинка:", data.tank, imgPath);
            this.resultImg.onload = () => {
                this.resultImg.style.display = "block"; // показываем результат
                this.nameBox.textContent = data.tank;
                void this.nameBox.offsetWidth;
                this.nameBox.classList.add("selected"); // анимация названия
                this.running = false;
            };
            this.resultImg.onerror = () => {
                console.error('Не удалось загрузить:', data.tank);
                this.resultImg.src = 'default-not-found.png'; // временная заглушка
            };
            this.resultImg.src = imgPath;

            setTimeout(() => {
                battleButton.disabled = false;
                battleButton.textContent = "В БОЙ!";
            }, 500);
        } else {
            requestAnimationFrame(animate);
        }
    }
};

// Создаём рулетки для каждого типа техники
const heavyRoulette = new RouletteColumn("TT", ttTrack, ttName, ttResult);
const mediumRoulette = new RouletteColumn("ST", stTrack, stName, stResult);
const tdRoulette = new RouletteColumn("PT", ptTrack, ptName, ptResult);

// Обработчик нажатия на кнопку "В бой!"
battleButton.addEventListener("click", () => {
    if (
        heavyRoulette.running ||
        mediumRoulette.running ||
        tdRoulette.running
    ) return;

    SETTINGS.repeat = repeatBox.checked;

    [ttName,stName,ptName].forEach(el => el.textContent="...");
    [ttResult,stResult,ptResult].forEach(el => el.style.display="none");

    battleButton.disabled=true;
    battleButton.textContent="ГЕНЕРАЦИЯ...";

    const results = [
        heavyRoulette.spin(),
        mediumRoulette.spin(),
        tdRoulette.spin()
    ];

    setTimeout(() => {
        results.forEach(r => r && r.tank && r.column.animate(r)); 
    }, 100);
});
// ======================================================
// КЛАСС ОДНОЙ РУЛЕТКИ
// ======================================================
class RouletteColumn {
    constructor(type, trackElement, nameElement, resultElement) {
        this.type = type;
        this.track = trackElement;
        this.nameBox = nameElement;
        this.resultImg = resultElement;

        this.used = used[type];
        this.tanks = TANKS[type];

        this.running = false;
    }

    // Доступные танки с учётом режима повтора
    getAvailableTanks() {
        if (SETTINGS.repeat) return [...this.tanks];
        let available = this.tanks.filter(tank => !this.used.includes(tank));
        if (!available.length) {
            this.used.length = 0; // сброс используемого списка
            available = [...this.tanks];
        }
        return available;
    }

    // Выбор случайного танка из доступных
    chooseTank() {
        const list = this.getAvailableTanks();
        const selected = list[Math.floor(Math.random() * list.length)];
        if (!SETTINGS.repeat) this.used.push(selected);
        return selected;
    }

    // Создание карточки для ленты
    createCard(name) {
        const card = document.createElement("div");
        card.className = "tank-card";
        const img = document.createElement("img");
        img.src = `../assets/tanks/${this.type}/${this.tanks.indexOf(name)+1}.png`;
        img.alt = name;
        card.appendChild(img);
        return card;
    }

    // Формирование ленты карточек (оптимизировано!)
    createRoller(selectedTank) {
        this.track.innerHTML = "";
        const sequence = [];

        // Определяем сколько всего нужно карточек, чтобы лента была полной
        const cardSize = SETTINGS.cardWidth + SETTINGS.gap;
        const windowWidth = this.track.parentElement.clientWidth;
        const maxCardsInView = Math.floor(windowWidth / cardSize) + 5; // запас сверху/снизу

        while (sequence.length < maxCardsInView) {
            sequence.unshift(this.tanks[Math.floor(Math.random() * this.tanks.length)]);
        }
        sequence.push(selectedTank); // добавляем выбранный танк

        // Не добавляем лишние карты после него!
        // for(let i=0;i<20;i++) {...} - этот код убран

        sequence.forEach(tank => {
            this.track.appendChild(this.createCard(tank));
        });

        return sequence.indexOf(selectedTank);
    }

    // Запуск жеребьёвки
    spin() {
        if (this.running) return;
        this.running = true;
        const selected = this.chooseTank();
        const position = this.createRoller(selected);
        return { tank: selected, position };
    }
}

// Функция плавной анимации
function easeOutCubic(x) {
    return 1 - Math.pow(1-x, 2);
}

RouletteColumn.prototype.animate = function(data) {
    const cardSize = SETTINGS.cardWidth + SETTINGS.gap;
    const windowWidth = this.track.parentElement.clientWidth;
    const center = windowWidth/2 - SETTINGS.cardWidth/2;
    const finish = data.position * cardSize - center;
    const start = -cardSize * 40;
    const distance = finish + 2000 - start;
    let startTime = null;

    requestAnimationFrame(animate);

    function animate(time) {
        if (!startTime) startTime = time;
        let progress = (time-startTime)/SETTINGS.spinTime;
        if (progress > 1) progress = 1;
        const smooth = easeOutCubic(progress);
        const current = start + distance*smooth;
        this.track.style.transform = `translateX(${-current}px)`;

        if (progress >= 1) {
            // Обработка итогового изображения
            const imgPath = `../assets/tanks/${this.type}/${this.tanks.indexOf(data.tank)+1}.png`;
            console.log("Итоговая картинка:", data.tank, imgPath);

            // Покажем картинку только после успешной загрузки
            this.resultImg.onload = () => {
                this.resultImg.style.display = "block"; // показываем результат
                this.nameBox.textContent = data.tank;
                void this.nameBox.offsetWidth;
                this.nameBox.classList.add("selected"); // анимация названия
                this.running = false;
            };
            this.resultImg.onerror = () => {
                console.error('Не удалось загрузить:', data.tank);
                this.resultImg.src = 'default-not-found.png'; // временная заглушка
            };
            this.resultImg.src = imgPath;

            // Сброс кнопки через задержку
            setTimeout(() => {
                battleButton.disabled = false;
                battleButton.textContent = "В БОЙ!";
            }, 500);
        } else {
            requestAnimationFrame(animate);
        }
    }
};

// Создаём рулетки для каждого типа техники
const heavyRoulette = new RouletteColumn("TT", ttTrack, ttName, ttResult);
const mediumRoulette = new RouletteColumn("ST", stTrack, stName, stResult);
const tdRoulette = new RouletteColumn("PT", ptTrack, ptName, ptResult);

// Обработчик нажатия на кнопку "В бой!"
battleButton.addEventListener("click", () => {
    if (
        heavyRoulette.running ||
        mediumRoulette.running ||
        tdRoulette.running
    ) return;

    SETTINGS.repeat = repeatBox.checked;

    // Очищаем старые результаты
    [ttName,stName,ptName].forEach(el => el.textContent="...");
    [ttResult,stResult,ptResult].forEach(el => el.style.display="none");

    // Блокируем кнопку
    battleButton.disabled=true;
    battleButton.textContent="ГЕНЕРАЦИЯ...";

    // Начинаем выбор танков
    const results = [
        heavyRoulette.spin(),
        mediumRoulette.spin(),
        tdRoulette.spin()
    ];

    // Стартуем анимацию всех трёх колонок одновременно
    setTimeout(() => {
        results.forEach(r => r && r.tank && r.column.animate(r)); // если есть данные
    }, 100);
});
