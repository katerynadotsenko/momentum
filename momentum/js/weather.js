const key = 'be65a70975bda286ed81c0ea8205d115';

export default class Weather {
    constructor(city) {
        this.city = '';
    }

    async getWeather(city) {
        try {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${key}&units=metric`);
            if (res.status === 404) {
                return res.status;
            }
                return res.json();
        } catch (err) {
            console.log(err);
        }
    }
}