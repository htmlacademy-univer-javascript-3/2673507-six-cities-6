import { Review } from '../../types/review';

type ReviewItemProps = {
  review: Review;
};

function formatMonthYear(iso: string): { human: string; machine: string } {
  const date = new Date(iso);
  const human = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const machine = date.toISOString().split('T')[0];
  return { human, machine };
}

function ReviewItem({ review }: ReviewItemProps): JSX.Element {
  const { human, machine } = formatMonthYear(review.date);

  return (
    <li className="reviews__item">
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img
            className="reviews__avatar user__avatar"
            src={review.user.avatarUrl}
            width="54"
            height="54"
            alt="Reviews avatar"
          />
        </div>
        <span className="reviews__user-name">{review.user.name}</span>
        {review.user.isPro && <span className="reviews__user-status">Pro</span>}
      </div>
      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span style={{ width: `${(review.rating / 5) * 100}%` }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <p className="reviews__text">{review.comment}</p>
        <time className="reviews__time" dateTime={machine}>
          {human}
        </time>
      </div>
    </li>
  );
}

export default ReviewItem;
