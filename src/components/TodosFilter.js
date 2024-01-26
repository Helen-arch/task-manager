import classNames from 'classnames';

export const TodosFilter = ({
  filters,
  filterBy,
  onFilterBy,
}) => {
  return (
    <nav className="filter">
      {filters.map(({ href, title }) => {
        return (
          <a
            key={href}
            href={`#${href}`}
            className={classNames('filter__link', {
              selected: filterBy === title,
            })}
            onClick={() => onFilterBy(title)}
          >
            {title}
          </a>
        );
      })}
    </nav>
  );
};
