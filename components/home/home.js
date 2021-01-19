const { useState, useEffect } = React;

const GetDataPage = async () => {
    const result = await fetch('https://react-p-7469d-default-rtdb.firebaseio.com/home.json');

    const home = await result.json();

    console.log(home);

    return {
        result,
        home,
    }
}

const Home = () => {
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
            <div className="home__wrap">
                { items.map(item => (
                    <div key={item.id} className="home">
                       <div className="home__block">
                       <span className="home__right--block">
                                <div className="area">
                                    Площадь: {item.area}
                                </div>
                                <span>Дополнительное оборудование:</span>
                                <ul className="trimmings">
                                    <li>{item.list}</li>
                                    <li>{item.name}</li>
                                </ul>
                        </span>
                        <span className="home__left--block">
                                <a href={item.pdf} target="_blank" className="pdf__wrap">
                                Ваш Pdf файл: <img src="img/icon/pdf.svg" alt="image" width="35px" height="35px" />
                                </a>
                                <div className="left__block-img">
                                    <img src={item.image} alt="image"/>
                                </div>
                        </span>
                       </div>
                       <div className="home__input-wrap">
                            <div className="input_wrapper">
                                <input type="text" paleholder="Введите название:" />
                                <span className="reset__input">Сбросить</span>
                            </div>
                            <button className="input__btn">
                                Отправить
                            </button>
                            <button className="input__btn--one">
                                Дальше
                            </button>
                       </div>
                    </div>
                ))}
            </div>
        )
    }
}
 
const domContainer = document.querySelector('#home_container');
ReactDOM.render(React.createElement(Home), domContainer);