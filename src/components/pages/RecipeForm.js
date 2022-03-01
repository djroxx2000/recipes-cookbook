import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../contexts/Globals/GlobalProvider';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import '../../styles/RecipeForm.css';

function RecipeForm() {
	const [state, dispatch] = React.useContext(GlobalContext);
	if (state.debug) {
		console.log('Rendering RecipeForm');
	}
	const navigate = useNavigate();

	const recipeForm = useRef(null);
	const [formTitle, setFormTitle] = useState('Add New Recipe');
	const [recipeToEdit, setRecipeToEdit] = useState(null);
	const [cuisine, setCuisine] = useState('Indian');

	// const [tagDivs, setTags] = useState([]);
	// const [stepDivs, setSteps] = useState([]);
	// const [ingredientDivs, setIngredients] = useState([]);
	const [domLists, setDomLists] = useState({ tags: [], steps: [], ingredients: [] });

	const [cuisines, setCuisines] = useState([]);
	const changeCuisine = (ev) => {
		setCuisine(ev.target.value);
	};

	const handleSubmit = async (ev) => {
		ev.preventDefault();
		let formData = new FormData(recipeForm.current);
		let reqObj = {
			title: '',
			description: '',
			duration: '',
			cuisine: '',
			tags: [],
			ingredients: [],
			steps: [],
		};
		for (let item of formData.entries()) {
			switch (item[0]) {
				case 'title':
				case 'description':
				case 'cuisine':
				case 'duration':
					if (item[1] !== '') {
						reqObj[item[0]] = item[1];
					}
					break;
				case 'tags':
				case 'steps':
					if (item[1] !== '') {
						reqObj[item[0]].push(item[1]);
					}
					break;
				case 'ingredients':
					if (item[1] !== '') {
						reqObj.ingredients.push({ ingredient: item[1] });
					}
					break;
				case 'quantities':
					let len = reqObj.ingredients.length;
					if (len > 0 && reqObj.ingredients[len - 1].quantity === undefined) {
						reqObj.ingredients[len - 1].quantity = item[1];
					}
					break;
				default:
					console.log('Illegal form key');
			}
		}
		reqObj.ingredients = JSON.stringify(reqObj.ingredients);
		reqObj.steps = JSON.stringify(reqObj.steps);
		reqObj.tags = JSON.stringify(reqObj.tags);

		let reqUrl;
		if (recipeToEdit !== null) {
			reqUrl = state.serverHost + '/recipes/' + recipeToEdit.id;
		} else {
			reqUrl = state.serverHost + '/recipes';
		}
		try {
			const res = await fetch(reqUrl, {
				method: 'POST',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(reqObj),
			});
			const resObj = await res.json();
			let msg =
				resObj && resObj.status === 'SUCCESS'
					? recipeToEdit === null
						? `Successfully added new recipe '${reqObj.title}'`
						: `Successfully modified recipe '${reqObj.title}'`
					: `Unable to submit recipe '${reqObj.title}'. Try again in a little while...`;
			let status = resObj.status === 'SUCCESS' ? 'notif-info' : 'notif-alert';
			dispatch({
				type: 'toggle_notification',
				payload: { notifOpen: true, notifMessage: msg, notifStatus: status },
			});
			let recipes = state.recipes;
			if (recipeToEdit !== null) {
				recipes = recipes.map((recipe) =>
					recipe.id === recipeToEdit.id ? reqObj : recipe
				);
			} else {
				recipes.push(reqObj);
			}
			dispatch({
				type: 'put_recipes',
				payload: recipes,
			});
		} catch (error) {
			dispatch({
				type: 'toggle_notification',
				payload: {
					notifOpen: true,
					notifMessage: 'Unable to connect to server. Please try in a while...',
					notifStatus: 'notif-alert',
				},
			});
			console.log(error.message);
		} finally {
			// Reset Form to default
			resetForm();
			return false;
		}
	};

	const getTag = (key, value) => {
		return (
			<div key={key === null ? domLists.tags.length + 1 : key} className="form-ele form-tag">
				<input
					placeholder="Eg: Healthy"
					type="text"
					className="input-textbox input-textbox-metadata"
					name="tags"
					defaultValue={value === null ? '' : value}
				/>
			</div>
		);
	};

	const getIngredient = (key, value) => {
		return (
			<div
				key={key === null ? domLists.ingredients.length + 1 : key}
				className="form-ele form-ingredient"
			>
				<div className="ingredient-inputs">
					<div className="ingredient-name">
						<input
							placeholder="Eg: Mozzarella"
							type="text"
							className="input-textbox input-center"
							name="ingredients"
							defaultValue={value === null ? '' : value.ingredient}
						/>
					</div>
					<span className="ingredient-dash">&nbsp;-</span>
					<div className="ingredient-quantity">
						<input
							placeholder="Eg: 200gms"
							type="text"
							className="input-textbox input-center"
							name="quantities"
							defaultValue={value === null ? '' : value.quantity}
						/>
					</div>
				</div>
			</div>
		);
	};

	const getStep = (key, value) => {
		return (
			<div
				key={key === null ? domLists.steps.length + 1 : key}
				className="form-ele form-step"
			>
				<div className="step-num no-select">
					<em className="em-step-num">
						{key === null ? domLists.steps.length + 1 : key}. &nbsp;
					</em>
				</div>
				<input
					type="text"
					className="input-textbox input-step"
					name="steps"
					defaultValue={value === null ? '' : value}
				/>
			</div>
		);
	};

	const addTag = () => {
		setDomLists({ ...domLists, tags: [...domLists.tags, getTag(null, null)] });
	};

	const removeTag = () => {
		if (domLists.tags.length <= 1) {
			return;
		}
		setDomLists({
			...domLists,
			tags: domLists.tags.filter((_, idx) => idx !== domLists.tags.length - 1),
		});
	};

	const addIngredient = () => {
		setDomLists({
			...domLists,
			ingredients: [...domLists.ingredients, getIngredient(null, null)],
		});
	};

	const removeIngredient = () => {
		if (domLists.ingredients.length <= 1) {
			return;
		}
		setDomLists({
			...domLists,
			ingredients: domLists.ingredients.filter(
				(_, idx) => idx !== domLists.ingredients.length - 1
			),
		});
	};

	const addStep = () => {
		setDomLists({ ...domLists, steps: [...domLists.steps, getStep(null, null)] });
	};

	const removeStep = () => {
		if (domLists.steps.length <= 1) {
			return;
		}
		setDomLists({
			...domLists,
			steps: domLists.steps.filter((_, idx) => idx !== domLists.steps.length - 1),
		});
	};

	const initDomLists = () => {
		const tags = domLists.tags;
		const ingredients = domLists.ingredients;
		const steps = domLists.steps;
		if (domLists.tags.length <= 1) {
			tags.push(getTag(null, null));
		}
		if (domLists.ingredients.length <= 1) {
			ingredients.push(getIngredient(null, null));
		}
		if (domLists.steps.length <= 1) {
			steps.push(getStep(null, null));
		}
		setDomLists({
			tags: tags,
			ingredients: ingredients,
			steps: steps,
		});
	};

	const editRecipe = async (_, recipe) => {
		window.scrollTo(0, 0);
		setFormTitle(`Editing Recipe: (${recipe.title})`);
		setRecipeToEdit(recipe);
		setCuisine(recipe.cuisine);
		setDomLists({ tags: [], ingredients: [], steps: [] });
		try {
			const res = await fetch(state.serverHost + '/recipes/detail/' + recipe.id, {
				method: 'GET',
			});
			const recipeDetails = await res.json();
			const inputKeys = [1, 1, 1];

			const preFilledTags = JSON.parse(recipeDetails[0].tags).map((tag) =>
				getTag(inputKeys[1]++, tag)
			);

			const preFilledIngredients = JSON.parse(recipeDetails[0].ingredients).map(
				(ingredient) => getIngredient(inputKeys[0]++, ingredient)
			);

			const preFilledSteps = JSON.parse(recipeDetails[0].steps).map((step) =>
				getStep(inputKeys[2]++, step)
			);
			setDomLists({
				tags: preFilledTags,
				ingredients: preFilledIngredients,
				steps: preFilledSteps,
			});
		} catch (error) {
			console.log('Unable to get recipe detail for edit recipe', error.message);
		}
	};

	const resetForm = (_) => {
		window.scrollTo(0, 0);
		setRecipeToEdit(null);
		setFormTitle('Add New Recipe');
		recipeForm.current.reset();
		setDomLists({
			tags: [getTag(1, null)],
			ingredients: [getIngredient(1, null)],
			steps: [getStep(1, null)],
		});
	};

	const deleteRecipe = async (_, recipe) => {
		try {
			const res = await fetch(state.serverHost + '/recipes/' + recipe.id, {
				method: 'DELETE',
			});
			const resObj = await res.json();
			const msg =
				resObj && resObj.status === 'SUCCESS'
					? `Deleted recipe '${recipe.title}' successfully`
					: `Unable to delete recipe '${recipe.title}'. Please try again in a while...`;
			const status = resObj && resObj.status === 'SUCCESS' ? 'notif-info' : 'notif-alert';
			dispatch({
				type: 'toggle_notification',
				payload: {
					notifOpen: true,
					notifMessage: msg,
					notifStatus: status,
				},
			});
			dispatch({
				type: 'put_recipes',
				payload: state.recipes.filter((r) => r.id !== recipe.id),
			});
			window.scrollTo(0, 0);
		} catch (error) {
			dispatch({
				type: 'toggle_notification',
				payload: {
					notifOpen: true,
					notifMessage: 'Unable to connect to server. Please try in a while...',
					notifStatus: 'notif-alert',
				},
			});
			console.log('Unable to delete recipe', error.message);
		}
	};

	const viewRecipe = (_, recipe) => {
		dispatch({
			type: 'set_current_recipe',
			payload: {
				recipeKey: recipe.id,
				title: recipe.title,
				desc: recipe.description,
				cuisine: recipe.cuisine,
				duration: recipe.duration,
			},
		});
		navigate('/recipe/' + recipe.id);
	};

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
		const res = await fetch(state.serverHost + '/cuisines/all', {
			method: 'GET',
		});
		const cuisinesObj = await res.json();
		setCuisines(cuisinesObj.map((cuisine) => cuisine.cuisine));
		initDomLists();
	}, []);

	return (
		<div className={'RecipeForm ' + (state.isLoading ? 'hide' : '')}>
			<div className="recipe-form-title">{formTitle}</div>
			{recipeToEdit !== null ? (
				<div className="form-submit">
					<button className="close-edit" onClick={resetForm}>
						Cancel
					</button>
				</div>
			) : (
				''
			)}
			<form onSubmit={handleSubmit} ref={recipeForm} autoComplete="off">
				<div className="form-wrapper">
					<div className="form-section form-top">
						<div className="form-ele form-title">
							<label htmlFor="title" className="label title">
								Title:
							</label>
							<input
								type="text"
								className="input-textbox input-title"
								name="title"
								required
								defaultValue={recipeToEdit !== null ? recipeToEdit.title : ''}
							/>
						</div>
						<div className="form-ele form-description">
							<label htmlFor="description" className="label description">
								Description:
							</label>
							<textarea
								rows="4"
								type="text"
								className="input-textarea"
								name="description"
								defaultValue={recipeToEdit !== null ? recipeToEdit.description : ''}
							/>
						</div>
					</div>
					<div className="form-section form-mid">
						<div className="form-metadata-wrapper">
							<div className="form-ele form-cuisine">
								<label htmlFor="cuisine" className="label cuisine">
									Cuisine:
								</label>
								<select
									name="cuisine"
									className="input-select input-textbox-metadata"
									value={cuisine}
									onChange={changeCuisine}
								>
									{cuisines.map((cuisine, idx) => (
										<option key={idx} className="input-option" value={cuisine}>
											{cuisine}
										</option>
									))}
								</select>
							</div>
							<div className="form-ele form-duration">
								<label htmlFor="duration" className="label duration">
									Duration:
								</label>
								<input
									placeholder="Eg: 1hr 30min"
									type="text"
									className="input-textbox input-textbox-metadata"
									name="duration"
									defaultValue={
										recipeToEdit !== null ? recipeToEdit.duration : ''
									}
								/>
							</div>
						</div>
						<div className="form-tags-wrapper">
							<div className="form-multi-wrapper">
								<div className="form-multi-left">
									<label htmlFor="tags" className="label tags">
										Tags:
									</label>
								</div>
								<div className="form-multi-right">
									<div
										className="form-add form-modify-button no-select"
										onClick={addTag}
									>
										+
									</div>
									<div
										className="form-remove form-modify-button no-select"
										onClick={removeTag}
									>
										-
									</div>
								</div>
							</div>
							<div className="form-tags">{domLists.tags}</div>
						</div>
					</div>
					<div className="form-section form-bottom">
						<div className="form-ingredients-wrapper">
							<div className="form-multi-wrapper">
								<div className="form-multi-left form-multi-ingredient-labels">
									<label htmlFor="ingredients" className="label ingredients">
										Ingredient
									</label>
									<label htmlFor="ingredients" className="label ingredients">
										-
									</label>
									<label htmlFor="quantity" className="label ingredients">
										Quantity
									</label>
								</div>
								<div className="form-multi-right">
									<div
										className="form-add form-modify-button no-select"
										onClick={addIngredient}
									>
										+
									</div>
									<div
										className="form-remove form-modify-button no-select"
										onClick={removeIngredient}
									>
										-
									</div>
								</div>
							</div>

							<div className="form-ingredients">{domLists.ingredients}</div>
						</div>
						<div className="form-steps-wrapper">
							<div className="form-multi-wrapper">
								<div className="form-multi-left">
									<label htmlFor="steps" className="label steps">
										Steps:
									</label>
								</div>
								<div className="form-multi-right">
									<div
										className="form-add form-modify-button no-select"
										onClick={addStep}
									>
										+
									</div>
									<div
										className="form-remove form-modify-button no-select"
										onClick={removeStep}
									>
										-
									</div>
								</div>
							</div>
							<div className="form-steps">{domLists.steps}</div>
						</div>
					</div>
					<div className="form-submit">
						<input type="submit" className="input-submit" value="Submit" />
					</div>
				</div>
			</form>
			<div className="recipe-table no-select">
				<div className="recipe-table-title">Modify/Delete Recipes:</div>
				<table className="table-root">
					<tbody>
						<tr className="table-row">
							<th className="table-ele-head table-first-col">Actions</th>
							<th className="table-ele-head">Title</th>
							<th className="table-ele-head">Cuisine</th>
							<th className="table-ele-head table-last-col">Duration</th>
						</tr>
						{state.recipes.map((recipe) => (
							<tr key={recipe.id} className="table-row">
								<td className="table-ele table-first-col">
									<div className="table-tools">
										<FontAwesomeIcon
											size="1x"
											icon={faPen}
											className="icon-btn"
											onClick={(ev) => editRecipe(ev, recipe)}
										/>
										<FontAwesomeIcon
											size="1x"
											icon={faTrash}
											className="icon-btn"
											onClick={(ev) => deleteRecipe(ev, recipe)}
										/>
										<FontAwesomeIcon
											size="1x"
											icon={faEye}
											className="icon-btn"
											onClick={(ev) => viewRecipe(ev, recipe)}
										/>
									</div>
								</td>
								<td className="table-ele">{recipe.title}</td>
								<td className="table-ele">{recipe.cuisine}</td>
								<td className="table-ele table-last-col">{recipe.duration}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default RecipeForm;
