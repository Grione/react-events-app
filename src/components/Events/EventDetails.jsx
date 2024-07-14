import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, Outlet, useParams, useNavigate } from 'react-router-dom';

import Header from '../Header.jsx';

import { deleteEvent, fetchEvent } from '../../utils/http.js';
import { queryClient } from '../../utils/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import Modal from '../UI/Modal.jsx';

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['events', { event: id }],
    queryFn: ({ signal }) => fetchEvent({ id, signal })
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none'
      });
      navigate('/events');
    }
  })

  function deleteEventHandle() {
    mutate({ id: id });
  }

  function handleStartDelete() {
    setIsDeleting(true);
  }

  function handleStopDelete() {
    setIsDeleting(false);
  }

  return (
    <>
      <Outlet />
      {isDeleting && (<Modal>
        <h4>Are you sure you want to delete the event?</h4>
        <p>Deleting an event cannot be prevented.</p>
        <div className="form-actions">
          <button className='button-text' onClick={handleStopDelete}>Cancel</button>
          <button className="button" onClick={deleteEventHandle}>Delete</button>
        </div>
      </Modal>)}
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {isPending && <LoadingIndicator />}
      {isLoading && <p>Loading the event info...</p>}
      {isError && <p>Get event data failed.</p>}
      {data && <article id="event-details">
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{data.date} @ {data.time}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </article>
      }
    </>
  );
}
