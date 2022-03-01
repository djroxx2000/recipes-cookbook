import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './partials/Header';
import Navbar from './partials/Navbar';
import Notification from './partials/Notification';
import Loader from './utility/Loader';
import Home from './pages/Home';
import Login from './pages/Login';
import Recipe from './pages/Recipe';
import RecipeList from './pages/RecipeList';
import RecipeForm from './pages/RecipeForm';
import About from './pages/About';

function App() {
	return (
		<Router>
			<div className="App" style={{ position: 'relative' }}>
				<Notification />
				<Header />
				<Navbar />
				<Loader />
				<Routes>
					<Route index element={<Home />} />
					<Route path="login" element={<Login />} />
					<Route path="recipes" element={<RecipeList />} />
					<Route path="recipe/:recipeId" element={<Recipe />} />
					<Route path="cookbook-web-admin" element={<RecipeForm />} />
					<Route path="about" element={<About />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
