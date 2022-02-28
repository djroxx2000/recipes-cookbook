import React, { useEffect } from 'react';

import '../../styles/Notification.css';
import { GlobalContext } from '../../contexts/Globals/GlobalProvider';

function Notification() {
	const [state, dispatch] = React.useContext(GlobalContext);
	useEffect(() => {
		setTimeout(() => {
			dispatch({
				type: 'toggle_notification',
				payload: {
					notifOpen: false,
				},
			});
		}, 5000);
	}, [state.notifOpen]);
	return (
		<div className={'Notification ' + state.notifStatus + (!state.notifOpen ? ' hide' : '')}>
			<div className="notif-message">{state.notifMessage}</div>
			{state.showNotifBtn ? (
				<div className="notif-btn-wrapper">
					<button className="notif-btn">{state.notifBtnText}</button>
				</div>
			) : (
				''
			)}
		</div>
	);
}

export default Notification;
