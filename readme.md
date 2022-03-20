1. 命名规范
可以看到源码里面的函数命名是严格遵守一定规范的，比如说 isPrimitive, toRawType 等等，is 一般表示的是 xxx 是不是 xxx， to一般表示的是将某个值转换成 xxx 或者是将某个类型转换成 xxx 类型，has 一般表示的是是否包含 xxx ...etc

2. 新知识  
● isFinite - 判断传入的参数值是否是一个有限数值  
    isFinite(Infinity);   false  
    isFinite(NaN);       false  
    isFinite(-Infinity)   false  
    isFinite(0);            true  

3. 判断的严谨性

```js
function isPromise (val) {
  return (
    isDef(val) && // 防止未定义下面抛错
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}
```

比如说上面这段代码，如果是让我来写的话可能一开始并不会判断 val 是否未定义，因为下意识地认为这个函数不就是判断 Promise 吗，那我排除基本值什么的就好了，但是其实还存在未定义的情况，所以写代码还需要考虑更多的情况防止实际使用的时候出问题。  

还有就是我觉得这段宽松判断真的写得特别好，整个思路捋下来非常清晰有逻辑。其中在原有的基础上我觉得可以补充下Map和 Set 这两个结构的宽松对比.

```js
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
```



4. 收获了很多非常有用的函数

```js
function toRawType (value) {
  return _toString.call(value).slice(8, -1) // (start, end) - 出现负数的情况会进行 s.length + start / s.length + end 处理
}


function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}


function toString (val) {
  return val == null // 排除 undefined 和 null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}


var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { 
    /*
      正则表达式里面非常有意思的分组内容
      将分组的内容替换掉匹配的内容
      example abc-efg => abcEfg
      匹配到的是 -e 使用 E 进行替换
    */
    return c ? c.toUpperCase() : ''; 
  })
});
```