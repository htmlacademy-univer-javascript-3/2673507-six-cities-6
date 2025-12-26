import { useState } from 'react';

export type SortType = 'Popular' | 'Price: low to high' | 'Price: high to low' | 'Top rated first';

type SortOptionsProps = {
  value: SortType;
  onChange: (value: SortType) => void;
};

function SortOptions({ value, onChange }: SortOptionsProps): JSX.Element {
  const [open, setOpen] = useState(false);

  const options: SortType[] = [
    'Popular',
    'Price: low to high',
    'Price: high to low',
    'Top rated first',
  ];

  const handleSelect = (option: SortType) => (evt: React.MouseEvent<HTMLLIElement>) => {
    evt.preventDefault();
    onChange(option);
    setOpen(false);
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
      >
        {value}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use href="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul className={`places__options places__options--custom ${open ? 'places__options--opened' : ''}`}>
        {options.map((option) => (
          <li
            key={option}
            className={`places__option ${option === value ? 'places__option--active' : ''}`}
            tabIndex={0}
            onClick={handleSelect(option)}
          >
            {option === value ? `${option} (current)` : option}
          </li>
        ))}
      </ul>
    </form>
  );
}

export default SortOptions;
