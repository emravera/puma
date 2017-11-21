// Copyright (c) 2013 - present UTN-LIS

/* eslint quotes: 0, no-useless-escape: 0, no-unused-vars: 0 */

/**
 *      PUMASCRIPT ECMA-15 TEST SUITE
 * @file: Standard Built-in ECMAScript Objects
 */
define(['pumascript', 'esprima'], function (puma, esprima) {

    module("15.1: The Global Object");

    test("Value Properties of the Global Object: NaN", function () {
        var result = puma.evalPuma("NaN");
        result.makeValue();
        equal(result.success, true);
        equal(isNaN(result.value), true);
    });

    test("Value Properties of the Global Object: Infinity", function () {
        var result = puma.evalPuma("Infinity");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, Infinity);
    });

    test("Value Properties of the Global Object: Undefined", function () {
        var result = puma.evalPuma("undefined");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, undefined);
    });

    test("Function Properties of the Global Object: eval(x)", function () {
        var result = puma.evalPuma("eval(Number(1));");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 1);
    });

    test("Function Properties of the Global Object: eval(WrongSyntax)", function () {
        var err;
        try {
            var result = puma.evalPuma("eval(\"var 1;\");");
        } catch (e) {
            if (e instanceof SyntaxError) {
                equal(true, true);
            }
        }
    });

    test("Function Properties of the Global Object: eval()", function () {
        var result = puma.evalPuma("eval(\"var f = 'Lachesis'; f === 'Lachesis';\");");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("Function Properties of the Global Object: eval(string)", function () {
        var result = puma.evalPuma("eval(\"var f = 'Clotho'; f;\");");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'Clotho');
    });

    //SequenceExpression visitor not implemented yet
    QUnit.skip("Indirect Call to Eval", function () {
        var result = puma.evalPuma("var indirectEval = (1, eval); indirectEval(\"var f = 'Atropos'; f;\");");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'Atropos');
    });

    test("parseInt(string, radix)", function () {
        var result = puma.evalPuma("parseInt (' +2027ADX', 16);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 2107309);
    });

    test("parseInt(invalidParse)", function () {
        var result = puma.evalPuma("parseInt ('0xT');");
        result.makeValue();
        equal(result.success, true);
        equal(isNaN(result.value), true);
    });

    test("parseFloat(string)", function () {
        var result = puma.evalPuma("parseFloat(' -20.7N');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, -20.7);
    });

    test("parseFloat(invalidParse)", function () {
        var result = puma.evalPuma("parseFloat('UD4');");
        result.makeValue();
        equal(result.success, true);
        equal(isNaN(result.value), true);
    });

    test("isNaN(number)", function () {
        var result = puma.evalPuma("isNaN(0/0);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("isFinite(number)", function () {
        var result = puma.evalPuma("isFinite(2);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("encodeURI(string)", function () {
        var result = puma.evalPuma("encodeURI('https://www.googleapis.com/customsearch/v1?key=#5475&name=Malik, Faridah&birth=1999:Dearborn, Michigan, USA');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, "https://www.googleapis.com/customsearch/v1?key=#5475&name=Malik,%20Faridah&birth=1999:Dearborn,%20Michigan,%20USA");
    });

    test("decodeURI(string)", function () {
        var result = puma.evalPuma("decodeURI('https://www.googleapis.com/customsearch/v1?key=#5475&name=Malik,%20Faridah&birth=1999:Dearborn,%20Michigan,%20USA')");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, "https://www.googleapis.com/customsearch/v1?key=#5475&name=Malik, Faridah&birth=1999:Dearborn, Michigan, USA");
    });

    test("encodeURIComponent(string)", function () {
        var result = puma.evalPuma("encodeURIComponent('https://www.googleapis.com/customsearch/v1?key=5475&name=Malik, Faridah&birth=1999:Dearborn, Michigan@USA');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, "https%3A%2F%2Fwww.googleapis.com%2Fcustomsearch%2Fv1%3Fkey%3D5475%26name%3DMalik%2C%20Faridah%26birth%3D1999%3ADearborn%2C%20Michigan%40USA");
    });

    test("decodeURIComponent(string)", function () {
        var result = puma.evalPuma("decodeURIComponent('https%3A%2F%2Fwww.googleapis.com%2Fcustomsearch%2Fv1%3Fkey%3D5475%26name%3DMalik%2C%20Faridah%26birth%3D1999%3ADearborn%2C%20Michigan%40USA')");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, "https://www.googleapis.com/customsearch/v1?key=5475&name=Malik, Faridah&birth=1999:Dearborn, Michigan@USA");
    });

    module("15.2: Object Objects");

    test("Object(undefined)", function () {
        var result = puma.evalPuma("Object(undefined)");
        result.makeValue();
        equal(result.success, true);
        equal(JSON.stringify(result.value), JSON.stringify(new Object(undefined)));
    });

    test("Object(value)", function () {
        var result = puma.evalPuma("Object(4)");
        result.makeValue();
        equal(result.success, true);
        equal(JSON.stringify(result.value), JSON.stringify(new Object(4)));
    });

    test("Object Constructor", function () {
        var obj = new Object({
            Name: 'LEO',
            Terminal: 25000
        });
        var result = puma.evalPuma("new Object({Name:'LEO', Terminal:25000});");
        result.makeValue();
        equal(result.success, true);
        equal(JSON.stringify(result.value), JSON.stringify(obj));
    });

    test("Object.prototype", function () {
        var result = puma.evalPuma("Object.prototype.isPrototypeOf(Object());");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("Object.getPrototypeOf(Object)", function () {
        var a = Array('Atropos', 'Clotho', 'Lachesis');
        var result = puma.evalPuma("Object.getPrototypeOf(Array());");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.isPrototypeOf(a), true);
    });

    test("Object.getOwnPropertyDescriptor(O,P)", function () {
        var c = {
            value: 42,
            writable: true,
            enumerable: true,
            configurable: true
        };
        var result = puma.evalPuma("var o, d; o = { bar: 42 }; d = Object.getOwnPropertyDescriptor(o, 'bar');");
        result.makeValue();
        equal(result.success, true);
        equal(JSON.stringify(result.value), JSON.stringify(c));
    });

    //   If the argument to this method is not an object it will cause a TypeError. As of ES6, a non-object argument will be coerced to an object.   //

    test("Object.getOwnPropertyNames(Object)", function () {
        var c = ["0", "1", "2", "length"];
        var result = puma.evalPuma("var arr = ['Alpha', 'Beta', 'Gamma']; Object.getOwnPropertyNames(arr);");
        result.makeValue();
        equal(result.success, true);
        equal(JSON.stringify(result.value), JSON.stringify(c));
    });

    test("Object.create(O [, Properties])", function () {
        var c = {
            value: "Puma",
            writable: true,
            enumerable: false,
            configurable: false
        };
        var result = puma.evalPuma("var o = Object.create(null, { foo: { writable: true, configurable: false, enumerable: false, value: 'Puma' }, bar: { value: 20 } } ); o;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.bar, 20);
        equal(JSON.stringify(Object.getOwnPropertyDescriptor(result.value, 'foo')), JSON.stringify(c));
    });

    test("Object.defineProperty(O, P, Attributes)", function () {
        var c = {
            value: "Rawr!",
            writable: true,
            enumerable: false,
            configurable: true
        };
        var result = puma.evalPuma("var o = Object(); Object.defineProperty(o, 'puma', { configurable: true, writable: true, value: 'Rawr!' } ); o;");
        result.makeValue();
        equal(result.success, true);
        equal(JSON.stringify(Object.getOwnPropertyDescriptor(result.value, 'puma')), JSON.stringify(c));
    });

    test("Object.defineProperties(O, Properties)", function () {
        var c = {
            value: "Rawr!",
            writable: true,
            enumerable: false,
            configurable: false
        };
        var result = puma.evalPuma("var o = Object(); Object.defineProperties(o, { 'puma': { writable: true, value: 'Rawr!' }, 'script': { value: true } } ); o;");
        result.makeValue();
        equal(result.success, true);
        equal(JSON.stringify(Object.getOwnPropertyDescriptor(result.value, 'puma')), JSON.stringify(c));
        equal(result.value.script, true);
    });

    test("Object.seal(O)", function () {
        var c = {
            value: "Shaher",
            writable: true,
            enumerable: false,
            configurable: false
        };
        var result = puma.evalPuma("var Fallen = Object.create(null, { name: { writable: true, configurable: true, value: 'Shaher' } } ); Object.seal(Fallen);");
        result.makeValue();
        equal(result.success, true);
        equal(JSON.stringify(Object.getOwnPropertyDescriptor(result.value, 'name')), JSON.stringify(c));
        equal(Object.isExtensible(result.value), false);
    });

    test("Object.freeze(O)", function () {
        var c = {
            value: "Shaher",
            writable: false,
            enumerable: false,
            configurable: false
        };
        var result = puma.evalPuma("var Fallen = Object.create(null, { name: { writable: true, configurable: true, value: 'Shaher' } } ); Object.freeze(Fallen);");
        result.makeValue();
        equal(result.success, true);
        equal(JSON.stringify(Object.getOwnPropertyDescriptor(result.value, 'name')), JSON.stringify(c));
        equal(Object.isExtensible(result.value), false);
    });

    test("Object.preventExtensions(O)", function () {
        var result = puma.evalPuma("var Fallen = Object.create(null, { name: { writable: true, configurable: true, value: 'Shaher' } } ); Object.preventExtensions(Fallen);");
        result.makeValue();
        equal(result.success, true);
        equal(Object.isExtensible(result.value), false);
    });

    test("Object.isSealed(O)", function () {
        var result = puma.evalPuma("var Fallen = Object.create(null, { name: { writable: true, configurable: true, value: 'Shaher' } } ); Object.seal(Fallen); Object.isSealed(Fallen);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("Object.isFrozen(O)", function () {
        var result = puma.evalPuma("var Fallen = Object.create(null, { name: { writable: true, configurable: true, value: 'Shaher' } } ); Object.freeze(Fallen); Object.isFrozen(Fallen);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("Object.isExtensible(O)", function () {
        var result = puma.evalPuma("var Fallen = Object.create(null, { name: { writable: true, configurable: true, value: 'Shaher' } } ); Object.preventExtensions(Fallen); Object.isExtensible(Fallen);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, false);
    });

    test("Object.keys(O)", function () {
        var a = ["name", "lv", "lead"];
        var result = puma.evalPuma("var Fallen = Object.create(null, { name: { writable:true, configurable:true, enumerable:true, value: 'Shaher' }, hp: { writable:true, enumerable:false, value: 617 }, lv: { configurable: true, enumerable: true, value: 32 }, lead: { configurable: false, enumerable: true, value: true } } ); Object.keys(Fallen);");
        result.makeValue();
        equal(result.success, true);
        equal(JSON.stringify(result.value), JSON.stringify(a));
    });

    test("Object.prototype.constructor", function () {
        var result = puma.evalPuma("Object.prototype.constructor === Object().constructor;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("Object.prototype.toString()", function () {
        var result = puma.evalPuma("var toStringP = Object.prototype.toString; toStringP.call(Math);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '[object Math]');
    });

    //it's working on puma's editor but not on travis's tasks (Check why result.value == "[object DOMWindow]")
    QUnit.skip("Object.prototype.toString(): undefined", function () {
        var result = puma.evalPuma("var toStringU = Object.prototype.toString; toStringU.call(undefined);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '[object Undefined]');
    });

    //it's working on puma's editor but not on travis's tasks (Check why result.value == "[object DOMWindow]")
    QUnit.skip("Object.prototype.toString(): null", function () {
        var result = puma.evalPuma("var toStringN = Object.prototype.toString; toStringN.call(null);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '[object Null]');
    });

    test("Object.prototype.toLocaleString()", function () {
        var result = puma.evalPuma("var toLocaleStringP = Object.prototype.toLocaleString; toLocaleStringP.call(Math);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '[object Math]');
    });

    test("Object.prototype.valueOf()", function () {
        var oni = Object.create(null, {
            height: {
                value: 1
            },
            width: {
                value: 6
            },
            color: {
                value: 'red'
            }
        });
        var result = puma.evalPuma("var ono = Object.create(null, { height: { value: 1 }, width: { value: 6 }, color: { value: 'red' } }); var valueOfO = Object.prototype.valueOf; valueOfO.call(ono);");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value.height, 1);
        equal(result.value.width, 6);
        equal(result.value.color, 'red');
    });

    test("Object.prototype.hasOwnProperty(V)", function () {
        var result = puma.evalPuma("var ono = Object.create(null, { height: { value: 1 }, width: { value: 6 }, color: { value: 'red' } }); Object.prototype.hasOwnProperty.call(ono, 'color');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("Object.prototype.isPrototypeOf(V)", function () {
        var result = puma.evalPuma("var oni = Object.create(null); oni.prototype = Object.prototype; oni.prototype.isPrototypeOf(Object);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("Object.prototype.propertyIsEnumerable(V)", function () {
        var result = puma.evalPuma("var ono = Object.create(null, { color: { enumerable: true, value: 'red' }, range: { enumerable: false, value: 'red' } }); var pIE = Object.prototype.propertyIsEnumerable; pIE.call(ono, 'color') && !pIE.call(ono, 'range');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    module("15.3: Function Objects");

    test("The Function Constructor Called as a Function", function () {
        var a = new Function();
        var result = puma.evalPuma("var e = Function(); e.toString();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, a.toString());
    });

    test("The Function Constructor Called as a new Function", function () {
        var a = new Function();
        var result = puma.evalPuma("var e = new Function(); e.toString();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, a.toString());
    });

    test("Function(p1,p2, … ,pn,body)", function () {
        var result = puma.evalPuma("var r = Function('x', 'fx', 'h', 'd', 'return x+fx+h+d'); r.call(this,6,8,7,0);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 21);
    });

    test("The Function Constructor", function () {
        var result = puma.evalPuma("var r = new Function('Sapph', 'ire', 'AMD', 'R', 'return Sapph+ire+AMD+R'); r.call(this,9,3,8,0);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 20);
    });

    test("Function.prototype", function () {
        var result = puma.evalPuma("Function.prototype;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'function');
    });

    test("Function.length", function () {
        var result = puma.evalPuma("Function.length;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 1);
    });

    test("Properties of the Function Prototype Object", function () {
        var result = puma.evalPuma("Function.prototype.length;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 0);
    });

    test("Function.prototype.constructor", function () {
        var c = Function('character', 'dialog', "return character+': \"'+dialog+'\"'").prototype.constructor.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("var transcript = Function('character', 'dialog', \"return character+': \\\"'+dialog+'\\\"'\"); transcript.prototype.constructor;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("Function.prototype.constructor.toString()", function () {
        var c = Function('character', 'dialog', "return character+': \"'+dialog+'\"'").prototype.constructor.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("var transcript = Function('character', 'dialog', \"return character+': \\\"'+dialog+'\\\"'\"); transcript.prototype.constructor.toString();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("Function.prototype.toString()", function () {
        var result = puma.evalPuma("var transcript = Function('character', 'dialog', \"return character+': \\\"'+dialog+'\\\"'\"); transcript.prototype.toString();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '[object Object]');
    });

    test("Function.prototype.apply(thisArg, argArray)", function () {
        var result = puma.evalPuma("var transcript = Function('character', 'dialog', \"return character+': \\\"'+dialog+'\\\"'\"); transcript.apply(this, ['Eleanor', \"I'm sorry, Alphonse. I couldn't keep my promise...\"]);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, "Eleanor: \"I'm sorry, Alphonse. I couldn't keep my promise...\"");
    });

    test("Function.prototype.call(thisArg [, arg1 [, arg2, … ]])", function () {
        var result = puma.evalPuma("var transcript = Function('character', 'dialog', \"return character+': \\\"'+dialog+'\\\"'\"); transcript.call(this, 'Alphonse', \"Good-bye, Eleanor.\");");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, "Alphonse: \"Good-bye, Eleanor.\"");
    });

    //it's working on puma's editor but not on travis's tasks (Check why result.success == false and result.value == null)
    QUnit.skip("Function.prototype.bind(thisArg [, arg1 [, arg2, … ]])", function () {
        var result = puma.evalPuma("var scope = 'global'; var order = { action: 'move', scope: 'flank', subject: 'ridge', getScope: Function('return this.scope;') }; var unbound_scope = order.getScope; var order_scope = unbound_scope.bind(order); order_scope();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'flank');
    });

    //it's working on puma's editor but not on travis's tasks
    QUnit.skip("[[Call]] internal method", function () {
        var result = puma.evalPuma("var scope = 'global'; var order = { action: 'move', scope: 'flank', subject: 'ridge', getScope: Function('return this.scope;') }; var unbound_scope = order.getScope; var order_scope = unbound_scope.bind(order); order_scope.call(this);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'flank');
    });

    //TypeError: Object prototype may only be an Object or null: undefined
    QUnit.skip("[[Construct]] internal method", function () {
        var result = puma.evalPuma("var scope = 'global'; var order = { action: 'move', scope: 'flank', subject: 'ridge', getScope: Function('return this.scope;') }; var unbound_scope = order.getScope; var order_scope = unbound_scope.bind(order); var o = new order_scope; o.toString();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '[object Object]');
    });

    //TypeError: Object prototype may only be an Object or null: undefined
    QUnit.skip("[[HasInstance]] internal method", function () {
        var result = puma.evalPuma("var scope = 'global'; var order = { action: 'move', scope: 'flank', subject: 'ridge', getScope: Function('return this.scope;') }; var unbound_scope = order.getScope; var order_scope = unbound_scope.bind(order); var o = new order_scope; o instanceof unbound_scope;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("Properties of Function Instances: length", function () {
        var result = puma.evalPuma("var str = Function('item', 'quantity', 'location', \"console.log('NOT IMPLEMENTED...');\"); str.length;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 3);
    });

    test("Properties of Function Instances: prototype", function () {
        var str = Function('item', 'quantity', 'location', "console.log('NOT IMPLEMENTED...');");
        var c = str.prototype.constructor.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("var str = Function('item', 'quantity', 'location', \"console.log('NOT IMPLEMENTED...');\"); str.prototype;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.constructor.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    //TypeError: Cannot read property 'makeValue' of undefined
    QUnit.skip("[[HasInstance]] (V)", function () {
        var result = puma.evalPuma("function store(item, quantity, location) { /**/ }; var a = new store; a instanceof store;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("[[Get]] (P)", function () {
        var result = puma.evalPuma("var foo = function store(item, quantity, location) { /**/ }; foo.name;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'store');
    });

    module("15.4: Array Objects");

    test("The Array Constructor Called as a Function", function () {
        var result = puma.evalPuma("var a = Array(); a;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(JSON.stringify(result.value), '[]');
    });

    test("Array([ item1 [, item2 [, ... ]]])", function () {
        var result = puma.evalPuma("var a = Array(16, 'F', true, [7, 'M', false], Object.create(null,{ name: { value: 'Zion' } })); a;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value[0], 16);
        equal(result.value[1], 'F');
        equal(result.value[2], true);
        equal(result.value[3], '7,M,false');
        equal(result.value[4].name, 'Zion');
    });

    test("The Array Constructor", function () {
        var result = puma.evalPuma("var a = new Array(); a;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(JSON.stringify(result.value), '[]');
    });

    test("new Array([ item0 [, item1 [, ... ]]])", function () {
        var result = puma.evalPuma("var a = new Array(16, 'F', true, [7, 'M', false], Object.create(null,{ name: { value: 'Zion' } })); a;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value[0], 16);
        equal(result.value[1], 'F');
        equal(result.value[2], true);
        equal(result.value[3], '7,M,false');
        equal(result.value[4].name, 'Zion');
    });

    test("new Array(len)", function () {
        var result = puma.evalPuma("var a = new Array(4); a;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value.length, 4);
    });

    test("Properties of the Array Constructor", function () {
        var c = Function.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("Array;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.length, 1);
        equal(result.value.constructor.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("Array.prototype", function () {
        var result = puma.evalPuma("Array.prototype;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString(), '');
    });

    test("Array.isArray(arg)", function () {
        var result = puma.evalPuma("var a = Array('R36','L10','R59','R97'); Array.isArray(a);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("Properties of the Array Prototype Object", function () {
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(Array, 'prototype');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.value, '');
        equal(result.value.writable, false);
        equal(result.value.enumerable, false);
        equal(result.value.configurable, false);
    });

    test("Array.prototype.constructor", function () {
        var c = Array.prototype.constructor.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("Array.prototype.constructor;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("Array.prototype.toString()", function () {
        var result = puma.evalPuma("var a = Array('R36','L10','R59','R97'); a.toString();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'R36,L10,R59,R97');
    });

    test("Array.prototype.toLocaleString()", function () {
        var a = Array(1200.96, 0.223);
        var c = a.toLocaleString();
        var result = puma.evalPuma("var a = Array(1200.96, 0.223); a.toLocaleString();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, c);
    });

    test("Array.prototype.concat([ item1 [, item2 [, ... ]]])", function () {
        var result = puma.evalPuma("var a = Array('OK'); a = a.concat('SWITCH'); a.concat('CANCEL', 'CANCEL');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'OK,SWITCH,CANCEL,CANCEL');
    });

    test("Array.prototype.join()", function () {
        var result = puma.evalPuma("var a = Array('R36','L10','R59','R97'); a.toString();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'R36,L10,R59,R97');
    });

    test("Array.prototype.join(separator)", function () {
        var result = puma.evalPuma("var a = Array('R36','L10','R59','R97'); a.join('-');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'R36-L10-R59-R97');
    });

    test("Array.prototype.pop()", function () {
        var result = puma.evalPuma("var a = Array(4,8,15,16,23,42); a.pop();");
        var result2 = puma.evalPuma("var b = Array('R36','L10','R59','R97'); b.pop(); b.valueOf();");
        result.makeValue();
        equal(result.success && result2.success, true);
        equal(result.value, 42);
        equal(result2.value.toString(), 'R36,L10,R59');
    });

    test("Array.prototype.push([ item1 [, item2 [, ... ]]])", function () {
        var result = puma.evalPuma("var a = Array(4,8,15,16,23); a.push(42);");
        var result2 = puma.evalPuma("var b = Array('R36','L10','R59'); b.push('R97'); b.valueOf();");
        result.makeValue();
        equal(result.success && result2.success, true);
        equal(result.value, 6);
        equal(result2.value.toString(), 'R36,L10,R59,R97');
    });

    test("Array.prototype.reverse()", function () {
        var result = puma.evalPuma("var a = Array(4,8,15,16,23,42); a.reverse();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString(), '42,23,16,15,8,4');
    });

    test("Array.prototype.shift()", function () {
        var result = puma.evalPuma("var a = Array(4,8,15,16,23,42); a.shift();");
        var result2 = puma.evalPuma("var b = Array('R36','L10','R59','R97'); b.shift(); b.valueOf();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 4);
        equal(result2.value.toString(), 'L10,R59,R97');
    });

    test("Array.prototype.slice(start, end)", function () {
        var result = puma.evalPuma("var a = Array(4,8,15,16,23,42); a.slice(2, '5');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString(), '15,16,23');
    });

    test("Array.prototype.sort(comparefn)", function () {
        var result = puma.evalPuma("var a = Array(15,42,23,4,16,8); a.sort(Function('n0','n1','return n0-n1;'));");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString(), '4,8,15,16,23,42');
    });

    test("Array.prototype.splice(start, deleteCount [, item1 [, item2 [, ... ]]])", function () {
        var result = puma.evalPuma("var a = Array(4,9); a.splice(1,1,2,6);");
        var result2 = puma.evalPuma("var b = Array('OK','SWITCH','CANCEL','SELECT','CANCEL'); var r = b.splice(3,1); b.valueOf();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString(), '9');
        equal(result2.value.toString(), 'OK,SWITCH,CANCEL,CANCEL');
    });

    test("Array.prototype.unshift([ item1 [, item2 [, ... ]]])", function () {
        var result = puma.evalPuma("var a = Array(16,23,42); a.unshift(4,8,15);");
        var result2 = puma.evalPuma("var b = Array('L10','R59','R97'); b.unshift('R36'); b.valueOf();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 6);
        equal(result2.value.toString(), 'R36,L10,R59,R97');
    });

    test("Array.prototype.indexOf(searchElement [, fromIndex ])", function () {
        var result = puma.evalPuma("var a = Array('0123','2121','5475','3716','9637','4145'); a.indexOf('4145');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 5);
    });

    test("Array.prototype.indexOf(nonPresentElement [, fromIndex ])", function () {
        var result = puma.evalPuma("var a = Array('0123','2121','5475','3716','9637','4145'); a.indexOf('7256',2);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, -1);
    });

    test("Array.prototype.lastIndexOf(searchElement [, fromIndex ])", function () {
        var result = puma.evalPuma("var a = Array('0123','2121','5475','3716','9637','4145','0250','1364','9642','5475','7256','3167'); a.lastIndexOf('5475');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 9);
    });

    test("Array.prototype.lastIndexOf(nonPresentElement [, fromIndex ])", function () {
        var result = puma.evalPuma("var a = Array('0250','1364','9642','5475','7256','3167'); a.lastIndexOf('2121,2');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, -1);
    });

    test("Array.prototype.every(callbackfn)", function () {
        var result = puma.evalPuma("var a = Array(2.5,13.64,9.642,5,4,0.75,2,31); a.every(Function('e','i','ar','return e > 0;'));");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("Array.prototype.every(callbackfn [, thisArg ])", function () {
        var result = puma.evalPuma("var reference = {refV: 0.25}; var a = Array(2.5,13.64,9.642,5,4,0.75,2,31); a.every(Function('e','i','ar','return e > this.refV;'), reference);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("Array.prototype.some(callbackfn)", function () {
        var result = puma.evalPuma("var a = Array(2.5,13.64,9.642,5,4,0.75,2,31); a.some(Function('e','i','ar','return e > 12;'));");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("Array.prototype.some(callbackfn [, thisArg ])", function () {
        var result = puma.evalPuma("var reference = {refV: 27}; var a = Array(2.5,13.64,9.642,5,4,0.75,2,31); a.some(Function('e','i','ar','return e > this.refV;'), reference);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("Array.prototype.forEach(callbackfn)", function () {
        var result = puma.evalPuma("var a = Array(2.5,13.64,9.642,5,4,0.75,2,31); a.forEach(Function('e','i','ar','ar[i]=e%2;')); a.valueOf();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '0.5,1.6400000000000006,1.6419999999999995,1,0,0.75,0,1');
    });

    test("Array.prototype.forEach(callbackfn [, thisArg ])", function () {
        var result = puma.evalPuma("var that = {a: Array(8)}; var a = Array(2.5,13.64,9.642,5,4,0.75,2,31); a.forEach(Function('e','i','ar','this.a[i]=e%0.25;'), that); that.a.valueOf();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '0,0.14000000000000057,0.14199999999999946,0,0,0,0,0');
    });

    test("Array.prototype.map(callbackfn)", function () {
        var result = puma.evalPuma("var a = Array(2.5,13.64,9.642,5,4,0.75,2,31); a.map(Function('e','i','ar','return e*i;'));");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '0,13.64,19.284,15,16,3.75,12,217');
    });

    test("Array.prototype.map(callbackfn [, thisArg ])", function () {
        var result = puma.evalPuma("var reference = {a: 15}; var a = Array(2.5,13.64,9.642,5,4,0.75,2,31); a.map(Function('e','i','ar','return e*i-this.a;'), reference);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '-15,-1.3599999999999994,4.283999999999999,0,1,-11.25,-3,202');
    });

    test("Array.prototype.filter(callbackfn)", function () {
        var result = puma.evalPuma("var a = Array(2.5,13.64,9.642,5,4,0.75,2,31); a.filter(Function('e','i','ar','if (e%2==0) {return true;};'));");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '4,2');
    });

    test("Array.prototype.filter(callbackfn [, thisArg ])", function () {
        var result = puma.evalPuma("var reference = {a: 2.5}; var a = Array(2.5,13.64,9.642,5,4,0.75,2,31); a.filter(Function('e','i','ar','if (e%this.a==0) {return true;};'), reference);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '2.5,5');
    });

    test("Array.prototype.reduce(callbackfn)", function () {
        var result = puma.evalPuma("var a = Array(2.5,13.64,9.642,5,4,0.75,2,31); a.reduce(Function('pv','cv','i','ar','return cv-pv;'));");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 32.248000000000005);
    });

    test("Array.prototype.reduce(callbackfn [, initialValue ])", function () {
        var result = puma.evalPuma("var a = Array(2.5,13.64,9.642,5,4,0.75,2,31); a.reduce(Function('pv','cv','i','ar','return cv-pv-i;'), -27);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 1.248000000000001);
    });

    test("Array.prototype.reduceRight(callbackfn)", function () {
        var result = puma.evalPuma("var a = Array(2.5,13.64,9.642,5,4,0.75,2,31); a.reduceRight(Function('pv','cv','i','ar','return cv-pv;'));");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, -32.248000000000005);
    });

    test("Array.prototype.reduceRight(callbackfn [, initialValue ])", function () {
        var result = puma.evalPuma("var a = Array(2.5,13.64,9.642,5,4,0.75,2,31); a.reduceRight(Function('pv','cv','i','ar','return cv-pv-i;'), 27);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, -1.248000000000001);
    });

    test("Properties of Array Instances", function () {
        var pd = {
            value: 4,
            writable: true,
            enumerable: false,
            configurable: false
        };
        var result = puma.evalPuma("var a = [36,10,59,97]; Object.defineProperty(a, '0', { writable: false, value: 7 }); a[1] = 0; Object.defineProperty(a, '2', { enumerable: false, value: 0 }); Object.defineProperty(a, '3', { enumerable: false }); a.valueOf();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.propertyIsEnumerable('0'), true);
        equal(result.value.propertyIsEnumerable('1'), true);
        equal(result.value.propertyIsEnumerable('2'), false);
        equal(result.value.propertyIsEnumerable('3'), false);
        equal(JSON.stringify(Object.getOwnPropertyDescriptor(result.value, 'length')), JSON.stringify(pd));
        equal(result.value.toString(), '7,0,0,97');
    });

    module("15.5: String Objects");

    test("The String Constructor Called as a Function", function () {
        var result = puma.evalPuma("var s = String(); s;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '');
    });

    test("String([ns])", function () {
        var result = puma.evalPuma("var s = String(4); s;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '4');
    });

    test("String([value])", function () {
        var result = puma.evalPuma("var s = String('Puma'); s;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'Puma');
    });

    test("The String Constructor", function () {
        var result = puma.evalPuma("var s = new String(); s;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value.valueOf(), '');
    });

    test("new String([ns])", function () {
        var result = puma.evalPuma("var s = new String(0004); s;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value.length, 1);
        equal(result.value.valueOf(), '4');
    });

    test("new String([value])", function () {
        var result = puma.evalPuma("var s = new String('Puma'); s;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value.length, 4);
        equal(result.value.valueOf(), 'Puma');
    });

    test("Properties of the String Constructor", function () {
        var c = Function.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("String;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.length, 1);
        equal(result.value.constructor.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("String.prototype", function () {
        var result = puma.evalPuma("String.prototype;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.length, 0);
        equal(result.value.valueOf(), '');
    });

    test("String.fromCharCode([ char0 [, char1 [, ... ]]])", function () {
        var result = puma.evalPuma("String.fromCharCode(85, 110, 100, 114, 101, 52, 109);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'Undre4m');
    });

    test("Properties of the String Prototype Object", function () {
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(String, 'prototype');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.value.toString(), '');
        equal(result.value.writable, false);
        equal(result.value.enumerable, false);
        equal(result.value.configurable, false);
    });

    test("String.prototype.constructor", function () {
        var c = String.prototype.constructor.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("String.prototype.constructor;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("String.prototype.toString()", function () {
        var result = puma.evalPuma("var s = String('Puma'); s.toString();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'Puma');
    });

    test("String.prototype.valueOf()", function () {
        var result = puma.evalPuma("var s = String('Puma'); s.valueOf();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'Puma');
    });

    test("String.prototype.charAt(pos)", function () {
        var result = puma.evalPuma("var s = String('Puma'); s.charAt(0);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'P');
    });

    test("String.prototype.charCodeAt(pos)", function () {
        var result = puma.evalPuma("var s = String('Puma'); s.charCodeAt(0);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 80);
    });

    test("String.prototype.charCodeAt(non_valid_pos)", function () {
        var result = puma.evalPuma("var s = String('Puma'); s.charCodeAt(4);");
        result.makeValue();
        equal(result.success, true);
        equal(isNaN(result.value), true);
    });

    test("String.prototype.concat([ string1 [, string2 [, ... ]]])", function () {
        var result = puma.evalPuma("var s = String('Puma'); s.concat('Sc', 'r', 'ip', 't');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'PumaScript');
    });

    test("String.prototype.indexOf(ns)", function () {
        var result = puma.evalPuma("var s = String('Undre4m'); s.indexOf(4);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 5);
    });

    test("String.prototype.indexOf(searchChar)", function () {
        var result = puma.evalPuma("var s = String(\"Hetalia\'s torpor\"); s.indexOf('a', undefined);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 3);
    });

    test("String.prototype.indexOf(searchString, position)", function () {
        var result = puma.evalPuma("var s = String(\"Hetalia\'s torpor\"); s.indexOf('or', 9);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 11);
    });

    test("String.prototype.indexOf(non_present_string, after_position)", function () {
        var result = puma.evalPuma("var s = String(\"Hetalia\'s torpor\"); s.indexOf('S', 7);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, -1);
    });

    test("String.prototype.lastIndexOf(ns)", function () {
        var result = puma.evalPuma("var s = String('Undre4m'); s.indexOf(4);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 5);
    });

    test("String.prototype.lastIndexOf(searchChar)", function () {
        var result = puma.evalPuma("var s = String(\"Hetalia\'s torpor\"); s.lastIndexOf('a', undefined);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 6);
    });

    test("String.prototype.lastIndexOf(searchString, position)", function () {
        var result = puma.evalPuma("var s = String(\"Hetalia\'s torpor\"); s.lastIndexOf('alia\\\'s', 15);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 3);
    });

    test("String.prototype.lastIndexOf(non_present_string, after_position)", function () {
        var result = puma.evalPuma("var s = String(\"Hetalia\'s torpor\"); s.lastIndexOf('ETA', 6);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, -1);
    });

    test("String.prototype.localeCompare(that)", function () {
        var result = puma.evalPuma("var s = String('Hecate'); s.localeCompare('Hetalia');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value < 0, true);
    });

    test("String.prototype.match(expression)", function () {
        var result = puma.evalPuma("var s = String('root:$6$Ke02nYgo.9v0SF4p$hjztYvo/M4buqO4oBX8KZTftjCn6fE4cV5o/I95QPekeQpITwFTRbDUBYBLIUx2mhorQoj9bLN8v.w6btE9xy1:16431:0:99999:7:::'); s.match(/:([*!]{0,2}|[a-z0-9.$/]{0,128}):/i);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value[1], '$6$Ke02nYgo.9v0SF4p$hjztYvo/M4buqO4oBX8KZTftjCn6fE4cV5o/I95QPekeQpITwFTRbDUBYBLIUx2mhorQoj9bLN8v.w6btE9xy1');
    });

    test("String.prototype.match(regexp)", function () {
        var result = puma.evalPuma("var rex = RegExp(/:([*!]{0,2}|[a-z0-9.$/]{0,128}):/i); var s = String('root:$6$Ke02nYgo.9v0SF4p$hjztYvo/M4buqO4oBX8KZTftjCn6fE4cV5o/I95QPekeQpITwFTRbDUBYBLIUx2mhorQoj9bLN8v.w6btE9xy1:16431:0:99999:7:::'); s.match(rex);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value[1], '$6$Ke02nYgo.9v0SF4p$hjztYvo/M4buqO4oBX8KZTftjCn6fE4cV5o/I95QPekeQpITwFTRbDUBYBLIUx2mhorQoj9bLN8v.w6btE9xy1');
    });

    test("String.prototype.replace(searchValue, replaceValue)", function () {
        var result = puma.evalPuma("var s = String('Hetalia'); s.replace('Het', 'Gen');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'Genalia');
    });

    test("String.prototype.replace(regexp, function)", function () {
        var result = puma.evalPuma("var rex = RegExp(/([a-z]+) ([a-z']+)/i); var s = String('Lucas Astrada'); s.replace(rex, '$2, $1');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'Astrada, Lucas');
    });

    test("String.prototype.search(expression)", function () {
        var result = puma.evalPuma("var s = String('root:$6$Ke02nYgo.9v0SF4p$hjztYvo/M4buqO4oBX8KZTftjCn6fE4cV5o/I95QPekeQpITwFTRbDUBYBLIUx2mhorQoj9bLN8v.w6btE9xy1:16431:0:99999:7:::'); s.search(/:([*!]{0,2}|[a-z0-9.$/]{0,128}):/i);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 4);
    });

    test("String.prototype.search(regexp)", function () {
        var result = puma.evalPuma("var rex = RegExp(/:([*!]{0,2}|[a-z0-9.$/]{0,128}):/i); var s = String('root:$6$Ke02nYgo.9v0SF4p$hjztYvo/M4buqO4oBX8KZTftjCn6fE4cV5o/I95QPekeQpITwFTRbDUBYBLIUx2mhorQoj9bLN8v.w6btE9xy1:16431:0:99999:7:::'); s.search(rex);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 4);
    });

    test("String.prototype.search(non_matching_regexp)", function () {
        var result = puma.evalPuma("var rex = RegExp(/:[*!]{1,2}:/i); var s = String('mandar:$6$5H0QpwprRiJQR19Y$bXGOh7dIfOWpUb/Tuqr7yQVCqL3UkrJns9.7msfvMg4ZO/PsFC5Tbt32PXAw9qRFEBs1254aLimFeNM8YsYOv.:16431:0:99999:7:::'); s.search(rex);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, -1);
    });

    test("String.prototype.slice(start, end)", function () {
        var result = puma.evalPuma("var s = String('Illumination'); s.slice(2, 8);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'lumina');
    });

    test("String.prototype.slice(negative_start, negative_end_string)", function () {
        var result = puma.evalPuma("var s = String('Illumination'); s.slice(-9, '-6');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'umi');
    });

    test("String.prototype.slice(start_string)", function () {
        var result = puma.evalPuma("var s = String('Illumination'); s.slice('6', undefined);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'nation');
    });

    test("String.prototype.split()", function () {
        var a = ["Pina"];
        var result = puma.evalPuma("var s = String('Pina'); s.split(undefined, undefined);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString(), a.toString());
    });

    test("String.prototype.split(empty_string)", function () {
        var a = ["P", "i", "n", "a"];
        var result = puma.evalPuma("var s = String('Pina'); s.split('', undefined);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString(), a.toString());
    });

    test("String.prototype.split(empty_matching_regexp)", function () {
        var a = ["P", "i", "n", "a"];
        var result = puma.evalPuma("var s = String('Pina'); s.split(RegExp(/ {0}/));");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString(), a.toString());
    });

    test("String.prototype.split(separator, limit)", function () {
        var a = ["15m", "EA9BO", "AF", "Ceuta & Melilla", "9818.891", "32", "21.076945", "IM75", "JT65"];
        var result = puma.evalPuma("var s = '15m,EA9BO,AF,Ceuta & Melilla,9818.891,32,21.076945,IM75,JT65,FF77,EA9,Y,-18,-09,LW2EIY/H,210000,210000,20160714'; s.split(',', 9);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString(), a.toString());
    });

    test("String.prototype.split(expression, limit_string)", function () {
        var a = ["ssh", "22", "tcp"];
        var result = puma.evalPuma("var s = 'ssh     22/tcp       #SSH Remote Login Protocol'; s.split(/  +|[/]/, '3');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString(), a.toString());
    });

    test("String.prototype.split(regexp)", function () {
        var a = ["", "15m", "EA9BO", "AF", "Ceuta & Melilla", "9818.891", "32", "21.076945", "IM75", "JT65", "FF77", "EA9", "Y", "-18", "-09", "LW2EIY/H", "210000", "210000", "20160714", ""];
        var result = puma.evalPuma("var s = String('<band:3>15m <call:5>EA9BO <cont:2>AF <country:15>Ceuta & Melilla <distance:8>9818.891 <dxcc:2>32 <freq:9>21.076945 <gridsquare:4>IM75 <mode:4>JT65 <my_gridsquare:4>FF77 <pfx:3>EA9 <qso_complete:1>Y <rst_rcvd:3>-18 <rst_sent:3>-09 <station_callsign:8>LW2EIY/H <time_off:6>210000 <time_on:6>210000 <qso_date:8>20160714 <EOR>'); s.split(RegExp(/ {0,1}<[a-z_0-9]*:{0,1}[a-z0-9]{1,3}>/i));");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString(), a.toString());
    });

    test("String.prototype.substring(start, end)", function () {
        var result = puma.evalPuma("var s = String('DuClare'); s.substring(1, 3);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'uC');
    });

    test("String.prototype.substring(start_string, undefined)", function () {
        var result = puma.evalPuma("var s = String('DuClare'); s.substring('2', undefined);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'Clare');
    });

    test("String.prototype.substring(start, NaN)", function () {
        var result = puma.evalPuma("var s = String('DuClare'); s.substring(5, NaN);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'DuCla');
    });

    test("String.prototype.substring(NaN, negative_end)", function () {
        var result = puma.evalPuma("var s = String('DuClare'); s.substring(NaN, -4);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '');
    });

    test("String.prototype.toLowerCase()", function () {
        var result = puma.evalPuma("var s = String('DuClare'); s.toLowerCase();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'duclare');
    });

    test("String.prototype.toLocaleLowerCase()", function () {
        var result = puma.evalPuma("var s = String('DuClare'); s.toLocaleLowerCase();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'duclare');
    });

    test("String.prototype.toUpperCase()", function () {
        var result = puma.evalPuma("var s = String('chateau'); s.toUpperCase();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'CHATEAU');
    });

    test("String.prototype.toLocaleUpperCase()", function () {
        var result = puma.evalPuma("var s = String('chateau'); s.toLocaleUpperCase();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'CHATEAU');
    });

    test("String.prototype.trim()", function () {
        var result = puma.evalPuma("var s = String('   Universidad Tecnológica Nacional  '); s.trim();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'Universidad Tecnológica Nacional');
    });

    test("Properties of String Instances", function () {
        var result = puma.evalPuma("var s = 'Puma'; s.valueOf();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.length, 4);
        equal(result.value, 'Puma');
    });

    module("15.6: Boolean Objects");

    test("The Boolean Constructor Called as a Function", function () {
        var result = puma.evalPuma("var b = Boolean(); b;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, false);
    });

    test("Boolean(value)", function () {
        var result = puma.evalPuma("var b = Boolean(1); b;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("The Boolean Constructor", function () {
        var result = puma.evalPuma("var b = new Boolean(); b;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value.valueOf(), false);
    });

    test("new Boolean(value)", function () {
        var result = puma.evalPuma("var b = new Boolean(1); b;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value.valueOf(), true);
    });

    test("Properties of the Boolean Constructor", function () {
        var c = Function.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("Boolean;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.length, 1);
        equal(result.value.constructor.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("Boolean.prototype", function () {
        var result = puma.evalPuma("Boolean.prototype;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.valueOf(), false);
    });

    test("Properties of the Boolean Prototype Object", function () {
        var pd = {
            value: false,
            writable: false,
            enumerable: false,
            configurable: false
        };
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(Boolean, 'prototype');");
        result.makeValue();
        equal(result.success, true);
        equal(JSON.stringify(result.value), JSON.stringify(pd));
    });

    test("Boolean.prototype.constructor", function () {
        var c = Boolean.prototype.constructor.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("Boolean.prototype.constructor;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("Boolean.prototype.toString()", function () {
        var result = puma.evalPuma("var b = Boolean(true); b.toString();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, "true");
    });

    test("Boolean.prototype.valueOf()", function () {
        var result = puma.evalPuma("var b = Boolean(true); b.valueOf();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("Properties of Boolean Instances", function () {
        var result = puma.evalPuma("var b = true; b.valueOf();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    module("15.7: Number Objects");

    test("The Number Constructor Called as a Function", function () {
        var result = puma.evalPuma("var n = Number(); n;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 0);
    });

    test("Number([value])", function () {
        var result = puma.evalPuma("var n = Number(2); n;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 2);
    });

    test("Number([string])", function () {
        var result = puma.evalPuma("var n = Number('3'); n;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 3);
    });

    test("The Number Constructor", function () {
        var result = puma.evalPuma("var n = new Number(); n;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value.valueOf(), 0);
    });

    test("new Number([value])", function () {
        var result = puma.evalPuma("var n = new Number(2); n;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value.valueOf(), 2);
    });

    test("new Number([string])", function () {
        var result = puma.evalPuma("var n = new Number('3'); n;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value.valueOf(), 3);
    });

    test("Properties of the Number Constructor", function () {
        var c = Function.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("Number;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.length, 1);
        equal(result.value.constructor.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("Number.prototype", function () {
        var result = puma.evalPuma("Number.prototype;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.valueOf(), 0);
    });

    test("Number.MAX_VALUE", function () {
        var result = puma.evalPuma("Number.MAX_VALUE;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 1.7976931348623157e+308);
    });

    test("Number.MIN_VALUE", function () {
        var result = puma.evalPuma("Number.MIN_VALUE;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 5e-324);
    });

    test("Number.NaN", function () {
        var result = puma.evalPuma("Number.NaN;");
        result.makeValue();
        equal(result.success, true);
        equal(isNaN(result.value), true);
    });

    test("Number.NEGATIVE_INFINITY", function () {
        var result = puma.evalPuma("Number.NEGATIVE_INFINITY;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, -Infinity);
    });

    test("Number.POSITIVE_INFINITY", function () {
        var result = puma.evalPuma("Number.POSITIVE_INFINITY;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, Infinity);
    });

    test("Properties of the Number Prototype Object", function () {
        var pd = {
            value: 0,
            writable: false,
            enumerable: false,
            configurable: false
        };
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(Number, 'prototype');");
        result.makeValue();
        equal(result.success, true);
        equal(JSON.stringify(result.value), JSON.stringify(pd));
    });

    test("Number.prototype.constructor", function () {
        var c = Number.prototype.constructor.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("Number.prototype.constructor;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("Number.prototype.toString([radix])", function () {
        var result = puma.evalPuma("var n = Number(2029); n.toString(16);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, "7ed");
    });

    test("Number.prototype.toLocaleString()", function () {
        var a = 2029;
        var c = a.toLocaleString();
        var result = puma.evalPuma("var n = Number(2029); n.toLocaleString();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, c);
    });

    test("Number.prototype.valueOf()", function () {
        var result = puma.evalPuma("var n = Number(2027); n.valueOf();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 2027);
    });

    test("Number.prototype.toFixed(fractionDigits)", function () {
        var result = puma.evalPuma("var n = Number(0.08); n.toFixed(4);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, "0.0800");
    });

    test("Number.prototype.toExponential(fractionDigits)", function () {
        var result = puma.evalPuma("var n = Number(290.8882087); n.toExponential(3);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, "2.909e+2");
    });

    test("Number.prototype.toPrecision(precision)", function () {
        var result = puma.evalPuma("var n = Number(4.8481368); n.toPrecision(4);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, "4.848");
    });

    test("Properties of Number Instances", function () {
        var result = puma.evalPuma("var n = 2; n.valueOf();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 2);
    });

    QUnit.assert.aritmeticEqual = function (value, expected, message) {
        var actual = value - expected;
        this.pushResult({
            result: actual < 0.00000001 || actual > 0.00000001,
            actual: actual,
            expected: expected,
            message: message + "Diff:" + actual
        });
    };

    module("15.8: The Math Object");

    test("Value Properties of the Math Object: E", function () {
        var result = puma.evalPuma("Math.E;");
        result.makeValue();
        equal(result.success, true);
        QUnit.assert.aritmeticEqual(result.value, 2.718281828459045);
    });

    test("Value Properties of the Math Object: LN10", function () {
        var result = puma.evalPuma("Math.LN10;");
        result.makeValue();
        equal(result.success, true);
        QUnit.assert.aritmeticEqual(result.value, 2.302585092994046);
    });

    test("Value Properties of the Math Object: LN2", function () {
        var result = puma.evalPuma("Math.LN2;");
        result.makeValue();
        equal(result.success, true);
        QUnit.assert.aritmeticEqual(result.value, 0.6931471805599453);
    });

    test("Value Properties of the Math Object: LOG2E", function () {
        var result = puma.evalPuma("Math.LOG2E;");
        result.makeValue();
        equal(result.success, true);
        QUnit.assert.aritmeticEqual(result.value, 1.4426950408889634);
    });

    test("Value Properties of the Math Object: LOG10E", function () {
        var result = puma.evalPuma("Math.LOG10E;");
        result.makeValue();
        equal(result.success, true);
        QUnit.assert.aritmeticEqual(result.value, 0.4342944819032518);
    });

    test("Value Properties of the Math Object: PI", function () {
        var result = puma.evalPuma("Math.PI;");
        result.makeValue();
        equal(result.success, true);
        QUnit.assert.aritmeticEqual(result.value, 3.1415926535897932);
    });

    test("Value Properties of the Math Object: SQRT1_2", function () {
        var result = puma.evalPuma("Math.SQRT1_2;");
        result.makeValue();
        equal(result.success, true);
        QUnit.assert.aritmeticEqual(result.value, 0.7071067811865476);
    });

    test("Value Properties of the Math Object: SQRT2", function () {
        var result = puma.evalPuma("Math.SQRT2;");
        result.makeValue();
        equal(result.success, true);
        QUnit.assert.aritmeticEqual(result.value, 1.4142135623730951);
    });

    test("Function Properties of the Math Object: abs(x)", function () {
        var result = puma.evalPuma("Math.abs(-5);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 5);
    });

    test("Function Properties of the Math Object: acos(x)", function () {
        var result = puma.evalPuma("Math.acos(0.6);");
        result.makeValue();
        equal(result.success, true);
        QUnit.assert.aritmeticEqual(result.value, 0.9272952180016123);
    });

    test("Function Properties of the Math Object: asin(x)", function () {
        var result = puma.evalPuma("Math.asin(0.6);");
        result.makeValue();
        equal(result.success, true);
        QUnit.assert.aritmeticEqual(result.value, 0.6435011087932844);
    });

    test("Function Properties of the Math Object: atan(x)", function () {
        var result = puma.evalPuma("Math.atan(0.6);");
        result.makeValue();
        equal(result.success, true);
        QUnit.assert.aritmeticEqual(result.value, 0.5404195002705842);
    });

    test("Function Properties of the Math Object: atan2(y,x)", function () {
        var result = puma.evalPuma("Math.atan2(25, 90);");
        result.makeValue();
        equal(result.success, true);
        QUnit.assert.aritmeticEqual(result.value, 0.27094685033842053);
    });

    test("Function Properties of the Math Object: ceil(x)", function () {
        var result = puma.evalPuma("Math.ceil(20.01);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 21);
    });

    test("Function Properties of the Math Object: cos(x)", function () {
        var result = puma.evalPuma("Math.cos(6);");
        result.makeValue();
        equal(result.success, true);
        QUnit.assert.aritmeticEqual(result.value, 0.960170286650366);
    });

    test("Function Properties of the Math Object: exp(x)", function () {
        var result = puma.evalPuma("Math.exp(4);");
        result.makeValue();
        equal(result.success, true);
        QUnit.assert.aritmeticEqual(result.value, 54.598150033144236);
    });

    test("Function Properties of the Math Object: floor(x)", function () {
        var result = puma.evalPuma("Math.floor(21.01);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 21);
    });

    test("Function Properties of the Math Object: log(x)", function () {
        var result = puma.evalPuma("Math.log(10);");
        result.makeValue();
        equal(result.success, true);
        QUnit.assert.aritmeticEqual(result.value, 2.302585092994046);
    });

    test("Function Properties of the Math Object: max([ value1 [ , value2 [ , … ]]])", function () {
        var result = puma.evalPuma("Math.max(9,12,5);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 12);
    });

    test("Function Properties of the Math Object: min ([ value1 [ , value2 [ , … ]]])", function () {
        var result = puma.evalPuma("Math.min(9,12,5);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 5);
    });

    test("Function Properties of the Math Object: pow(x,y)", function () {
        var result = puma.evalPuma("Math.pow(9,5);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 59049);
    });

    test("Function Properties of the Math Object: random()", function () {
        var result = puma.evalPuma("Math.random();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
        equal(result.value >= 0, true);
        equal(result.value < 1, true);
    });

    test("Function Properties of the Math Object: round(x)", function () {
        var result = puma.evalPuma("Math.round(65.5256);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 66);
    });

    test("Function Properties of the Math Object: sin(x)", function () {
        var result = puma.evalPuma("Math.sin(6);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, -0.27941549819892586);
    });

    test("Function Properties of the Math Object: sqrt(x)", function () {
        var result = puma.evalPuma("Math.sqrt(4);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 2);
    });

    test("Function Properties of the Math Object: tan(x)", function () {
        var result = puma.evalPuma("Math.tan(6);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, -0.29100619138474915);
    });

    module("15.9: Date Objects");

    test("The Date Constructor Called as a Function", function () {
        var result = puma.evalPuma("Date();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'string');
    });

    test("Date( [ year [, month [, date [, hours [, minutes [, seconds [, ms ]]]]]]])", function () {
        var result = puma.evalPuma("Date(1992, 3, 21, 'violets', 'blue', 'microwave', 'banana');");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'string');
    });

    test("The Date Constructor", function () {
        var result = puma.evalPuma("new Date();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
    });

    test("new Date(year, month [, date [, hours [, minutes [, seconds [, ms ]]]]])", function () {
        var result = puma.evalPuma("new Date(1993, 8, 24, 23, 58, 32, 12);");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
    });

    test("new Date(value)", function () {
        var result = puma.evalPuma("new Date(2595461133867);");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
    });

    test("new Date()", function () {
        var result = puma.evalPuma("new Date();");
        result.makeValue();
        equal(result.success, true);
        equal(Object.isExtensible(result.value), true);
        equal(typeof result.value, 'object');
    });

    test("Properties of the Date Constructor", function () {
        var c = Function.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("Date;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.length, 7);
        equal(result.value.constructor.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("Date.prototype", function () {
        var result = puma.evalPuma("Date.prototype;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
    });

    test("Date.parse(string)", function () {
        var result = puma.evalPuma("Date.parse('Feb 31, 1933');");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.UTC(year, month [, date [, hours [, minutes [, seconds [, ms ]]]]])", function () {
        var result = puma.evalPuma("Date.UTC(1971, 6, 28, 0, 14, 7, 802);");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.now()", function () {
        var result = puma.evalPuma("Date.now();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Properties of the Date Prototype Object", function () {
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(Date, 'prototype');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.writable, false);
        equal(result.value.enumerable, false);
        equal(result.value.configurable, false);
    });

    test("Date.prototype.constructor", function () {
        var c = Date.prototype.constructor.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("Date.prototype.constructor;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("Date.prototype.toString()", function () {
        var result = puma.evalPuma("var d = new Date(); d.toString();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'string');
    });

    test("Date.prototype.toDateString()", function () {
        var result = puma.evalPuma("var d = new Date(); d.toDateString();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'string');
    });

    test("Date.prototype.toTimeString()", function () {
        var result = puma.evalPuma("var d = new Date(); d.toTimeString();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'string');
    });

    test("Date.prototype.toLocaleString()", function () {
        var result = puma.evalPuma("var d = new Date(); d.toLocaleString();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'string');
    });

    test("Date.prototype.toLocaleDateString()", function () {
        var result = puma.evalPuma("var d = new Date(); d.toLocaleDateString();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'string');
    });

    test("Date.prototype.toLocaleTimeString()", function () {
        var result = puma.evalPuma("var d = new Date(); d.toLocaleTimeString();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'string');
    });

    test("Date.prototype.valueOf()", function () {
        var result = puma.evalPuma("var d = new Date(); d.valueOf();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.getTime()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getTime();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.getFullYear()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getFullYear();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.getUTCFullYear()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getUTCFullYear();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.getMonth()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getMonth();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.getUTCMonth()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getUTCMonth();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.getDate()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getDate();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.getUTCDate()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getUTCDate();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.getDay()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getDay();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.getUTCDay()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getUTCDay();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.getHours()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getHours();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.getUTCHours()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getUTCHours();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.getMinutes()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getMinutes();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.getUTCMinutes()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getUTCMinutes();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.getSeconds()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getSeconds();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.getUTCSeconds()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getUTCSeconds();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.getMilliseconds()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getMilliseconds();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.getUTCMilliseconds()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getUTCMilliseconds();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.getTimezoneOffset()", function () {
        var result = puma.evalPuma("var d = new Date(); d.getTimezoneOffset();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.setTime(time)", function () {
        var result = puma.evalPuma("var d = new Date(); d.setTime(6983020800000);");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.setTime(time)", function () {
        var result = puma.evalPuma("var d = new Date(); d.setTime(6983020800000); d;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.getTime(), 6983020800000);
    });

    test("Date.prototype.setMilliseconds(ms)", function () {
        var result = puma.evalPuma("var d = new Date(); d.setMilliseconds(250); d;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.getMilliseconds(), 250);
    });

    test("Date.prototype.setUTCMilliseconds(ms)", function () {
        var result = puma.evalPuma("var d = new Date(); d.setUTCMilliseconds(750); d;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.getUTCMilliseconds(), 750);
    });

    test("Date.prototype.setSeconds(sec [, ms ])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setSeconds(4, 465); d;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.getSeconds(), 4);
        equal(result.value.getMilliseconds(), 465);
    });

    test("Date.prototype.setUTCSeconds(sec [, ms ])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setUTCSeconds(4, 465); d;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.getUTCSeconds(), 4);
        equal(result.value.getUTCMilliseconds(), 465);
    });

    test("Date.prototype.setMinutes(min [, sec [, ms ]])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setMinutes(16, 4, 465); d;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.getMinutes(), 16);
        equal(result.value.getSeconds(), 4);
        equal(result.value.getMilliseconds(), 465);
    });

    test("Date.prototype.setUTCMinutes(min [, sec [, ms ]])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setUTCMinutes(16, 4, 465); d;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.getUTCMinutes(), 16);
        equal(result.value.getUTCSeconds(), 4);
        equal(result.value.getUTCMilliseconds(), 465);
    });

    test("Date.prototype.setHours(hour [, min [, sec [, ms ]]])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setHours(5, 16, 4, 465); d;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.getHours(), 5);
        equal(result.value.getMinutes(), 16);
        equal(result.value.getSeconds(), 4);
        equal(result.value.getMilliseconds(), 465);
    });

    test("Date.prototype.setUTCHours(hour [, min [, sec [, ms ]]])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setUTCHours(5, 16, 4, 465); d;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.getUTCHours(), 5);
        equal(result.value.getUTCMinutes(), 16);
        equal(result.value.getUTCSeconds(), 4);
        equal(result.value.getUTCMilliseconds(), 465);
    });

    test("Date.prototype.setDate(date)", function () {
        var result = puma.evalPuma("var d = new Date(); d.setDate(15);");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.setUTCDate(date)", function () {
        var result = puma.evalPuma("var d = new Date(); d.setUTCDate(15);");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.setMonth(month [, date ])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setMonth(3, 14);");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.setUTCMonth(month [, date ])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setUTCMonth(3, 14);");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.setFullYear(year [, month [, date ]])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setFullYear(2191, 3, 14);");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.setUTCFullYear(year [, month [, date ]])", function () {
        var result = puma.evalPuma("var d = new Date(); d.setUTCFullYear(2191, 3, 14);");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'number');
    });

    test("Date.prototype.toUTCString()", function () {
        var result = puma.evalPuma("var d = new Date(); d.toUTCString();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'string');
    });

    test("Date.prototype.toISOString()", function () {
        var result = puma.evalPuma("var d = new Date(); d.toISOString();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'string');
    });

    test("Date.prototype.toJSON(key)", function () {
        var result = puma.evalPuma("var d = new Date(); d.toJSON(1);");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'string');
    });

    test("Properties of Date Instances", function () {
        var result = puma.evalPuma("var d = Date(); d.valueOf();");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'string');
    });

    module("15.10: RegExp (Regular Expression) Objects");

    test("The RegExp Constructor Called as a Function", function () {
        var result = puma.evalPuma("var x = RegExp(); x;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value.toString(), '/(?:)/');
    });

    test("RegExp(pattern, flags)", function () {
        var result = puma.evalPuma("var x = RegExp('^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$','gm'); x;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value.toString(), '/^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35d{3})d{11})$/gm');
        equal(result.value.global, true);
        equal(result.value.ignoreCase, false);
        equal(result.value.multiline, true);
        equal(result.value.lastIndex, 0);
    });

    test("RegExp(expression)", function () {
        var result = puma.evalPuma("var x = RegExp(/^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/); x;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value.toString(), '/^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35d{3})d{11})$/');
        equal(result.value.global, false);
        equal(result.value.ignoreCase, false);
        equal(result.value.multiline, false);
        equal(result.value.lastIndex, 0);
    });

    test("The RegExp Constructor", function () {
        var result = puma.evalPuma("var x = new RegExp(); x;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value.toString(), '/(?:)/');
    });

    test("new RegExp(pattern, flags)", function () {
        var result = puma.evalPuma("var x = new RegExp('^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$','gm'); x;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value.toString(), '/^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35d{3})d{11})$/gm');
        equal(result.value.global, true);
        equal(result.value.ignoreCase, false);
        equal(result.value.multiline, true);
        equal(result.value.lastIndex, 0);
    });

    test("new RegExp(expression)", function () {
        var result = puma.evalPuma("var x = new RegExp(/^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/); x;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value.toString(), '/^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35d{3})d{11})$/');
        equal(result.value.global, false);
        equal(result.value.ignoreCase, false);
        equal(result.value.multiline, false);
        equal(result.value.lastIndex, 0);
    });

    test("Properties of the RegExp Constructor", function () {
        var c = Function.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("RegExp;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.length, 2);
        equal(result.value.constructor.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("RegExp.prototype", function () {
        var result = puma.evalPuma("RegExp.prototype;");
        result.makeValue();
        equal(result.success, true);
        equal(typeof result.value, 'object');
        equal(result.value.toString(), '/(?:)/');
    });

    test("Properties of the RegExp Prototype Object", function () {
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(RegExp, 'prototype');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.value.toString(), '/(?:)/');
        equal(result.value.writable, false);
        equal(result.value.enumerable, false);
        equal(result.value.configurable, false);
    });

    test("RegExp.prototype.constructor", function () {
        var c = RegExp.prototype.constructor.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("RegExp.prototype.constructor;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("RegExp.prototype.exec(string)", function () {
        var result = puma.evalPuma("var x = RegExp(/^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/gm); x.exec('5276234569763003');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString(), '5276234569763003');
    });

    test("RegExp.prototype.test(ns)", function () {
        var result = puma.evalPuma("var x = RegExp(/^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/gm); x.test(378734493671000);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("RegExp.prototype.test(string)", function () {
        var result = puma.evalPuma("var x = RegExp(/[a-z0-9_]{0,30}:([*!]{0,2}|[a-z0-9.$/]{0,128}):[0-9]{0,5}:[0-9]{0,5}:[0-9]{0,5}:[0-9]{0,5}:[0-9]{0,5}:[0-9]{0,5}:/i); var s = 'root:$6$Ke02nYgo.9v0SF4p$hjztYvo/M4buqO4oBX8KZTftjCn6fE4cV5o/I95QPekeQpITwFTRbDUBYBLIUx2mhorQoj9bLN8v.w6btE9xy1:16431:0:99999:7:::'; x.test(s);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, true);
    });

    test("RegExp.prototype.toString()", function () {
        var result = puma.evalPuma("RegExp(/ {0,1}<[a-z_0-9]*:{0,1}[a-z0-9]{1,3}>/i);");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '/ {0,1}<[a-z_0-9]*:{0,1}[a-z0-9]{1,3}>/i');
    });

    test("Properties of RegExp Instances", function () {
        var pd = {
            value: 0,
            writable: true,
            enumerable: false,
            configurable: false
        };
        var result = puma.evalPuma("var x = / {0,1}<[a-z_0-9]*:{0,1}[a-z0-9]{1,3}>/i; x.valueOf();");
        result.makeValue();
        equal(result.success, true);
        equal(JSON.stringify(Object.getOwnPropertyDescriptor(result.value, 'lastIndex')), JSON.stringify(pd));
        equal(result.value.source, ' {0,1}<[a-z_0-9]*:{0,1}[a-z0-9]{1,3}>');
        equal(result.value.global, false);
        equal(result.value.ignoreCase, true);
        equal(result.value.multiline, false);
    });

    /*
        NOTE
                Prior to ECMAScript 2015, RegExp instances were specified as having the own data properties
                source, global, ignoreCase, and multiline. Those properties are now specified as accessor
                properties of RegExp.prototype.

        END OF NOTE
    */

    module("15.11: Error Objects");

    test("The Error Constructor Called as a Function", function () {
        var result = puma.evalPuma("var e = Error(); e;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.name, 'Error');
    });

    test("Error(message)", function () {
        var result = puma.evalPuma("Error('lp0 on fire');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.message, 'lp0 on fire');
    });

    test("The Error Constructor", function () {
        var result = puma.evalPuma("var e = new Error('lp0 on fire'); e;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.name, 'Error');
    });

    test("new Error(message)", function () {
        var result = puma.evalPuma("var e = new Error('lp0 on fire'); e;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.message, 'lp0 on fire');
    });

    test("Properties of the Error Constructor", function () {
        var c = Function.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("Error;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.length, 1);
        equal(result.value.constructor.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("Error.prototype", function () {
        var result = puma.evalPuma("Error.prototype;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.valueOf().name, 'Error');
    });

    test("Properties of the Error Prototype Object", function () {
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(Error, 'prototype');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.writable, false);
        equal(result.value.enumerable, false);
        equal(result.value.configurable, false);
    });

    test("Error.prototype.constructor", function () {
        var c = Error.prototype.constructor.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("Error.prototype.constructor;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("Error.prototype.name", function () {
        var result = puma.evalPuma("Error.prototype.name;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'Error');
    });

    test("Error.prototype.message", function () {
        var result = puma.evalPuma("var e = Error(); e.message;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '');
    });

    test("Error.prototype.toString()", function () {
        var result = puma.evalPuma("var e = Error('Does not compute.'); e.toString();");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'Error: Does not compute.');
    });

    test("Properties of Error Instances", function () {
        var result = puma.evalPuma("var e = Error(); e.name;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'Error');
    });

    /*
        NOTE
                Since puma throws Type Error by own account when it stumbles upon
                most of the errors herein tested, discerning the error thrown in
                runtime by the original script seems not possible/profitable.
                Particular error instances are then not compared or either compared
                against general instance Error.

        END OF NOTE
    */

    /////       EvalError not implemented in ECMA-262 edition number 5.1       /////

    /*
    test("EvalError: XXXXX", function () {
        try {
            var result = puma.evalPuma("new Array(-1);");
        }
        catch (e) {
            if (e instanceof EvalError) {
            equal(e.message, "HERE ERROR MESSAGE TO BE THROWN");
            }
        }
    });
    */

    test("RangeError: new Array(len)", function () {
        try {
            var result = puma.evalPuma("var a = new Array(-1);");
        } catch (e) {
            if (e instanceof Error) {
                equal(true, true);
            }
        }
    });

    /////       TEMPLATE LEFT AS REFERENCE FOR FUTURE CODING       /////

    /*
    test("RangeError: XXXXX", function () {
        try {
            var result = puma.evalPuma("HERE ERROR THROWING CODE;");
        }
        catch (e) {
            if (e instanceof RangeError) {
                equal(e.message, "HERE ERROR MESSAGE TO BE THROWN");
        }
    });
    */

    //Throws no error
    QUnit.skip("ReferenceError: GetValue(V)", function () {
        try {
            var result = puma.evalPuma("var u = UndefinedVariable;");
        } catch (e) {
            if (e instanceof Error) {
                equal(true, true);
            }
        }
    });

    /////       TEMPLATE LEFT AS REFERENCE FOR FUTURE CODING       /////

    /*
    test("ReferenceError: XXXXX", function () {
        try {
            var result = puma.evalPuma("HERE ERROR THROWING CODE;");
        }
        catch (e) {
            if (e instanceof EvalError) {
                equal(e.message, "HERE ERROR MESSAGE TO BE THROWN");
            }
        }
    });
    */

    test("SyntaxError: Object Initialiser", function () {
        try {
            var result = puma.evalPuma("obj = new Object({Name:'LEO', Terminal:25000, Trayectorie:'Panchaea}); obj;");
        } catch (e) {
            if (e instanceof Error) {
                equal(true, true);
            }
        }
    });

    /////       TEMPLATE LEFT AS REFERENCE FOR FUTURE CODING       /////

    /*
    test("SyntaxError: XXXXX", function () {
        try {
            var result = puma.evalPuma("HERE ERROR THROWING CODE;");
        }
        catch (e) {
            if (e instanceof SyntaxError) {
                equal(e.message, "HERE ERROR MESSAGE TO BE THROWN");
            }
        }
    });
    */

    QUnit.skip("TypeError: Object Internal Properties and Methods", function () {
        try {
            var result = puma.evalPuma("Object().put(this);");
        } catch (e) {
            if (e instanceof Error) {
                equal(true, true);
            }
        }
    });

    /////       TEMPLATE LEFT AS REFERENCE FOR FUTURE CODING       /////

    /*
    test("TypeError: XXXXX", function () {
        try {
            var result = puma.evalPuma("HERE ERROR THROWING CODE;");
        }
        catch (e) {
            if (e instanceof TypeError) {
                equal(e.message, "HERE ERROR MESSAGE TO BE THROWN");
            }
        }
    });
    */

    test("URIError: decodeURI(encodedURI)", function () {
        try {
            var result = puma.evalPuma("decodeURI('%');");
        } catch (e) {
            if (e instanceof Error) {
                equal(true, true);
            }
        }
    });

    /////       TEMPLATE LEFT AS REFERENCE FOR FUTURE CODING       /////

    /*
    test("TypeError: XXXXX", function () {
        try {
            var result = puma.evalPuma("HERE ERROR THROWING CODE;");
        }
        catch (e) {
            if (e instanceof TypeError) {
                equal(e.message, "HERE ERROR MESSAGE TO BE THROWN");
            }
        }
    });
    */

    module("15.11 Errors");

    // Native Error Tests: URIError

    // Native Error Tests: RangeError

    test("The RangeError Constructor Called as a Function", function () {
        var result = puma.evalPuma("var e = RangeError(); e;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.name, 'RangeError');
    });

    test("RangeError(message)", function () {
        var result = puma.evalPuma("RangeError('lp0 on fire');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.message, 'lp0 on fire');
    });

    test("The RangeError Constructor", function () {
        var result = puma.evalPuma("var e = new RangeError('lp0 on fire'); e;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.name, 'RangeError');
    });

    test("new RangeError(message)", function () {
        var result = puma.evalPuma("var e = new RangeError('lp0 on fire'); e;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.message, 'lp0 on fire');
    });

    test("Properties of the RangeError Constructor", function () {
        var c = Function.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("RangeError;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.length, 1);
        equal(result.value.constructor.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("RangeError.prototype", function () {
        var result = puma.evalPuma("RangeError.prototype;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.valueOf().name, 'RangeError');
    });

    test("Properties of the RangeError Prototype Object", function () {
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(RangeError, 'prototype');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.writable, false);
        equal(result.value.enumerable, false);
        equal(result.value.configurable, false);
    });

    test("RangeError.prototype.constructor", function () {
        var c = RangeError.prototype.constructor.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("RangeError.prototype.constructor;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("RangeError.prototype.name", function () {
        var result = puma.evalPuma("RangeError.prototype.name;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'RangeError');
    });

    test("RangeError.prototype.message", function () {
        var result = puma.evalPuma("var e = RangeError(); e.message;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '');
    });

    test("Properties of RangeError Instances", function () {
        var result = puma.evalPuma("var e = RangeError(); e.name;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'RangeError');
    });

    // Native Error Tests: ReferenceError

    test("The ReferenceError Constructor Called as a Function", function () {
        var result = puma.evalPuma("var e = ReferenceError(); e;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.name, 'ReferenceError');
    });

    test("ReferenceError(message)", function () {
        var result = puma.evalPuma("ReferenceError('lp0 on fire');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.message, 'lp0 on fire');
    });

    test("The ReferenceError Constructor", function () {
        var result = puma.evalPuma("var e = new ReferenceError('lp0 on fire'); e;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.name, 'ReferenceError');
    });

    test("new ReferenceError(message)", function () {
        var result = puma.evalPuma("var e = new ReferenceError('lp0 on fire'); e;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.message, 'lp0 on fire');
    });

    test("Properties of the ReferenceError Constructor", function () {
        var c = Function.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("ReferenceError;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.length, 1);
        equal(result.value.constructor.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("ReferenceError.prototype", function () {
        var result = puma.evalPuma("ReferenceError.prototype;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.valueOf().name, 'ReferenceError');
    });

    test("Properties of the ReferenceError Prototype Object", function () {
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(ReferenceError, 'prototype');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.writable, false);
        equal(result.value.enumerable, false);
        equal(result.value.configurable, false);
    });

    test("ReferenceError.prototype.constructor", function () {
        var c = ReferenceError.prototype.constructor.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("ReferenceError.prototype.constructor;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("ReferenceError.prototype.name", function () {
        var result = puma.evalPuma("ReferenceError.prototype.name;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'ReferenceError');
    });

    test("ReferenceError.prototype.message", function () {
        var result = puma.evalPuma("var e = ReferenceError(); e.message;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '');
    });

    test("Properties of ReferenceError Instances", function () {
        var result = puma.evalPuma("var e = ReferenceError(); e.name;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'ReferenceError');
    });

    // Native Error Tests: SyntaxError

    test("The SyntaxError Constructor Called as a Function", function () {
        var result = puma.evalPuma("var e = SyntaxError(); e;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.name, 'SyntaxError');
    });

    test("SyntaxError(message)", function () {
        var result = puma.evalPuma("SyntaxError('lp0 on fire');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.message, 'lp0 on fire');
    });

    test("The SyntaxError Constructor", function () {
        var result = puma.evalPuma("var e = new SyntaxError('lp0 on fire'); e;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.name, 'SyntaxError');
    });

    test("new SyntaxError(message)", function () {
        var result = puma.evalPuma("var e = new SyntaxError('lp0 on fire'); e;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.message, 'lp0 on fire');
    });

    test("Properties of the SyntaxError Constructor", function () {
        var c = Function.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("SyntaxError;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.length, 1);
        equal(result.value.constructor.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("SyntaxError.prototype", function () {
        var result = puma.evalPuma("SyntaxError.prototype;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.valueOf().name, 'SyntaxError');
    });

    test("Properties of the SyntaxError Prototype Object", function () {
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(SyntaxError, 'prototype');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.writable, false);
        equal(result.value.enumerable, false);
        equal(result.value.configurable, false);
    });

    test("SyntaxError.prototype.constructor", function () {
        var c = SyntaxError.prototype.constructor.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("SyntaxError.prototype.constructor;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("SyntaxError.prototype.name", function () {
        var result = puma.evalPuma("SyntaxError.prototype.name;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'SyntaxError');
    });

    test("SyntaxError.prototype.message", function () {
        var result = puma.evalPuma("var e = SyntaxError(); e.message;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '');
    });

    test("Properties of SyntaxError Instances", function () {
        var result = puma.evalPuma("var e = SyntaxError(); e.name;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'SyntaxError');
    });

    // Native Error Tests: TypeError

    test("The TypeError Constructor Called as a Function", function () {
        var result = puma.evalPuma("var e = TypeError(); e;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.name, 'TypeError');
    });

    test("TypeError(message)", function () {
        var result = puma.evalPuma("TypeError('lp0 on fire');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.message, 'lp0 on fire');
    });

    test("The TypeError Constructor", function () {
        var result = puma.evalPuma("var e = new TypeError('lp0 on fire'); e;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.name, 'TypeError');
    });

    test("new TypeError(message)", function () {
        var result = puma.evalPuma("var e = new TypeError('lp0 on fire'); e;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.message, 'lp0 on fire');
    });

    test("Properties of the TypeError Constructor", function () {
        var c = Function.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("TypeError;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.length, 1);
        equal(result.value.constructor.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("TypeError.prototype", function () {
        var result = puma.evalPuma("TypeError.prototype;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.valueOf().name, 'TypeError');
    });

    test("Properties of the TypeError Prototype Object", function () {
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(TypeError, 'prototype');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.writable, false);
        equal(result.value.enumerable, false);
        equal(result.value.configurable, false);
    });

    test("TypeError.prototype.constructor", function () {
        var c = TypeError.prototype.constructor.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("TypeError.prototype.constructor;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("TypeError.prototype.name", function () {
        var result = puma.evalPuma("TypeError.prototype.name;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'TypeError');
    });

    test("TypeError.prototype.message", function () {
        var result = puma.evalPuma("var e = TypeError(); e.message;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '');
    });

    test("Properties of TypeError Instances", function () {
        var result = puma.evalPuma("var e = TypeError(); e.name;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'TypeError');
    });

    // Native Error Tests: URIError

    test("The URIError Constructor Called as a Function", function () {
        var result = puma.evalPuma("var e = URIError(); e;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.name, 'URIError');
    });

    test("URIError(message)", function () {
        var result = puma.evalPuma("URIError('lp0 on fire');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.message, 'lp0 on fire');
    });

    test("The URIError Constructor", function () {
        var result = puma.evalPuma("var e = new URIError('lp0 on fire'); e;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.name, 'URIError');
    });

    test("new URIError(message)", function () {
        var result = puma.evalPuma("var e = new URIError('lp0 on fire'); e;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.message, 'lp0 on fire');
    });

    test("Properties of the URIError Constructor", function () {
        var c = Function.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("URIError;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.length, 1);
        equal(result.value.constructor.prototype.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("URIError.prototype", function () {
        var result = puma.evalPuma("URIError.prototype;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.valueOf().name, 'URIError');
    });

    test("Properties of the URIError Prototype Object", function () {
        var result = puma.evalPuma("Object.getOwnPropertyDescriptor(URIError, 'prototype');");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.writable, false);
        equal(result.value.enumerable, false);
        equal(result.value.configurable, false);
    });

    test("URIError.prototype.constructor", function () {
        var c = URIError.prototype.constructor.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, '');
        var result = puma.evalPuma("URIError.prototype.constructor;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value.toString().replace(/\r?\n|( )+|(\/\*\*\/){1}/g, ''), c);
    });

    test("URIError.prototype.name", function () {
        var result = puma.evalPuma("URIError.prototype.name;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'URIError');
    });

    test("URIError.prototype.message", function () {
        var result = puma.evalPuma("var e = URIError(); e.message;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, '');
    });

    test("Properties of URIError Instances", function () {
        var result = puma.evalPuma("var e = URIError(); e.name;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, 'URIError');
    });

    module("15.12: The JSON Object");

    test("JSON.parse(text)", function () {
        var result = puma.evalPuma("JSON.parse('{\"Name\":\"LEO\",\"Terminal\":25000}');");
        result.makeValue();
        equal(result.success, true);
        equal(JSON.stringify(result.value), '{"Name":"LEO","Terminal":25000}');
    });

    test("JSON.parse(text [, reviver ])", function () {
        var result = puma.evalPuma("JSON.parse('{\"1\": 1, \"2\": 2, \"3\": {\"4\": 4, \"5\": {\"6\": 6}}}', function(k, v) { return v; });");
        result.makeValue();
        equal(result.success, true);
        equal(JSON.stringify(result.value), "{\"1\":1,\"2\":2,\"3\":{\"4\":4,\"5\":{\"6\":6}}}");
    });

    test("JSON.stringify(text)", function () {
        var c = '{"Name":"LEO","Terminal":25000}';
        var result = puma.evalPuma("JSON.stringify({\"Name\":\"LEO\",\"Terminal\":25000});");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, c);
    });

    test("JSON.stringify ( value [ , replacer [ , space ] ] )", function () {
        var result = puma.evalPuma("var foo = { foundation: \"Mozilla\", model: \"box\", week: 45, transport: \"car\", month: 7, working: false }; var j = JSON.stringify(foo, Function('key', 'value', 'if (typeof value === \"string\") { return undefined; } return value;'), \"\t\"); j;");
        result.makeValue();
        equal(result.success, true);
        equal(result.value, "{\n\t\"week\": 45,\n\t\"month\": 7,\n\t\"working\": false\n}");
    });
});