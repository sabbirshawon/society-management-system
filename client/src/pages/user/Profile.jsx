import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AuthContext from '../../contexts/auth-context';
import Loader from '../../components/loader/Loader';
import Footer from '../../components/footer/Footer';

import { genAccessToken } from '../../helpers/GenAccessToken';

import './Profile.scss';

const ProfilePage = (props) => {
  const [user, setUser] = useState({});
  const [registeredSocities, setRegisteredSocities] = useState([]);
  const [loading, setLoading] = useState(true);
  const context = useContext(AuthContext);

  useEffect(() => {
    genAccessToken();
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (Object.keys(user).length && isMounted) {
      document.title = user.name;
      fetch('/society/registered_societies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + context.token,
        },
        body: JSON.stringify({
          societies: JSON.stringify(user.registered_societies),
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (isMounted) {
            setRegisteredSocities(res.registered_societies);
          }
        })
        .catch((err) => console.log(err));
    }
    return () => {
      // eslint-disable-next-line
      isMounted = false;
    };
  }, [user, context]);

  useEffect(() => {
    let isMounted = true;
    fetch('/students/fetch-authenticate-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: context.userId,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.student && isMounted) {
          setLoading(false);
          setUser(res.student);
        }
      })
      .catch((err) => {
        setLoading(false);
      });

    return () => {
      // eslint-disable-next-line
      isMounted = false;
    };
  }, [context]);

  const goToEditPage = (username) => {
    props.history.push(`/edit-profile/${username}`);
  };

  return (
    <>
      <div
        className="profile_wrapper"
        style={{
          display: Object.keys(user).length === 0 ? 'flex' : 'block',
          justifyContent:
            Object.keys(user).length === 0 ? 'center' : 'stretch',
          alignItems:
            Object.keys(user).length === 0 ? 'center' : 'stretch',
        }}
      >
        {loading &&
        Object.keys(user).length === 0 &&
        user.constructor === Object ? (
          <div className="loader_wrap">
            <Loader width={120} height={120} />
          </div>
        ) : (
          <div className="user_info">
            <div className="profile_pic_wrapper">
              {user.profile_picture !== '' ? (
                <img
                  src={
                    process.env.PUBLIC_URL +
                    '/uploads/' +
                    user.profile_picture
                  }
                  alt={user.name}
                />
              ) : (
                <img
                  src={require('../../assets/images/default_img.png')}
                  alt="User Avatar"
                />
              )}
            </div>
            <div className="profile_details">
              <h1 className="user_full_name">{user.name}</h1>
              <span className="user_email">{user.email}</span>
              <div className="dept_info">
                <p>
                  <strong>Department</strong>:{' '}
                  {user.department === 'cse' &&
                    'Computer Science and Engineering'}
                  {user.department === 'eee' &&
                    'Electrical and Electronics Engineering'}
                  {user.department === 'bba' &&
                    'Business Administration'}
                  {user.department === 'eco' && 'Economics'}
                  {user.department === 'eng' && 'English'}
                  {user.department === 'jms' &&
                    'Journalism and Media Studies'}
                </p>
                <p>
                  <strong>Batch</strong>: {user.batch}
                </p>
                <p>
                  <strong>ID</strong>: {user.std_id}
                </p>
              </div>
              <div className="reg_socities_wrap">
                <h2>Registered Socities</h2>
                <div className="socities">
                  <ol className="registered_societies_list">
                    {registeredSocities &&
                      registeredSocities.map((society) => {
                        return (
                          <li
                            key={society._id}
                            className="society_wrap"
                          >
                            <h3>{society.name}</h3>
                            {/* <p>{society.description.substr(0, 200)}</p> */}
                          </li>
                        );
                      })}
                  </ol>
                </div>
              </div>
            </div>
            <div className="edit_profile_btn">
              <Button
                variant="contained"
                color="secondary"
                className="btn-bg-color"
                onClick={() => goToEditPage(user.username)}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default withRouter(ProfilePage);
