import Quote from './quote.js';
import Weather from './weather.js';


const main = document.querySelector('.main');
const time = document.querySelector('.time');
const greetingText = document.querySelector('.greeting__text');
const greetingName = document.querySelector('.greeting__name');
const focusText = document.querySelector('.focus-text');
const buttonNext = document.querySelector('.navigation-buttons__next');
const quoteContent = document.querySelector('.quote__text');
const quoteAuthor = document.querySelector('.quote__author');
const quoteRefreshButton = document.querySelector('.quote__refresh-button');
const quoteRefreshImg = document.querySelector('.quote__refresh-button img');

const weatherCity = document.querySelector('.weather__city');
const weatherIco = document.querySelector('.weather__ico');
const weatherTemp = document.querySelector('.weather__temp');
const weatherDescription = document.querySelector('.weather__description');
const weatherHumidity = document.querySelector('.weather__humidity');
const weatherWindSpeed = document.querySelector('.weather__wind-speed');

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
        this.weather = new Weather();
        this.city = '';
    }

    createDay() {
        this.setTimeOfDay();
        this.generateImagesForDay();
        this.setRandomQuote();
        this.setWeather();
    }

    setTime() {
        let dateToday = new Date(),
            hours = dateToday.getHours(),
            minutes = dateToday.getMinutes(),
            seconds = dateToday.getSeconds();
        this.time = `${hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
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

    async setWeather() {
        console.log("this.city - ", this.city);
        console.log("update weather");
        try {
            if (this.city !== undefined || this.city !== '') {
                let weatherData = await this.weather.getWeather(this.city);
                if (weatherData === 404) {
                    weatherIco.classList.forEach(className => {
                        if (className.startsWith('owf-')) {
                        weatherIco.classList.remove(className);
                        }
                    });
                    weatherTemp.textContent = '';
                    weatherDescription.innerHTML = 'The city not found.<br>Please check the spelling.';
                    weatherHumidity.textContent = '';
                    weatherWindSpeed.textContent = '';
                } else {
                    let dayNightPrefix = this.timeOfDay === 'night' ? '-n' : '-d';
                
                    weatherIco.classList.forEach(className => {
                        if (className.startsWith('owf-')) {
                        weatherIco.classList.remove(className);
                        }
                    });
    
                    weatherIco.classList.add(`owf-${weatherData.weather[0].id + dayNightPrefix}`);
                    weatherTemp.textContent = `${weatherData.main.temp.toFixed(0)}°C`;
                    weatherDescription.textContent = weatherData.weather[0].description;
                    weatherHumidity.textContent = `${weatherData.main.humidity}%`;
                    weatherWindSpeed.textContent = `${weatherData.wind.speed}m/s`;
                }
            }
        } catch {
            weatherTemp.textContent = '';
            weatherDescription.innerHTML = 'Cannot fetch the data.<br>Please try later.';
            weatherHumidity.textContent = '';
            weatherWindSpeed.textContent = '';
        }

    }
}

window.onload = () => {
    const newDay = new Day();

    getCity();

    newDay.createDay();

    updateDay();
    updateWeather();
    activeImageArrayNumber = newDay.activeImageArrayNumber;
    activeTimeOfDayPath = newDay.timeOfDay;
    getName();
    getFocus();

    function updateWeather() {
        newDay.setWeather();
        setTimeout(updateWeather, 36*(10**5));
    }

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
            main.style.backgroundImage = newBgImage;
            console.log(newBgImage);
        }
    }
    
    function setName(e) {
        if (e.type === 'keypress') {
            if (e.which == '13' || e.keyCode == 13) {
                if (e.target.innerText.trim() !== '') {
                    localStorage.setItem('name', e.target.innerText);
                } else {
                    getName();
                }
                greetingName.blur();
                e.target.style.minWidth = 'auto';
            }
        } else {
            if (e.target.innerText.trim() !== '') {
                localStorage.setItem('name', e.target.innerText);
            } else {
                getName();
            }
            e.target.style.minWidth = 'auto';
        }
    }
    
    function setFocusText(e) {
        if (e.type === 'keypress') {
            if (e.which == '13' || e.keyCode == 13) {
                if (e.target.innerText.trim() !== '') {
                    localStorage.setItem('focus', e.target.innerText);
                } else {
                    getFocus();
                }
                focusText.blur();
                e.target.style.minWidth = 'auto';
            }
        } else {
            if (e.target.innerText.trim() !== '') {
                localStorage.setItem('focus', e.target.innerText);
            } else {
                getFocus();
            }
            e.target.style.minWidth = 'auto';
        }
    }

    function setCity(e) {
        if (e.type === 'keypress') {
            if (e.which == '13' || e.keyCode == 13) {
                if (e.target.innerText.trim() !== '') {
                    localStorage.setItem('city', e.target.innerText);
                    newDay.city = localStorage.getItem('city');
                } else {
                    getCity();
                }
                weatherCity.blur();
                e.target.style.minWidth = 'auto';
            }
        } else {
            if (e.target.innerText.trim() !== '') {
                localStorage.setItem('city', e.target.innerText);
                newDay.city = localStorage.getItem('city');
            } else {
                getCity();
            }
            e.target.style.minWidth = 'auto';
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

    function getCity() {
        if (localStorage.getItem('city') === null || localStorage.getItem('city') === '') {
            weatherCity.textContent = '[Enter City]';
        } else {
            weatherCity.textContent = localStorage.getItem('city');
            newDay.city = localStorage.getItem('city');
        }
    }

    function clear(e){
        const elementWidth = e.target.offsetWidth;
        e.target.innerText = '';
        e.target.focus();
        console.log(`${elementWidth}px`);
        e.target.style.minWidth = `${elementWidth+1}px`;
    }
    
    greetingName.addEventListener('keypress', setName);
    greetingName.addEventListener('blur', setName);
    greetingName.addEventListener('focus', clear);
    
    focusText.addEventListener('keypress', setFocusText);
    focusText.addEventListener('blur', setFocusText);
    focusText.addEventListener('focus', clear);

    weatherCity.addEventListener('keypress', (e) => {
        const isNeedRefreshWeather = e.target.innerText.trim() !== '' ? e.target.innerText !== newDay.city ? true : false : false;
        console.log("isNeedRefreshWeather - ", isNeedRefreshWeather);
        setCity(e);
        if (e.which == '13' || e.keyCode == 13) {
            if (newDay.city && isNeedRefreshWeather) {
                newDay.setWeather();
            }
        }
    });

    weatherCity.addEventListener('blur', (e) => {
        const isNeedRefreshWeather = e.target.innerText.trim() !== '' ? e.target.innerText !== newDay.city ? true : false : false;
        console.log("isNeedRefreshWeather - ", isNeedRefreshWeather);
        setCity(e);
        if (newDay.city && isNeedRefreshWeather) {
            newDay.setWeather();
        }
    });

    weatherCity.addEventListener('focus', clear);
    
    buttonNext.addEventListener('click', () => {
        activeImageArrayNumber = activeImageArrayNumber + 1;
        if (activeImageArrayNumber > 5) {
            activeImageArrayNumber = 0;
            let timeOfDayArrayNumber = timeOfDayArray.indexOf(activeTimeOfDayPath);
            activeTimeOfDayPath = timeOfDayArray[timeOfDayArrayNumber < 3 ? timeOfDayArrayNumber + 1 : 0];
        }
        let imageNumber = newDay.imagesForDay[activeImageArrayNumber] || 5;
        main.style.backgroundImage = `url('./images/${activeTimeOfDayPath}/${imageNumber > 9 ? imageNumber : '0' + imageNumber}.jpg')`;
    });
    
    quoteRefreshButton.addEventListener('click', () => {
        newDay.setRandomQuote();
    });

}