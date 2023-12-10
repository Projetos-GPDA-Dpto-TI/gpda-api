import axios from 'axios';

const endpoint = 'https://www.boredapi.com/api/activity';

axios.get(endpoint)
    .then(response => console.log(response.data))
