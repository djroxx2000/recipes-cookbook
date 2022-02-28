import React from 'react';

function RecipeHighlight({ data, color, classStr }) {
	// console.log('Rendering RecipeHighlight');
	const rhighlight = {
		color: color,
	};
	const rdata = {
		background: color,
	};
	return (
		<div className={classStr} style={classStr == 'recipe-highlight' ? rhighlight : rdata}>
			{data}
		</div>
	);
}

export default RecipeHighlight;
