const API_KEY = '5c907d88191148a58c1912aac37bfa2e';
const BASE_URL = 'https://api.spoonacular.com/recipes';

const searchBtn = document.getElementById('search-btn');
const recipeQuery = document.getElementById('recipe-query');
const recipesContainer = document.getElementById('recipes-container');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');

// Search on button click
searchBtn.addEventListener('click', searchRecipes);

// Search on Enter key press
recipeQuery.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchRecipes();
    }
});

async function searchRecipes() {
    const query = recipeQuery.value.trim();
    
    if (!query) {
        showError('Please enter a search term');
        return;
    }

    // Clear previous results
    recipesContainer.innerHTML = '';
    hideError();
    showLoading();

    try {
        // Search for recipes
        const searchUrl = `${BASE_URL}/complexSearch?query=${encodeURIComponent(query)}&apiKey=${API_KEY}&number=10&addRecipeInformation=true`;
        
        const response = await fetch(searchUrl);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        hideLoading();

        if (data.results && data.results.length > 0) {
            const resultsSection = document.querySelector('.recipe-results');
            resultsSection.classList.remove('hidden');
            displayRecipes(data.results);
        } else {
            showError('No recipes found. Try a different search term.');
        }
    } catch (error) {
        hideLoading();
        showError(`Error fetching recipes: ${error.message}`);
        console.error('Error:', error);
    }
}

function displayRecipes(recipes) {
    recipesContainer.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';

        const image = recipe.image ? `<img src="${recipe.image}" alt="${recipe.title}">` : '';
        const summary = recipe.summary ? `<p class="recipe-summary">${stripHtml(recipe.summary)}</p>` : '';
        const readyInMinutes = recipe.readyInMinutes ? `<p><strong>Ready in:</strong> ${recipe.readyInMinutes} minutes</p>` : '';
        const servings = recipe.servings ? `<p><strong>Servings:</strong> ${recipe.servings}</p>` : '';

        recipeCard.innerHTML = `
            <div class="recipe-image">${image}</div>
            <div class="recipe-content">
                <h3>${recipe.title}</h3>
                ${summary}
                <div class="recipe-meta">
                    ${readyInMinutes}
                    ${servings}
                </div>
                ${recipe.sourceUrl ? `<a href="${recipe.sourceUrl}" target="_blank" class="recipe-link">View Full Recipe</a>` : ''}
            </div>
        `;

        recipesContainer.appendChild(recipeCard);
    });
}

function stripHtml(html) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    errorDiv.classList.add('hidden');
}

