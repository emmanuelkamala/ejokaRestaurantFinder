class Ejoka {
    constructor(){
        this.api = "eaf59a06684b739431331d13cc75060d";
        this.header = {
            method: "GET",
            headers: {
                "user-key": this.api,
                "Content-Type": "application/json"
            },
            credentials: "same-origin"
        };
    }

    async searchAPI(city, categoryID){
        const categoryURL = `https://developers.zomato.com/api/v2.1/categories`;
        const cityURL = `https://developers.zomato.com/api/v2.1/cities?=${city}`;
        
        
        const categoryInfo = await fetch(categoryURL, this.header);
        const categoryJSON = await categoryInfo.json();
        const categories = await categoryJSON.categories;

        const cityInfo = await fetch(cityURL, this.header);
        const cityJSON = await cityInfo.json();
        const cityLocation = await cityJSON.location_suggestions;

        let cityID;

        if (cityLocation.length > 0){
            return cityID = await cityLocation[0].id;    
        }

        const restaurantURL = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityID}&entity_type=city&category=${categoryID}&sort=rating`;

        const restaurantInfo = await fetch(restaurantURL, this.header);
        const restaurantJSON = await restaurantInfo.json();
        const restaurants = await restaurantJSON.restaurants;
        
        return {
            categories,
            cityID, 
            restaurants
        };
    }
}

class UI {
    constructor(){
        this.loader = document.querySelector('.loader');
        this.restaurantList = document.getElementById('restaurant-list');
    }

    addSelectOptions(categories){
        const search = document.getElementById('searchCategory');
        let output = `<option value='0' selected>Select category</option>`;
        categories.forEach(category => {
            output += `<option value='${category.categories.id}'>${category.categories.name}</option>`;
        })
        search.innerHTML = output;
    }

    showFeedback(text){
        const feedback = document.querySelector('.feedback');
        feedback.classList.add('showItem');
        feedback.innerHTML = `<p>${text}</p>`;
        setTimeout(() => {
            feedback.classList.remove('showItem');
        }, 3000)
    }

    showLoader(){
        this.loader.classList.add('showItem');
    }

    hideLoader(){
        this.loader.classList.remove('showItem');
    }

    getRestaurants(restaurants){
        this.hideLoader();
        if (restaurants.length === 0){
            this.showFeedback('No such categories exist in the selected city');
        } else {
            this.restaurantList.innerHTML = '';
            restaurants.forEach(restaurant => {
                const { thumb:img, name, location:{address}, user_rating:{aggregate_rating}, cuisines, average_cost_for_two:cost, menu_url, url} = restaurant.restaurant;
                if (img !== ''){
                    this.showRestaurant(img, name, address, aggregate_rating, cuisines, cost, menu_url, url)
                }
            })
            
        }

    }
}

(function(){
    const searchForm = document.getElementById('searchForm');
    const searchCity = document.getElementById('searchCity');
    const searchCategory = document.getElementById('searchCategory');

    const ejoka = new Ejoka();
    const ui = new UI();

    document.addEventListener('DOMContentLoaded', () => {
        ejoka.searchAPI().then(data => ui.addSelectOptions(data.categories));  
    })

    searchForm.addEventListener('submit', event => {
        event.preventDefault();

        const city = searchCity.value.toLowerCase();
        const categoryID = parseInt(searchCategory.value);
        if (city === '' || categoryID === 0){
            ui.showFeedback('Please enter City and Select Category');
        } else {
            ejoka.searchAPI(city).then(cityData => {
                if (cityData.cityID === 0){
                    ui.showFeedback('Please enter a valid city');
                } else {
                    ui.showLoader();
                    ejoka.searchAPI(city, categoryID).then(data => {
                        ui.getRestaurants(data.restaurants);
                    });
                    
                }
                
            })
        }
        
    })
})();