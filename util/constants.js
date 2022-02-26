require('dotenv').config();

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL_LOCAL || process.env.DATABASE_URL;
const CODES = {
	SUCCESS: 'SUCCESS',
	INTERNAL_SERVER_ERR: 'INTERNAL_SERVER_ERR',
	UNAUTHORIZED: 'UNAUTHORIZED',
};
const QUERIES = {
	// Create Queries
	create: `CREATE TABLE IF NOT EXISTS cuisines
               (id SERIAL PRIMARY KEY not NULL,
               cuisine varchar(50) UNIQUE not NULL
               );
            CREATE TABLE IF NOT EXISTS recipes
               (id SERIAL PRIMARY KEY not NULL,
               title varchar(50) not NULL,
               description TEXT not NULL,
               cuisine varchar(50),
               duration varchar(10),
               CONSTRAINT fk_cuisine
                  FOREIGN KEY(cuisine) REFERENCES cuisines(cuisine)
                  ON DELETE SET NULL
               );
            CREATE TABLE IF NOT EXISTS "recipeDetail"
               (id SERIAL PRIMARY KEY not NULL,
               "recipeId" integer not NULL,
               steps TEXT,
               ingredients TEXT,
               tags varchar(100),
               CONSTRAINT fk_recipe_id
                  FOREIGN KEY("recipeId") REFERENCES recipes(id)
                  ON DELETE CASCADE
               );`,

	// Select Queries
	selectAllCuisines: `SELECT cuisine FROM cuisines`,
	selectAllRecipes: `SELECT * FROM recipes;`,
	selectRecipeDetail: `SELECT * FROM "recipeDetail" WHERE "recipeId" = $1;`,

	// Insert Queries
	insertCuisine: `INSERT INTO cuisines
                     (cuisine) VALUES
                     ($1);`,
	insertRecipe: `INSERT INTO recipes
                     (title, description, cuisine, duration) VALUES
                     ($1, $2, $3, $4) RETURNING *;`,
	insertRecipeDetail: `INSERT INTO "recipeDetail"
                           ("recipeId", steps, ingredients, tags) VALUES
                           ($1, $2, $3, $4);`,

	// Update Queries
	updateRecipe: `UPDATE recipes SET
                     title = $1,
                     description = $2,
                     cuisine = $3,
                     duration = $4 WHERE id = $5;`,
	updateRecipeDetail: `UPDATE "recipeDetail" SET
                           steps = $1,
                           ingredients = $2,
                           tags = $3 WHERE "recipeId" = $4;`,

	// Delete Queries
	deleteRecipe: `DELETE FROM recipes WHERE id = $1`,
	deleteCuisine: `DELETE FROM cuisines WHERE id = $1`,
};

module.exports = { PORT, DATABASE_URL, CODES, QUERIES };
