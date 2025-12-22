import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';
import { logoutAction } from '../../store/api-actions';
import {
  selectAuthorizationStatus,
  selectFavoriteCount,
  selectUserEmail,
} from '../../store/selectors';

function NotFoundPage(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const authorizationStatus = useSelector(selectAuthorizationStatus);
  const userEmail = useSelector(selectUserEmail);
  const favoriteCount = useSelector(selectFavoriteCount);
  const isAuth = authorizationStatus === 'Auth';

  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link" to="/">
                <img
                  className="header__logo"
                  src="img/logo.svg"
                  alt="6 cities logo"
                  width="81"
                  height="41"
                />
              </Link>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                {isAuth ? (
                  <>
                    <li className="header__nav-item user">
                      <Link
                        className="header__nav-link header__nav-link--profile"
                        to="/favorites"
                      >
                        <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                        <span className="header__user-name user__name">
                          {userEmail}
                        </span>
                        <span className="header__favorite-count">
                          {favoriteCount}
                        </span>
                      </Link>
                    </li>
                    <li className="header__nav-item">
                      <button
                        className="header__nav-link"
                        style={{ background: 'none', border: 'none' }}
                        onClick={() => void dispatch(logoutAction())}
                      >
                        <span className="header__signout">Sign out</span>
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="header__nav-item user">
                    <Link
                      className="header__nav-link header__nav-link--profile"
                      to="/login"
                    >
                      <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                      <span className="header__login">Sign in</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main">
        <div
          className="container"
          style={{ textAlign: 'center', padding: '100px 20px' }}
        >
          <h1 style={{ fontSize: '72px', marginBottom: '20px' }}>404</h1>
          <h2 style={{ fontSize: '32px', marginBottom: '40px' }}>Not Found</h2>
          <p style={{ fontSize: '18px', marginBottom: '40px' }}>
            The page you are looking for does not exist.
          </p>
          <Link
            to="/"
            className="button"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              textDecoration: 'none',
            }}
          >
            Go to main page
          </Link>
        </div>
      </main>
    </div>
  );
}

export default NotFoundPage;
