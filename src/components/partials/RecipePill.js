import React, { useRef } from 'react';

import '../../styles/RecipePill.css';
import { GlobalContext } from '../../contexts/Globals/GlobalProvider';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCocktail, faClock } from '@fortawesome/free-solid-svg-icons';

function RecipePill({ recipeKey, title, desc, cuisine, duration, bgImg }) {
	const [state, dispatch] = React.useContext(GlobalContext);
	if (state.debug) {
		console.log('Rendering RecipePill');
	}
	const navigate = useNavigate();
	const recipeMain = useRef(null);
	const recipeDesc = useRef(null);
	const mobileDescShowBtn = useRef(null);
	const mobileDescHideBtn = useRef(null);

	const goToRecipe = (ev) => {
		if (ev.target == mobileDescShowBtn.current || ev.target == mobileDescHideBtn.current) {
			return;
		}
		dispatch({
			type: 'set_current_recipe',
			payload: {
				recipeKey,
				title,
				desc,
				cuisine,
				duration,
			},
		});
		navigate('/recipe/' + recipeKey);
	};

	const showDesc = () => {
		recipeDesc.current.style.transform = 'translateY(0%)';
		recipeMain.current.style.opacity = '0';
	};

	const hideDesc = () => {
		recipeDesc.current.style.transform = 'translateY(-100%)';
		recipeMain.current.style.opacity = '1';
	};

	const pillBgLight = {
		background:
			(state.cuisineColors[cuisine] ? state.cuisineColors[cuisine] : '#ffffff') + '2f',
	};

	const pillBgDark = {
		background:
			(state.cuisineColors[cuisine] ? state.cuisineColors[cuisine] : '#ffffff') + '5f',
	};

	const pillColor = {
		color: state.cuisineColors[cuisine] ? state.cuisineColors[cuisine] : 'black',
	};

	const partialDesc = desc.substring(0, 150);

	return (
		<div
			className="RecipePill"
			onClick={goToRecipe}
			onMouseEnter={showDesc}
			onMouseLeave={hideDesc}
			style={pillBgLight}
		>
			<div className="recipe-pill-container" ref={recipeMain} style={pillColor}>
				<div className="recipe-pill-title">
					{title}
					{window.innerWidth < 450 ? (
						<div className="mobile-desc-wrapper">
							<div
								className="mobile-desc-btn"
								ref={mobileDescShowBtn}
								style={pillBgDark}
								onClick={showDesc}
							>
								•••
							</div>
						</div>
					) : (
						''
					)}
				</div>
				<div className="recipe-pill-bottom">
					<div className="recipe-pill-data" style={pillBgDark}>
						<FontAwesomeIcon size="1x" icon={faCocktail} />
						&nbsp;
						{cuisine}
					</div>
					<div className="recipe-pill-data" style={pillBgDark}>
						<FontAwesomeIcon size="1x" icon={faClock} />
						&nbsp;
						{duration}
					</div>
				</div>
			</div>
			<div style={pillBgDark} ref={recipeDesc} className="recipe-pill-desc-wrapper no-select">
				<div className="recipe-pill-desc">
					{partialDesc + (desc.length > 150 ? '...' : '')}
				</div>
				{window.innerWidth < 450 ? (
					<div className="mobile-desc-wrapper" style={pillColor}>
						<div
							className="mobile-desc-btn"
							ref={mobileDescHideBtn}
							onClick={hideDesc}
							style={pillBgDark}
						>
							▲
						</div>
					</div>
				) : (
					''
				)}
			</div>
		</div>
	);
}

export default RecipePill;
