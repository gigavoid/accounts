var account = new Account('http://accounts-api.gigavoid.com');

account.ready = function() {
    loggedIn();
}

document.getElementById('oneFormToRuleThemAll').addEventListener('submit', function(e) {
    if (document.querySelector('#submit').value === 'Create Account') {
        register();
    }
    else {
        login();
    }

    e.preventDefault();
});

document.getElementById('mail').addEventListener('blur', function() {
    account.isEmailTaken(document.querySelector('#mail').value, function (success, data) {
        console.log(success, data.taken);
        if (success) {
            document.querySelector('#submit').value = data.taken ? 'Log In' : 'Create Account';
        }
    });
});

document.querySelector('.logout').addEventListener('click', function() {
    account.signOut();
    setLoggedIn(false);
});

function login() {
    account.login(document.getElementById('mail').value, document.getElementById('pw').value, function (success, response) {
        setLoggedIn(success);
        if (!success) {
            alert(JSON.stringify(response));
        }
    });
}

function register() {
    account.register(document.getElementById('mail').value, document.getElementById('pw').value, function (success, response) {
        setLoggedIn(success);
        if (!success) {
            alert(JSON.stringify(response));
        }
    });
}

function loggedIn() {
    account.isLoggedIn(setLoggedIn);
}

function setLoggedIn(isLoggedIn) {
    if (!isLoggedIn) {
        document.querySelector('#oneFormToRuleThemAll').className = '';
        document.querySelector('#membersArea').className = 'hidden';
    }
    else {
        document.querySelector('#oneFormToRuleThemAll').className = 'hidden';
        document.querySelector('#membersArea').className = '';
    }
}

function verify() {
    account.verify(function (success, response) {
    });
}

function signOut() {
    account.signOut();
}

