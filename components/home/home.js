const { useState, useEffect, useRef } = React;

const GetDataPage = async () => {
    const result = await fetch('https://react-p-7469d-default-rtdb.firebaseio.com/home.json');

    const home = await result.json();

    console.log(home);

    return {
        result,
        home,
    }
}

const SendQuestion = (e) => {
    // const result = await fetch('https://react-p-7469d-default-rtdb.firebaseio.com/TARGET_URL', {method: 'post', body: e});
    //
    // const home = await result.json();
    //
    // console.log(home);
    let result = {
        status: 200
    };

    return {
        result,
    }
}

const Home = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [question, sendQuestion] = useState(false);
    const activeInput = useRef('');

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
                                <a href={item.pdf ? item.pdf : '/'} target="_blank" className="pdf__wrap">
                                    {item.pdf ? <span>Ваш Pdf <img src={'../../img/icon/pdf.svg'} width="35px" height="35px"/></span> : <div> Данных нет </div>}
                                </a>
                                <div className="left__block-img">
                                    {item.image ? <img src={item.image} /> : <button>Зпросить Pdf</button>}
                                </div>
                        </span>
                       </div>
                       <div className="home__input-wrap">
                            <div className="input_wrapper">
                                <input type="text" name="quastion" paleholder="Введите название:" onChange={e => {
                                    sendQuestion(true);
                                    activeInput.current = e.target;
                                    SendQuestion(e.target.value);
                                }} />
                                <button type="button" onClick={() => {
                                    activeInput.current.value = '';
                                    sendQuestion(false);
                                }} className="reset__input">Сбросить</button>
                            </div>
                            <button className="input__btn">
                                Отправить
                            </button>
                            <button className="input__btn--one" disabled={!question}>
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