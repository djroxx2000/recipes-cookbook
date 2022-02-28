import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../contexts/Globals/GlobalProvider';

import '../../styles/Login.css';

function Login() {
	const [state, dispatch] = React.useContext(GlobalContext);
	const navigate = useNavigate();

	const username = useRef(null);
	const password = useRef(null);

	useEffect(() => {
		dispatch({ type: 'unset_cuisine' });
	}, []);

	const login = async () => {
		const res = await fetch(state.serverHost + '/user/login', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: username.current.value,
				password: password.current.value,
			}),
		});
		const resObj = await res.json();
		if (resObj.status === 'SUCCESS') {
			navigate('/cookbook-web-admin');
		} else {
			dispatch({
				type: 'toggle_notification',
				payload: {
					notifOpen: true,
					notifStatus: 'notif-alert',
					notifMessage: 'Unauthorized Access',
				},
			});
		}
	};
	return (
		<div className="Login">
			<div className="login-wrapper">
				<div className="login-form-wrapper">
					<div className="form-ele form-username">
						<label htmlFor="username" className="label">
							Username:
						</label>
						<input
							type="text"
							className="login-input-textbox"
							ref={username}
							style={{ fontSize: '1.5em', padding: '0.4em' }}
						/>
					</div>
					<div className="form-ele form-password">
						<label htmlFor="password" className="label">
							Password:
						</label>
						<input
							type="password"
							className="login-input-textbox"
							ref={password}
							style={{ fontSize: '1.4em', padding: '0.4em' }}
						/>
					</div>
					<div className="form-ele login-form-submit">
						<button className="login-btn" onClick={login}>
							Login
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
