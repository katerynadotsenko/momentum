import Quote from './quote.js';

const time = document.querySelector('.time');
const greetingText = document.querySelector('.greeting__text');
const greetingName = document.querySelector('.greeting__name');
const focusText = document.querySelector('.focus-text');
const buttonNext = document.querySelector('.navigation-buttons__next');
const quoteContent = document.querySelector('.quote__text');
const quoteAuthor = document.querySelector('.quote__author');
const quoteRefreshButton = document.querySelector('.quote__refresh-button');
const quoteRefreshImg = document.querySelector('.quote__refresh-button img');

//TODO generate image array for the next day

const timeOfDayArray = ['night', 'morning', 'afternoon', 'evening'];

let timeOfDay = '';
let bgImage = '';
let activeImageArrayNumber = '';
let activeTimeOfDayPath = '';

class Day {
    constructor() {
        this.dateToday = '';
        this.time = '';
        this.timeOfDay = '';
        this.imagesForDay = [];
        this.activeImageArrayNumber = '';
        this.bgImage = '';
        this.quote = new Quote();
    }

    createDay() {
        this.setTimeOfDay();
        this.generateImagesForDay();
        this.setRandomQuote();
    }

    setTime() {
        let dateToday = new Date(),
            hours = dateToday.getHours(),
            minutes = dateToday.getMinutes(),
            seconds = dateToday.getSeconds();
        this.time = `${hours}:${minutes > 10 ? minutes : '0' + minutes}:${seconds > 10 ? seconds : '0' + seconds}`;
        return this.time;
    }
    

    setTimeOfDay() {
        //утро 6:00-12:00, день 12:00-18:00, вечер 18:00-24:00, ночь 24:00-6:00
    
        let dateToday = new Date(),
            hours = dateToday.getHours();
    
        if (hours < 6) {
            this.timeOfDay = 'night'
        } else if (hours < 12) {
            this.timeOfDay = 'morning'
        } else if (hours < 18) {
            this.timeOfDay = 'afternoon'
        } else if (hours < 24) {
            this.timeOfDay = 'evening'
        }

        return this.timeOfDay;
    }

    generateImagesForDay() {
        let randomImageNumber = 0;
        for (let i = 1; i <= 6; i++) {
            randomImageNumber = Math.floor(Math.random() * 20) + 1;
            if (this.imagesForDay.filter(item => item  === randomImageNumber).length === 0) {
                this.imagesForDay.push(randomImageNumber);
            } else {
                i--;
            }
        }   
        
        console.log('this.imagesForDay', this.imagesForDay);
    }

    setBackground() {
        const dateToday = new Date(),
            hours = dateToday.getHours();
        let imageNumber;

        this.activeImageArrayNumber = hours%6;
        imageNumber = this.imagesForDay[this.activeImageArrayNumber];
        
        this.bgImage = `url('./images/${this.timeOfDay}/${imageNumber > 9 ? imageNumber : '0' + imageNumber}.jpg')`;

        return this.bgImage;  
    }

    async setRandomQuote() {
        quoteRefreshImg.src = '/images/icons/ring-anim.svg'
        let randomQuote = await this.quote.getRandomQuote();
        console.log("randomQuote - ", randomQuote.content);
        if (randomQuote.content.length > 200) {
            console.log("randomQuote length - ", randomQuote.content.length);
            this.setRandomQuote();
        } else {
            quoteRefreshImg.src = '/images/icons/ring.svg'
            quoteContent.innerHTML = randomQuote.content;
            quoteAuthor.innerHTML = randomQuote.originator.name;
        }
    }
}

const newDay = new Day();
newDay.createDay();

updateDay();
activeImageArrayNumber = newDay.activeImageArrayNumber;
activeTimeOfDayPath = newDay.timeOfDay;
getName();
getFocus();


function updateDay() {
    updateTime();
    updateBgImage();
    updateGreetingText();
    
    setTimeout(updateDay, 1000);
}

function updateTime() {
    time.innerHTML = newDay.setTime();
}

function updateGreetingText() {
    const newTimeOfDay = newDay.setTimeOfDay();
    if (newTimeOfDay !== timeOfDay) {
        timeOfDay = newTimeOfDay;
        greetingText.innerHTML = `Good ${timeOfDay}, `;
    }
}

function updateBgImage() {
    const newBgImage = newDay.setBackground();
    if (newBgImage !== bgImage) {
        bgImage = newBgImage;
        document.body.style.backgroundImage = newBgImage;
        console.log(newBgImage);
    }
}

function setName(e) {
    if (e.type === 'keypress') {
        if (e.which == '13' || e.keyCode == 13) {
            localStorage.setItem('name', e.target.innerText);
            greetingName.blur();
        }
    } else {
        localStorage.setItem('name', e.target.innerText);
    }
}

function setFocusText(e) {
    if (e.type === 'keypress') {
        if (e.which == '13' || e.keyCode == 13) {
            localStorage.setItem('focus', e.target.innerText);
            focusText.blur();
        }
    } else {
        localStorage.setItem('focus', e.target.innerText);
    }
}

function getName() {
    if (localStorage.getItem('name') === null || localStorage.getItem('name') === '') {
        greetingName.textContent = '[Enter Name]';
    } else {
        greetingName.textContent = localStorage.getItem('name');
    }
}

function getFocus() {
    if (localStorage.getItem('focus') === null || localStorage.getItem('focus') === '') {
        focusText.textContent = '[Enter Focus]';
    } else {
        focusText.textContent = localStorage.getItem('focus');
    }
}

greetingName.addEventListener('keypress', setName);
greetingName.addEventListener('blur', setName);

focusText.addEventListener('keypress', setFocusText);
focusText.addEventListener('blur', setFocusText);

buttonNext.addEventListener('click', () => {
    activeImageArrayNumber = activeImageArrayNumber + 1;
    if (activeImageArrayNumber > 5) {
        activeImageArrayNumber = 0;
        let timeOfDayArrayNumber = timeOfDayArray.indexOf(activeTimeOfDayPath);
        activeTimeOfDayPath = timeOfDayArray[timeOfDayArrayNumber < 3 ? timeOfDayArrayNumber + 1 : 0];
        console.log("activeTimeOfDayPath - ", activeTimeOfDayPath);
    }
    let imageNumber = newDay.imagesForDay[activeImageArrayNumber] || 5;
    document.body.style.backgroundImage = `url('./images/${activeTimeOfDayPath}/${imageNumber > 9 ? imageNumber : '0' + imageNumber}.jpg')`;
    console.log('activeImageArrayNumber', activeImageArrayNumber);
});

quoteRefreshButton.addEventListener('click', () => {
    newDay.setRandomQuote();
});