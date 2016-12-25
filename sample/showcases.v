#include < ./Card => c >
#include < ./Card => b >
<showcases>
#for i, j in h.l.slice(1, 2)
<c name = i is_a/>
#endfor
#define a 1234
#if a
#c#
#elif c
#else
#endif
</showcases>