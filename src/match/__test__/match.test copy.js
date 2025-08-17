import { expect, test } from "vitest";
import { Match, Pred } from "../match";
import { Lang, Typu } from "@/shared";
import { execMatch } from "../match";
import { Pattern } from "../pattern";

test('test base', () => {
   const match = Match(
      1, () => 1 * 2,
      Pattern.enum(1, 2, 4), () => 3,
      [2, 3, (data) => data < 1], () => 4,
      {
         name: (data) => data.startsWith('A'),
         age: (x) => x < 18
      }, () => 5
   )

   expect(match(1)).toBe(2)
})

test('test Match: base match', () => {
   const m = Match(2)
      .case(1, (x) => x + 1)
      .test(Typu.tyfNumber, (x) => x + 2)
      .pick((x, cb) => {
         if (x === 1) {
            return x
         }
      }, (x) => x + 1)
      .when(Pattern.test(x => x > 1))
      .value

   const m2 = Match(
      Typu.isNumber, (x) => x + 1,
      (x) => x.name, (name) => name + 'a'
   )

   expect(m).toBe(4)

})

test('test Match: enum match', () => {
   const match = Match(2)
      .case(1, 2, (x) => x + 1)
      .test(Typu.tyfNumber, Typu.isBoolean, (x) => x + 2)
      .pick((x, cb) => x === 1 ? cb(x) : null, (x) => x + 1)
      .pick((x, cb) => x?.son?.name && cb(x.son), (x) => x + 1)
      .when(
         Pattern.test(x => x > 1),
         Pattern.test(Typu.isNumber).test(x => x < 1),
         Pattern(
            Pattern.test(Typu.isNumber).test(x => x < 1),
            Pattern.test(Typu.isNumber).test(x => x < 1)
         ),
         (x) => x
      )
      .func

   expect(match(1)).toBe(4)
   expect(match(2)).toBe(4)
   expect(match(3)).toBe(4)
   expect(match(4)).toBe(4)
   expect(match(5)).toBe(4)
})

test('test Match: type match', () => {
   const m = Match(123)
      .typeof()
      .instanceof()
      .in()
      .own()
      .is()
      .equals()
      .like()
      .same()
      .value

   expect(m).toBe(126)
})

test('test Match: value match', () => {
   /* equals match */

   /* 枚举匹配 */


   /* number utils, range, 精度匹配*/
   let data = 1
   const func = Match(data)
      .when(1, (x) => x + 1)
      .when(2, (x) => x + 2)
      .end

   /* string utils, regex */

   const m = func(data)

   expect(m).toBe(2)
})

test('test iter Match', () => {
   let a = { name: 'sd', toString() { return this.name } }
   let b = {
      [a]: 123
   }

   console.log(b)
})

test('test object Match', () => {

})

