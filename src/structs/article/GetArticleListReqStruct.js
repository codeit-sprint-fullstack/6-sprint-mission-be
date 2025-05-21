// import {
//   coerce,
//   defaulted,
//   enums,
//   integer,
//   max,
//   min,
//   nonempty,
//   object,
//   optional,
//   string,
// } from "superstruct";

// //article list 요청의 쿼리 스트링 구조 디버깅
// const GetArticleListReqStruct = object({
//   cursor: defaulted(
//     coerce(min(integer(), 0), string(), (value) => Number.parseInt(value, 10)),
//     0
//   ),
//   take: defaulted(
//     coerce(max(min(integer(), 1), 10), string(), (value) =>
//       Number.parseInt(value, 10)
//     ),
//     10
//   ),
//   orderBy: optional(enums(["recent"])),
//   word: optional(nonempty(string())),
// });

// module.exports = { GetArticleListReqStruct };
