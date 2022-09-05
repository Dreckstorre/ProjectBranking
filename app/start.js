import fetch from 'node-fetch';
const URL = 'http://localhost:3000';
const clientId = 'BankinClientId';
const clientSecret = 'secret';
const headers = {
  'Content-Type': 'application/json',
  authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
};
let savedToken = '';

function main() {
  console.log('Started');
  login()
    .then((t) => {
      return token(t);
    })
    .then((e) => {
      return accounts();
    })
    .then((comptes) => {
      comptes.account.forEach((compte) => {
        compte.transactions = transactions(compte.acc_number);
      });

      return { comptes };
    })
    .then((compte) => {
      console.log(compte);
      return compte;
    })
    .then((e) => {
      console.log(e);
    });
}

function get(path) {
  return fetch(URL + path, {
    method: 'GET',
    headers,
  })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
}

function post(path, body) {
  return fetch(URL + path, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
}

function token(t) {
  return fetch(URL + '/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=refresh_token&refresh_token=' + t,
  })
    .then((response) => {
      return response.text();
    })
    .then((res) => {
      const json = JSON.parse(res);
      headers.authorization = 'Bearer ' + json.access_token;
    })
    .catch((err) => {
      console.log(err);
    });
}

function login() {
  return post('/login', {
    user: 'BankinUser',
    password: '12345678',
  })
    .then((e) => {
      return e.text();
    })
    .then((e) => {
      const token = JSON.parse(e).refresh_token;
      return token;
    });
}

function accounts() {
  return get('/accounts')
    .then((e) => {
      return e.text();
    })
    .then((e) => {
      return JSON.parse(e);
    });
}

function transactions(numeroCompte) {
  console.log(numeroCompte);
  return get('/accounts/' + numeroCompte + '/transactions')
    .then((e) => {
      return e.text();
    })
    .then((e) => {
      // console.log(e);
      return JSON.parse(e);
    });
}
main();
