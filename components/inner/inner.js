const { useState, useEffect } = React;

const GetDataPage = async () => {
    const result = await fetch('https://react-p-7469d-default-rtdb.firebaseio.com/Tanuki.json');

    const home = await result.json();

    console.log(home);

    return {
        result,
        home,
    }
}

const InnerPage = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        GetDataPage().catch(err => {
            console.error(err);
            setError(err)
        }).then(res => {
            if(res.result.status === 200) {
                if(res.home === null) {
                    setError({message: 'Данных нет'})
                } else if (res.home.length > 0) {
                    setItems(res.home);
                    setIsLoaded(true);
                }
            } else if (res.result.status === 403) {
                window.location.href = '/home';
            } else if (res.result.status === 404) {
                setError({message: 'Таких Данных не существует'})
            }
        })
    }, []);

    if (error) {
        return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Загрузка...</div>;
    } else {
        return(
            <div className="inner__page--wrap">
                { items.map(item => (
                    <div key={item.id} className="inner__card--wrap">
                       <div className="card__flex">
                            <a href="/" className="inner__card">
                                <img src={item.image} alt="card-image" className="inner__card--image"/>
                                <span className="inner__card--name">
                                    {item.name}
                                </span>
                                <span className="inner__description">
                                    {item.description}
                                </span>
                            </a>
                       </div>
                    </div>
                ))};
            </div>
        )
    }
}
 
const domContainer = document.querySelector('#inner_container');
ReactDOM.render(React.createElement(InnerPage), domContainer);