var File = java.io.File;
var Image = javax.imageio.ImageIO;
var BasicStroke = java.awt.BasicStroke;
var Color = java.awt.Color;
var BufferedImage = java.awt.image.BufferedImage;


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var java;
(function (java) {
    var lang;
    (function (lang) {
        var System = /** @class */ (function () {
            function System() {
            }
            System.gc = function () {
            };
            System.arraycopy = function (src, srcPos, dest, destPos, numElements) {
                if ((dest instanceof Float64Array || dest instanceof Int32Array)
                    && (src instanceof Float64Array || src instanceof Int32Array)) {
                    if (numElements == src.length) {
                        dest.set(src, destPos);
                    }
                    else {
                        dest.set(src.subarray(srcPos, srcPos + numElements), destPos);
                    }
                }
                else {
                    for (var i = 0; i < numElements; i++) {
                        dest[destPos + i] = src[srcPos + i];
                    }
                }
            };
            return System;
        }());
        lang.System = System;
        var StringBuilder = /** @class */ (function () {
            function StringBuilder() {
                this._buffer = "";
                this.length = 0;
            }
            StringBuilder.prototype.append = function (val) {
                this._buffer = this._buffer + val;
                this.length = this._buffer.length;
                return this;
            };
            StringBuilder.prototype.insert = function (position, val) {
                this._buffer = this._buffer.slice(0, position) + val + this._buffer.slice(position);
                return this;
            };
            StringBuilder.prototype.toString = function () {
                return this._buffer;
            };
            return StringBuilder;
        }());
        lang.StringBuilder = StringBuilder;
        var String = /** @class */ (function () {
            function String() {
            }
            String.valueOf = function (data, offset, count) {
                if (typeof offset === 'undefined' && typeof count === 'undefined') {
                    return data + '';
                }
                else {
                    return data.slice(offset, offset + count);
                }
            };
            String.hashCode = function (str) {
                var h = str['_hashCode'] ? str['_hashCode'] : 0;
                if (h === 0 && str.length > 0) {
                    var val = str;
                    for (var i = 0; i < str.length; i++) {
                        h = 31 * h + str.charCodeAt(i);
                    }
                    str['_hashCode'] = h;
                }
                return h;
            };
            String.isEmpty = function (str) {
                return str.length === 0;
            };
            String.join = function (delimiter) {
                var elements = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    elements[_i - 1] = arguments[_i];
                }
                return elements.join(delimiter);
            };
            return String;
        }());
        lang.String = String;
        var Thread = /** @class */ (function () {
            function Thread() {
            }
            Thread.sleep = function (time) {
            };
            return Thread;
        }());
        lang.Thread = Thread;
        var Double = /** @class */ (function () {
            function Double() {
            }
            Double.MAX_VALUE = Number.MAX_VALUE;
            Double.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
            Double.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
            Double.NaN = NaN;
            return Double;
        }());
        lang.Double = Double;
        var Long = /** @class */ (function () {
            function Long() {
            }
            Long.parseLong = function (d) {
                return parseInt(d);
            };
            return Long;
        }());
        lang.Long = Long;
        var Integer = /** @class */ (function () {
            function Integer() {
            }
            Integer.parseInt = function (d) {
                return parseInt(d);
            };
            return Integer;
        }());
        lang.Integer = Integer;
    })(lang = java.lang || (java.lang = {}));
    var util;
    (function (util) {
        var concurrent;
        (function (concurrent) {
            var atomic;
            (function (atomic) {
                var AtomicIntegerArray = /** @class */ (function () {
                    function AtomicIntegerArray(initialCapacity) {
                        this._internal = new Int32Array(initialCapacity);
                    }
                    AtomicIntegerArray.prototype.set = function (index, newVal) {
                        this._internal[index] = newVal;
                    };
                    AtomicIntegerArray.prototype.get = function (index) {
                        return this._internal[index];
                    };
                    AtomicIntegerArray.prototype.getAndSet = function (index, newVal) {
                        var temp = this._internal[index];
                        this._internal[index] = newVal;
                        return temp;
                    };
                    AtomicIntegerArray.prototype.compareAndSet = function (index, expect, update) {
                        if (this._internal[index] == expect) {
                            this._internal[index] = update;
                            return true;
                        }
                        else {
                            return false;
                        }
                    };
                    return AtomicIntegerArray;
                }());
                atomic.AtomicIntegerArray = AtomicIntegerArray;
                var AtomicLongArray = /** @class */ (function () {
                    function AtomicLongArray(initialCapacity) {
                        this._internal = new Float64Array(initialCapacity);
                    }
                    AtomicLongArray.prototype.set = function (index, newVal) {
                        this._internal[index] = newVal;
                    };
                    AtomicLongArray.prototype.get = function (index) {
                        return this._internal[index];
                    };
                    AtomicLongArray.prototype.getAndSet = function (index, newVal) {
                        var temp = this._internal[index];
                        this._internal[index] = newVal;
                        return temp;
                    };
                    AtomicLongArray.prototype.compareAndSet = function (index, expect, update) {
                        if (this._internal[index] == expect) {
                            this._internal[index] = update;
                            return true;
                        }
                        else {
                            return false;
                        }
                    };
                    AtomicLongArray.prototype.length = function () {
                        return this._internal.length;
                    };
                    return AtomicLongArray;
                }());
                atomic.AtomicLongArray = AtomicLongArray;
                var AtomicReferenceArray = /** @class */ (function () {
                    function AtomicReferenceArray(initialCapacity) {
                        this._internal = new Array();
                    }
                    AtomicReferenceArray.prototype.set = function (index, newVal) {
                        this._internal[index] = newVal;
                    };
                    AtomicReferenceArray.prototype.get = function (index) {
                        return this._internal[index];
                    };
                    AtomicReferenceArray.prototype.getAndSet = function (index, newVal) {
                        var temp = this._internal[index];
                        this._internal[index] = newVal;
                        return temp;
                    };
                    AtomicReferenceArray.prototype.compareAndSet = function (index, expect, update) {
                        if (this._internal[index] == expect) {
                            this._internal[index] = update;
                            return true;
                        }
                        else {
                            return false;
                        }
                    };
                    AtomicReferenceArray.prototype.length = function () {
                        return this._internal.length;
                    };
                    return AtomicReferenceArray;
                }());
                atomic.AtomicReferenceArray = AtomicReferenceArray;
                var AtomicReference = /** @class */ (function () {
                    function AtomicReference() {
                        this._internal = null;
                    }
                    AtomicReference.prototype.compareAndSet = function (expect, update) {
                        if (this._internal == expect) {
                            this._internal = update;
                            return true;
                        }
                        else {
                            return false;
                        }
                    };
                    AtomicReference.prototype.get = function () {
                        return this._internal;
                    };
                    AtomicReference.prototype.set = function (newRef) {
                        this._internal = newRef;
                    };
                    AtomicReference.prototype.getAndSet = function (newVal) {
                        var temp = this._internal;
                        this._internal = newVal;
                        return temp;
                    };
                    return AtomicReference;
                }());
                atomic.AtomicReference = AtomicReference;
                var AtomicLong = /** @class */ (function () {
                    function AtomicLong(init) {
                        this._internal = 0;
                        this._internal = init;
                    }
                    AtomicLong.prototype.compareAndSet = function (expect, update) {
                        if (this._internal == expect) {
                            this._internal = update;
                            return true;
                        }
                        else {
                            return false;
                        }
                    };
                    AtomicLong.prototype.get = function () {
                        return this._internal;
                    };
                    AtomicLong.prototype.incrementAndGet = function () {
                        this._internal++;
                        return this._internal;
                    };
                    AtomicLong.prototype.decrementAndGet = function () {
                        this._internal--;
                        return this._internal;
                    };
                    return AtomicLong;
                }());
                atomic.AtomicLong = AtomicLong;
                var AtomicBoolean = /** @class */ (function () {
                    function AtomicBoolean(init) {
                        this._internal = false;
                        this._internal = init;
                    }
                    AtomicBoolean.prototype.compareAndSet = function (expect, update) {
                        if (this._internal == expect) {
                            this._internal = update;
                            return true;
                        }
                        else {
                            return false;
                        }
                    };
                    AtomicBoolean.prototype.get = function () {
                        return this._internal;
                    };
                    AtomicBoolean.prototype.set = function (newVal) {
                        this._internal = newVal;
                    };
                    return AtomicBoolean;
                }());
                atomic.AtomicBoolean = AtomicBoolean;
                var AtomicInteger = /** @class */ (function () {
                    function AtomicInteger(init) {
                        this._internal = 0;
                        this._internal = init;
                    }
                    AtomicInteger.prototype.compareAndSet = function (expect, update) {
                        if (this._internal == expect) {
                            this._internal = update;
                            return true;
                        }
                        else {
                            return false;
                        }
                    };
                    AtomicInteger.prototype.get = function () {
                        return this._internal;
                    };
                    AtomicInteger.prototype.set = function (newVal) {
                        this._internal = newVal;
                    };
                    AtomicInteger.prototype.getAndSet = function (newVal) {
                        var temp = this._internal;
                        this._internal = newVal;
                        return temp;
                    };
                    AtomicInteger.prototype.incrementAndGet = function () {
                        this._internal++;
                        return this._internal;
                    };
                    AtomicInteger.prototype.decrementAndGet = function () {
                        this._internal--;
                        return this._internal;
                    };
                    AtomicInteger.prototype.getAndIncrement = function () {
                        var temp = this._internal;
                        this._internal++;
                        return temp;
                    };
                    AtomicInteger.prototype.getAndDecrement = function () {
                        var temp = this._internal;
                        this._internal--;
                        return temp;
                    };
                    return AtomicInteger;
                }());
                atomic.AtomicInteger = AtomicInteger;
            })(atomic = concurrent.atomic || (concurrent.atomic = {}));
            var locks;
            (function (locks) {
                var ReentrantLock = /** @class */ (function () {
                    function ReentrantLock() {
                    }
                    ReentrantLock.prototype.lock = function () {
                    };
                    ReentrantLock.prototype.unlock = function () {
                    };
                    return ReentrantLock;
                }());
                locks.ReentrantLock = ReentrantLock;
            })(locks = concurrent.locks || (concurrent.locks = {}));
        })(concurrent = util.concurrent || (util.concurrent = {}));
        var Random = /** @class */ (function () {
            function Random() {
                this.seed = undefined;
            }
            Random.prototype.nextInt = function (max) {
                if (typeof max === 'undefined') {
                    max = Math.pow(2, 32);
                }
                if (this.seed == undefined) {
                    return Math.floor(Math.random() * max);
                }
                else {
                    return Math.floor(this.nextSeeded(0, max));
                }
            };
            Random.prototype.nextDouble = function () {
                if (this.seed == undefined) {
                    return Math.random();
                }
                else {
                    return this.nextSeeded(Number.MIN_VALUE, Number.MAX_VALUE);
                }
            };
            Random.prototype.nextBoolean = function () {
                if (this.seed == undefined) {
                    return Math.random() >= 0.5;
                }
                else {
                    return this.nextSeeded() >= 0.5;
                }
            };
            Random.prototype.setSeed = function (seed) {
                this.seed = seed;
            };
            Random.prototype.nextSeeded = function (min, max) {
                var max = max || 1;
                var min = min || 0;
                this.seed = (this.seed * 9301 + 49297) % 233280;
                var rnd = this.seed / 233280;
                return min + rnd * (max - min);
            };
            return Random;
        }());
        util.Random = Random;
        var Arrays = /** @class */ (function () {
            function Arrays() {
            }
            Arrays.fill = function (data, begin, nbElem, param) {
                var max = begin + nbElem;
                for (var i = begin; i < max; i++) {
                    data[i] = param;
                }
            };
            Arrays.copyOf = function (original, newLength, ignore) {
                var copy = new Array(newLength);
                lang.System.arraycopy(original, 0, copy, 0, Math.min(original.length, newLength));
                return copy;
            };
            return Arrays;
        }());
        util.Arrays = Arrays;
        var Collections = /** @class */ (function () {
            function Collections() {
            }
            Collections.swap = function (list, i, j) {
                var l = list;
                l.set(i, l.set(j, l.get(i)));
            };
            return Collections;
        }());
        util.Collections = Collections;
        var Itr = /** @class */ (function () {
            function Itr(list) {
                this.cursor = 0;
                this.lastRet = -1;
                this.list = list;
            }
            Itr.prototype.hasNext = function () {
                return this.cursor != this.list.size();
            };
            Itr.prototype.next = function () {
                try {
                    var i = this.cursor;
                    var next = this.list.get(i);
                    this.lastRet = i;
                    this.cursor = i + 1;
                    return next;
                }
                catch ($ex$) {
                    if ($ex$ instanceof Error) {
                        var e = $ex$;
                        throw new Error("no such element exception");
                    }
                    else {
                        throw $ex$;
                    }
                }
            };
            return Itr;
        }());
        util.Itr = Itr;
        var HashSet = /** @class */ (function () {
            function HashSet() {
                this.content = {};
            }
            HashSet.prototype.add = function (val) {
                this.content[val] = val;
            };
            HashSet.prototype.clear = function () {
                this.content = {};
            };
            HashSet.prototype.contains = function (val) {
                return this.content.hasOwnProperty(val);
            };
            HashSet.prototype.containsAll = function (elems) {
                return false;
            };
            HashSet.prototype.addAll = function (vals) {
                var tempArray = vals.toArray(null);
                for (var i = 0; i < tempArray.length; i++) {
                    this.content[tempArray[i]] = tempArray[i];
                }
                return true;
            };
            HashSet.prototype.remove = function (val) {
                var b = false;
                if (this.content[val]) {
                    b = true;
                }
                delete this.content[val];
                return b;
            };
            HashSet.prototype.removeAll = function () {
                return false;
            };
            HashSet.prototype.size = function () {
                return Object.keys(this.content).length;
            };
            HashSet.prototype.isEmpty = function () {
                return this.size() == 0;
            };
            HashSet.prototype.toArray = function (a) {
                var _this = this;
                return Object.keys(this.content).map(function (key) { return _this.content[key]; });
            };
            HashSet.prototype.iterator = function () {
                return new java.util.Itr(this);
            };
            HashSet.prototype.forEach = function (f) {
                for (var p in this.content) {
                    f(this.content[p]);
                }
            };
            HashSet.prototype.get = function (index) {
                return this.content[index];
            };
            return HashSet;
        }());
        util.HashSet = HashSet;
        var AbstractList = /** @class */ (function () {
            function AbstractList() {
                this.content = [];
            }
            AbstractList.prototype.addAll = function (index, vals) {
                var tempArray = vals.toArray(null);
                for (var i = 0; i < tempArray.length; i++) {
                    this.content.push(tempArray[i]);
                }
                return false;
            };
            AbstractList.prototype.clear = function () {
                this.content = [];
            };
            AbstractList.prototype.poll = function () {
                return this.content.shift();
            };
            AbstractList.prototype.remove = function (indexOrElem) {
                this.content.splice(indexOrElem, 1);
                return true;
            };
            AbstractList.prototype.removeAll = function () {
                this.content = [];
                return true;
            };
            AbstractList.prototype.toArray = function (a) {
                return this.content;
            };
            AbstractList.prototype.size = function () {
                return this.content.length;
            };
            AbstractList.prototype.add = function (index, elem) {
                if (typeof elem !== 'undefined') {
                    this.content.splice(index, 0, elem);
                }
                else {
                    this.content.push(index);
                }
            };
            AbstractList.prototype.get = function (index) {
                return this.content[index];
            };
            AbstractList.prototype.contains = function (val) {
                return this.content.indexOf(val) != -1;
            };
            AbstractList.prototype.containsAll = function (elems) {
                return false;
            };
            AbstractList.prototype.isEmpty = function () {
                return this.content.length == 0;
            };
            AbstractList.prototype.set = function (index, element) {
                this.content[index] = element;
                return element;
            };
            AbstractList.prototype.indexOf = function (element) {
                return this.content.indexOf(element);
            };
            AbstractList.prototype.lastIndexOf = function (element) {
                return this.content.lastIndexOf(element);
            };
            AbstractList.prototype.iterator = function () {
                return new Itr(this);
            };
            return AbstractList;
        }());
        util.AbstractList = AbstractList;
        var LinkedList = /** @class */ (function (_super) {
            __extends(LinkedList, _super);
            function LinkedList() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return LinkedList;
        }(AbstractList));
        util.LinkedList = LinkedList;
        var ArrayList = /** @class */ (function (_super) {
            __extends(ArrayList, _super);
            function ArrayList() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ArrayList;
        }(AbstractList));
        util.ArrayList = ArrayList;
        var Stack = /** @class */ (function () {
            function Stack() {
                this.content = new Array();
            }
            Stack.prototype.pop = function () {
                return this.content.pop();
            };
            Stack.prototype.push = function (t) {
                this.content.push(t);
            };
            Stack.prototype.isEmpty = function () {
                return this.content.length == 0;
            };
            Stack.prototype.peek = function () {
                return this.content.slice(-1)[0];
            };
            return Stack;
        }());
        util.Stack = Stack;
        var HashMap = /** @class */ (function () {
            function HashMap() {
                this.content = {};
            }
            HashMap.prototype.get = function (key) {
                return this.content[key];
            };
            HashMap.prototype.put = function (key, value) {
                var previous_val = this.content[key];
                this.content[key] = value;
                return previous_val;
            };
            HashMap.prototype.containsKey = function (key) {
                return this.content.hasOwnProperty(key);
            };
            HashMap.prototype.remove = function (key) {
                var tmp = this.content[key];
                delete this.content[key];
                return tmp;
            };
            HashMap.prototype.keySet = function () {
                var result = new HashSet();
                for (var p in this.content) {
                    if (this.content.hasOwnProperty(p)) {
                        result.add(p);
                    }
                }
                return result;
            };
            HashMap.prototype.isEmpty = function () {
                return Object.keys(this.content).length == 0;
            };
            HashMap.prototype.values = function () {
                var result = new HashSet();
                for (var p in this.content) {
                    if (this.content.hasOwnProperty(p)) {
                        result.add(this.content[p]);
                    }
                }
                return result;
            };
            HashMap.prototype.clear = function () {
                this.content = {};
            };
            HashMap.prototype.size = function () {
                return Object.keys(this.content).length;
            };
            return HashMap;
        }());
        util.HashMap = HashMap;
        var ConcurrentHashMap = /** @class */ (function (_super) {
            __extends(ConcurrentHashMap, _super);
            function ConcurrentHashMap() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ConcurrentHashMap;
        }(HashMap));
        util.ConcurrentHashMap = ConcurrentHashMap;
    })(util = java.util || (java.util = {}));
})(java || (java = {}));
function arrayInstanceOf(arr, arg) {
    if (!(arr instanceof Array)) {
        return false;
    }
    else {
        if (arr.length == 0) {
            return true;
        }
        else {
            return (arr[0] instanceof arg);
        }
    }
}
var Long = /** @class */ (function () {
    function Long(low, high, unsigned) {
        /*
         long.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
         Released under the Apache License, Version 2.0
         see: https://github.com/dcodeIO/long.js for details
         */
        this.high = 0;
        this.low = 0;
        this.unsigned = false;
        this.eq = this.equals;
        this.neq = this.notEquals;
        this.lt = this.lessThan;
        this.lte = this.lessThanOrEqual;
        this.gt = this.greaterThan;
        this.gte = this.greaterThanOrEqual;
        this.comp = this.compare;
        this.neg = this.negate;
        this.sub = this.subtract;
        this.mul = this.multiply;
        this.div = this.divide;
        this.mod = this.modulo;
        this.shl = this.shiftLeft;
        this.shr = this.shiftRight;
        this.shru = this.shiftRightUnsigned;
        if (!(high == undefined)) {
            this.high = high;
        }
        if (!(low == undefined)) {
            this.low = low;
        }
        if (!(unsigned == undefined)) {
            this.unsigned = unsigned;
        }
    }
    Long.isLong = function (obj) {
        return (obj && obj["__isLong__"]) === true;
    };
    Long.fromInt = function (value, unsigned) {
        var obj, cachedObj, cache;
        if (unsigned) {
            value >>>= 0;
            if (cache = (0 <= value && value < 256)) {
                cachedObj = Long.UINT_CACHE[value];
                if (cachedObj)
                    return cachedObj;
            }
            obj = Long.fromBits(value, (value | 0) < 0 ? -1 : 0, true);
            if (cache)
                Long.UINT_CACHE[value] = obj;
            return obj;
        }
        else {
            value |= 0;
            if (cache = (-128 <= value && value < 128)) {
                cachedObj = Long.INT_CACHE[value];
                if (cachedObj)
                    return cachedObj;
            }
            obj = Long.fromBits(value, value < 0 ? -1 : 0, false);
            if (cache)
                Long.INT_CACHE[value] = obj;
            return obj;
        }
    };
    Long.fromNumber = function (value, unsigned) {
        if (isNaN(value) || !isFinite(value))
            return unsigned ? Long.UZERO : Long.ZERO;
        if (unsigned) {
            if (value < 0)
                return Long.UZERO;
            if (value >= Long.TWO_PWR_64_DBL)
                return Long.MAX_UNSIGNED_VALUE;
        }
        else {
            if (value <= -Long.TWO_PWR_63_DBL)
                return Long.MIN_VALUE;
            if (value + 1 >= Long.TWO_PWR_63_DBL)
                return Long.MAX_VALUE;
        }
        if (value < 0)
            return Long.fromNumber(-value, unsigned).neg();
        return Long.fromBits((value % Long.TWO_PWR_32_DBL) | 0, (value / Long.TWO_PWR_32_DBL) | 0, unsigned);
    };
    Long.fromBits = function (lowBits, highBits, unsigned) {
        return new Long(lowBits, highBits, unsigned);
    };
    Long.fromString = function (str, radix, unsigned) {
        if (radix === void 0) { radix = 10; }
        if (unsigned === void 0) { unsigned = false; }
        if (str.length === 0)
            throw Error('empty string');
        if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
            return Long.ZERO;
        radix = radix || 10;
        if (radix < 2 || 36 < radix)
            throw RangeError('radix');
        var p;
        if ((p = str.indexOf('-')) > 0)
            throw Error('interior hyphen');
        else if (p === 0) {
            return Long.fromString(str.substring(1), radix, unsigned).neg();
        }
        // Do several (8) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = Long.fromNumber(Long.pow_dbl(radix, 8));
        var result = Long.ZERO;
        for (var i = 0; i < str.length; i += 8) {
            var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
            if (size < 8) {
                var power = Long.fromNumber(Long.pow_dbl(radix, size));
                result = result.mul(power).add(Long.fromNumber(value));
            }
            else {
                result = result.mul(radixToPower);
                result = result.add(Long.fromNumber(value));
            }
        }
        result.unsigned = unsigned;
        return result;
    };
    Long.fromValue = function (val) {
        if (val /* is compatible */ instanceof Long)
            return val;
        if (typeof val === 'number')
            return Long.fromNumber(val);
        if (typeof val === 'string')
            return Long.fromString(val);
        // Throws for non-objects, converts non-instanceof Long:
        return Long.fromBits(val.low, val.high, val.unsigned);
    };
    Long.prototype.toInt = function () {
        return this.unsigned ? this.low >>> 0 : this.low;
    };
    ;
    Long.prototype.toNumber = function () {
        if (this.unsigned)
            return ((this.high >>> 0) * Long.TWO_PWR_32_DBL) + (this.low >>> 0);
        return this.high * Long.TWO_PWR_32_DBL + (this.low >>> 0);
    };
    ;
    Long.prototype.toString = function (radix) {
        radix = radix || 10;
        if (radix < 2 || 36 < radix)
            throw RangeError('radix');
        if (this.isZero())
            return '0';
        if (this.isNegative()) { // Unsigned Longs are never negative
            if (this.eq(Long.MIN_VALUE)) {
                // We need to change the Long value before it can be negated, so we remove
                // the bottom-most digit in this base and then recurse to do the rest.
                var radixLong = Long.fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
                return div.toString(radix) + rem1.toInt().toString(radix);
            }
            else
                return '-' + this.neg().toString(radix);
        }
        // Do several (6) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = Long.fromNumber(Long.pow_dbl(radix, 6), this.unsigned);
        var rem = this;
        var result = '';
        while (true) {
            var remDiv = rem.div(radixToPower);
            var intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0;
            var digits = intval.toString(radix);
            rem = remDiv;
            if (rem.isZero())
                return digits + result;
            else {
                while (digits.length < 6)
                    digits = '0' + digits;
                result = '' + digits + result;
            }
        }
    };
    ;
    Long.prototype.getHighBits = function () {
        return this.high;
    };
    ;
    Long.prototype.getHighBitsUnsigned = function () {
        return this.high >>> 0;
    };
    ;
    Long.prototype.getLowBits = function () {
        return this.low;
    };
    ;
    Long.prototype.getLowBitsUnsigned = function () {
        return this.low >>> 0;
    };
    ;
    Long.prototype.getNumBitsAbs = function () {
        if (this.isNegative()) // Unsigned Longs are never negative
            return this.eq(Long.MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
        var val = this.high != 0 ? this.high : this.low;
        for (var bit = 31; bit > 0; bit--)
            if ((val & (1 << bit)) != 0)
                break;
        return this.high != 0 ? bit + 33 : bit + 1;
    };
    ;
    Long.prototype.isZero = function () {
        return this.high === 0 && this.low === 0;
    };
    ;
    Long.prototype.isNegative = function () {
        return !this.unsigned && this.high < 0;
    };
    ;
    Long.prototype.isPositive = function () {
        return this.unsigned || this.high >= 0;
    };
    ;
    Long.prototype.isOdd = function () {
        return (this.low & 1) === 1;
    };
    ;
    Long.prototype.isEven = function () {
        return (this.low & 1) === 0;
    };
    ;
    Long.prototype.equals = function (other) {
        if (!Long.isLong(other))
            other = Long.fromValue(other);
        if (this.unsigned !== other.unsigned && (this.high >>> 31) === 1 && (other.high >>> 31) === 1)
            return false;
        return this.high === other.high && this.low === other.low;
    };
    ;
    Long.prototype.notEquals = function (other) {
        return !this.eq(other);
    };
    ;
    Long.prototype.lessThan = function (other) {
        return this.comp(other) < 0;
    };
    ;
    Long.prototype.lessThanOrEqual = function (other) {
        return this.comp(other) <= 0;
    };
    ;
    Long.prototype.greaterThan = function (other) {
        return this.comp(other) > 0;
    };
    ;
    Long.prototype.greaterThanOrEqual = function (other) {
        return this.comp(other) >= 0;
    };
    ;
    Long.prototype.compare = function (other) {
        if (!Long.isLong(other))
            other = Long.fromValue(other);
        if (this.eq(other))
            return 0;
        var thisNeg = this.isNegative(), otherNeg = other.isNegative();
        if (thisNeg && !otherNeg)
            return -1;
        if (!thisNeg && otherNeg)
            return 1;
        // At this point the sign bits are the same
        if (!this.unsigned)
            return this.sub(other).isNegative() ? -1 : 1;
        // Both are positive if at least one is unsigned
        return (other.high >>> 0) > (this.high >>> 0) || (other.high === this.high && (other.low >>> 0) > (this.low >>> 0)) ? -1 : 1;
    };
    ;
    Long.prototype.negate = function () {
        if (!this.unsigned && this.eq(Long.MIN_VALUE))
            return Long.MIN_VALUE;
        return this.not().add(Long.ONE);
    };
    ;
    Long.prototype.add = function (addend) {
        if (!Long.isLong(addend)) {
            addend = Long.fromValue(addend);
        }
        // Divide each number into 4 chunks of 16 bits, and then sum the chunks.
        var a48 = this.high >>> 16;
        var a32 = this.high & 0xFFFF;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xFFFF;
        var b48 = addend.high >>> 16;
        var b32 = addend.high & 0xFFFF;
        var b16 = addend.low >>> 16;
        var b00 = addend.low & 0xFFFF;
        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 + b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 + b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 + b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 + b48;
        c48 &= 0xFFFF;
        return Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
    };
    ;
    Long.prototype.subtract = function (subtrahend) {
        if (!Long.isLong(subtrahend))
            subtrahend = Long.fromValue(subtrahend);
        return this.add(subtrahend.neg());
    };
    ;
    Long.prototype.multiply = function (multiplier) {
        if (this.isZero())
            return Long.ZERO;
        if (!Long.isLong(multiplier))
            multiplier = Long.fromValue(multiplier);
        if (multiplier.isZero())
            return Long.ZERO;
        if (this.eq(Long.MIN_VALUE))
            return multiplier.isOdd() ? Long.MIN_VALUE : Long.ZERO;
        if (multiplier.eq(Long.MIN_VALUE))
            return this.isOdd() ? Long.MIN_VALUE : Long.ZERO;
        if (this.isNegative()) {
            if (multiplier.isNegative())
                return this.neg().mul(multiplier.neg());
            else
                return this.neg().mul(multiplier).neg();
        }
        else if (multiplier.isNegative())
            return this.mul(multiplier.neg()).neg();
        // If both longs are small, use float multiplication
        if (this.lt(Long.TWO_PWR_24) && multiplier.lt(Long.TWO_PWR_24))
            return Long.fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
        // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
        // We can skip products that would overflow.
        var a48 = this.high >>> 16;
        var a32 = this.high & 0xFFFF;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xFFFF;
        var b48 = multiplier.high >>> 16;
        var b32 = multiplier.high & 0xFFFF;
        var b16 = multiplier.low >>> 16;
        var b00 = multiplier.low & 0xFFFF;
        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 * b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 * b00;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c16 += a00 * b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 * b00;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a16 * b16;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a00 * b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
        c48 &= 0xFFFF;
        return Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
    };
    ;
    Long.prototype.divide = function (divisor) {
        if (!Long.isLong(divisor))
            divisor = Long.fromValue(divisor);
        if (divisor.isZero())
            throw Error('division by zero');
        if (this.isZero())
            return this.unsigned ? Long.UZERO : Long.ZERO;
        var approx, rem, res;
        if (!this.unsigned) {
            // This section is only relevant for signed longs and is derived from the
            // closure library as a whole.
            if (this.eq(Long.MIN_VALUE)) {
                if (divisor.eq(Long.ONE) || divisor.eq(Long.NEG_ONE))
                    return Long.MIN_VALUE; // recall that -MIN_VALUE == MIN_VALUE
                else if (divisor.eq(Long.MIN_VALUE))
                    return Long.ONE;
                else {
                    // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                    var halfThis = this.shr(1);
                    approx = halfThis.div(divisor).shl(1);
                    if (approx.eq(Long.ZERO)) {
                        return divisor.isNegative() ? Long.ONE : Long.NEG_ONE;
                    }
                    else {
                        rem = this.sub(divisor.mul(approx));
                        res = approx.add(rem.div(divisor));
                        return res;
                    }
                }
            }
            else if (divisor.eq(Long.MIN_VALUE))
                return this.unsigned ? Long.UZERO : Long.ZERO;
            if (this.isNegative()) {
                if (divisor.isNegative())
                    return this.neg().div(divisor.neg());
                return this.neg().div(divisor).neg();
            }
            else if (divisor.isNegative())
                return this.div(divisor.neg()).neg();
            res = Long.ZERO;
        }
        else {
            // The algorithm below has not been made for unsigned longs. It's therefore
            // required to take special care of the MSB prior to running it.
            if (!divisor.unsigned)
                divisor = divisor.toUnsigned();
            if (divisor.gt(this))
                return Long.UZERO;
            if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
                return Long.UONE;
            res = Long.UZERO;
        }
        // Repeat the following until the remainder is less than other:  find a
        // floating-point that approximates remainder / other *from below*, add this
        // into the result, and subtract it from the remainder.  It is critical that
        // the approximate value is less than or equal to the real value so that the
        // remainder never becomes negative.
        rem = this;
        while (rem.gte(divisor)) {
            // Approximate the result of division. This may be a little greater or
            // smaller than the actual value.
            approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
            // We will tweak the approximate result by changing it in the 48-th digit or
            // the smallest non-fractional digit, whichever is larger.
            var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = (log2 <= 48) ? 1 : Long.pow_dbl(2, log2 - 48), 
            // Decrease the approximation until it is smaller than the remainder.  Note
            // that if it is too large, the product overflows and is negative.
            approxRes = Long.fromNumber(approx), approxRem = approxRes.mul(divisor);
            while (approxRem.isNegative() || approxRem.gt(rem)) {
                approx -= delta;
                approxRes = Long.fromNumber(approx, this.unsigned);
                approxRem = approxRes.mul(divisor);
            }
            // We know the answer can't be zero... and actually, zero would cause
            // infinite recursion since we would make no progress.
            if (approxRes.isZero())
                approxRes = Long.ONE;
            res = res.add(approxRes);
            rem = rem.sub(approxRem);
        }
        return res;
    };
    ;
    Long.prototype.modulo = function (divisor) {
        if (!Long.isLong(divisor))
            divisor = Long.fromValue(divisor);
        return this.sub(this.div(divisor).mul(divisor));
    };
    ;
    Long.prototype.not = function () {
        return Long.fromBits(~this.low, ~this.high, this.unsigned);
    };
    ;
    Long.prototype.and = function (other) {
        if (!Long.isLong(other))
            other = Long.fromValue(other);
        return Long.fromBits(this.low & other.low, this.high & other.high, this.unsigned);
    };
    ;
    Long.prototype.or = function (other) {
        if (!Long.isLong(other))
            other = Long.fromValue(other);
        return Long.fromBits(this.low | other.low, this.high | other.high, this.unsigned);
    };
    ;
    Long.prototype.xor = function (other) {
        if (!Long.isLong(other))
            other = Long.fromValue(other);
        return Long.fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
    };
    ;
    Long.prototype.shiftLeft = function (numBits) {
        if (Long.isLong(numBits))
            numBits = numBits.toInt();
        if ((numBits &= 63) === 0)
            return this;
        else if (numBits < 32)
            return Long.fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
        else
            return Long.fromBits(0, this.low << (numBits - 32), this.unsigned);
    };
    ;
    Long.prototype.shiftRight = function (numBits) {
        if (Long.isLong(numBits))
            numBits = numBits.toInt();
        if ((numBits &= 63) === 0)
            return this;
        else if (numBits < 32)
            return Long.fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
        else
            return Long.fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
    };
    ;
    Long.prototype.shiftRightUnsigned = function (numBits) {
        if (Long.isLong(numBits))
            numBits = numBits.toInt();
        numBits &= 63;
        if (numBits === 0)
            return this;
        else {
            var high = this.high;
            if (numBits < 32) {
                var low = this.low;
                return Long.fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
            }
            else if (numBits === 32)
                return Long.fromBits(high, 0, this.unsigned);
            else
                return Long.fromBits(high >>> (numBits - 32), 0, this.unsigned);
        }
    };
    ;
    Long.prototype.toSigned = function () {
        if (!this.unsigned)
            return this;
        return Long.fromBits(this.low, this.high, false);
    };
    ;
    Long.prototype.toUnsigned = function () {
        if (this.unsigned)
            return this;
        return Long.fromBits(this.low, this.high, true);
    };
    ;
    Long.INT_CACHE = {};
    Long.UINT_CACHE = {};
    Long.pow_dbl = Math.pow;
    Long.TWO_PWR_16_DBL = 1 << 16;
    Long.TWO_PWR_24_DBL = 1 << 24;
    Long.TWO_PWR_32_DBL = Long.TWO_PWR_16_DBL * Long.TWO_PWR_16_DBL;
    Long.TWO_PWR_64_DBL = Long.TWO_PWR_32_DBL * Long.TWO_PWR_32_DBL;
    Long.TWO_PWR_63_DBL = Long.TWO_PWR_64_DBL / 2;
    Long.TWO_PWR_24 = Long.fromInt(Long.TWO_PWR_24_DBL);
    Long.ZERO = Long.fromInt(0);
    Long.UZERO = Long.fromInt(0, true);
    Long.ONE = Long.fromInt(1);
    Long.UONE = Long.fromInt(1, true);
    Long.NEG_ONE = Long.fromInt(-1);
    Long.MAX_VALUE = Long.fromBits(0x7FFFFFFF, 0xFFFFFFFF, false);
    Long.MAX_UNSIGNED_VALUE = Long.fromBits(0xFFFFFFFF, 0xFFFFFFFF, true);
    Long.MIN_VALUE = Long.fromBits(0x80000000, 0, false);
    return Long;
}());
Object.defineProperty(Long.prototype, "__isLong__", {
    value: true,
    enumerable: false,
    configurable: false
});
/// <reference path="./jre.ts" />
var sample;
(function (sample) {
    var HelloWorld = /** @class */ (function () {
        function HelloWorld() {
        }
        HelloWorld.linCol = function (C) {
            var k = C / 255.0;
            var c;
            if (k < 0.03928) {
                c = k / 12.95;
            }
            else {
                c = Math.pow(k + 0.055 / 1.055, 2.4);
            }
            return c;
        };
        HelloWorld.L = function (r, g, b) {
            return 0.212 * sample.HelloWorld.linCol(r) + 0.7152 * sample.HelloWorld.linCol(g) + 0.0722 * sample.HelloWorld.linCol(b);
        };
        HelloWorld.contrast = function (threshold, r1, g1, b1, r2, g2, b2) {
            var La = sample.HelloWorld.L(r1, g1, b1);
            var Lb = sample.HelloWorld.L(r2, g2, b2);
            var L1 = Math.max(La, Lb);
            var L2 = Math.min(La, Lb);
            var ratio = (L1 + 0.05) / (L2 + 0.05);
            return ratio > threshold;
        };
        HelloWorld.readImage = function (imageName) {
            return ImageIO.read(new File(imageName));
        };
        HelloWorld.saveImage = function (imageName, bIn) {
            var format = "JPG";
            if (imageName.contains(".jpg")) {
                format = "JPG";
            }
            else {
                if (imageName.contains(".png")) {
                    format = "PNG";
                }
                else {
                    if (imageName.contains(".gif")) {
                        format = "GIF";
                    }
                }
            }
            ImageIO.write(bIn, format, new File(imageName));
        };
        HelloWorld.staticFilter = function () {
            console.log("experiment 1....");
            var bIn = sample.HelloWorld.readImage("test.jpg");
            var g = bIn.getGraphics();
            var out = new BufferedImage(bIn.getWidth(), bIn.getHeight(), bIn.getType());
            for (var i = 0; i < bIn.getWidth(); i++) {
                var alpha, red, green, blue;
                for (var j = 0; j < bIn.getHeight(); j++) {
                    alpha = new Color(bIn.getRGB(i, j)).getAlpha();
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    var f = 128;
                    var grey = (blue + red + green) / 3;
                    grey = (grey / f) * f;
                    var c = new Color(grey, grey, grey);
                    out.setRGB(i, j, c.getRGB());
                }
            }
            sample.HelloWorld.saveImage("resultat.png", out);
        };
        HelloWorld.dynamicFilter = function () {
            console.log("experiment 2....");
            var bIn = sample.HelloWorld.readImage("test.jpg");
            var g = bIn.getGraphics();
            var out = new BufferedImage(bIn.getWidth(), bIn.getHeight(), bIn.getType());
            var res = 4;
            var f = 256 / res;
            var histogram = new Array(res);
            for (var histogram_d1 = 0; histogram_d1 < res; histogram_d1++) {
                histogram[histogram_d1] = new Array(res);
                for (var histogram_d2 = 0; histogram_d2 < res; histogram_d2++) {
                    histogram[histogram_d1][histogram_d2] = new Int32Array(res);
                }
            }
            ;
            for (var i = bIn.getWidth() / 3; i < 2 * bIn.getWidth() / 3; i++) {
                var alpha, red, green, blue;
                for (var j = bIn.getHeight() / 3; j < 2 * bIn.getHeight() / 3; j++) {
                    alpha = new Color(bIn.getRGB(i, j)).getAlpha();
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    blue = (blue / f);
                    red = (red / f);
                    green = (green / f);
                    histogram[red][green][blue]++;
                }
            }
            var max = 0;
            var secondMax = 0;
            var maxR = 0, maxG = 0, maxB = 0;
            var sMaxR, sMaxG, sMaxB;
            for (var red = 0; red < res; red++) {
                for (var green = 0; green < res; green++) {
                    for (var blue = 0; blue < res; blue++) {
                        var curr = histogram[red][green][blue];
                        if (curr > max) {
                            secondMax = max;
                            sMaxR = maxR;
                            sMaxG = maxG;
                            sMaxB = maxB;
                            max = curr;
                            maxR = red;
                            maxG = green;
                            maxB = blue;
                        }
                        else {
                            if (curr > secondMax) {
                                secondMax = curr;
                                sMaxR = red;
                                sMaxG = green;
                                sMaxB = blue;
                            }
                        }
                        if (histogram[red][green][blue] > 0) {
                            console.log(red + " " + green + " " + " " + blue + " - " + histogram[red][green][blue]);
                        }
                    }
                }
            }
            console.log("winners: " + max + ", " + secondMax);
            var tmpr = 0, tmpg = 0, tmpb = 0, count = 0;
            for (var i = bIn.getWidth() / 3; i < 2 * bIn.getWidth() / 3; i++) {
                var alpha, red, green, blue;
                for (var j = bIn.getHeight() / 3; j < 2 * bIn.getHeight() / 3; j++) {
                    alpha = new Color(bIn.getRGB(i, j)).getAlpha();
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    var bb = (blue / f);
                    var br = (red / f);
                    var bg = (green / f);
                    if (br == maxR && bg == maxG && bb == maxB) {
                        tmpr += red;
                        tmpg += green;
                        tmpb += blue;
                        count++;
                    }
                }
            }
            maxR = tmpr / count;
            maxG = tmpg / count;
            maxB = tmpb / count;
            console.log("max colour centroid: " + maxR + ", " + maxG + ", " + maxB);
            for (var i = 0; i < bIn.getWidth(); i++) {
                var alpha, red, green, blue;
                for (var j = 0; j < bIn.getHeight(); j++) {
                    alpha = new Color(bIn.getRGB(i, j)).getAlpha();
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    if (!sample.HelloWorld.contrast(7.0, red, green, blue, maxR, maxG, maxB)) {
                        red = maxR;
                        green = maxG;
                        blue = maxB;
                    }
                    var c = new Color(red, green, blue);
                    out.setRGB(i, j, c.getRGB());
                }
            }
            sample.HelloWorld.saveImage("resultat.png", out);
        };
        HelloWorld.fixedColourFilter = function () {
            console.log("experiment 5....");
            var bIn = sample.HelloWorld.readImage("test.jpg");
            var g = bIn.getGraphics();
            var out = new BufferedImage(bIn.getWidth(), bIn.getHeight(), bIn.getType());
            var maxR = 255;
            var maxG = 255;
            var maxB = 255;
            for (var i = 0; i < bIn.getWidth(); i++) {
                var red, green, blue;
                for (var j = 0; j < bIn.getHeight(); j++) {
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    if (!sample.HelloWorld.contrast(3.0, red, green, blue, maxR, maxG, maxB)) {
                        red = maxR;
                        green = maxG;
                        blue = maxB;
                    }
                    var c = new Color(red, green, blue);
                    out.setRGB(i, j, c.getRGB());
                }
            }
            sample.HelloWorld.saveImage("resultat.png", out);
        };
        HelloWorld.enhancingFilterSaturation = function () {
            console.log("experiment 2....");
            var bIn = sample.HelloWorld.readImage("test.jpg");
            var g = bIn.getGraphics();
            var out = new BufferedImage(bIn.getWidth(), bIn.getHeight(), bIn.getType());
            var res = 4;
            var f = 256 / res;
            var histogram = new Array(res);
            for (var histogram_d1 = 0; histogram_d1 < res; histogram_d1++) {
                histogram[histogram_d1] = new Array(res);
                for (var histogram_d2 = 0; histogram_d2 < res; histogram_d2++) {
                    histogram[histogram_d1][histogram_d2] = new Int32Array(res);
                }
            }
            ;
            for (var i = bIn.getWidth() / 3; i < 2 * bIn.getWidth() / 3; i++) {
                var alpha, red, green, blue;
                for (var j = bIn.getHeight() / 3; j < 2 * bIn.getHeight() / 3; j++) {
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    blue = (blue / f);
                    red = (red / f);
                    green = (green / f);
                    histogram[red][green][blue]++;
                }
            }
            var max = 0;
            var secondMax = 0;
            var maxR = 0, maxG = 0, maxB = 0;
            var sMaxR = 0, sMaxG = 0, sMaxB = 0;
            for (var red = 0; red < res; red++) {
                for (var green = 0; green < res; green++) {
                    for (var blue = 0; blue < res; blue++) {
                        var curr = histogram[red][green][blue];
                        if (curr > max) {
                            secondMax = max;
                            sMaxR = maxR;
                            sMaxG = maxG;
                            sMaxB = maxB;
                            max = curr;
                            maxR = red;
                            maxG = green;
                            maxB = blue;
                        }
                        else {
                            if (curr > secondMax) {
                                secondMax = curr;
                                sMaxR = red;
                                sMaxG = green;
                                sMaxB = blue;
                            }
                        }
                    }
                }
            }
            var tmpr = 0, tmpg = 0, tmpb = 0, count = 0;
            for (var i = bIn.getWidth() / 3; i < 2 * bIn.getWidth() / 3; i++) {
                var red, green, blue;
                for (var j = bIn.getHeight() / 3; j < 2 * bIn.getHeight() / 3; j++) {
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    var bb = (blue / f);
                    var br = (red / f);
                    var bg = (green / f);
                    if (br == maxR && bg == maxG && bb == maxB) {
                        tmpr += red;
                        tmpg += green;
                        tmpb += blue;
                        count++;
                    }
                }
            }
            maxR = tmpr / count;
            maxG = tmpg / count;
            maxB = tmpb / count;
            var backCol = new Color(maxR, maxG, maxB).getRGB();
            console.log("max colour centroid: " + maxR + ", " + maxG + ", " + maxB);
            console.log("backCol: " + backCol);
            tmpr = 0;
            tmpg = 0;
            tmpb = 0;
            count = 0;
            for (var i = bIn.getWidth() / 3; i < 2 * bIn.getWidth() / 3; i++) {
                var red, green, blue;
                for (var j = bIn.getHeight() / 3; j < 2 * bIn.getHeight() / 3; j++) {
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    var bb = (blue / f);
                    var br = (red / f);
                    var bg = (green / f);
                    if (br == sMaxR && bg == sMaxG && bb == sMaxB) {
                        tmpr += red;
                        tmpg += green;
                        tmpb += blue;
                        count++;
                    }
                }
            }
            sMaxR = tmpr / count;
            sMaxG = tmpg / count;
            sMaxB = tmpb / count;
            console.log("second max colour centroid: " + sMaxR + ", " + sMaxG + ", " + sMaxB);
            var hsbBack = Color.RGBtoHSB(maxR, maxG, maxB, null);
            var hsbSecondBack = Color.RGBtoHSB(sMaxR, sMaxG, sMaxB, null);
            var threshold = 3.0;
            var minDist = java.lang.Float.MAX_VALUE;
            var adjForegroundCol = 0;
            for (var k = 0; k < 100; k++) {
                var sat = k / 100;
                var col = Color.HSBtoRGB(hsbSecondBack[0], sat, hsbSecondBack[2]);
                var red = new Color(col).getRed();
                var green = new Color(col).getGreen();
                var blue = new Color(col).getBlue();
                if (sample.HelloWorld.contrast(threshold, red, green, blue, maxR, maxG, maxB)) {
                    var dist = Math.abs(hsbBack[1] - sat);
                    if (dist < minDist) {
                        minDist = dist;
                        adjForegroundCol = col;
                    }
                }
            }
            console.log("adjForegroundCol: " + adjForegroundCol);
            var adjRed = new Color(adjForegroundCol).getRed();
            var adjGreen = new Color(adjForegroundCol).getGreen();
            var adjBlue = new Color(adjForegroundCol).getBlue();
            console.log("adjusted foreground colour centroid: " + adjRed + ", " + adjGreen + ", " + adjBlue);
            for (var i = 0; i < bIn.getWidth(); i++) {
                var alpha, red, green, blue;
                for (var j = 0; j < bIn.getHeight(); j++) {
                    alpha = new Color(bIn.getRGB(i, j)).getAlpha();
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    var distBack = (red - maxR) * (red - maxR) + (green - maxG) * (green - maxG) + (blue - maxB) * (blue - maxB);
                    var distFore = (red - sMaxR) * (red - sMaxR) + (green - sMaxG) * (green - sMaxG) + (blue - sMaxB) * (blue - sMaxB);
                    var col = backCol;
                    if (distFore < distBack) {
                        col = adjForegroundCol;
                    }
                    out.setRGB(i, j, col);
                }
            }
            sample.HelloWorld.saveImage("resultat.png", out);
        };
        HelloWorld.enhancingFilterBrightness = function () {
            console.log("experiment 2....");
            var bIn = sample.HelloWorld.readImage("test.jpg");
            var g = bIn.getGraphics();
            var out = new BufferedImage(bIn.getWidth(), bIn.getHeight(), bIn.getType());
            var res = 4;
            var f = 256 / res;
            var histogram = new Array(res);
            for (var histogram_d1 = 0; histogram_d1 < res; histogram_d1++) {
                histogram[histogram_d1] = new Array(res);
                for (var histogram_d2 = 0; histogram_d2 < res; histogram_d2++) {
                    histogram[histogram_d1][histogram_d2] = new Int32Array(res);
                }
            }
            ;
            for (var i = bIn.getWidth() / 3; i < 2 * bIn.getWidth() / 3; i++) {
                var alpha, red, green, blue;
                for (var j = bIn.getHeight() / 3; j < 2 * bIn.getHeight() / 3; j++) {
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    blue = (blue / f);
                    red = (red / f);
                    green = (green / f);
                    histogram[red][green][blue]++;
                }
            }
            var max = 0;
            var secondMax = 0;
            var maxR = 0, maxG = 0, maxB = 0;
            var sMaxR = 0, sMaxG = 0, sMaxB = 0;
            for (var red = 0; red < res; red++) {
                for (var green = 0; green < res; green++) {
                    for (var blue = 0; blue < res; blue++) {
                        var curr = histogram[red][green][blue];
                        if (curr > max) {
                            secondMax = max;
                            sMaxR = maxR;
                            sMaxG = maxG;
                            sMaxB = maxB;
                            max = curr;
                            maxR = red;
                            maxG = green;
                            maxB = blue;
                        }
                        else {
                            if (curr > secondMax) {
                                secondMax = curr;
                                sMaxR = red;
                                sMaxG = green;
                                sMaxB = blue;
                            }
                        }
                    }
                }
            }
            var tmpr = 0, tmpg = 0, tmpb = 0, count = 0;
            for (var i = bIn.getWidth() / 3; i < 2 * bIn.getWidth() / 3; i++) {
                var red, green, blue;
                for (var j = bIn.getHeight() / 3; j < 2 * bIn.getHeight() / 3; j++) {
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    var bb = (blue / f);
                    var br = (red / f);
                    var bg = (green / f);
                    if (br == maxR && bg == maxG && bb == maxB) {
                        tmpr += red;
                        tmpg += green;
                        tmpb += blue;
                        count++;
                    }
                }
            }
            maxR = tmpr / count;
            maxG = tmpg / count;
            maxB = tmpb / count;
            var backCol = new Color(maxR, maxG, maxB).getRGB();
            console.log("max colour centroid: " + maxR + ", " + maxG + ", " + maxB);
            console.log("backCol: " + backCol);
            tmpr = 0;
            tmpg = 0;
            tmpb = 0;
            count = 0;
            for (var i = bIn.getWidth() / 3; i < 2 * bIn.getWidth() / 3; i++) {
                var red, green, blue;
                for (var j = bIn.getHeight() / 3; j < 2 * bIn.getHeight() / 3; j++) {
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    var bb = (blue / f);
                    var br = (red / f);
                    var bg = (green / f);
                    if (br == sMaxR && bg == sMaxG && bb == sMaxB) {
                        tmpr += red;
                        tmpg += green;
                        tmpb += blue;
                        count++;
                    }
                }
            }
            sMaxR = tmpr / count;
            sMaxG = tmpg / count;
            sMaxB = tmpb / count;
            console.log("second max colour centroid: " + sMaxR + ", " + sMaxG + ", " + sMaxB);
            var hsbBack = Color.RGBtoHSB(maxR, maxG, maxB, null);
            var hsbSecondBack = Color.RGBtoHSB(sMaxR, sMaxG, sMaxB, null);
            var threshold = 3.0;
            var minDist = java.lang.Float.MAX_VALUE;
            var adjForegroundCol = 0;
            for (var k = 0; k < 100; k++) {
                var bri = k / 100;
                var col = Color.HSBtoRGB(hsbSecondBack[0], hsbSecondBack[1], bri);
                var red = new Color(col).getRed();
                var green = new Color(col).getGreen();
                var blue = new Color(col).getBlue();
                console.log("bri " + bri + " k: " + k);
                if (sample.HelloWorld.contrast(threshold, red, green, blue, maxR, maxG, maxB)) {
                    var dist = Math.abs(hsbBack[2] - bri);
                    console.log("dist " + dist + " mbIn " + minDist);
                    if (dist < minDist) {
                        minDist = dist;
                        adjForegroundCol = col;
                    }
                }
            }
            console.log("adjForegroundCol: " + adjForegroundCol);
            var adjRed = new Color(adjForegroundCol).getRed();
            var adjGreen = new Color(adjForegroundCol).getGreen();
            var adjBlue = new Color(adjForegroundCol).getBlue();
            console.log("adjusted foreground colour centroid: " + adjRed + ", " + adjGreen + ", " + adjBlue);
            for (var i = 0; i < bIn.getWidth(); i++) {
                var alpha, red, green, blue;
                for (var j = 0; j < bIn.getHeight(); j++) {
                    alpha = new Color(bIn.getRGB(i, j)).getAlpha();
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    var distBack = (red - maxR) * (red - maxR) + (green - maxG) * (green - maxG) + (blue - maxB) * (blue - maxB);
                    var distFore = (red - sMaxR) * (red - sMaxR) + (green - sMaxG) * (green - sMaxG) + (blue - sMaxB) * (blue - sMaxB);
                    var col = backCol;
                    if (distFore < distBack) {
                        col = adjForegroundCol;
                    }
                    out.setRGB(i, j, col);
                }
            }
            sample.HelloWorld.saveImage("resultat.png", out);
        };
        HelloWorld.enhancingFilterBrightnessBackground = function () {
            console.log("experiment 2....");
            var bIn = sample.HelloWorld.readImage("test.jpg");
            var g = bIn.getGraphics();
            var out = new BufferedImage(bIn.getWidth(), bIn.getHeight(), bIn.getType());
            var res = 4;
            var f = 256 / res;
            var histogram = new Array(res);
            for (var histogram_d1 = 0; histogram_d1 < res; histogram_d1++) {
                histogram[histogram_d1] = new Array(res);
                for (var histogram_d2 = 0; histogram_d2 < res; histogram_d2++) {
                    histogram[histogram_d1][histogram_d2] = new Int32Array(res);
                }
            }
            ;
            for (var i = bIn.getWidth() / 3; i < 2 * bIn.getWidth() / 3; i++) {
                var alpha, red, green, blue;
                for (var j = bIn.getHeight() / 3; j < 2 * bIn.getHeight() / 3; j++) {
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    blue = (blue / f);
                    red = (red / f);
                    green = (green / f);
                    histogram[red][green][blue]++;
                }
            }
            var max = 0;
            var secondMax = 0;
            var maxR = 0, maxG = 0, maxB = 0;
            var sMaxR = 0, sMaxG = 0, sMaxB = 0;
            for (var red = 0; red < res; red++) {
                for (var green = 0; green < res; green++) {
                    for (var blue = 0; blue < res; blue++) {
                        var curr = histogram[red][green][blue];
                        if (curr > max) {
                            secondMax = max;
                            sMaxR = maxR;
                            sMaxG = maxG;
                            sMaxB = maxB;
                            max = curr;
                            maxR = red;
                            maxG = green;
                            maxB = blue;
                        }
                        else {
                            if (curr > secondMax) {
                                secondMax = curr;
                                sMaxR = red;
                                sMaxG = green;
                                sMaxB = blue;
                            }
                        }
                    }
                }
            }
            var tmpr = 0, tmpg = 0, tmpb = 0, count = 0;
            for (var i = bIn.getWidth() / 3; i < 2 * bIn.getWidth() / 3; i++) {
                var red, green, blue;
                for (var j = bIn.getHeight() / 3; j < 2 * bIn.getHeight() / 3; j++) {
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    var bb = (blue / f);
                    var br = (red / f);
                    var bg = (green / f);
                    if (br == maxR && bg == maxG && bb == maxB) {
                        tmpr += red;
                        tmpg += green;
                        tmpb += blue;
                        count++;
                    }
                }
            }
            maxR = tmpr / count;
            maxG = tmpg / count;
            maxB = tmpb / count;
            var backCol = new Color(maxR, maxG, maxB).getRGB();
            console.log("max colour centroid: " + maxR + ", " + maxG + ", " + maxB);
            console.log("backCol: " + backCol);
            tmpr = 0;
            tmpg = 0;
            tmpb = 0;
            count = 0;
            for (var i = bIn.getWidth() / 3; i < 2 * bIn.getWidth() / 3; i++) {
                var red, green, blue;
                for (var j = bIn.getHeight() / 3; j < 2 * bIn.getHeight() / 3; j++) {
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    var bb = (blue / f);
                    var br = (red / f);
                    var bg = (green / f);
                    if (br == sMaxR && bg == sMaxG && bb == sMaxB) {
                        tmpr += red;
                        tmpg += green;
                        tmpb += blue;
                        count++;
                    }
                }
            }
            sMaxR = tmpr / count;
            sMaxG = tmpg / count;
            sMaxB = tmpb / count;
            console.log("second max colour centroid: " + sMaxR + ", " + sMaxG + ", " + sMaxB);
            var hsbBack = Color.RGBtoHSB(maxR, maxG, maxB, null);
            var hsbSecondBack = Color.RGBtoHSB(sMaxR, sMaxG, sMaxB, null);
            var threshold = 7.0;
            var minDist = java.lang.Float.MAX_VALUE;
            var adjBackCol = 0;
            for (var k = 0; k < 100; k++) {
                var bri = k / 100;
                var col = Color.HSBtoRGB(hsbBack[0], hsbBack[1], bri);
                var red = new Color(col).getRed();
                var green = new Color(col).getGreen();
                var blue = new Color(col).getBlue();
                console.log("bri " + bri + " k: " + k);
                if (sample.HelloWorld.contrast(threshold, red, green, blue, sMaxR, sMaxG, sMaxB)) {
                    var dist = Math.abs(hsbSecondBack[2] - bri);
                    console.log("dist " + dist + " mbIn " + minDist);
                    if (dist < minDist) {
                        minDist = dist;
                        adjBackCol = col;
                    }
                }
            }
            console.log("adjBackCol: " + adjBackCol);
            var adjRed = new Color(adjBackCol).getRed();
            var adjGreen = new Color(adjBackCol).getGreen();
            var adjBlue = new Color(adjBackCol).getBlue();
            console.log("adjusted foreground colour centroid: " + adjRed + ", " + adjGreen + ", " + adjBlue);
            for (var i = 0; i < bIn.getWidth(); i++) {
                var alpha, red, green, blue;
                for (var j = 0; j < bIn.getHeight(); j++) {
                    alpha = new Color(bIn.getRGB(i, j)).getAlpha();
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    var distBack = (red - maxR) * (red - maxR) + (green - maxG) * (green - maxG) + (blue - maxB) * (blue - maxB);
                    var distFore = (red - sMaxR) * (red - sMaxR) + (green - sMaxG) * (green - sMaxG) + (blue - sMaxB) * (blue - sMaxB);
                    var col = adjBackCol;
                    if (distFore < distBack) {
                        col = bIn.getRGB(i, j);
                    }
                    out.setRGB(i, j, col);
                }
            }
            sample.HelloWorld.saveImage("resultat.png", out);
        };
        HelloWorld.makeSBplot = function () {
            console.log("experiment 4....");
            var bIn = sample.HelloWorld.readImage("test.jpg");
            var g = bIn.getGraphics();
            var imgRes = 1000;
            var out = new BufferedImage(imgRes, imgRes, bIn.getType());
            var g2 = out.getGraphics();
            var res = 4;
            var f = 256 / res;
            var histogram = new Array(res);
            for (var histogram_d1 = 0; histogram_d1 < res; histogram_d1++) {
                histogram[histogram_d1] = new Array(res);
                for (var histogram_d2 = 0; histogram_d2 < res; histogram_d2++) {
                    histogram[histogram_d1][histogram_d2] = new Int32Array(res);
                }
            }
            ;
            for (var i = bIn.getWidth() / 3; i < 2 * bIn.getWidth() / 3; i++) {
                var alpha, red, green, blue;
                for (var j = bIn.getHeight() / 3; j < 2 * bIn.getHeight() / 3; j++) {
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    blue = (blue / f);
                    red = (red / f);
                    green = (green / f);
                    histogram[red][green][blue]++;
                }
            }
            var max = 0;
            var secondMax = 0;
            var maxR = 0, maxG = 0, maxB = 0;
            var sMaxR = 0, sMaxG = 0, sMaxB = 0;
            for (var red = 0; red < res; red++) {
                for (var green = 0; green < res; green++) {
                    for (var blue = 0; blue < res; blue++) {
                        var curr = histogram[red][green][blue];
                        if (curr > max) {
                            secondMax = max;
                            sMaxR = maxR;
                            sMaxG = maxG;
                            sMaxB = maxB;
                            max = curr;
                            maxR = red;
                            maxG = green;
                            maxB = blue;
                        }
                        else {
                            if (curr > secondMax) {
                                secondMax = curr;
                                sMaxR = red;
                                sMaxG = green;
                                sMaxB = blue;
                            }
                        }
                    }
                }
            }
            var tmpr = 0, tmpg = 0, tmpb = 0, count = 0;
            for (var i = bIn.getWidth() / 3; i < 2 * bIn.getWidth() / 3; i++) {
                var red, green, blue;
                for (var j = bIn.getHeight() / 3; j < 2 * bIn.getHeight() / 3; j++) {
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    var bb = (blue / f);
                    var br = (red / f);
                    var bg = (green / f);
                    if (br == maxR && bg == maxG && bb == maxB) {
                        tmpr += red;
                        tmpg += green;
                        tmpb += blue;
                        count++;
                    }
                }
            }
            maxR = tmpr / count;
            maxG = tmpg / count;
            maxB = tmpb / count;
            var backCol = new Color(maxR, maxG, maxB).getRGB();
            console.log("max colour centroid: " + maxR + ", " + maxG + ", " + maxB);
            console.log("backCol: " + backCol);
            tmpr = 0;
            tmpg = 0;
            tmpb = 0;
            count = 0;
            for (var i = bIn.getWidth() / 3; i < 2 * bIn.getWidth() / 3; i++) {
                var red, green, blue;
                for (var j = bIn.getHeight() / 3; j < 2 * bIn.getHeight() / 3; j++) {
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    var bb = (blue / f);
                    var br = (red / f);
                    var bg = (green / f);
                    if (br == sMaxR && bg == sMaxG && bb == sMaxB) {
                        tmpr += red;
                        tmpg += green;
                        tmpb += blue;
                        count++;
                    }
                }
            }
            sMaxR = tmpr / count;
            sMaxG = tmpg / count;
            sMaxB = tmpb / count;
            console.log("second max colour centroid: " + sMaxR + ", " + sMaxG + ", " + sMaxB);
            var hsbBack = Color.RGBtoHSB(maxR, maxG, maxB, null);
            var hsbSecondBack = Color.RGBtoHSB(sMaxR, sMaxG, sMaxB, null);
            for (var k = 0; k < imgRes; k++) {
                for (var m = 0; m < imgRes; m++) {
                    var paintCol = Color.WHITE.getRGB();
                    var bri = k / imgRes;
                    var sat = m / imgRes;
                    var col = Color.HSBtoRGB(hsbSecondBack[0], sat, bri);
                    var red = new Color(col).getRed();
                    var green = new Color(col).getGreen();
                    var blue = new Color(col).getBlue();
                    if (sample.HelloWorld.contrast(3.0, red, green, blue, maxR, maxG, maxB)) {
                        paintCol = Color.LIGHT_GRAY.getRGB();
                    }
                    if (sample.HelloWorld.contrast(4.5, red, green, blue, maxR, maxG, maxB)) {
                        paintCol = Color.GRAY.getRGB();
                    }
                    if (sample.HelloWorld.contrast(5.0, red, green, blue, maxR, maxG, maxB)) {
                        paintCol = Color.DARK_GRAY.getRGB();
                    }
                    if (sample.HelloWorld.contrast(7.0, red, green, blue, maxR, maxG, maxB)) {
                        paintCol = Color.BLACK.getRGB();
                    }
                    out.setRGB(k, m, paintCol);
                }
            }
            g2.setColor(Color.green);
            g2.setStroke(new BasicStroke(5));
            var x = (hsbBack[2] * imgRes);
            var y = (hsbBack[1] * imgRes);
            var delta = imgRes / 40;
            g2.drawLine(x - delta, y - delta, x + delta, y + delta);
            g2.drawLine(x + delta, y - delta, x - delta, y + delta);
            g2.setColor(Color.red);
            x = (hsbSecondBack[2] * imgRes);
            y = (hsbSecondBack[1] * imgRes);
            g2.drawLine(x - delta, y - delta, x + delta, y + delta);
            g2.drawLine(x + delta, y - delta, x - delta, y + delta);
            sample.HelloWorld.saveImage("SBplot.png", out);
        };
        HelloWorld.filterImage = function (contrast, imageName, r, g, b) {
            var bIn = sample.HelloWorld.readImage(imageName);
            var out = new BufferedImage(bIn.getWidth(), bIn.getHeight(), bIn.getType());
            for (var i = 0; i < bIn.getWidth(); i++) {
                var red, green, blue;
                for (var j = 0; j < bIn.getHeight(); j++) {
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    if (!sample.HelloWorld.contrast(contrast, red, green, blue, r, g, b)) {
                        red = r;
                        green = g;
                        blue = b;
                    }
                    var c = new Color(red, green, blue);
                    out.setRGB(i, j, c.getRGB());
                }
            }
            sample.HelloWorld.saveImage(imageName + contrast + "simulated.png", out);
        };
        HelloWorld.enhanceImage = function (imageName, nr, ng, nb, or, og, ob, br, bg, bb) {
            var bIn = sample.HelloWorld.readImage(imageName);
            var out = new BufferedImage(bIn.getWidth(), bIn.getHeight(), bIn.getType());
            var radius = ((or - br) * (or - br) + (og - bg) * (og - bg) + (ob - bb) * (ob - bb)) / 4;
            var correctedCol = new Color(nr, ng, nb).getRGB();
            for (var i = 0; i < bIn.getWidth(); i++) {
                var red, green, blue;
                for (var j = 0; j < bIn.getHeight(); j++) {
                    var col = bIn.getRGB(i, j);
                    red = new Color(col).getRed();
                    green = new Color(col).getGreen();
                    blue = new Color(col).getBlue();
                    var dist = (red - or) * (red - or) + (green - og) * (green - og) + (blue - ob) * (blue - ob);
                    if (dist < radius) {
                        col = correctedCol;
                    }
                    out.setRGB(i, j, col);
                }
            }
            sample.HelloWorld.saveImage(imageName + nr + "-" + ng + "-" + nb + "enhanced.png", out);
        };
        HelloWorld.analyseAndImprove = function (imageName) {
            console.log("Contrast analyser");
            var bIn = sample.HelloWorld.readImage(imageName);
            var g = bIn.getGraphics();
            var imgRes = 1000;
            var out = new BufferedImage(imgRes, imgRes, bIn.getType());
            var g2 = out.getGraphics();
            var res = 4;
            var f = 256 / res;
            var histogram = new Array(res);
            for (var histogram_d1 = 0; histogram_d1 < res; histogram_d1++) {
                histogram[histogram_d1] = new Array(res);
                for (var histogram_d2 = 0; histogram_d2 < res; histogram_d2++) {
                    histogram[histogram_d1][histogram_d2] = new Int32Array(res);
                }
            }
            ;
            for (var i = bIn.getWidth() / 3; i < 2 * bIn.getWidth() / 3; i++) {
                var alpha, red, green, blue;
                for (var j = bIn.getHeight() / 3; j < 2 * bIn.getHeight() / 3; j++) {
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    blue = (blue / f);
                    red = (red / f);
                    green = (green / f);
                    histogram[red][green][blue]++;
                }
            }
            var max = 0;
            var secondMax = 0;
            var maxR = 0, maxG = 0, maxB = 0;
            var sMaxR = 0, sMaxG = 0, sMaxB = 0;
            for (var red = 0; red < res; red++) {
                for (var green = 0; green < res; green++) {
                    for (var blue = 0; blue < res; blue++) {
                        var curr = histogram[red][green][blue];
                        if (curr > max) {
                            secondMax = max;
                            sMaxR = maxR;
                            sMaxG = maxG;
                            sMaxB = maxB;
                            max = curr;
                            maxR = red;
                            maxG = green;
                            maxB = blue;
                        }
                        else {
                            if (curr > secondMax) {
                                secondMax = curr;
                                sMaxR = red;
                                sMaxG = green;
                                sMaxB = blue;
                            }
                        }
                    }
                }
            }
            var tmpr = 0, tmpg = 0, tmpb = 0, count = 0;
            for (var i = bIn.getWidth() / 3; i < 2 * bIn.getWidth() / 3; i++) {
                var red, green, blue;
                for (var j = bIn.getHeight() / 3; j < 2 * bIn.getHeight() / 3; j++) {
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    var bb = (blue / f);
                    var br = (red / f);
                    var bg = (green / f);
                    if (br == maxR && bg == maxG && bb == maxB) {
                        tmpr += red;
                        tmpg += green;
                        tmpb += blue;
                        count++;
                    }
                }
            }
            maxR = tmpr / count;
            maxG = tmpg / count;
            maxB = tmpb / count;
            tmpr = 0;
            tmpg = 0;
            tmpb = 0;
            count = 0;
            for (var i = bIn.getWidth() / 3; i < 2 * bIn.getWidth() / 3; i++) {
                var red, green, blue;
                for (var j = bIn.getHeight() / 3; j < 2 * bIn.getHeight() / 3; j++) {
                    red = new Color(bIn.getRGB(i, j)).getRed();
                    green = new Color(bIn.getRGB(i, j)).getGreen();
                    blue = new Color(bIn.getRGB(i, j)).getBlue();
                    var bb = (blue / f);
                    var br = (red / f);
                    var bg = (green / f);
                    if (br == sMaxR && bg == sMaxG && bb == sMaxB) {
                        tmpr += red;
                        tmpg += green;
                        tmpb += blue;
                        count++;
                    }
                }
            }
            sMaxR = tmpr / count;
            sMaxG = tmpg / count;
            sMaxB = tmpb / count;
            console.log("Background: " + maxR + ", " + maxG + ", " + maxB);
            console.log("Foreground: " + sMaxR + ", " + sMaxG + ", " + sMaxB);
            if (sample.HelloWorld.contrast(7.0, sMaxR, sMaxG, sMaxB, maxR, maxG, maxB)) {
                console.log("Constrast > 7:1, text WCAG2.0 AAA (criterion 1.4.6 enhanced)");
            }
            else {
                if (sample.HelloWorld.contrast(4.5, sMaxR, sMaxG, sMaxB, maxR, maxG, maxB)) {
                    console.log("Constrast > 4.5:1, text WCAG2.0 AA (criteriion 1.4.3 minimum) large text WCAG2.0 AAA (criterion 1.4.6 enhanced)");
                }
            }
            if (sample.HelloWorld.contrast(3.0, sMaxR, sMaxG, sMaxB, maxR, maxG, maxB)) {
                console.log("Constrast > 3:1, large text WCAG2.0 AA (criteriion 1.4.3 minimum)");
            }
            else {
                if (sample.HelloWorld.contrast(7.0, sMaxR, sMaxG, sMaxB, maxR, maxG, maxB)) {
                    console.log("Contrast < 3:1, insufficient contrast.");
                }
            }
            var hsbBack = Color.RGBtoHSB(maxR, maxG, maxB, null);
            var hsbSecondBack = Color.RGBtoHSB(sMaxR, sMaxG, sMaxB, null);
            var minDist3 = java.lang.Double.MAX_VALUE;
            var minDist45 = java.lang.Double.MAX_VALUE;
            var minDist7 = java.lang.Double.MAX_VALUE;
            var s3 = 0, s45 = 0, s7 = 0;
            var b3 = 0, b45 = 0, b7 = 0;
            for (var k = 0; k < imgRes; k++) {
                for (var m = 0; m < imgRes; m++) {
                    var paintCol = Color.WHITE.getRGB();
                    var bri = k / imgRes;
                    var sat = m / imgRes;
                    var col = Color.HSBtoRGB(hsbSecondBack[0], sat, bri);
                    var red = new Color(col).getRed();
                    var green = new Color(col).getGreen();
                    var blue = new Color(col).getBlue();
                    var dist = (bri - hsbBack[2]) * (bri - hsbBack[2]) + (sat - hsbBack[1]) * (sat - hsbBack[1]);
                    if (sample.HelloWorld.contrast(3.0, red, green, blue, maxR, maxG, maxB)) {
                        paintCol = Color.LIGHT_GRAY.getRGB();
                        if (dist < minDist3) {
                            minDist3 = dist;
                            s3 = sat;
                            b3 = bri;
                        }
                    }
                    if (sample.HelloWorld.contrast(4.5, red, green, blue, maxR, maxG, maxB)) {
                        paintCol = Color.GRAY.getRGB();
                        if (dist < minDist45) {
                            minDist45 = dist;
                            s45 = sat;
                            b45 = bri;
                        }
                    }
                    if (sample.HelloWorld.contrast(7.0, red, green, blue, maxR, maxG, maxB)) {
                        paintCol = Color.DARK_GRAY.getRGB();
                        if (dist < minDist7) {
                            minDist7 = dist;
                            s7 = sat;
                            b7 = bri;
                        }
                    }
                    out.setRGB(k, m, paintCol);
                }
            }
            var col = Color.HSBtoRGB(hsbSecondBack[0], s3, b3);
            var red = new Color(col).getRed();
            var green = new Color(col).getGreen();
            var blue = new Color(col).getBlue();
            console.log("3:1 contrast correctd foreground: " + red + ", " + green + ", " + blue);
            sample.HelloWorld.filterImage(3.0, imageName, maxR, maxG, maxB);
            sample.HelloWorld.enhanceImage(imageName, red, green, blue, sMaxR, sMaxG, sMaxB, maxR, maxG, maxB);
            col = Color.HSBtoRGB(hsbSecondBack[0], s45, b45);
            red = new Color(col).getRed();
            green = new Color(col).getGreen();
            blue = new Color(col).getBlue();
            console.log("4.1:1 contrast corrected foreground: " + red + ", " + green + ", " + blue);
            sample.HelloWorld.filterImage(4.5, imageName, maxR, maxG, maxB);
            sample.HelloWorld.enhanceImage(imageName, red, green, blue, sMaxR, sMaxG, sMaxB, maxR, maxG, maxB);
            col = Color.HSBtoRGB(hsbSecondBack[0], s7, b7);
            red = new Color(col).getRed();
            green = new Color(col).getGreen();
            blue = new Color(col).getBlue();
            console.log("7:1 contrast corrected foreground: " + red + ", " + green + ", " + blue);
            sample.HelloWorld.filterImage(7.0, imageName, maxR, maxG, maxB);
            sample.HelloWorld.enhanceImage(imageName, red, green, blue, sMaxR, sMaxG, sMaxB, maxR, maxG, maxB);
            g2.setColor(Color.green);
            g2.setStroke(new BasicStroke(5));
            var x = (hsbBack[2] * imgRes);
            var y = (hsbBack[1] * imgRes);
            var delta = imgRes / 40;
            g2.drawLine(x - delta, y - delta, x + delta, y + delta);
            g2.drawLine(x + delta, y - delta, x - delta, y + delta);
            g2.setColor(Color.red);
            x = (hsbSecondBack[2] * imgRes);
            y = (hsbSecondBack[1] * imgRes);
            g2.drawLine(x - delta, y - delta, x + delta, y + delta);
            g2.drawLine(x + delta, y - delta, x - delta, y + delta);
            g2.setColor(Color.blue);
            x = (b3 * imgRes);
            y = (s3 * imgRes);
            g2.drawLine(x - delta, y - delta, x + delta, y + delta);
            g2.drawLine(x + delta, y - delta, x - delta, y + delta);
            x = (b45 * imgRes);
            y = (s45 * imgRes);
            g2.drawLine(x - delta, y - delta, x + delta, y + delta);
            g2.drawLine(x + delta, y - delta, x - delta, y + delta);
            x = (b7 * imgRes);
            y = (s7 * imgRes);
            g2.drawLine(x - delta, y - delta, x + delta, y + delta);
            g2.drawLine(x + delta, y - delta, x - delta, y + delta);
            sample.HelloWorld.saveImage(imageName + "SBplot.png", out);
        };
        HelloWorld.main = function (args) {
            try {
                sample.HelloWorld.analyseAndImprove("C:\\Users\\faete\\Documents\\NetBeansProjects\\icchp2018contrast\\src\\icchp2018contrast\\Capture.PNG");
            }
            catch ($ex$) {
                if ($ex$ instanceof Error) {
                    var e = $ex$;
                    console.error(e);
                }
                else {
                    throw $ex$;
                }
            }
        };
        return HelloWorld;
    }());
    sample.HelloWorld = HelloWorld;
})(sample || (sample = {}));
//# sourceMappingURL=sample.js.map