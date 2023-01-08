'use strict';
module.exports = createApi;
function createApi(options) {
  const basePath = '';
  const endpoint = options.endpoint || '';
  const cors = !!options.cors;
  const mode = cors ? 'cors' : 'basic';

  const securityHandlers = options.securityHandlers || {};
  const handleSecurity = (security, headers, params, operationId) => {
    return; //controllo fatto nel server
    //if(!securityHandlers(headers['authorization']))
    //return new Error('Unauthorized');
  }
  const buildQuery = (obj) => {
    return Object.keys(obj)
      .filter(key => typeof obj[key] !== 'undefined')
      .map((key) => {
        const value = obj[key];
        if (value === undefined) {
          return '';
        }
        if (value === null) {
          return key;
        }
        if (Array.isArray(value)) {
          if (value.length) {
            return key + '=' + value.map(encodeURIComponent).join('&' + key + '=');
          } else {
            return '';
          }
        } else {
          return key + '=' + encodeURIComponent(value);
        }
      }).join('&');
    };
  return {
    signup(parameters) {
      const params = typeof parameters === 'undefined' ? {} : parameters;
      let headers = {
        'content-type': 'application/json',

      };
      return fetch(endpoint + basePath + '/sign-up'
        , {
          method: 'POST',
          headers,
          mode,
          body: JSON.stringify(params['body']),

        });
    },
    login(parameters) {
      const params = typeof parameters === 'undefined' ? {} : parameters;
      let headers = {

      };
      return fetch(endpoint + basePath + '/login' + '?' + buildQuery({
          'email': params['email'],
          'password': params['password'],
        })

        , {
          method: 'GET',
          headers,
          mode,
        });
    },
    buy(parameters) {
      const params = typeof parameters === 'undefined' ? {} : parameters;
      let headers = {
        'authorization': params['authorization'],

      };
      handleSecurity([{"bearerAuth":[]}]
          , headers, params, 'buy');
      return fetch(endpoint + basePath + '/home/buy' + '?' + buildQuery({
          'from': params['from'],
          'amount': params['amount'],
        })

        , {
          method: 'GET',
          headers,
          mode,
        });
    },
    deposit(parameters) {
      const params = typeof parameters === 'undefined' ? {} : parameters;
      let headers = {
        'authorization': params['authorization'],

      };
      handleSecurity([{"bearerAuth":[]}]
          , headers, params, 'deposit');
      return fetch(endpoint + basePath + '/home/deposit' + '?' + buildQuery({
          'from': params['from'],
          'amount': params['amount'],
        })

        , {
          method: 'GET',
          headers,
          mode,
        });
    },
    withdraw(parameters) {
      const params = typeof parameters === 'undefined' ? {} : parameters;
      let headers = {
        'authorization': params['authorization'],

      };
      handleSecurity([{"bearerAuth":[]}]
          , headers, params, 'withdraw');
      return fetch(endpoint + basePath + '/home/withdraw' + '?' + buildQuery({
          'from': params['from'],
          'amount': params['amount'],
        })

        , {
          method: 'GET',
          headers,
          mode,
        });
    },
    listTransactions(parameters) {
      const params = typeof parameters === 'undefined' ? {} : parameters;
      let headers = {
        'content-type': 'application/json',
        'authorization': params['authorization'],

      };
      handleSecurity([{"bearerAuth":[]}]
          , headers, params, 'listTransactions');
      return fetch(endpoint + basePath + '/home/transactions'
        , {
          method: 'POST',
          headers,
          mode,
          body: JSON.stringify(params['body']),

        });
    },

  };
}
