import React, { useEffect } from 'react';

import '../../styles/RecipeList.css';
import RecipePill from '../partials/RecipePill';

import { GlobalContext } from '../../contexts/Globals/GlobalProvider';

function RecipeList() {
	const [state, dispatch] = React.useContext(GlobalContext);
	if (state.debug) {
		console.log('Rendering RecipeList');
	}
	useEffect(async () => {
		dispatch({ type: 'unset_cuisine' });
		if (state.recipes.length === 0) {
			dispatch({ type: 'toggle_loader' });
			const res = await fetch(state.serverHost + '/recipes', {
				method: 'GET',
			});
			const resObj = await res.json();
			dispatch({ type: 'put_recipes', payload: resObj });
			dispatch({ type: 'toggle_loader' });
		}
	}, []);
	return (
		<div className={'RecipeList ' + (state.isLoading ? 'hide' : '')}>
			<div className="recipe-list">
				{state.recipes.map((recipe) => (
					<RecipePill
						key={recipe.id}
						recipeKey={recipe.id}
						title={recipe.title}
						desc={recipe.description}
						cuisine={recipe.cuisine}
						duration={recipe.duration}
					/>
				))}
			</div>
		</div>
	);
}

export default RecipeList;
