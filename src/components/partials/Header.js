import React from 'react';
import { GlobalContext } from '../../contexts/Globals/GlobalProvider';

import ChefMom from '../../assets/icons/chefmom-192x192.png';
import '../../styles/Header.css';

function Header() {
	const [state] = React.useContext(GlobalContext);
	if (state.debug) {
		console.log('Rendering Header');
	}
	return (
		<div
			className="Header no-select"
			style={{
				background:
					state.cuisineColors[state.cuisine] !== undefined
						? state.cuisineColors[state.cuisine]
						: 'var(--color-primary-accent)',
			}}
		>
			<img className="header-img" src={ChefMom} alt="Chef Mom Image" />
			<p className="header-title">Harina's Cookbook</p>
		</div>
	);
}

export default Header;
