import React, { useEffect, useRef } from 'react';

import '../../styles/Loader.css';
import { GlobalContext } from '../../contexts/Globals/GlobalProvider';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCookie } from '@fortawesome/free-solid-svg-icons';
import Cookie from '../../assets/anims/cookie_accent.gif';

function Loader() {
	const [state] = React.useContext(GlobalContext);
	if (state.debug) {
		console.log('Rendering Loader');
	}
	const label = useRef(null);

	useEffect(() => {
		let dots = 3;
		let interval = setInterval(() => {
			label.current.innerHTML = 'Loading tastebuds';
			let i = 0;
			for (; i < dots; i++) {
				label.current.innerHTML += '.';
			}
			for (; i < 3; i++) {
				label.current.innerHTML += '&nbsp;';
			}
			dots = (dots + 1) % 4;
		}, 500);
		if (!state.isLoading) {
			clearInterval(interval);
		}
		return () => {
			clearInterval(interval);
		};
	}, []);
	return (
		<div className={'Loader ' + (state.isLoading ? '' : 'hide')}>
			<div className="loader-wrapper">
				<div className="loader-icon-wrapper">
					{/* <FontAwesomeIcon className="loader-icon" size="4x" icon={faCookie} /> */}
					<img className="loader-img" src={Cookie} alt="" />
				</div>
				<div ref={label} className="loader-label">
					Loading tastebuds...
				</div>
			</div>
		</div>
	);
}

export default Loader;
