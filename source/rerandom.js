// generate multiple instances
let factory = function() {
    var key_processor,
        post_processor;
    // track inputs
    let registry = new Map();
    let generator = Math.random;
    let instance = function(key) {
        // if the input is recognized,
        // return the previous value
        let lookup = key_processor ? key_processor(key) : key;
        if (key && lookup && registry.has(lookup)) {
            return registry.get(lookup);
        // if the input is not recognized,
        // compute a new random value and store it
        } else {
            let value = generator();
            // apply optional post-processing of the random value
            let result = post_processor ? post_processor(value, key) : value;
            registry.set(lookup, result);
            return result;
        }
    };
    // return or reset the internal registry
    instance.registry = function(input) {
        if (input === null) {
            registry = new Map();
            return instance;
        } else if (typeof input === 'undefined') {
            return registry;
        }
    };
    // get or set custom random number generator
    instance.generator = function(input) {
        if (input && typeof input === 'function') {
            if (typeof input() !== 'number') {
                let message = 'custom random generator must be a function that returns a number; to convert randomized numbers to contextually useful values, use the .post() method';
                throw new Error(message);
            } else {
              generator = input;
              return instance;
            }
        } else {
            return generator;
        }
    };
    // get or set key processing function
    // to be run on the inputs
    instance.key = function(input) {
        if (input && typeof input === 'function') {
            key_processor = input;
            return instance;
        } else {
            return key_processor;
        }
    };
    // get or set post-processing function
    // to be run on the random value
    instance.post = function(input) {
        if (input && typeof input === 'function') {
            post_processor = input;
            return instance;
        } else {
            return post_processor;
        }
    };
    return instance;
};

export { factory as rerandom };
