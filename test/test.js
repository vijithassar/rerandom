var assert = require('assert'),
    rerandom = require('../');

describe('factory', function() {
    it('is a function', function() {
        assert(typeof rerandom === 'function');
    });
    it('returns a function', function() {
        assert(typeof rerandom() === 'function');
    });
});

describe('instance', function() {
    it('returns itself when chaining', function() {
        let instance = rerandom();
        let noop = function() {
            return;
        };
        assert(instance === instance.registry(null).post(noop).key(noop));
    });
    it('returns a number', function() {
        let instance = rerandom();
        let output = instance();
        assert(typeof output === 'number');
    });
});

describe('custom random number generators', function() {
    it('have a getter/setter method', function() {
        let instance = rerandom();
        assert(typeof instance.generator === 'function');
    });
    it('can be injected', function() {
        let instance = rerandom();
        let one = function() {
            return 1;
        };
        instance.generator(one);
        assert(one === instance.generator());
    });
    it('are used if injected', function() {
        let instance = rerandom();
        instance.generator(function() {
            return 1;
        });
        assert(instance() === 1);
    });
    it('must be functions that return numbers', function() {
        let instance = rerandom();
        try {
            instance.generator(function() {
                return true;
            });
        } catch (error) {
            assert(true);
        }
    });
    it('replace Math.random()', function() {
        let instance = rerandom();
        assert(instance.generator() === Math.random);
    });
});

describe('key processing function', function() {
    it('has a getter/setter method', function() {
        let instance = rerandom();
        assert(typeof instance.key === 'function');
    });
    it('is injected', function() {
        let instance = rerandom();
        let noop = function() {
            return;
        };
        instance.key(noop);
        assert(noop === instance.key());
    });
    it('is applied', function() {
        let instance = rerandom();
        instance.key(function(value) {
            return value + 1;
        });
        instance(1);
        assert(instance.registry().has(2));
    });
    it('can increase the frequency of matches', function() {
        let instance = rerandom();
        assert(instance(['a']) !== instance(['a']));
        instance.key(function(value) {
            return value + '';
        });
        assert(instance(['a']) === instance(['a']));
    });
});

describe('registry', function() {
    it('is exposed', function() {
        let instance = rerandom();
        let key = 'a';
        instance(key);
        let registry = instance.registry();
        assert(typeof registry === 'object');
        assert(registry.has(key));
    });
    it('can be reset', function() {
        let instance = rerandom();
        let key = 'a';
        instance(key);
        instance.registry(null);
        let registry = instance.registry();
        assert(registry.has(key) === false);
    });
    it('stores the input values', function() {
        let instance = rerandom();
        let key = 'a';
        instance(key);
        assert(instance.registry().has(key));
    });
});

describe('post-processing function', function() {
    it('has a getter/setter method', function() {
        let instance = rerandom();
        assert(typeof instance.post === 'function');
    });
    it('is injected', function() {
        let instance = rerandom();
        let noop = function() {
            return;
        };
        instance.post(noop);
        assert(noop === instance.post());
    });
    it('is applied', function() {
        let instance = rerandom().post(function(value) {
            return value + 1;
        });
        assert(typeof instance() === 'number');
        assert(instance() > 1 && instance() < 2);
    });
    it('can be used without an input key', function() {
        let instance = rerandom();
        instance.post(function(value) {
            return value + 1;
        });
        assert(instance() > 1);
    });
});

describe('randomization', function() {
    it('returns a number between 0 and 1', function() {
        let instance = rerandom();
        assert(typeof instance() === 'number');
        assert(instance() > 0 && instance() < 1);
    });
    it('randomizes only unknown inputs', function() {
        let instance = rerandom();
        let keys = ['a', 'b', 'b'];
        let results = keys.map(instance);
        assert(results[0] !== results[1]);
        assert(results[1] === results[2]);
    });
    it('returns consistent values for matching inputs', function() {
        let instance = rerandom();
        let keys = ['a', 'b', 'c', 'd', 'a', 'b', 'c', 'd'];
        let results = keys.map(instance);
        assert(results[0] === results[4]);
        assert(results[1] === results[5]);
        assert(results[2] === results[6]);
        assert(results[3] === results[7]);
    });
});
