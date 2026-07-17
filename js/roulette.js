// ======================================================
// ЖЕРЕБЬЁВКА ТЕХНИКИ
// Бар Архиватор
// Версия 1.1
// ======================================================


// ---------- НАСТРОЙКИ ----------


const SETTINGS = {

   spinTime:5000,

    cardWidth: 320,

    gap: 50,

    repeat:false

};



// ---------- СПИСОКИ ТАНКОВ ----------


const TANKS = {


TT:[

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



ST:[

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
"Progetto M40 mod.65",
"Lion",
"Carro da Combattimento 45 t",
"Merkava LP",
"T-54D"

],



PT:[

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



// ---------- ИСПОЛЬЗОВАННЫЕ ТАНКИ ----------


const used={

TT:[],
ST:[],
PT:[]

};



// ---------- DOM ----------


const battleButton =
document.getElementById("battleButton");


const repeatBox =
document.getElementById("repeatMode");



const ttTrack =
document.getElementById("ttTrack");


const stTrack =
document.getElementById("stTrack");


const ptTrack =
document.getElementById("ptTrack");



const ttName =
document.getElementById("ttName");


const stName =
document.getElementById("stName");


const ptName =
document.getElementById("ptName");



const ttResult =
document.getElementById("ttResult");


const stResult =
document.getElementById("stResult");


const ptResult =
document.getElementById("ptResult");

// ======================================================
// КЛАСС ОДНОЙ РУЛЕТКИ
// ======================================================


class RouletteColumn {


    constructor(type, trackElement, nameElement, resultElement){

        this.type = type;

        this.track = trackElement;

        this.nameBox = nameElement;

        this.resultImg = resultElement;


        this.used = used[type];

        this.tanks = TANKS[type];


        this.running = false;

    }




    // ------------------------------------------
    // Доступные танки
    // ------------------------------------------


    getAvailableTanks(){


        if(SETTINGS.repeat){

            return [...this.tanks];

        }



        let available =
        this.tanks.filter(
            tank => !this.used.includes(tank)
        );



        if(available.length === 0){


            this.used.length = 0;


            available=[...this.tanks];


        }



        return available;


    }





    // ------------------------------------------
    // Выбор танка
    // ------------------------------------------


    chooseTank(){


        const list =
        this.getAvailableTanks();



        const selected =
        list[
            Math.floor(
                Math.random()*list.length
            )
        ];



        if(!SETTINGS.repeat){

            this.used.push(selected);

        }



        return selected;


    }





    // ------------------------------------------
    // Создание карточки
    // ------------------------------------------


    createCard(name){


        const card =
        document.createElement("div");


        card.className="tank-card";



        const img =
        document.createElement("img");



        img.src =
        `../assets/tanks/${this.type}/${this.tanks.indexOf(name)+1}.png`;



        img.alt=name;



        card.appendChild(img);



        return card;


    }





    // ------------------------------------------
    // Создание ленты
    // ------------------------------------------


    createRoller(selectedTank){


    this.track.innerHTML="";


    let sequence=[];


    // создаём запас танков до и после выбранного

    for(let i=0;i<4;i++){

        sequence.push(
            ...this.tanks
        );

    }



    // ставим выбранный танк не в конец,
    // а в зоне остановки

    const targetPosition =
    sequence.length - 10;



    sequence[targetPosition]=selectedTank;




    // добавляем ещё танки после результата

    sequence.push(
        ...this.tanks.slice(0,10)
    );




    sequence.forEach(tank=>{


        this.track.appendChild(
            this.createCard(tank)
        );


    });



    return targetPosition;


}





    // ------------------------------------------
    // Запуск выбора
    // ------------------------------------------


    spin(){


        if(this.running){

            return;

        }



        this.running=true;



        const selected =
        this.chooseTank();




        const position =
        this.createRoller(selected);




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

    return 1-Math.pow(1-x,2);

}





RouletteColumn.prototype.animate=function(data){



    const cardSize =
    SETTINGS.cardWidth + SETTINGS.gap;



    const windowWidth =
    this.track.parentElement.clientWidth;



    const center =
    windowWidth/2 -
    SETTINGS.cardWidth/2;




    const finish =
    data.position * cardSize -
    center;




const start =
-cardSize * 40;



const distance =
finish - start;



    let startTime=null;




    const animate=(time)=>{


        if(!startTime){

            startTime=time;

        }



        let progress =
        (time-startTime) /
        SETTINGS.spinTime;



        if(progress>1){

            progress=1;

        }




        const smooth =
        easeOutCubic(progress);




        const current =
        start +
        distance*smooth;




        this.track.style.transform =
        `translateX(${-current}px)`;




        if(progress<1){


            requestAnimationFrame(animate);


        }
        else{


            this.track.style.transform =
            `translateX(${-finish}px)`;



            this.nameBox.textContent =
            data.tank;



            this.resultImg.src =
            `../assets/tanks/${this.type}/${this.tanks.indexOf(data.tank)+1}.png`;



            this.resultImg.style.display="block";



            this.nameBox.classList.remove("selected");


            void this.nameBox.offsetWidth;


            this.nameBox.classList.add("selected");



            this.running=false;


        }



    };




    requestAnimationFrame(animate);



};

// ======================================================
// СОЗДАНИЕ РУЛЕТОК
// ======================================================


const heavyRoulette =
new RouletteColumn(
    "TT",
    ttTrack,
    ttName,
    ttResult
);



const mediumRoulette =
new RouletteColumn(
    "ST",
    stTrack,
    stName,
    stResult
);



const tdRoulette =
new RouletteColumn(
    "PT",
    ptTrack,
    ptName,
    ptResult
);





// ======================================================
// ЗАПУСК РУЛЕТКИ
// ======================================================


battleButton.addEventListener("click",()=>{


    // защита от повторного запуска

    if(
        heavyRoulette.running ||
        mediumRoulette.running ||
        tdRoulette.running
    ){

        return;

    }




    // режим повторения

    SETTINGS.repeat =
    repeatBox.checked;





    // очистка старых результатов


    ttName.textContent="...";

    stName.textContent="...";

    ptName.textContent="...";



    ttResult.style.display="none";

    stResult.style.display="none";

    ptResult.style.display="none";





    // блок кнопки


    battleButton.disabled=true;


    battleButton.textContent=
    "ГЕНЕРАЦИЯ...";







    // выбираем танки


    const ttResultData =
    heavyRoulette.spin();



    const stResultData =
    mediumRoulette.spin();



    const ptResultData =
    tdRoulette.spin();







    // небольшая задержка перед стартом

    setTimeout(()=>{


        heavyRoulette.animate(
            ttResultData
        );


        mediumRoulette.animate(
            stResultData
        );


        tdRoulette.animate(
            ptResultData
        );



    },100);







    // возврат кнопки


    setTimeout(()=>{


        battleButton.disabled=false;


        battleButton.textContent=
        "В БОЙ!";



    }, SETTINGS.spinTime + 500);



});
