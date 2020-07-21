class Ejoka {
    constructor(){
        this.api = 'eaf59a06684b739431331d13cc75060d';
        this.headers = {
            method: 'GET',
            headers: {
                'user-key': this.api,
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        }
    }
}

class UI {

}

(function(){
    const searchForm = document.getElementById('searchForm');
    const searchCity = document.getElementById('searchCity');
    const searchCategory = document.getElementById('searchCategory');

    const ejoka = new Ejoka();
    const ui = new UI();

    document.addEventListener('DOMContentLoaded', ()=>{

    })
})();