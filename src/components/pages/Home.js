import React, { useLayoutEffect } from 'react';
import { GlobalContext } from '../../contexts/Globals/GlobalProvider';
import { useNavigate } from 'react-router-dom';

import '../../styles/Home.css';

function Home() {
	const [state, dispatch] = React.useContext(GlobalContext);
	const navigate = useNavigate();
	if (state.debug) {
		console.log('Rendering Home');
	}
	useLayoutEffect(() => {
		dispatch({ type: 'unset_cuisine' });
	}, []);
	return (
		<div className="Home">
			<div className="home-title">Welcome to Harina's cookbook 🙋‍♀️</div>
			<div className="home-subtitle">Use the navigation to find all of mom's recipes.</div>
			<div className="home-nav-info">
				Go to{' '}
				<span className="home-nav-highlight" onClick={() => navigate('/recipes')}>
					Recipes
				</span>{' '}
				to find list of recipes
			</div>
			<div className="home-nav-info">
				Go to{' '}
				<span className="home-nav-highlight" onClick={() => navigate('/login')}>
					Login
				</span>{' '}
				to add/modify recipes.
			</div>
			<div className="home-nav-info">
				Go to{' '}
				<span className="home-nav-highlight" onClick={() => navigate('/about')}>
					About
				</span>{' '}
				to learn more about the great chef mom.
			</div>
		</div>
	);
}

export default Home;
