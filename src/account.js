window.Account = function(accountServer) {
    var getCallbacks = {};

    var self = this;
    this.accountServer = accountServer;
    this.frame = createFrameElement(accountServer);



    self.login = function(username, password, cb) {
        post('/login', {
            username: username,
            password: password
        }, function (success, resp) {
            cb(success, resp);

            if (success) {
                store('key', resp.key);
            }
        });
    };

    self.getKey = function(cb) {
        get('key', function (resp) {
            cb(resp);
        });
    };

    self.register = function(username, password, cb) {
        post('/register', {
            username: username,
            password: password
        }, function (success, resp) {
            cb(success, resp);

            if (success) {
                store('key', resp.key);
            }
        });
    };

    self.isLoggedIn = function (callback) {
        get('key', function (resp) {
            callback(!!resp);
        });
    };

    self.setDisplayName = function(displayName, callback) {
        get('key', function (key) {
            post('/setDisplayName', {
                key: key,
                displayName: displayName
            }, callback);
        });
    };

    self.verify = function (cb) {
        get('key', function (key) {
            post('/verify', {
                key: key
            }, function (success, resp) {
                cb(success, resp);
            });
        });
    }

    self.signOut = function () {
        store('key', undefined);
    };

    self.isEmailTaken = function (email, callback) {
        post('/emailtaken', {
            email: email
        }, callback);
    };



    function post(api, body, callback) {
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    callback(true, JSON.parse(xmlhttp.responseText));
                } else {
                    callback(false, JSON.parse(xmlhttp.responseText));
                }
            }
        };
        
        xmlhttp.open('POST', self.accountServer + api, true);
        xmlhttp.setRequestHeader("Content-type", "application/json")
        xmlhttp.send(JSON.stringify(body));
    }


    this.frame.addEventListener('load', function() {
        if (self.ready) self.ready();
    });

    window.addEventListener('message', function(e) {
        getCallbacks[e.data.transactionKey](e.data.value);
        delete getCallbacks[e.data.transactionKey];
    });

    function createFrameElement() {
        var frame = document.createElement('iframe');
        frame.src = accountServer + '/frame';
        frame.style.cssText = 'width: 1px; height: 1px; position: absolute; top: -10px;';
        document.body.appendChild(frame);
        return frame;
    }


    /**
     * Get a value from the global localStorage
     */
    function get(key, cb) {
        var transactionKey = genTransactionKey();
        getCallbacks[transactionKey] = cb;
        self.frame.contentWindow.postMessage({
            action: 'get',
            key: key,
            transactionKey: transactionKey
        }, self.frame.src);
    }
    
    /**
     * Store a value at the global localStorage
     */
    function store(key, value) {
        self.frame.contentWindow.postMessage({
            action: 'store',
            key: key,
            value: value,
        }, self.frame.src);
    }
    
    function genTransactionKey() {
        var alphabet = 'abcdefghijklmnopqrstuvxyz';
        var numbers = '0123456789';
        var possible = alphabet + alphabet.toUpperCase() + numbers;

        key = '';
        for (var i = 0; i < 32; i++) {
            key += possible[Math.floor(Math.random() * possible.length)];
        }
        return key;
    }
};
