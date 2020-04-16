import {h} from 'preact';
import {useState, useEffect} from 'preact/hooks'
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import './style.css';

var apiEndpoint = process.env.PRISMIC_API_ENDPOINT;

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

const pusher = new Pusher(process.env.PUSHER_TOKEN, {
    cluster: 'eu',
    forceTLS: true
});

const en = "en-us";
const ru = "ru";


const useNews = () => {
    const [news, setNews] = useState([]);
    const [lang, setLang] = useState(en);

    const setEn = () => {
        setLang(en);
    }

    const setRu = () => {
        setLang(ru);
    }

    const getData = () => Prismic.getApi(apiEndpoint).then(function(api) {
        return api.query(Prismic.Predicates.at('document.type', 'news'),
            { lang, pageSize : 100, orderings : '[document.first_publication_date desc]' }); // An empty query will return all the documents
    }).then(function(response) {
        console.log(response.results);
        setNews(response.results)
    }, function(err) {
        console.log("Something went wrong: ", err);
    });

    useEffect(() => {
        getData();

    }, [lang])

    useEffect(() => {
        var channel = pusher.subscribe('my-channel');
        channel.bind('my-event', getData);

        return () => channel.unbind('my-event', getData);
    }, []);

    return {news, lang, setRu, setEn};
};

export const App = ()  => {
    const {news, lang, setRu, setEn} = useNews();

    return <div>
        <div className="lang_button__block">
            <button className={`lang_button ${lang === en ? "lang_button__active" : ""}`} onClick={setEn}>English</button>
            <button className={`lang_button ${lang === ru ? "lang_button__active" : ""}`} onClick={setRu}>Русский</button>
        </div>

        <div className="news">
            {news.map((document) => {
                return <div key={document.id} className="news__block" dangerouslySetInnerHTML={{__html: PrismicDOM.RichText.asHtml(document.data.text)}} />
            })}
        </div>
    </div>
};
