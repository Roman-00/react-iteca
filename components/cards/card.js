
const { useState, useEffect } = React;

if(localStorage.getItem('cart') == null ) {
    localStorage.setItem('cart', JSON.stringify([]))
}
if(localStorage.getItem('cartItem') == null ) {
    localStorage.setItem('cartItem', JSON.stringify([]))
}

const AddToCard = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart'));
    if(cart.find(el => el === item.id)) {
        console.log('уже есть в корзине')
    } else {
        cart.push(item.id);
        localStorage.setItem('cart', JSON.stringify(cart));
        let cartItem = JSON.parse(localStorage.getItem('cartItem'));

        cartItem.push(item);
        localStorage.setItem('cartItem', JSON.stringify(cartItem));
    }
}

const RemoveFromCard = (id) => {
    const cart = JSON.parse(localStorage.getItem('cart'));
    if(cart.find(el => el === id)) {
        const item = cart.findIndex(el => el === id);
        cart.splice(item, 1)
        localStorage.setItem('cart', JSON.stringify(cart));
        let cartItem = JSON.parse(localStorage.getItem('cartItem'));

        const removedItem = cartItem.filter(el => el.id !== id);
        localStorage.setItem('cartItem', JSON.stringify(removedItem));
    }
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


const Shop = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);

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


const Filter = (price) => {
    setFiltered(items.filter(el => el.price === price));
}

const categoryItems = filtered.length > 0 ? filtered : items;

  if (error) {
    return <div>Ошибка: {error.message}</div>;
  } else if (!isLoaded) {
      return <div>Загрузка...</div>;
  } else {
    return(
      <div className="card_wrap">
        { categoryItems.map(item => (
            <div key={item.id} className="card">
                <img src={item.image} alt="image" className="card__image" />
                <h3 className="card__title">{item.name}</h3>
                <p className="card__text">{item.description}</p>
                <small className="card__price">Цена: {item.price}</small>
                <button type="button" onClick={() => AddToCard(item)}>Купить</button>
                <button type="button" onClick={() => RemoveFromCard(item.id)}>х</button>
            </div>
        ))}
          <button type="button" onClick={() => SendRequest()}>Отправить </button>

          <ul>
              <li><button onClick={() => Filter(705)} >705</button></li>
              <li><button onClick={() => Filter(759)} >759</button></li>
              <li><button onClick={() => Filter()} >3</button></li>
           </ul>
      </div>
    )
  }
};


const domContainer = document.querySelector('#card_container');
ReactDOM.render(React.createElement(Shop), domContainer);