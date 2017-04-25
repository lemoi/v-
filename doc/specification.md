##Syntax
example:
``` 
==1==
/*
@require({
    'i': './a'
})
@view(
<Button type: string = 'default'
        size: string = 'md'
        disabled: boolean = false
        on_click: function>
    <button class=[
                'btn',
                'btn-' + type,
                'btn-' + size,
                disabled && 'disabled']
            @click=on_click>
    </button>
</Button>
)
@style('button.css')
*/

import { argv, data, on, thread } from 'vpp';

@on('update')
function update() {
    console.log('123');
}

data['adasds'] = '1123232';

thread.argv
thread.data = {}
thread.name = 'button'
thread.version = 'vpp@1.0.0'
thread.uuid = 1
thread.on('load', function () {
    console.log('loaded');
})
thread.set('a.b&set')
thread.data = Object.create(thread.argv)
thread.on('update', function (old, data) {
})
/*
thread.on('update', function (_) {
})
*/
thread.types['a'] = function (value, helper) {
    return helper.match(value, [helper.string, helper.number]);
}

==2==
@require()
@view()
@style()
export default ({ argv, data, on }) => {
    data['a'] = 123;
    on('update', function () {
        console.log('update');
    })
    Object.assign{data, {
    }}
}
/*
import { import } from 'vpp'
import('button.js').render()

*/
```
###@view

- #for(while)
- #if
- #elif
- #else
- #def
- #!{}
- #macro
- #yield
- #end
- #=#
- ##

!def, macro: 宽松命名
其他: javascript命名
####type checking
```
[string, number] array, type of the first is string, second is number
arrayOf(number)
{ length: number }
{ height: 10 }
string, number, object, function, symbol
```

####Looping
```
#for value in object
    <div>#{value}</div>
#end

#for key, value in object
    <div>#{kwy, value}</div>
#end
```

####Conditional
```
#if expression
    
#elif expression

#else
    
#end

#if a
  <b></b>
#end
```

####Defination
```
#def hi
    <div>"Hi"</div>
#end    

#def hi(name)
    <div>"Hi, " + <span>name</span></div>
    #yield
#end

<hi name='Alice'>123</hi>
```

####Text Replacement
```
<!-- with HTML escaping -->
<div>#{name}</div>
<!-- equal to -->
<div>#!:escape{name}</div>
<!-- disable escaping -->
<div>#!{name}</div>
<!-- add some other string handlers -->
<div>#!:escape:padLeft(5){name}</div>
<!-- treat the directive as text -->
<div>
    <span>\#for</span>
    <span>\##</span>
    <span>\#{name}</span>
</div>
...
```

####Comment
```
//multiline
#=#
    xxxxx
    xxxxx
#=#
//singleline
## xxxxx
```

####Attribute
One thing should be notified that the attribute value is treated as an expression.
```
<!-- class attribute -->
<!-- the following are equal -->
<div class = ['a', 'b']></div>
<div class = {'a': true, 'b': true}></div>
<div class = "a, b"></div>
<div class = ["a", "b"].join(' ')></div>
<div class = ("a"+ " " 
                + "b")></div>
<div class = "a " + "b"></div>
<div class = "a ${"b"}"></div>

<!-- style attribute -->
<div style = {'color': 'red'}></div>
<div style = "color: red"></div>

<!-- some other attributes -->
<div id = id></div>
<div id = "${id}"></div>
<input type="text" disabled="true">
<input type="text" disabled=false>

<input type="text" value &= val> // bind with ref
<button click @= handle_click> // bind 
<button keydown @.enter= input></button>

<input focus := true>
```

####Macro, Yeild
```
//definition
<Display>
    <title a=10>dadadasd</title>
</Display>

//usage
<Display>
#macro title(a)
    <div>I'm the title#{a}</div>
    <span>></span>
    #yield
    <span><</span>
#end
#macro *
    #yield
#end
</Display>

//result
<div>I'm the title1</div>
<span>></span>
Title
<span><</span>
```

##AST Tree
###model file
The model file is just a `javascript` file now, but it's on the way to give it some features. 

Most of syntax tree is formated as standardized by [ESTree project](https://github.com/estree/estree).

