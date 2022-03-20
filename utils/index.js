// 冻结对象
var emptyObject = Object.freeze({});


// 判断是否未定义
function isUndef (v) {
  return v === undefined || v === null
}

// 判断是否已定义
function isDef (v) {
  return v !== undefined && v !== null
}

// 判断是否是 true
function isTrue (v) {
  return v === true
}


// 判断是否是 false
function isFalse (v) {
  return v === false
}


/**
 * 判断 value 是否是原始值（基本类型）
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}


/**
 * 判断 obj 是不是引用类型（注意 typeof null === 'object'）
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}


/**
 * @function 获得变量的原生类型（精确）
 */
var _toString = Object.prototype.toString;


function toRawType (value) {
  return _toString.call(value).slice(8, -1) // (start, end) - 出现负数的情况会进行 s.length + start / s.length + end 处理
}



/**
 * 判断是否是纯对象（不为数组 / null）
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}


/**
 * 判断是否是正则表达式
 */
function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}


/**
 * 判断是否是正确的数组索引（0、1、2...etc）
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  // 先验证是否是大于 0 的数；再验证是否是浮点数；最后看是不是有限数值(这一步没看懂)  
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}   


/*
    isFinite 用来判断被传入的参数值是否为一个有限数值
    isFinite 方法检测它参数的数值。如果参数是 NaN，正无穷大或者负无穷大，会返回false，其他返回 true
    isFinite(Infinity);  // false
    isFinite(NaN);       // false
    isFinite(-Infinity); // false
    isFinite(0);         // true
    isFinite(2e64);      // true, 在更强壮的Number.isFinite(null)中将会得到false
    isFinite("0");       // true, 在更强壮的Number.isFinite('0')中将会得到false
*/


/**
 * 判断是否是 promise
 */
function isPromise (val) {
  return (
    isDef(val) && // 防止未定义下面抛错
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}


/**
 * 将某个类型的数据转换成 String 类型
 */
function toString (val) {
  return val == null // 排除 undefined 和 null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString) // 验证是否是数组和对象
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/*
  JSON.stringify(value, replacer?, space?)
  space - 缩进的空格
*/


/**
 * 将输入的类型转化为数值类型
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/*
  examples
  toNumber('a') // 'a'
  toNumber('1') // 1
  toNumber('1a') // 1
  toNumber('a1') // 'a1'
*/




/**
 * @function 传入一个以逗号分隔的字符串并以此构造map
 * @param {String} 需要提取的字符串 
 * @param {Boolean} 是否需要进行大小写转换
 * @returns {Function} 判断一个键值是否在 map 内
 */

function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null); // 没有原型链的空对象
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

// 基于 makeMap 构造的 map列表
var isBuiltInTag = makeMap('slot,component', true);
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/*
  isBuiltInTag('slot') // true
  isBuiltInTag('component') // true
  isBuiltInTag('Slot') // true
  isBuiltInTag('Component') // true

  isReservedAttribute('key') // true
  isReservedAttribute('ref') // true
  isReservedAttribute('slot') // true
  isReservedAttribute('slot-scope') // true
  isReservedAttribute('is') // true
  isReservedAttribute('IS') // undefined
*/






/**
 * 从数组中移除一个元素
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1) // 其实相当于把所有的元素都左移一位（如果长度太大的话会很消耗性能）
    }
  }
}


/**
 * 检测某个属性在数组中是否存在
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}


/**
 * @function 利用闭包缓存数据
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {// 为什么要用()包着呢
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}


/**
 * 连字符转camelCase(小驼峰)
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { 
    /*
      将分组的内容替换掉匹配的内容
      example abc-efg => abcEfg
      匹配到的是 -e 使用 E 进行替换
    */
    return c ? c.toUpperCase() : ''; 
  })
});




/**
 * 首字母转大写
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});



/**
 * camelCase(小驼峰)转连字符
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  // $1 指的是第一个分组的内容(也就是所有的大写字母)
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});



/**
 * @function bind兼容处理
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */


/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }


  boundFn._length = fn.length;
  return boundFn
}


function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}


var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;





/**
 * @function 将类数组转换成真数组
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  // 从后往前拷贝
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/*function fn() {
  var arr1 = toArray(arguments);
  console.log(arr1); // [1, 2, 3, 4, 5]
  var arr2 = toArray(arguments, 2);
  console.log(arr2); // [3, 4, 5]
}
fn(1, 2, 3, 4, 5)*/




/**
 * @function 对象属性合并
 * @description 会产生覆盖的效果
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}


/**
 * @function 数组转对象
 * @description 相同的键值会被合并
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {// 存在对应的值就不继续添加了
      extend(res, arr[i]);
    }
  }
  return res
}


/* eslint-disable no-unused-vars */


/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}


/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };


/* eslint-enable no-unused-vars */


/**
 * @function 返回参数本身
 */
var identity = function (_) { return _; };


/**
 * @function 产生静态字符串
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}


/**
 * @function 宽松比较
 * @description 如果内容相等就认为两个引用类型是相等的
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {// 如果是数组或者对象则进入比较
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) { // 判定当前两个变量是数组
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i]) // 可能存在多维数组需要进行递归判断
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime() // 以格林威治时间数值做比较
      } else if (!isArrayA && !isArrayB) { // 判定是对象
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        
        // 键值列表长度 & 每个键值
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key]) // 同样存在键值是对象需要递归判断
        })
      } 
      
      else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * @description 在原有的基础上增加 Map 和 Set 的宽松判断
 */
function looseEqualUpper(a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      let typeA = toRawType(a), typeB = toRawType(b) // 借用上述得到源类型的方法

      if (typeA == 'Array' && typeB == 'Array') { // Array
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) { // Date
        return a.getTime() === b.getTime()
      } else if(typeA == 'Set' && typeB == 'Set') { // Set
          console.log('===Set===')
          const keysA = a.keys(), keysB = b.keys()

          if(keysA.length === keysB.length) { 
              for(let itemA of a) { // 如果是基于无顺序都要验证相等性的话
                let tmp = 0
                for(let itemB of b) {
                  if(looseEqualUpper(itemA, itemB)) { break }
                  else tmp++
                }
                if(tmp === keysA.length) { return false }
              }
          } 
          return true 


      } else if(typeA == 'Map' && typeB == 'Map') { // Map
          console.log('===Map===')
          const keysA = a.keys(), keysB = b.keys()
          
          if(keysA.length === keysB.length) {
            for(let item of keysA) {
              return looseEqualUpper(a.get(item), b.get(item))
            }
          } else { return false }

        } else if (!isArrayA && !isArrayB) { // Object
          var keysA = Object.keys(a);
          var keysB = Object.keys(b);
          
          // 键值列表长度 & 每个键值
          return keysA.length === keysB.length && keysA.every(function (key) {
            return looseEqual(a[key], b[key]) // 同样存在键值是对象需要递归判断
          })
      } 
      
      else {
        return false
      }
    } catch (e) {
      return false
    }
  } else if (!isObjectA && !isObjectB) {// 基本值的判断
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * @function 宽松indexof查找
 * @description 对比于原生的indexof能对数组或者对象等进行相同判定处理
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}


/**
 * @function 保证一个函数只运行一次
 */
function once (fn) {
  var called = false; // 利用闭包的原理
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}


var SSR_ATTR = 'data-server-rendered';


/* 
  下面这些都是提前设置好的常量
  在初始化阶段进行全局 component、directive、filter等的创建
  触发相关生命周期钩子
*/

// Vue 的全局设置
var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];


// Vue 的生命周期
var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];


/*  */