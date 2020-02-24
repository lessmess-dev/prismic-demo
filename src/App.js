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


const useNews = () => {
    const [news, setNews] = useState([]);
    useEffect(() => {
        const getData = () => Prismic.getApi(apiEndpoint ).then(function(api) {
            return api.query(Prismic.Predicates.at('document.type', 'news'),
                { pageSize : 100, orderings : '[document.first_publication_date desc]' }); // An empty query will return all the documents
        }).then(function(response) {
            console.log(response.results);
            setNews(response.results)
        }, function(err) {
            console.log("Something went wrong: ", err);
        });

        var channel = pusher.subscribe('my-channel');
        channel.bind('my-event', getData);

        getData();

        return () => channel.unbind('my-event', getData);
    }, []);

    return news;
};

export const App = ()  => {
    const news = useNews();
    return <div className="news">
        {news.map((document) => {
            return <div key={document.id} className="news__block" dangerouslySetInnerHTML={{__html: PrismicDOM.RichText.asHtml(document.data.text)}} />
        })}
    </div>
};
