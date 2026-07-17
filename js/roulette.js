// ======================================================
// ЖЕРЕБЬЁВКА ТЕХНИКИ
// Бар Архиватор
// Версия 1.0
// ======================================================

// ---------- НАСТРОЙКИ ----------

const SETTINGS = {

    spinTime: 10000,          // 10 секунд

    cardWidth: 370,

    gap: 50,

    repeat: false

};


// ---------- СПИСКИ ТАНКОВ ----------

const TANKS = {

    TT: [

        "113",
        "WZ-111 model 5A",
        "BZ-75",
        "GPT-75",
        "BZ-74-1",
        "116-F3",
        "AMX 50 B",
        "AMX M4 mle. 54",
        "Projet 57",
        "Maus",
        "E 100",
        "Pz.Kpfw. VII",
        "Kampfpanzer 07 P(E)",
        "VK 72.01 (K)",
        "Е 100 Feuerbär",
        "Type 5 Heavy",
        "Type 71",
        "FV215b",
        "Super Conqueror",
        "Vandal",
        "T95/FV4201 Chieftain",
        "FV242B Condor",
        "ИС-4",
        "ИС-7",
        "Объект 705А",
        "Объект 277",
        "СТ-II",
        "Объект 780",
        "Объект 279 ранний",
        "Объект 260",
        "ТЭТ-100",
        "Объект 718Б",
        "Объект 278",
        "T110E5",
        "T57 Heavy Tank",
        "M-V-Y",
        "H-3",
        "Astron-FL",
        "Vz. 55",
        "Warrior",
        "Kranvagn",
        "60TP Lewandowskiego",
        "Czołg (P) wz.46",
        "Rinoceronte",
        "Orso"

    ],

    ST: [

        "121",
        "121B",
        "DZT-159",
        "Bat.-Châtillon 25 t",
        "AMX 30 B",
        "E 50 Ausf. M",
        "Leopard 1",
        "Erich Konzept I",
        "STB-1",
        "Centurion Action X",
        "Concept No. 5",
        "Nemesis",
        "Vulcan",
        "Т-62А",
        "Объект 907",
        "Объект 140",
        "Объект 430У",
        "К-91",
        "Т-22 ср.",
        "Объект 168-122 Квант",
        "M48A5 Patton",
        "M60",
        "T95E6",
        "OTAC MT-58",
        "MBT-59",
        "TVP T 50/51",
        "UDES 15/16",
        "CS-63",
        "CS-63 Wilk",
        "Progetto M40 mod. 65",
        "Lion",
        "Carro da Combattimento 45 t",
        "Merkava LP",
        "T-54D"

    ],

    PT: [

        "WZ-113G FT",
        "114 SP2",
        "AMX 50 Foch (155)",
        "AMX 50 Foch B",
        "120 AC Gendarme",
        "Tornade",
        "Jagdpanzer E 100",
        "Waffenträger auf E 100",
        "Grille 15",
        "Sturmtiger",
        "StuG Maus 17 cm",
        "Ho-Ri 3",
        "FV215b (183)",
        "FV4005 Stage II",
        "FV217 Badger",
        "Объект 268",
        "Объект 268 Вариант 4",
        "Объект 268 Вариант 5",
        "СУ-122В",
        "Объект 120 «Таран»",
        "T110E4",
        "T110E3",
        "XM57",
        "Strv 103B",
        "Wz.70 Żubr",
        "Controcarro 3 Minotauro"

    ]

};


// ---------- ИСПОЛЬЗОВАННЫЕ ----------

const used = {

    TT: [],
    ST: [],
    PT: []

};


// ---------- DOM ----------

const battleButton = document.getElementById("battleButton");

const repeatBox = document.getElementById("repeatMode");

const ttTrack = document.getElementById("ttTrack");
const stTrack = document.getElementById("stTrack");
const ptTrack = document.getElementById("ptTrack");

const ttName = document.getElementById("ttName");
const stName = document.getElementById("stName");
const ptName = document.getElementById("ptName");


// ======================================================
// КЛАСС ОДНОЙ РУЛЕТКИ
// ======================================================


class RouletteColumn {


    constructor(type, trackElement, nameElement) {


        this.type = type;

        this.track = trackElement;

        this.nameBox = nameElement;


        this.used = used[type];

        this.tanks = TANKS[type];


        this.running = false;


    }



    // ------------------------------------------
    // Получение доступных танков
    // ------------------------------------------

    getAvailableTanks(){


        if(SETTINGS.repeat){

            return [...this.tanks];

        }


        let available = this.tanks.filter(

            tank => !this.used.includes(tank)

        );


        if(available.length === 0){


            this.used.length = 0;


            available = [...this.tanks];


        }


        return available;


    }





    // ------------------------------------------
    // Выбор танка
    // ------------------------------------------

    chooseTank(){


        const list = this.getAvailableTanks();


        const index = Math.floor(

            Math.random() * list.length

        );


        const selected = list[index];



        if(!SETTINGS.repeat){

            this.used.push(selected);

        }


        return selected;


    }





    // ------------------------------------------
    // Создание карточки
    // ------------------------------------------

    createCard(name){


        const card = document.createElement("div");


        card.className = "tank-card";



        const img = document.createElement("img");


        img.src = `../assets/tanks/${this.type}/${this.tanks.indexOf(name)+1}.png`;

        img.alt = name;



        card.appendChild(img);



        return card;


    }





    // ------------------------------------------
    // Создание ленты
    // ------------------------------------------

    createRoller(selectedTank){


        this.track.innerHTML = "";



        let sequence = [];



        // создаем длинную ленту

        for(let i = 0; i < 8; i++){


            sequence.push(

                ...this.tanks

            );


        }



        // вставляем выбранный танк ближе к концу

        let targetPosition =

            sequence.length - 5;



        sequence[targetPosition] = selectedTank;



        sequence.forEach(tank=>{


            this.track.appendChild(

                this.createCard(tank)

            );


        });



        return targetPosition;


    }







    // ------------------------------------------
    // Запуск
    // ------------------------------------------

    spin(){



        if(this.running){

            return;

        }


        this.running = true;



        const selected = this.chooseTank();



        const position = this.createRoller(selected);



        return {


            tank:selected,

            position:position


        };


    }



}

// ======================================================
// АНИМАЦИЯ
// ======================================================

function easeOutCubic(x){

    return 1 - Math.pow(1 - x,3);

}



RouletteColumn.prototype.animate=function(data){


    const cardSize=SETTINGS.cardWidth+SETTINGS.gap;

    const center=560/2-SETTINGS.cardWidth/2;

    const finish=data.position*cardSize-center;

    const start=-Math.random()*300;

    const extra=cardSize*18;

    const distance=finish+extra-start;


    let startTime=null;


    const track=this.track;

    const box=this.nameBox;



    box.textContent="";



    const step=(time)=>{


        if(!startTime){

            startTime=time;

        }



        let progress=(time-startTime)/SETTINGS.spinTime;

        if(progress>1){

            progress=1;

        }



        const smooth=easeOutCubic(progress);



        const current=

            start+

            distance*smooth;



        track.style.transform=

            `translateX(${-current}px)`;



        if(progress<1){

            requestAnimationFrame(step);

        }

        else{

            track.style.transform=

                `translateX(${-finish}px)`;


            box.textContent=data.tank;

            box.classList.remove("selected");

            void box.offsetWidth;

            box.classList.add("selected");


            this.running=false;

        }


    }



    requestAnimationFrame(step);


}



// ======================================================
// СОЗДАНИЕ РУЛЕТОК
// ======================================================

const heavyRoulette=new RouletteColumn(

    "TT",

    ttTrack,

    ttName

);


const mediumRoulette=new RouletteColumn(

    "ST",

    stTrack,

    stName

);


const tdRoulette=new RouletteColumn(

    "PT",

    ptTrack,

    ptName

);

// ======================================================
// ЗАПУСК ВСЕХ РУЛЕТОК
// ======================================================


battleButton.addEventListener("click",()=>{


    if(
        heavyRoulette.running ||
        mediumRoulette.running ||
        tdRoulette.running
    ){

        return;

    }



    // состояние повторений

    SETTINGS.repeat = repeatBox.checked;



    // очищаем предыдущие результаты

    ttName.textContent="...";

    stName.textContent="...";

    ptName.textContent="...";



    // блокируем кнопку

    battleButton.disabled=true;

    battleButton.textContent="ГЕНЕРАЦИЯ...";



    // запускаем выбор танков


    const ttResult=

        heavyRoulette.spin();



    const stResult=

        mediumRoulette.spin();



    const ptResult=

        tdRoulette.spin();





    // запускаем анимацию


    setTimeout(()=>{


        heavyRoulette.animate(ttResult);


        mediumRoulette.animate(stResult);


        tdRoulette.animate(ptResult);



    },100);





    // возвращаем кнопку


    setTimeout(()=>{


        battleButton.disabled=false;

        battleButton.textContent="В БОЙ!";


    }, SETTINGS.spinTime + 500);



});