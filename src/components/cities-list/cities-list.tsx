import { useDispatch, useSelector } from 'react-redux';
import { changeCity } from '../../store/action';
import { RootState } from '../../store';

const CITIES = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'] as const;

function CitiesList(): JSX.Element {
  const dispatch = useDispatch();
  const activeCity = useSelector((state: RootState) => state.city);

  const handleClick = (city: string) => (evt: React.MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    dispatch(changeCity(city));
  };

  return (
    <div className="tabs">
      <section className="locations container">
        <ul className="locations__list tabs__list">
          {CITIES.map((city) => (
            <li key={city} className="locations__item">
              <a
                href="#"
                onClick={handleClick(city)}
                className={`locations__item-link tabs__item${activeCity === city ? ' tabs__item--active' : ''}`}
              >
                <span>{city}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default CitiesList;
