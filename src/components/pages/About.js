import React, { useLayoutEffect } from 'react';
import { GlobalContext } from '../../contexts/Globals/GlobalProvider';

import '../../styles/About.css';

function About() {
	const [state, dispatch] = React.useContext(GlobalContext);
	if (state.debug) {
		console.log('Rendering About');
	}
	useLayoutEffect(() => {
		dispatch({ type: 'unset_cuisine' });
	}, []);
	return (
		<div className="About">
			Recipes by supermom Harinakshi Shettigar.
			<br /> Bio coming soon... :P
		</div>
	);
}

export default About;
