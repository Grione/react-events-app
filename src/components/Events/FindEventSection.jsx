import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchEvents } from '../../utils/http';
import EventItem from './EventItem';
import LoadingIndicator from '../UI/LoadingIndicator';

export default function FindEventSection() {
  const [searchTerm, setSearchTerm] = useState();

  const searchElement = useRef();

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['events', { search: searchTerm }],
    queryFn: ({ signal }) => fetchEvents({ signal, searchTerm }),
    enabled: searchTerm !== undefined
  });

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  let content = <p>Please enter a search term and to find events.</p>;

  if (isLoading) {
    content = <LoadingIndicator />
  }

  if (isError) {
    content = <p>Error defined! {error}</p>
  }

  if (data) {
    content = <ul className='events-list'>
      {
        data.map((event) => <li key={event.id}><EventItem event={event} /></li>)
      }
    </ul>
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
