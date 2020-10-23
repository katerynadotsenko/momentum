import Quote from './quote.js';
import Weather from './weather.js';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const main = document.querySelector('.main'),
        time = document.querySelector('.time'),
        date = document.querySelector('.date'),
        greetingText = document.querySelector('.greeting__text'),
        greetingName = document.querySelector('.greeting__name'),
        focusText = document.querySelector('.focus__text'),
        buttonNext = document.querySelector('.button-next'),
        quoteContent = document.querySelector('.quote__text'),
        quoteAuthor = document.querySelector('.quote__author'),
        quoteRefreshButton = document.querySelector('.quote__refresh-button'),
        quoteRefreshImg = document.querySelector('.quote__refresh-button img');

const weatherCity = document.querySelector('.weather__city'),
        weatherIco = document.querySelector('.weather__ico'),
        weatherTemp = document.querySelector('.weather__temp'),
        weatherDescription = document.querySelector('.weather__description'),
        weatherBottom = document.querySelector('.weather__info-bottom'),
        weatherHumidity = document.querySelector('.weather__humidity'),
        weatherWindSpeed = document.querySelector('.weather__wind-speed');

//TODO generate image array for the next day

const timeOfDayArray = ['night', 'morning', 'afternoon', 'evening'];

let timeOfDay = '',
        activeImageArrayNumber = '',
        activeTimeOfDayPath = '';

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
        this.setDay();
        this.generateImagesForDay();
        this.setRandomQuote();
    }

    generateDay(date) {
        const dayName = days[date.getDay()],
                monthName = months[date.getMonth()],
                dayNumber = date.getDate();
        return `${dayName}, ${dayNumber} ${monthName}`;
    }

    setDay() {
        this.dateToday = new Date();
        date.textContent = this.generateDay(this.dateToday);
        console.log(this.generateDay(this.dateToday));
    }

    setTime() {
        let dateToday = new Date(),
            hours = dateToday.getHours(),
            minutes = dateToday.getMinutes(),
            seconds = dateToday.getSeconds();
        this.time = `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
        return this.time;
    }
    

    setTimeOfDay() { 
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

    generateBackgroundUrl() {
        const dateToday = new Date(),
            hours = dateToday.getHours();
        
        this.activeImageArrayNumber = hours%6;
        const imageNumber = this.imagesForDay[this.activeImageArrayNumber];
        
        const src = `./images/${this.timeOfDay}/${imageNumber > 9 ? imageNumber : '0' + imageNumber}.jpg`;

        return src;  
    }

    setBackground(src) {
        const img = document.createElement('img');
        img.src = src;
        img.onload = () => {
            main.style.backgroundImage = `url(${src})`;      
        };
    }

    async setRandomQuote() {
        quoteRefreshImg.src = './images/icons/ring-anim.svg'
        let randomQuote = await this.quote.getRandomQuote();
        console.log("randomQuote - ", randomQuote.content);
        if (randomQuote.content.length > 200) {
            console.log("randomQuote length - ", randomQuote.content.length);
            this.setRandomQuote();
        } else {
            quoteRefreshImg.src = './images/icons/ring.svg'
            quoteContent.innerHTML = randomQuote.content;
            quoteAuthor.innerHTML = randomQuote.originator.name;
        }
    }

    async setWeather() {
        console.log("this.city - ", this.city);
        console.log("update weather");
        if (weatherCity.textContent === '[Enter City]') {
            weatherBottom.style.display = 'none';
            return;
        }
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
                    weatherBottom.style.display = 'none';
                } else {
                    let dayNightPrefix = this.timeOfDay === 'night' ? '-n' : '-d';
                
                    weatherIco.classList.forEach(className => {
                        if (className.startsWith('owf-')) {
                        weatherIco.classList.remove(className);
                        }
                    });

                    weatherBottom.style.display = 'block';
    
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
            weatherBottom.style.display = 'none';
        }
    }
}



window.onload = () => {

    document.body.classList.add('loaded_hiding');
      window.setTimeout(function () {
        document.body.classList.add('loaded');
        document.body.classList.remove('loaded_hiding');
      }, 500);


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
        updateGreetingText();
        updateBgImage();

        if (newDay.generateDay(newDay.dateToday) !== newDay.generateDay(new Date())) {
            newDay.setDay();
        }
        
        setTimeout(updateDay, 1000);
    }
    
    function updateTime() {
        time.innerHTML = newDay.setTime();
    }
    
    function updateGreetingText() {
        const newTimeOfDay = newDay.setTimeOfDay();
        if (newTimeOfDay !== timeOfDay) {
            timeOfDay = newTimeOfDay;
            greetingText.innerHTML = `Good ${timeOfDay},`;
        }
    }
    
    function updateBgImage() {
        const newBgImage = newDay.generateBackgroundUrl();
        if (newBgImage !== newDay.bgImage) {
            newDay.bgImage = newBgImage;
            newDay.setBackground(newBgImage);
            console.log(newDay.bgImage);
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

        const imageNumber = newDay.imagesForDay[activeImageArrayNumber] || 5;
        const src = `./images/${activeTimeOfDayPath}/${imageNumber > 9 ? imageNumber : '0' + imageNumber}.jpg`;

        newDay.setBackground(src);

        console.log("activeTimeOfDayPath - ", activeTimeOfDayPath);
        console.log("imageNumber - ", imageNumber);
        console.log("path - ",src);
        
        buttonNext.disabled = true;
        setTimeout(function() { buttonNext.disabled = false }, 1000);
    });
    
    quoteRefreshButton.addEventListener('click', () => {
        newDay.setRandomQuote();
    });

}