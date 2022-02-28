import React, { useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../contexts/Globals/GlobalProvider';

import '../../styles/Recipe.css';
import RecipeHighlight from '../partials/RecipeHighlight';

function Recipe() {
	const [state, dispatch] = React.useContext(GlobalContext);
	if (state.debug) {
		console.log('Rendering Recipe');
	}
	const [domLists, setDomLists] = useState({ tags: [], ingredients: [], steps: [] });
	const { recipeId } = useParams();

	const checkboxColor = {
		border: '2px solid ' + state.cuisineColors[state.cuisine],
	};

	useLayoutEffect(() => {
		window.scrollTo(0, 0);
		async function loadData() {
			try {
				dispatch({ type: 'toggle_loader' });
				if (state.recipes.length === 0) {
					const res = await fetch(state.serverHost + '/recipes', {
						method: 'GET',
					});
					const resObj = await res.json();
					dispatch({ type: 'put_recipes', payload: resObj });
					const curRecipe = resObj.filter((recipe) => {
						return recipe.id == recipeId;
					})[0];
					dispatch({
						type: 'set_current_recipe',
						payload: {
							recipeKey: curRecipe.id,
							title: curRecipe.title,
							desc: curRecipe.description,
							cuisine: curRecipe.cuisine,
							duration: curRecipe.duration,
						},
					});
				}
				const res = await fetch(state.serverHost + '/recipes/detail/' + recipeId, {
					method: 'GET',
				});
				const recipeDetails = await res.json();
				setDomLists({
					tags: JSON.parse(recipeDetails[0].tags),
					ingredients: JSON.parse(recipeDetails[0].ingredients),
					steps: JSON.parse(recipeDetails[0].steps),
				});
				dispatch({ type: 'toggle_loader' });
			} catch (error) {
				console.log('Unable to fetch recipe details', error);
			}
		}
		loadData();
	}, []);

	return (
		<div className={'Recipe ' + (state.isLoading ? 'hide' : '')}>
			<div className="recipe-left">
				<div className={'recipe-img-container'}>
					<img src={state.images[state.cuisine]} className="recipe-img" alt="" />
				</div>
			</div>
			<div className="recipe-right">
				<div className="recipe-right-bg">
					{window.innerWidth < 700 ? (
						<img
							src={state.images[state.cuisine]}
							className="recipe-img-right"
							alt=""
						/>
					) : (
						''
					)}
				</div>
				<div className="recipe-title" style={{ color: state.cuisineColors[state.cuisine] }}>
					{state.title}
				</div>
				<div className="recipe-section recipe-description">{state.desc}</div>
				<div className="recipe-section">
					<div className="recipe-metadata">
						<div className="recipe-cuisine">
							<RecipeHighlight
								data="Cuisine:"
								color={state.cuisineColors[state.cuisine]}
								classStr="recipe-highlight"
							/>
							<RecipeHighlight
								data={state.cuisine}
								color={state.cuisineColors[state.cuisine]}
								classStr="recipe-data"
							/>
						</div>
						<div className="recipe-duration">
							<RecipeHighlight
								data="Duration:"
								color={state.cuisineColors[state.cuisine]}
								classStr="recipe-highlight"
							/>
							<RecipeHighlight
								data={state.duration}
								color={state.cuisineColors[state.cuisine]}
								classStr="recipe-data"
							/>
						</div>
					</div>
					<div className="recipe-tags">
						<RecipeHighlight
							data="Tags:"
							color={state.cuisineColors[state.cuisine]}
							classStr="recipe-highlight"
						/>
						<div className="recipe-tags-list">
							{domLists.tags.map((tag, idx) => (
								<RecipeHighlight
									key={idx}
									data={tag}
									color={state.cuisineColors[state.cuisine]}
									classStr="recipe-data"
								/>
							))}
						</div>
					</div>
				</div>
				<div className="recipe-section recipe-ingredients">
					<RecipeHighlight
						data="Ingredients:"
						color={state.cuisineColors[state.cuisine]}
						classStr="recipe-highlight"
					/>
					{domLists.ingredients.map((ingredient, idx) => (
						<div key={idx} className="recipe-ingredient-container">
							<input
								type="checkbox"
								className="recipe-checkbox"
								style={checkboxColor}
							/>
							<div className="data-name">
								{ingredient.ingredient}{' '}
								<em
									className="ingredient-q"
									style={{ color: state.cuisineColors[state.cuisine] }}
								>
									&nbsp;- {ingredient.quantity}
								</em>
							</div>
						</div>
					))}
				</div>
				<div className="recipe-section recipe-steps">
					<RecipeHighlight
						data="Steps:"
						color={state.cuisineColors[state.cuisine]}
						classStr="recipe-highlight"
					/>
					{domLists.steps.map((step, idx) => (
						<div key={idx} className="recipe-step-container">
							<input
								type="checkbox"
								className="recipe-checkbox"
								style={checkboxColor}
							/>
							<div className="data-name">
								<em
									className="step-num"
									style={{ color: state.cuisineColors[state.cuisine] }}
								>
									{idx + 1}.
								</em>
								&nbsp;&nbsp;{step}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default Recipe;
