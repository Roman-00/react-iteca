const e = React.createElement;


const { useState, useEffect } = React;

function MyComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // База куда нужно записывать даные карточки "https://react-p-7469d-default-rtdb.firebaseio.com/sample.json";

  useEffect(() => {
    fetch('https://react-p-7469d-default-rtdb.firebaseio.com/Pizza.json')
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Ошибка: {error.message}</div>;
  } else if (!isLoaded) {
      return <div>Загрузка...</div>;
  } else {
    return(
      <div className="card_wrap">
        {items.map(item => (
          <div key={item.id} className="card">
            <img src={item.image} alt="image" className="card__image" />
            <h3 className="card__title">{item.name}</h3>
            <p className="card__text">{item.description}</p>
            <small className="card__price">Цена: {item.price}</small>
          </div>
        ))}
      </div>
    )
  }
};


const domContainer = document.querySelector('#card_container');
ReactDOM.render(e(MyComponent), domContainer);