####list.v
```
#include <B>
<list list_data max_num>
    #for i in getlist()
        <B name = i[0]
           value = i[1]/>
    #endfor

    hello #name#!

    <B name = name|| name = #name/>
    <B name = name>Hello</B>
</list>
```
####list.js
```
class list {
    constructor () {
        this.name = 1
    }
    getlist () {
        return this.argv['list_data'].slice(this.argv['max_num'])
    }
    did_unload () {

    }
    did_load () {

    }
}
```

```
view中支持的指令
#include
#for #endfor
#if #elif #else #endif

js 
life cycle
did_load 加载完成后
did_unload 卸载的时候调用
```

```
Meta元节点
1. #inlcude
eg:
#include <A>

2. #for
eg:
#for k,v in obj
#endfor

3. #if
#if condition
#elif condtion
#else 
#endif

4. #define
#define A expression

Node节点
DNode  dom节点
SNode  字符串节点
VNode  变量节点
```
