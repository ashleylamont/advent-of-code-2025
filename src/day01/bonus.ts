// Note: for some reason WebStorm is a bit weird about inferring types here, specifically tuple lengths, so use the TypeScript playground instead if you're testing this code.

type Length<T extends any[]> = T extends {length: infer L} ? L : 0;
type Increment<T extends any[]> = T extends {length: 99} ? [] : [...T, any];
type Tuple<L extends number, PartialT extends any[] = []> = PartialT extends {length: L} ? PartialT : Tuple<L, Increment<PartialT>>;
type Decrement<T extends any[]> = T extends {length: 0} ? Tuple<99> : T extends [any, ...infer Rest] ? Rest : [];
type InstructionType = `${'L'|'R'}${number}`;

type ParseInt<T> = T extends `${infer N extends number}` ? N : never;
type Assert<T, E> = T extends E ? T : never;

type ApplyInstruction<Instruction extends InstructionType, Values extends any[][] = [Tuple<50>], KeepMidvalues extends boolean = false> = Values extends [infer Current, ...infer History] ? (
  Instruction extends `L${infer Count}` ? (
    ParseInt<Count> extends 0 ? (KeepMidvalues extends true ? Values : [Current, ...Values]) : ApplyInstruction<`L${Length<Decrement<Tuple<ParseInt<Count>>>>}`, KeepMidvalues extends true ? [Decrement<Assert<Current, any[]>>, Assert<Current, any[]>, ...Assert<History, any[][]>] : [Decrement<Assert<Current, any[]>>, ...Assert<History, any[][]>], KeepMidvalues>
    ): (
    Instruction extends `R${infer Count}` ?
      ParseInt<Count> extends 0 ? (KeepMidvalues extends true ? Values : [Current, ...Values]) : ApplyInstruction<`R${Length<Decrement<Tuple<ParseInt<Count>>>>}`, KeepMidvalues extends true ? [Increment<Assert<Current, any[]>>, Assert<Current, any[]>, ...Assert<History, any[][]>] : [Increment<Assert<Current, any[]>>, ...Assert<History, any[][]>], KeepMidvalues>
      : never
    )
  ) : never;

type ToValues <History extends any[][]> = { [K in keyof History]: Length<History[K]> };
type FilterZeroes<Lengths extends number[] = []> = Lengths extends [] ? [] : Lengths extends [infer Value, ...infer Rest] ? (Value extends 0 ? [any, ...FilterZeroes<Assert<Rest, number[]>>] : FilterZeroes<Assert<Rest, number[]>>) : never;
type CountZeroes<Lengths extends number[] = []> = Length<FilterZeroes<Lengths>>;

type TestInput = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

type ToLines<Str extends string> = Str extends `${infer Start}
${infer Rest}` ? [Start, ...ToLines<Rest>] : Str extends '' ? [] : [Str];
type Reverse<T extends any[]> =
  T extends [infer Head, ...infer Rest]
    ? [...Reverse<Rest>, Head]
    : [];

type ApplyInstructions<Instructions extends InstructionType[], KeepMidvalues extends boolean = false> = Instructions extends [] ? [Tuple<50>] :
  Instructions extends [infer NextInstruction, ...infer OtherInstructions] ? ApplyInstruction<Assert<NextInstruction, InstructionType>, ApplyInstructions<Assert<OtherInstructions, InstructionType[]>, KeepMidvalues>, KeepMidvalues> : never;

type TestPartA = CountZeroes<ToValues<ApplyInstructions<Reverse<ToLines<TestInput>>>>>;
type TestPartB = CountZeroes<ToValues<ApplyInstructions<Reverse<ToLines<TestInput>>, true>>>;