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

    async searchAPI(){
        const categoryURL = `https://developers.zomato.com/api/v2.1/categories`;
        
        const categoryInfo = await fetch(categoryURL, this.header);
        const categoryJSON = await categoryInfo.json();
        const categories = await categoryJSON.categories;

        return {
            categories
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
})();