import IndianFood from '../../assets/cuisines/indian.jpg';
import AmericanFood from '../../assets/cuisines/american.jpg';
import ChineseFood from '../../assets/cuisines/chinese.jpg';
import JapaneseFood from '../../assets/cuisines/japanese.jpg';
import DessertsFood from '../../assets/cuisines/desserts.jpg';
import SaladsFood from '../../assets/cuisines/salads.jpg';
import FrenchFood from '../../assets/cuisines/french.jpg';
import SeaFood from '../../assets/cuisines/seafood.jpg';

export const reducer = (state, action) => {
	if (state.debug) {
		console.log('Action Type:', action.type);
		console.log('Payload:', action.payload);
	}

	switch (action.type) {
		case 'toggle_loader':
			return {
				...state,
				isLoading: !state.isLoading,
			};
		case 'put_recipes':
			return {
				...state,
				recipes: action.payload,
			};
		case 'put_recipe':
			return {
				...state,
				recipes: [...state.recipes, action.payload],
			};
		case 'set_current_recipe':
			return {
				...state,
				...action.payload,
			};
		case 'unset_cuisine':
			return {
				...state,
				cuisine: 'Unset',
			};
		case 'toggle_login_modal':
			return action.payload !== undefined
				? {
						...state,
						...action.payload,
				  }
				: { ...state, loginModalOpen: !state.chatModalOpen };
		case 'toggle_notification':
			if (!state.notifOn) {
				return state;
			}
			return {
				...state,
				...action.payload,
			};
		default:
			console.log('Illegal action type:', action.type);
			return state;
	}
};

export const initialState = {
	// serverHost: 'http://localhost:5000',
	debug: true,
	serverHost: 'https://mom-cookbook-server.herokuapp.com',
	username: '',
	// themeDark: true,
	recipes: [],
	title: null,
	desc: null,
	cuisine: null,
	duration: null,
	recipeKey: null,
	loggedIn: false,
	isLoading: false,
	notifOn: true,
	notifOpen: false,
	notifStatus: 'notif-info',
	notifMessage: 'test message! Hey buddy, how are you? Hope you are enjoying this website!',
	images: {
		Indian: IndianFood,
		American: AmericanFood,
		Chinese: ChineseFood,
		Japanese: JapaneseFood,
		Salads: SaladsFood,
		Desserts: DessertsFood,
		French: FrenchFood,
		Seafood: SeaFood,
	},
	cuisineColors: {
		Indian: '#e05b0c',
		American: '#efba0a',
		Chinese: '#ff5544',
		Japanese: '#ec786b',
		Salads: '#8ca561',
		Desserts: '#f28e99',
		French: '#c09c6a',
		Seafood: '#468cb2',
		Unset: 'var(--color-primary-accent)',
	},
};

/* const testRecipes = 
	{
		id: 17,
		title: 'Butter Chicken',
		description:
			'A great chicken dish. Sweet and savory. Perfect for a sunday evening to eat with family. Easy to cook and will win much brownie points with your children. Make this recipe today. All the best. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa magnam, itaque, quas veniam esse dignissimos blanditiis neque voluptates commodi vel sit natus eaque sunt omnis corporis adipisci voluptate saepe nisi!',
		cuisine: 'Indian',
		duration: '1 hour 30 min',
	},
	{
		id: 10,
		title: 'Special order',
		description: 'yespls',
		cuisine: 'American',
		duration: '20min',
	},
	{
		id: 14,
		title: 'hello',
		description: 'dsf sd',
		cuisine: 'Chinese',
		duration: 'yes pls',
	},
	{
		id: 15,
		title: 'Dish1',
		description: 'dish1 desc',
		cuisine: 'French',
		duration: '20min',
	},
	{
		id: 5,
		title: 'Paneer Paratha',
		description: 'Great Dish Indian',
		cuisine: 'Desserts',
		duration: '20 minutes',
	},
	{
		id: 12,
		title: 'Make it',
		description: 'Oh so good',
		cuisine: 'Seafood',
		duration: 'Make it again',
	},
	{
		id: 18,
		title: 'Sushi Roll',
		description:
			'Great sushi roll. Raw fish in soy and various different pastes like wasabi make it super spicy and an entirely different texture. Try today itself',
		cuisine: 'Japanese',
		duration: '1 hr',
	},
	{
		id: 19,
		title: "Caesar's Salad",
		description:
			'A healthy all round dish with great nutritional value while also being extremely tasty and helps you keep the tummy tucked',
		cuisine: 'Salads',
		duration: '30 min',
	}, 
*/
