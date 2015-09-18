var account = new Account(window.location.host === 'accounts.gigavoid.com' ? 'http://accounts-api.gigavoid.com/' : 'http://localhost:3000');

account.ready = function() {
    log('Account.js is ready');
    loggedIn();
}

function login() {
    account.login(prompt('username'), prompt('password'), function (success, response) {
        logSR(success, response);
    });
}

function register() {
    account.register(prompt('username'), prompt('password'), function (success, response) {
        logSR(success, response);
    });
}

function loggedIn() {
    account.isLoggedIn(function (isLoggedIn) {
        log('Is logged in: ' + isLoggedIn);
    });
}

function verify() {
    account.verify(function (success, response) {
        logSR(success, response);
    });
}

function signOut() {
    account.signOut();
    log('Signed out');
}

function logSR(success, response) {
    console.log(success, response);
    log('account.login: ' + success + ' ' + JSON.stringify(response));
}

function log(msg) {
    document.querySelector('#log').innerHTML += '<p>' + msg + '</p>';
}
