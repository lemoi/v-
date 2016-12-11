#include <A>
<sample n = #[1, 2]# >
    # !(i > 1) ? "Hi, come here" : "Hi, see you agin"#
    <div onClick = b_click>
    #for i in n
        <A date = '2016-12-10' id = i/>
    #endfor
</sample>