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

const SendQuestion =  async (e, sendQuestion) => {
    const result = await fetch('https://react-p-7469d-default-rtdb.firebaseio.com/sample.json', {method: 'post', body: JSON.stringify(e) });
    if(result.status === 200) {
        sendQuestion(false);
    } else {
        console.log('херушки')
    }
}


if(localStorage.getItem('cart') == null ) {
    localStorage.setItem('cart', JSON.stringify([]))
}
if(localStorage.getItem('cartItem') == null ) {
    localStorage.setItem('cartItem', JSON.stringify([]))
}

const AddToCard = (item, setAdded) => {
    item.quantity =+ 1;
    const cart = JSON.parse(localStorage.getItem('cart'));
    const cartItem = JSON.parse(localStorage.getItem('cartItem'));
    if(cart.find(el => el === item.id)) {
        console.log('уже есть в корзине');

        const updatedItem = cartItem.filter(el => el.id === item.id)[0];
        console.log(updatedItem.quantity)
        updatedItem.quantity = updatedItem.quantity + 1;
        console.log(updatedItem)
        const removedItem = cartItem.filter(el => el.id !== item.id);
        localStorage.setItem('cartItem', JSON.stringify(cartItem));
    } else {
        cart.push(item.id);
        localStorage.setItem('cart', JSON.stringify(cart));
        let cartItem = JSON.parse(localStorage.getItem('cartItem'));

        cartItem.push(item);
        localStorage.setItem('cartItem', JSON.stringify(cartItem));
    }
    const update = () => setAdded(false)
    setTimeout(update, 0)
}

const RemoveFromCard = (id, setAdded) => {
    const cart = JSON.parse(localStorage.getItem('cart'));
    if(cart.find(el => el === id)) {
        const item = cart.findIndex(el => el === id);
        cart.splice(item, 1)
        localStorage.setItem('cart', JSON.stringify(cart));
        let cartItem = JSON.parse(localStorage.getItem('cartItem'));

        const removedItem = cartItem.filter(el => el.id !== id);
        localStorage.setItem('cartItem', JSON.stringify(removedItem));
    }
    const update = () => setAdded(false)
    setTimeout(update, 0)
}

const SendRequest = () => {
    const request = JSON.stringify(localStorage.getItem('cartItem'));
    console.log(request);
    const SendRequest = () => fetch('https://react-p-7469d-default-rtdb.firebaseio.com/sample.json', {
        method: 'post',
        body: request,
    });
    SendRequest().catch(err => console.error(err)).then(res => console.log(res));
    localStorage.setItem('cart', JSON.stringify([]))
    localStorage.setItem('cartItem', JSON.stringify([]))
}
const GetPizza = async (type) => {
    const result = await fetch(`https://react-p-7469d-default-rtdb.firebaseio.com/Pizza${typeof type !== 'undefined' ? type : ''}.json`);

    const pizza = await result.json();

    console.log(pizza)
    return {
        result,
        pizza,
    }
}




const GetDataPageInner = async () => {
    const result = await fetch('https://react-p-7469d-default-rtdb.firebaseio.com/Tanuki.json');

    const home = await result.json();

    console.log(home);

    return {
        result,
        home,
    }
}





const App = () => {
    const [activeView, setActiveView] = useState('cart');

    const Home = (redirect) => {
        const [error, setError] = useState(null);
        const [isLoaded, setIsLoaded] = useState(false);
        const [items, setItems] = useState([]);
        const [question, sendQuestion] = useState(true);
        const [text, sendText] = useState('');
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

        console.log(question)


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
                                        activeInput.current = e.target;
                                        sendText(e.target.value);
                                    }} />
                                    <button type="button" onClick={() => {
                                        activeInput.current.value = '';
                                        sendQuestion(true);
                                    }} className="reset__input">Сбросить</button>
                                </div>
                                <button className="input__btn" onClick={() => {
                                    activeInput.current.value = '';
                                    SendQuestion(text, sendQuestion);
                                }}>
                                    Отправить
                                </button>
                                <button className="input__btn--one" disabled={question} onClick={() =>
                                    setActiveView('inner')
                                }>
                                    Дальше
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
    }

    const InnerPage = () => {
        const [error, setError] = useState(null);
        const [isLoaded, setIsLoaded] = useState(false);
        const [items, setItems] = useState([]);

        useEffect(() => {
            GetDataPageInner().catch(err => {
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
                                <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    setActiveView('cart');
                                }} className="inner__card">
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

    const Shop = () => {
        const [error, setError] = useState(null);
        const [isLoaded, setIsLoaded] = useState(false);
        const [items, setItems] = useState([]);
        const [filtered, setFiltered] = useState([]);
        const [count, setCount] = useState({id: '', count: 0});
        const [cartItems, setCartItems] = useState( JSON.parse(localStorage.getItem('cartItem')));
        const [added, setAdded] = useState(false);

        // База куда нужно записывать даные карточки "https://react-p-7469d-default-rtdb.firebaseio.com/sample.json";

        useEffect(() => {
            GetPizza().catch(err => {
                console.error(err);
                setError(err)
            }).then(res => {
                if(res.result.status === 200) {
                    // console.log(res)
                    // console.log(res.result.headers.get('Content-Type'))
                    // console.log(res.pizza)
                    // console.log('о да мы получили пиццу');
                    if(res.pizza === null) {
                        setError({message: 'кончилась пицца'})
                    } else if(res.pizza.length > 0) {
                        setItems(res.pizza);
                        setIsLoaded(true);
                    }
                } else if (res.result.status === 403) {
                    window.location.href = '/login'
                } else if (res.result.status === 404) {
                    setError({message: 'нет такой пиццы'})
                }
            })


            // fetch('https://react-p-7469d-default-rtdb.firebaseio.com/Pizza.json')
            //    .catch(err => {
            //         setIsLoaded(true);
            //         setError(error)}
            //     )
            //   .then(res => res.json())
            //   .then(
            //     (result) => {
            //       setIsLoaded(true);
            //       setItems(result);
            //     }
            //   )
        }, []);

        useEffect(() => {
            setCartItems(JSON.parse(localStorage.getItem('cartItem')))
        }, [added])


        const Filter = (price) => {
            setFiltered(items.filter(el => el.price === price));
        }

        const categoryItems = filtered.length > 0 ? filtered : items;

        // console.log('count', count)
        // console.log(count.count)

        if (error) {
            return <div>Ошибка: {error.message}</div>;
        } else if (!isLoaded) {
            return <div className="loader"></div>;
        } else {
            return(
                <>
                    <aside>
                        <div className="title__cart">
                            <span>Ваш заказ:</span>
                        </div>
                        <div className="block__cart">
                            Отображения заказов:
                            {!added && cartItems.map(({name, price}) => <div key={name}><p>{name} </p><p>{price}</p></div>)}
                        </div>

                        <button type="button" onClick={() => SendRequest()}>Отправить </button>
                    </aside>
                    <div className="card_wrap">
                        { categoryItems.map(item =>  {
                            return (
                                <div key={item.id} className="card">
                                    <img src={item.image} alt="image" className="card__image" />
                                    <h3 className="card__title">{item.name}</h3>
                                    <p className="card__text">{item.description}</p>
                                    <div className="card__item">
                                        <small className="card__price">Цена: {item.price}</small>
                                        <div className="count__wrap">
                                            <button className="count__plus" onClick={() => {
                                                setCount({id: item.id, count: count.count + 1})
                                            }}>+</button>
                                            <input type="number" value={item.id === count.id && +count.count || 0} className="count__number" onChange={(e)=> {setCount((e.target.value))}}/>
                                            <button className="count__minus" disabled={count.count === 0} onClick={() => {
                                                if(count.count !== 0) {
                                                    setCount({id: item.id, count: count.count - 1})
                                                }

                                            }}>-</button>
                                            <span>уже в корзине: </span>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => {
                                        AddToCard(item, setAdded);
                                        setAdded(true);
                                    }}>Купить</button>
                                    <button type="button" onClick={() => {RemoveFromCard(item.id,setAdded);
                                        setAdded(true);}}>х</button>
                                </div>
                            )
                        })}

                        <ul>
                            <li><button onClick={() => Filter(705)} >705</button></li>
                            <li><button onClick={() => Filter(759)} >759</button></li>
                            <li><button onClick={() => Filter()} >3</button></li>
                        </ul>
                    </div>
                </>
            )
        }
    };

    let view;
    if(activeView === 'home') {
        view = <Home />
    } else if(activeView === 'inner') {
        view = <InnerPage />
    } else if (activeView === 'cart') {
        view = <Shop />
    }

    return <div>{view}</div>
}

const domContainer = document.querySelector('#home_container');
ReactDOM.render(React.createElement(App), domContainer);