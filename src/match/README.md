#

```js

const p1 = pattern.template`
name age gender
${pn.key('name')} ${pn.key('age').range(0,3).type('number')} ${pn.key('gender')}/
<array>
   
</array>

`

```