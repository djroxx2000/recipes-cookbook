import React from 'react';
import { GlobalContext } from '../../contexts/Globals/GlobalProvider';
import '../../styles/Navbar.css';

import { useNavigate } from 'react-router-dom';

function Navbar() {
	const [state] = React.useContext(GlobalContext);
	if (state.debug) {
		console.log('Rendering Navbar');
	}
	const navigate = useNavigate();
	return (
		<div className="Navbar no-select">
			<div className="nav-left">
				<div
					onClick={() => {
						navigate('');
					}}
					className="nav-link nav-ele"
				>
					Home
				</div>
				<div
					onClick={() => {
						navigate('/recipes');
					}}
					className="nav-ele nav-link"
				>
					Recipes
				</div>
				<div
					onClick={() => {
						navigate('/cookbook-web-admin');
					}}
					className={'nav-ele nav-link ' + (state.loggedIn ? 'show-block' : 'hide')}
				>
					Create
				</div>
				<div
					onClick={() => {
						navigate('/about');
					}}
					className="nav-ele nav-link"
				>
					About
				</div>
			</div>
			<div className="nav-right">
				{state.loggedIn ? (
					<div className="">Hey, {state.username}</div>
				) : (
					<div
						className="nav-ele nav-btn"
						onClick={() => {
							navigate('/login');
						}}
					>
						Login
					</div>
				)}
			</div>
		</div>
	);
}

export default Navbar;
