const url = "https://rapidapi.p.rapidapi.com/quotes/random/";
const headers = {
    "x-rapidapi-host": "quotes15.p.rapidapi.com",
    "x-rapidapi-key": "f975211309mshc3ddb8a58c75414p196020jsn3f08922454e3"
    };

const spareQuotes = [
    {
        content: 'The best way to not feel hopeless is to get up and do something.',
        originator: {
            name: 'Barack Obama'
        }
    },
    {
        content: 'Everything here is edible; even I\'m edible. But that, dear children, is cannibalism, and is in fact frowned upon in most societies.',
        originator: {
            name: 'Johnny Depp'
        }
    },
    {
        content: 'Making mistakes is a lot better than not doing anything.',
        originator: {
            name: 'Billie Joe Armstrong'
        }
    }
]

export default class Quote {
    
    async getRandomQuote() {
        try {
            const res = await fetch(url, {
                "method": "GET",
                "headers": headers
            });
            if (res.status !== 200) {
                console.log(`response ${res.status} - using spare quoter`);
                return spareQuotes[Math.floor(Math.random() * 3)];
            } else {
                return res.json();
            }
        } catch (err) {
            console.log(err);
            console.log("err - using spare quoter");
            return spareQuotes[Math.floor(Math.random() * 3)];
        }
    }
}