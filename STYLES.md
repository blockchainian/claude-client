# Google TypeScript/Javascript Style Guide

This guide is based on the internal Google TypeScript style guide, but it has been slightly adjusted to remove Google-internal sections.

You MUST FOLLOW all rules below.

## Rules enforced by lint (82)

| Rule | ESLint | Prettier |
|---|---|---|
| 2.1.1 Whitespace characters | `no-irregular-whitespace` (skipStrings: false) |  |
| 2.1.2 Special escape sequences | `no-octal-escape`, `no-nonoctal-decimal-escape` |  |
| 3.3.1 Import paths | `no-restricted-imports` (patterns) |  |
| 3.4.1 Export visibility | `import/no-unused-modules` (unusedExports) |  |
| 3.4.2 Mutable exports | `import/no-mutable-exports` |  |
| 3.4.3 Container classes | `@typescript-eslint/no-extraneous-class` |  |
| 3.5.1 Import type | `@typescript-eslint/consistent-type-imports` |  |
| 3.5.2 Export type | `@typescript-eslint/consistent-type-exports` |  |
| 3.5.3 Dynamic `import()` type | `@typescript-eslint/consistent-type-imports` (disallowTypeAnnotations) |  |
| 3.5.4 Use modules not namespaces | `@typescript-eslint/no-namespace` |  |
| 4.1.1 Use const and let | `no-var`, `prefer-const` |  |
| 4.1.2 One variable per declaration | `one-var` (never) |  |
| 4.2.1 Do not use the `Array` constructor | `@typescript-eslint/no-array-constructor` |  |
| 4.3.1 Do not use the `Object` constructor | `no-object-constructor` |  |
| 4.3.2 Iterating objects | `guard-for-in` |  |
| 4.3.3 Using spread syntax | `@typescript-eslint/no-misused-spread` |  |
| 4.4.1 Class declarations | `@stylistic/no-extra-semi` | `built-in` |
| 4.4.4.1 Avoid private static methods | `no-restricted-syntax` (private static methods) |  |
| 4.4.4.3 Avoid static `this` references | `no-restricted-syntax` (`this` in static methods) |  |
| 4.4.5 Constructors | `@stylistic/new-parens` | `built-in` |
| 4.4.6.1 No \#private fields | `no-restricted-syntax` (PrivateIdentifier) |  |
| 4.4.6.2 Use readonly | `@typescript-eslint/prefer-readonly` |  |
| 4.4.6.3 Parameter properties | `@typescript-eslint/parameter-properties` (prefer: parameter-property) |  |
| 4.4.7 Visibility | `@typescript-eslint/explicit-member-accessibility` (accessibility: no-public) |  |
| 4.4.8.1 Do not manipulate `prototype`s directly | `no-restricted-syntax` (assignments to `prototype`) |  |
| 4.5.2 Prefer function declarations for named functions | `func-style` (declaration) |  |
| 4.5.4 Do not use function expressions | `prefer-arrow-callback`, `func-style` (declaration) |  |
| 4.5.5 Arrow function bodies | `arrow-body-style`, `@typescript-eslint/no-confusing-void-expression` |  |
| 4.5.6 Rebinding `this` | `@typescript-eslint/no-invalid-this` |  |
| 4.5.7 Prefer passing arrow functions as callbacks | `unicorn/no-array-callback-reference` |  |
| 4.5.8 Arrow functions as properties | `no-restricted-syntax` (arrow function class properties) |  |
| 4.5.11 Prefer rest and spread when appropriate | `prefer-rest-params`, `prefer-spread`, `no-shadow-restricted-names` |  |
| 4.5.12 Formatting functions | `@stylistic/padded-blocks` (never) | `built-in` |
| 4.5.13 Function Length | `max-lines-per-function` |  |
| 4.6 this | `@typescript-eslint/no-invalid-this` |  |
| 4.7.1.1 Use single quotes | `@stylistic/quotes` (single, avoidEscape) | `singleQuote: true` |
| 4.7.1.2 No line continuations | `no-multi-str` |  |
| 4.7.1.3 Template literals | `prefer-template` |  |
| 4.7.2 Number literals | `no-octal`, `unicorn/number-literal-case` | `built-in` |
| 4.7.3.1 Coercing to numbers | `no-implicit-coercion` (number), `no-restricted-globals` (parseFloat, parseInt) |  |
| 4.7.3.2 Implicit coercion | `no-extra-boolean-cast` |  |
| 4.8.1.1 Assignment in control statements | `no-cond-assign` |  |
| 4.8.1.2 Iterating containers | `@typescript-eslint/prefer-for-of`, `guard-for-in` |  |
| 4.8.2 Grouping parentheses | `@stylistic/no-extra-parens` | `built-in` |
| 4.8.3.1 Instantiate errors using `new` | `unicorn/throw-new-error` |  |
| 4.8.3.2 Only throw errors | `@typescript-eslint/only-throw-error` |  |
| 4.8.3.4 Empty catch blocks | `no-empty` |  |
| 4.8.4 Switch statements | `default-case`, `default-case-last`, `no-fallthrough` |  |
| 4.8.5 Equality checks | `eqeqeq` (always, null: ignore) |  |
| 4.8.6.1 Type assertion syntax | `@typescript-eslint/consistent-type-assertions` (assertionStyle: as) |  |
| 4.8.6.2 Double assertions | `no-restricted-syntax` (double assertions not through `unknown`) |  |
| 4.8.6.3 Type assertions and object literals | `@typescript-eslint/consistent-type-assertions` (objectLiteralTypeAssertions: never) |  |
| 4.10.1 Wrapper objects for primitive types | `no-new-wrappers` |  |
| 4.10.2 Automatic Semicolon Insertion | disabled | disabled |
| 4.10.3 Const enums | `no-restricted-syntax` (`const enum`) |  |
| 4.10.4 Debugger statements | `no-debugger` |  |
| 4.10.5 `with` | `no-with` |  |
| 4.10.6 Dynamic code evaluation | `no-eval`, `no-implied-eval`, `no-new-func` |  |
| 4.10.7 Non-standard features | `@typescript-eslint/no-deprecated` |  |
| 4.10.8 Modifying built-in objects | `no-extend-native` |  |
| 5.1.3 Camel case | `@typescript-eslint/naming-convention` (strictCamelCase) |  |
| 5.1.4 Dollar sign | `@typescript-eslint/naming-convention` (custom regex without `$`) |  |
| 5.2.1 Type parameters | `@typescript-eslint/naming-convention` (typeParameter) |  |
| 5.2.3 Underscore (`_`) prefix/suffix | `@typescript-eslint/naming-convention` (leadingUnderscore), `@typescript-eslint/no-unused-vars` |  |
| 5.2.4 Imports | `@typescript-eslint/naming-convention` (import) |  |
| 5.2.5 Constants | `@typescript-eslint/naming-convention` (UPPER_CASE) |  |
| 6.2.1 Nullable/undefined type aliases | `no-restricted-syntax` (`null`/`undefined` in type alias unions) |  |
| 6.4 Prefer interfaces over type literal aliases | `@typescript-eslint/consistent-type-definitions` (interface) |  |
| 6.5 `Array<T>` Type | `@typescript-eslint/array-type` (array-simple) |  |
| 6.8.1 Providing a more specific type | `@typescript-eslint/no-explicit-any` |  |
| 6.8.2 Using `unknown` over `any` | `@typescript-eslint/no-explicit-any` |  |
| 6.8.3 Suppressing `any` lint warnings | `@eslint-community/eslint-comments/require-description` |  |
| 6.9 `{}` Type | `@typescript-eslint/no-empty-object-type` |  |
| 6.11 Wrapper types | `@typescript-eslint/no-wrapper-object-types` |  |
| 6.12 Return type only generics | `@typescript-eslint/no-unnecessary-type-parameters` |  |
| 7.1.1 @ts-ignore | `@typescript-eslint/ban-ts-comment` |  |
| 8.0.2 Multi-line comments | `@stylistic/multiline-comment-style` (separate-lines) |  |
| 8.1 JSDoc general form | `jsdoc/multiline-blocks`, `jsdoc/require-asterisk-prefix` |  |
| 8.3 JSDoc tags | `jsdoc/check-tag-names` |  |
| 8.4 Line wrapping | `jsdoc/check-line-alignment` |  |
| 8.5 Document all top-level exports of modules | `jsdoc/require-jsdoc` (publicOnly) |  |
| 8.9 JSDoc type annotations | `jsdoc/no-types` |  |

## Rules not enforced by lint (45)

YO MUST FOLLOW all these rules while writing code; DO NOT CHEAT, even though they are not enforced by lint.

### 2 Source file basics

#### 2.1 File encoding: UTF-8

##### 2.1.3 Non-ASCII characters

For the remaining non-ASCII characters, use the actual Unicode character (e.g. `∞`). For non-printable characters, the equivalent hex or Unicode escapes (e.g. `\u221e`) can be used along with an explanatory comment.

**Good:**

``` ts
// Perfectly clear, even without a comment.
const units = 'μs';

// Use escapes for non-printable characters.
const output = '\ufeff' + content;  // byte order mark
```

**Bad:**

``` ts
// Hard to read and prone to mistakes, even with the comment.
const units = '\u03bcs'; // Greek letter mu, 's'

// The reader has no idea what this is.
const output = '\ufeff' + content;
```

### 3 Source file structure

#### 3.1 Copyright information

If license or copyright information is necessary in a file, add it in a JSDoc at the top of the file.

#### 3.2 `@fileoverview` JSDoc

A file may have a top-level `@fileoverview` JSDoc. If present, it may provide a description of the file’s content, its uses, or information about its dependencies. Wrapped lines are not indented.

Example:

**Good:**

``` ts
/**
 * @fileoverview Description of file. Lorem ipsum dolor sit amet, consectetur
 * adipiscing elit, sed do eiusmod tempor incididunt.
 */
```

#### 3.3 Imports

##### 3.3.2 Namespace versus named imports

###### 3.3.2.1 Special case: Apps JSPB protos

Apps JSPB protos must use named imports, even when it leads to long import lines.

This rule exists to aid in build performance and dead code elimination since often `.proto` files contain many `message`s that are not all needed together. By leveraging destructured imports the build system can create finer grained dependencies on Apps JSPB messages while preserving the ergonomics of path based imports.

**Good:**

``` ts
// Good: import the exact set of symbols you need from the proto file.
import {Foo, Bar} from './foo.proto';

function copyFooBar(foo: Foo, bar: Bar) {...}
```

##### 3.3.3 Renaming imports

Code *should* fix name collisions by using a namespace import or renaming the exports themselves. Code *may* rename imports (`import {SomeThing as SomeOtherThing}`) if needed.

Three examples where renaming can be helpful:

1.  If it’s necessary to avoid collisions with other imported symbols.
2.  If the imported symbol name is generated.
3.  If importing symbols whose names are unclear by themselves, renaming can improve code clarity. For example, when using RxJS the `from` function might be more readable when renamed to `observableFrom`.

### 4 Language features

#### 4.2 Array literals

##### 4.2.2 Do not define properties on arrays

Do not define or use non-numeric properties on an array (other than `length`). Use a `Map` (or `Object`) instead.

##### 4.2.3 Array destructuring

Array literals may be used on the left-hand side of an assignment to perform destructuring (such as when unpacking multiple values from a single array or iterable). A final “rest” element may be included (with no space between the `...` and the variable name). Elements should be omitted if they are unused.

**Good:**

``` ts
const [a, b, c, ...rest] = generateResults();
let [, b,, d] = someArray;
```

Destructuring may also be used for function parameters. Always specify `[]` as the default value if a destructured array parameter is optional, and provide default values on the left hand side:

**Good:**

``` ts
function destructured([a = 4, b = 2] = []) { … }
```

Disallowed:

**Bad:**

``` ts
function badDestructuring([a, b] = [4, 2]) { … }
```

Tip: For (un)packing multiple values into a function’s parameter or return, prefer object destructuring to array destructuring when possible, as it allows naming the individual elements and specifying a different type for each.

#### 4.3 Object literals

##### 4.3.4 Computed property names

Computed property names (e.g. `{['key' + foo()]: 42}`) are allowed, and are considered dict-style (quoted) keys (i.e., must not be mixed with non-quoted keys) unless the computed property is a [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) (e.g. `[Symbol.iterator]`).

##### 4.3.5 Object destructuring

Object destructuring patterns may be used on the left-hand side of an assignment to perform destructuring and unpack multiple values from a single object.

Destructured objects may also be used as function parameters, but should be kept as simple as possible: a single level of unquoted shorthand properties. Deeper levels of nesting and computed properties may not be used in parameter destructuring. Specify any default values in the left-hand-side of the destructured parameter (`{str = 'some default'} = {}`, rather than `{str} = {str: 'some default'}`), and if a destructured object is itself optional, it must default to `{}`.

Example:

**Good:**

``` ts
interface Options {
  /** The number of times to do something. */
  num?: number;

  /** A string to do stuff to. */
  str?: string;
}

function destructured({num, str = 'default'}: Options = {}) {}
```

Disallowed:

**Bad:**

``` ts
function nestedTooDeeply({x: {num, str}}: {x: Options}) {}
function nontrivialDefault({num, str}: Options = {num: 42, str: 'default'}) {}
```

#### 4.4 Classes

##### 4.4.2 Don’t create member variables only used in constructors

If a variable is only used in the constructor, then it can be migrated to be a variable scoped to the constructor body, which will make your class more stateless and easier to reason about for future devs.

Some classes have methods that are only called in the constructor and that update bits of class state that are only used during class construction. For the same reasons as above, these bits of class state should also be migrated to be constructor-local variables.

**Bad:**

``` ts
class MyClass {
  // BAD: onlyUsedInCtor is only used in the constructor and nowhere else after
  // class initialization.
  private readonly onlyUsedInCtor = ...;
  private readonly otherDataStructure = ...;
  constructor(
    // BAD: Services only used in the constructor but kept after ctor execution.
    private readonly serviceA: ServiceA,
    private readonly serviceB: ServiceB,
    private readonly serviceC: ServiceC,
  ) {
    this.computeThing(
      this.serviceA.getA(), this.serviceB.getB(), this.serviceC.getC(),
    );
    this.otherDataStructure = computeOther(this.onlyUsedInCtor);
  }

  private computeThing(a: A, b: B, c: C) {
    this.onlyUsedInCtor = someFunctionOf(a, b, c);
  }
}
```

**Good:**

``` ts
class MyClass {
  private readonly otherDataStructure = ...;
  constructor(
    // GOOD: Services only used in constructor and dropped after ctor finishes.
    serviceA: ServiceA,
    serviceB: ServiceB,
    serviceC: ServiceC,
  ) {
    // GOOD: onlyUsedInCtor is a constructor-local variable.
    const onlyUsedInCtor =
      someFunctionOf(serviceA.getA(), serviceB.getB(), serviceC.getC());
    this.otherDataStructure = computeOther(onlyUsedInCtor);
  }
}
```

##### 4.4.3 Class method declarations

###### 4.4.3.1 Overriding toString

The `toString` method may be overridden, but must always succeed and never have visible side effects.

Tip: Beware, in particular, of calling other methods from toString, since exceptional conditions could lead to infinite loops.

##### 4.4.4 Static methods

###### 4.4.4.2 Do not rely on dynamic dispatch

Code *should not* rely on dynamic dispatch of static methods. Static methods *should* only be called on the base class itself (which defines it directly). Static methods *should not* be called on variables containing a dynamic instance that may be either the constructor or a subclass constructor (and *must* be defined with `@nocollapse` if this is done), and *must not* be called directly on a subclass that doesn’t define the method itself.

Disallowed:

**Bad:**

``` ts
// Context for the examples below (this class is okay by itself)
class Base {
  /** @nocollapse */ static foo() {}
}
class Sub extends Base {}

// Discouraged: don't call static methods dynamically
function callFoo(cls: typeof Base) {
  cls.foo();
}

// Disallowed: don't call static methods on subclasses that don't define it themselves
Sub.foo();

// Disallowed: don't access this in static methods.
class MyClass {
  static foo() {
    return this.staticField;
  }
}
MyClass.staticField = 1;
```

##### 4.4.6 Class members

###### 4.4.6.4 Field initializers

If initializing a class member does not rely on a constructor parameter or a parameter property, initialize it where it’s declared. This sometimes lets you drop the constructor entirely.

**Bad:**

``` ts
class Foo {
  private readonly userList: string[];

  constructor() {
    this.userList = [];
  }
}
```

**Good:**

``` ts
class Foo {
  private readonly userList: string[] = [];
}
```

It is possible to reference parameter properties from field initializers due to the way TypeScript transpiles this pattern to JavaScript. This transpilation is changing to match JavaScript language semantics, and referencing a parameter property from a field initializer will become a TypeScript compiler error, so this pattern should be avoided.

**Bad:**

``` ts
class Foo {
  // BAD: references a property (`this.state`) that will be
  // initialized after this field.
  private readonly userList = initializeUserList(this.state);

  constructor(private readonly state: InitialState) {}
}
```

**Good:**

``` ts
class Foo {
  // GOOD: this must be initialized in the constructor
  private readonly userList: string[];

  // This might allow converting the parameter property into a normal
  // constructor parameter.
  constructor(state: InitialState) {
    this.userList = initializeUserList(state);
  }
}
```

Tip: Properties should never be added to or removed from an instance after the constructor is finished, since it significantly hinders VMs’ ability to optimize classes’ “shape”. Optional fields that may be filled in later should be explicitly initialized to `undefined` to prevent later shape changes.

###### 4.4.6.5 Properties used outside of class lexical scope

Properties used from outside the lexical scope of their containing class, *must not* use `private` visibility, as they are used outside of the lexical scope of their containing class.

Exception: Angular component properties used only from a template are allowed to use `private` visibility.

Use either `protected` or `public` as appropriate to the property in question.

TypeScript code *must not* use `obj['foo']` to bypass the visibility of a property.

Why?

When a property is `private`, you are declaring to both automated systems and humans that the property accesses are scoped to the methods of the declaring class, and they will rely on that. For example, a check for unused code will flag a private property that appears to be unused, even if some other file manages to bypass the visibility restriction.

Though it might appear that `obj['foo']` can bypass visibility in the TypeScript compiler, this pattern can be broken by rearranging the build rules, and also violates [optimization compatibility](#optimization-compatibility).

###### 4.4.6.6 Getters and setters

Getters and setters, also known as accessors, for class members *may* be used. The getter method *must* be a [pure function](https://en.wikipedia.org/wiki/Pure_function) (i.e., result is consistent and has no side effects: getters *must not* change observable state). They are also useful as a means of restricting the visibility of internal or verbose implementation details (shown below).

**Good:**

``` ts
class Foo {
  constructor(private readonly someService: SomeService) {}

  get someMember(): string {
    return this.someService.someVariable;
  }

  set someMember(newValue: string) {
    this.someService.someVariable = newValue;
  }
}
```

**Bad:**

``` ts
class Foo {
  nextId = 0;
  get next() {
    return this.nextId++; // Bad: getter changes observable state
  }
}
```

If an accessor is used to hide a class property, the hidden property *may* be prefixed or suffixed with any whole word, like `internal` or `wrapped`. When using these private properties, access the value through the accessor whenever possible. At least one accessor for a property *must* be non-trivial: do not define “pass-through” accessors only for the purpose of hiding a property. Instead, make the property public (or consider making it `readonly` rather than just defining a getter with no setter).

**Good:**

``` ts
class Foo {
  private wrappedBar = '';
  get bar() {
    return this.wrappedBar || 'bar';
  }

  set bar(wrapped: string) {
    this.wrappedBar = wrapped.trim();
  }
}
```

**Bad:**

``` ts
class Bar {
  private barInternal = '';
  // Neither of these accessors have logic, so just make bar public.
  get bar() {
    return this.barInternal;
  }

  set bar(value: string) {
    this.barInternal = value;
  }
}
```

Getters and setters *must not* be defined using `Object.defineProperty`, since this interferes with property renaming.

###### 4.4.6.7 Computed properties

Computed properties may only be used in classes when the property is a symbol. Dict-style properties (that is, quoted or computed non-symbol keys) are not allowed (see [rationale for not mixing key types](#features-objects-mixing-keys)). A `[Symbol.iterator]` method should be defined for any classes that are logically iterable. Beyond this, `Symbol` should be used sparingly.

Tip: be careful of using any other built-in symbols (e.g. `Symbol.isConcatSpreadable`) as they are not polyfilled by the compiler and will therefore not work in older browsers.

#### 4.5 Functions

##### 4.5.1 Terminology

There are many different types of functions, with subtle distinctions between them. This guide uses the following terminology, which aligns with [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions):

- “function declaration”: a declaration (i.e. not an expression) using the `function` keyword
- “function expression”: an expression, typically used in an assignment or passed as a parameter, using the `function` keyword
- “arrow function”: an expression using the `=>` syntax
- “block body”: right hand side of an arrow function with braces
- “concise body”: right hand side of an arrow function without braces

Methods and classes/constructors are not covered in this section.

##### 4.5.3 Nested functions

Functions nested within other methods or functions *may* use function declarations or arrow functions, as appropriate. In method bodies in particular, arrow functions are preferred because they have access to the outer `this`.

##### 4.5.9 Event handlers

Event handlers *may* use arrow functions when there is no need to uninstall the handler (for example, if the event is emitted by the class itself). If the handler requires uninstallation, arrow function properties are the right approach, because they automatically capture `this` and provide a stable reference to uninstall.

**Good:**

``` ts
// Event handlers may be anonymous functions or arrow function properties.
class Component {
  onAttached() {
    // The event is emitted by this class, no need to uninstall.
    this.addEventListener('click', () => {
      this.listener();
    });
    // this.listener is a stable reference, we can uninstall it later.
    window.addEventListener('onbeforeunload', this.listener);
  }
  onDetached() {
    // The event is emitted by window. If we don't uninstall, this.listener will
    // keep a reference to `this` because it's bound, causing a memory leak.
    window.removeEventListener('onbeforeunload', this.listener);
  }
  // An arrow function stored in a property is bound to `this` automatically.
  private listener = () => {
    confirm('Do you want to exit the page?');
  }
}
```

Do not use `bind` in the expression that installs an event handler, because it creates a temporary reference that can’t be uninstalled.

**Bad:**

``` ts
// Binding listeners creates a temporary reference that prevents uninstalling.
class Component {
  onAttached() {
    // This creates a temporary reference that we won't be able to uninstall
    window.addEventListener('onbeforeunload', this.listener.bind(this));
  }
  onDetached() {
    // This bind creates a different reference, so this line does nothing.
    window.removeEventListener('onbeforeunload', this.listener.bind(this));
  }
  private listener() {
    confirm('Do you want to exit the page?');
  }
}
```

##### 4.5.10 Parameter initializers

Optional function parameters *may* be given a default initializer to use when the argument is omitted. Initializers *must not* have any observable side effects. Initializers *should* be kept as simple as possible.

**Good:**

``` ts
function process(name: string, extraContext: string[] = []) {}
function activate(index = 0) {}
```

**Bad:**

``` ts
// BAD: side effect of incrementing the counter
let globalCounter = 0;
function newId(index = globalCounter++) {}

// BAD: exposes shared mutable state, which can introduce unintended coupling
// between function calls
class Foo {
  private readonly defaultPaths: string[];
  frobnicate(paths = defaultPaths) {}
}
```

Use default parameters sparingly. Prefer [destructuring](#features-objects-destructuring) to create readable APIs when there are more than a small handful of optional parameters that do not have a natural order.

#### 4.8 Control structures

##### 4.8.3 Exception handling

###### 4.8.3.3 Catching and rethrowing

When catching errors, code *should* assume that all thrown errors are instances of `Error`.

**Good:**

``` ts
function assertIsError(e: unknown): asserts e is Error {
  if (!(e instanceof Error)) throw new Error("e is not an Error");
}

try {
  doSomething();
} catch (e: unknown) {
  // All thrown errors must be Error subtypes. Do not handle
  // other possible values unless you know they are thrown.
  assertIsError(e);
  displayError(e.message);
  // or rethrow:
  throw e;
}
```

Exception handlers *must not* defensively handle non-`Error` types unless the called API is conclusively known to throw non-`Error`s in violation of the above rule. In that case, a comment should be included to specifically identify where the non-`Error`s originate.

**Good:**

``` ts
try {
  badApiThrowingStrings();
} catch (e: unknown) {
  // Note: bad API throws strings instead of errors.
  if (typeof e === 'string') { ... }
}
```

Why?

Avoid [overly defensive programming](https://en.wikipedia.org/wiki/Defensive_programming#Offensive_programming). Repeating the same defenses against a problem that will not exist in most code leads to boiler-plate code that is not useful.

###### 4.8.3.5 ErrorOptions cause must be an Error object

When passing an argument for the ErrorOptions parameter, the `cause` property must be initialized with a subtype of error. This effectively creates a chain of error objects with useful stack traces.

**Good:**

``` ts
try {
  ...
} catch (e: unknown) {
  if (e instanceof Error) {
    throw new Error('Something went wrong', {cause: e});
  }
}
```

**Bad:**

``` ts
const status = doSomething();
if (status !== success) {
  throw new Error('doSomething failed', {cause: status});
}
```

If the `cause` initializer refers to the catch clause variable of type unknown, it’s ok to omit a type check, since our codebase assumes you cannot throw anything other than an `Error` object.

**Good:**

``` ts
try {
  ...
} catch (e: unknown) {
  // No need to check the type of e.
  throw new Error('Something went wrong', {cause: e});
}
```

In TypeScript, type `Error` happens to be assignable to `ErrorOptions`. Thus it is possible to pass an error object accidentally as the ErrorOptions parameter, which is very likely a bug in the code.

**Bad:**

``` ts
try {
  ...
} catch (e: unknown) {
  if (e instanceof Error) {
    throw new Error('Something went wrong', e);
  }
}
```

##### 4.8.7 Keep try blocks focused

Limit the amount of code inside a try block, if this can be done without hurting readability.

**Bad:**

``` ts
try {
  const result = methodThatMayThrow();
  use(result);
} catch (error: unknown) {
  // ...
}
```

**Good:**

``` ts
let result;
try {
  result = methodThatMayThrow();
} catch (error: unknown) {
  // ...
}
use(result);
```

Moving the non-throwable lines out of the try/catch block helps the reader learn which method throws exceptions. Some inline calls that do not throw exceptions could stay inside because they might not be worth the extra complication of a temporary variable.

**Exception:** There may be performance issues if try blocks are inside a loop. Widening try blocks to cover a whole loop is ok.

#### 4.9 Decorators

Decorators are syntax with an `@` prefix, like `@MyDecorator`.

Do not define new decorators. Only use the decorators defined by frameworks:

- Angular (e.g. `@Component`, `@NgModule`, etc.)
- Polymer (e.g. `@property`)

Why?

We generally want to avoid decorators, because they were an experimental feature that have since diverged from the TC39 proposal and have known bugs that won’t be fixed.

When using decorators, the decorator *must* immediately precede the symbol it decorates, with no empty lines between:

``` ts
/** JSDoc comments go before decorators */
@Component({...})  // Note: no empty line after the decorator.
class MyComp {
  @Input() myField: string;  // Decorators on fields may be on the same line...

  @Input()
  myOtherField: string;  // ... or wrap.
}
```

### 5 Naming

#### 5.1 Identifiers

##### 5.1.1 Naming style

TypeScript expresses information in types, so names *should not* be decorated with information that is included in the type. (See also [Testing Blog](https://testing.googleblog.com/2017/10/code-health-identifiernamingpostforworl.html) for more about what not to include.)

Some concrete examples of this rule:

- Do not use trailing or leading underscores for private properties or methods.
- Do not use the `opt_` prefix for optional parameters.
  - For accessors, see [accessor rules](#classes-getters-and-setters) below.
- Do not mark interfaces specially (~~`IMyInterface`~~ or ~~`MyFooInterface`~~) unless it’s idiomatic in its environment. When introducing an interface for a class, give it a name that expresses why the interface exists in the first place (e.g. `class TodoItem` and `interface TodoItemStorage` if the interface expresses the format used for storage/serialization in JSON).
- Suffixing `Observable`s with `$` is a common external convention and can help resolve confusion regarding observable values vs concrete values. Judgement on whether this is a useful convention is left up to individual teams, but *should* be consistent within projects.

##### 5.1.2 Descriptive names

Names *must* be descriptive and clear to a new reader. Do not use abbreviations that are ambiguous or unfamiliar to readers outside your project, and do not abbreviate by deleting letters within a word.

- **Exception:** Variables that are in scope for 10 lines or fewer, including arguments that are *not* part of an exported API, *may* use short (e.g. single letter) variable names.

**Good:**

``` ts
// Good identifiers:
errorCount          // No abbreviation.
dnsConnectionIndex  // Most people know what "DNS" stands for.
referrerUrl         // Ditto for "URL".
customerId          // "Id" is both ubiquitous and unlikely to be misunderstood.
```

**Bad:**

``` ts
// Disallowed identifiers:
n                   // Meaningless.
nErr                // Ambiguous abbreviation.
nCompConns          // Ambiguous abbreviation.
wgcConnections      // Only your group knows what this stands for.
pcReader            // Lots of things can be abbreviated "pc".
cstmrId             // Deletes internal letters.
kSecondsPerDay      // Do not use Hungarian notation.
customerID          // Incorrect camelcase of "ID".
```

#### 5.2 Rules by identifier type

##### 5.2.2 Test names

Test method names inxUnit-style test frameworks *may* be structured with `_` separators, e.g. `testX_whenY_doesZ()`.

##### 5.2.6 Aliases

When creating a local-scope alias of an existing symbol, use the format of the existing identifier. The local alias *must* match the existing naming and format of the source. For variables use `const` for your local aliases, and for class fields use the `readonly` attribute.

> Note: If you’re creating an alias just to expose it to a template in your framework of choice, remember to also apply the proper [access modifiers](#properties-used-outside-of-class-lexical-scope).

**Good:**

``` ts
const {BrewStateEnum} = SomeType;
const CAPACITY = 5;

class Teapot {
  readonly BrewStateEnum = BrewStateEnum;
  readonly CAPACITY = CAPACITY;
}
```

##### 5.2.7 Overridden and implemented members

Properties and methods that override, implement, or narrow a base class or interface member, or appear in a contextually typed object literal, must match the existing declaration’s name and casing to compile. Casing rules therefore apply only at a member’s original declaration, which *must* follow them unless an external contract requires otherwise. Consider fixing the original declaration’s name if possible.

**Bad:**

``` ts
interface ServerResponse {
  // Disallowed: property names must use lowerCamelCase (or CONSTANT_CASE).
  // The correct name here would be `errorCode`.
  error_code: number;
}
```

**Good:**

``` ts
// When the existing name is required to match an external contract, suppress
// the lint warning on the original declaration and include a rationale:
declare interface ServerResponse {
  // Required to match external contract.
  // tslint:disable-next-line:enforce-name-casing
  error_code: number;
}

// Extending, implementing, or contextually matching the existing declaration
// is allowed to follow its naming convention without another suppression:
interface ErrorResponse extends ServerResponse {
  error_code: 400 | 500;
}
```

### 6 Type system

#### 6.1 Type inference

##### 6.1.1 Return types

Whether to include return type annotations for functions and methods is up to the code author. Reviewers *may* ask for annotations to clarify complex return types that are hard to understand. Projects *may* have a local policy to always require return types, but this is not a general TypeScript style requirement.

There are two benefits to explicitly typing out the implicit return values of functions and methods:

- More precise documentation to benefit readers of the code.
- Surface potential type errors faster in the future if there are code changes that change the return type of the function.

#### 6.3 Use structural types

TypeScript’s type system is structural, not nominal. That is, a value matches a type if it has at least all the properties the type requires and the properties’ types match, recursively.

When providing a structural-based implementation, explicitly include the type at the declaration of the symbol (this allows more precise type checking and error reporting).

**Good:**

``` ts
const foo: Foo = {
  a: 123,
  b: 'abc',
}
```

**Bad:**

``` ts
const badFoo = {
  a: 123,
  b: 'abc',
}
```

Use interfaces to define structural types, not classes

**Good:**

``` ts
interface Foo {
  a: number;
  b: string;
}

const foo: Foo = {
  a: 123,
  b: 'abc',
}
```

**Bad:**

``` ts
class Foo {
  readonly a: number;
  readonly b: number;
}

const foo: Foo = {
  a: 123,
  b: 'abc',
}
```

Why?

The “badFoo” object above relies on type inference. Additional fields could be added to “badFoo” and the type is inferred based on the object itself.

When passing a “badFoo” to a function that takes a “Foo”, the error will be at the function call site, rather than at the object declaration site. This is also useful when changing the surface of an interface across broad codebases.

``` ts
interface Animal {
  sound: string;
  name: string;
}

function makeSound(animal: Animal) {}

/**
 * 'cat' has an inferred type of '{sound: string}'
 */
const cat = {
  sound: 'meow',
};

/**
 * 'cat' does not meet the type contract required for the function, so the
 * TypeScript compiler errors here, which may be very far from where 'cat' is
 * defined.
 */
makeSound(cat);

/**
 * Horse has a structural type and the type error shows here rather than the
 * function call.  'horse' does not meet the type contract of 'Animal'.
 */
const horse: Animal = {
  sound: 'niegh',
};

const dog: Animal = {
  sound: 'bark',
  name: 'MrPickles',
};

makeSound(dog);
makeSound(horse);
```

#### 6.6 Indexable types / index signatures (`{[key: string]: T}`)

In JavaScript, it’s common to use an object as an associative array (aka “map”, “hash”, or “dict”). Such objects can be typed using an [index signature](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures) (`[k: string]: T`) in TypeScript:

``` ts
const fileSizes: {[fileName: string]: number} = {};
fileSizes['readme.txt'] = 541;
```

In TypeScript, provide a meaningful label for the key. (The label only exists for documentation; it’s unused otherwise.)

**Bad:**

``` ts
const users: {[key: string]: number} = ...;
```

**Good:**

``` ts
const users: {[userName: string]: number} = ...;
```

> Rather than using one of these, consider using the ES6 `Map` and `Set` types instead. JavaScript objects have [surprising undesirable behaviors](http://2ality.com/2012/01/objects-as-maps.html) and the ES6 types more explicitly convey your intent. Also, `Map`s can be keyed by—and `Set`s can contain—types other than `string`.

TypeScript’s built-in `Record<Keys, ValueType>` type allows constructing types with a defined set of keys. This is distinct from associative arrays in that the keys are statically known. See advice on that [below](#mapped-conditional-types).

#### 6.7 Mapped and conditional types

TypeScript’s [mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html) and [conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) allow specifying new types based on other types. TypeScript’s standard library includes several type operators based on these (`Record`, `Partial`, `Readonly` etc).

These type system features allow succinctly specifying types and constructing powerful yet type safe abstractions. They come with a number of drawbacks though:

- Compared to explicitly specifying properties and type relations (e.g. using interfaces and extension, see below for an example), type operators require the reader to mentally evaluate the type expression. This can make programs substantially harder to read, in particular combined with type inference and expressions crossing file boundaries.
- Mapped & conditional types’ evaluation model, in particular when combined with type inference, is underspecified, not always well understood, and often subject to change in TypeScript compiler versions. Code can “accidentally” compile or seem to give the right results. This increases future support cost of code using type operators.
- Mapped & conditional types are most powerful when deriving types from complex and/or inferred types. On the flip side, this is also when they are most prone to create hard to understand and maintain programs.
- Some language tooling does not work well with these type system features. E.g. your IDE’s find references (and thus rename property refactoring) will not find properties in a `Pick<T, Keys>` type, and Code Search won’t hyperlink them. \*

The style recommendation is:

- Always use the simplest type construct that can possibly express your code.
- A little bit of repetition or verbosity is often much cheaper than the long term cost of complex type expressions.
- Mapped & conditional types may be used, subject to these considerations.

For example, TypeScript’s built-in `Pick<T, Keys>` type allows creating a new type by subsetting another type `T`, but simple interface extension can often be easier to understand.

``` ts
interface User {
  shoeSize: number;
  favoriteIcecream: string;
  favoriteChocolate: string;
}

// FoodPreferences has favoriteIcecream and favoriteChocolate, but not shoeSize.
type FoodPreferences = Pick<User, 'favoriteIcecream'|'favoriteChocolate'>;
```

This is equivalent to spelling out the properties on `FoodPreferences`:

``` ts
interface FoodPreferences {
  favoriteIcecream: string;
  favoriteChocolate: string;
}
```

To reduce duplication, `User` could extend `FoodPreferences`, or (possibly better) nest a field for food preferences:

**Good:**

``` ts
interface FoodPreferences { /* as above */ }
interface User extends FoodPreferences {
  shoeSize: number;
  // also includes the preferences.
}
```

Using interfaces here makes the grouping of properties explicit, improves IDE support, allows better optimization, and arguably makes the code easier to understand.

#### 6.10 Tuple types

If you are tempted to create a Pair type, instead use a tuple type:

**Bad:**

``` ts
interface Pair {
  first: string;
  second: string;
}
function splitInHalf(input: string): Pair {
  ...
  return {first: x, second: y};
}
```

**Good:**

``` ts
function splitInHalf(input: string): [string, string] {
  ...
  return [x, y];
}

// Use it like:
const [leftHalf, rightHalf] = splitInHalf('my string');
```

However, often it’s clearer to provide meaningful names for the properties.

If declaring an `interface` is too heavyweight, you can use an inline object literal type:

**Good:**

``` ts
function splitHostPort(address: string): {host: string, port: number} {
  ...
}

// Use it like:
const address = splitHostPort(userAddress);
use(address.port);

// You can also get tuple-like behavior using destructuring:
const {host, port} = splitHostPort(userAddress);
```

### 7 Toolchain requirements

#### 7.2 Conformance

Google TypeScript includes several *conformance frameworks*, [tsetse](https://tsetse.info) and [tsec](https://github.com/google/tsec).

These rules are commonly used to enforce critical restrictions (such as defining globals, which could break the codebase) and security patterns (such as using `eval` or assigning to `innerHTML`), or more loosely to improve code quality.

Google-style TypeScript must abide by any applicable global or framework-local conformance rules.

### 8 Comments and documentation

##### 8.0.1 JSDoc versus comments

There are two types of comments, JSDoc (`/** ... */`) and non-JSDoc ordinary comments (`// ...` or `/* ... */`).

- Use `/** JSDoc */` comments for documentation, i.e. comments a user of the code should read.
- Use `// line comments` for implementation comments, i.e. comments that only concern the implementation of the code itself.

JSDoc comments are understood by tools (such as editors and documentation generators), while ordinary comments are only for other humans.

#### 8.2 Markdown

JSDoc is written in Markdown, though it *may* include HTML when necessary.

This means that tooling parsing JSDoc will ignore plain text formatting, so if you did this:

**Bad:**

``` ts
/**
 * Computes weight based on three factors:
 *   items sent
 *   items received
 *   last timestamp
 */
```

it will be rendered like this:

``` plaintext
Computes weight based on three factors: items sent items received last timestamp
```

Instead, write a Markdown list:

**Good:**

``` ts
/**
 * Computes weight based on three factors:
 *
 * - items sent
 * - items received
 * - last timestamp
 */
```

#### 8.6 Class comments

JSDoc comments for classes should provide the reader with enough information to know how and when to use the class, as well as any additional considerations necessary to correctly use the class. Textual descriptions may be omitted on the constructor.

#### 8.7 Method and function comments

Method, parameter, and return descriptions may be omitted if they are obvious from the rest of the method’s JSDoc or from the method name and type signature.

Method descriptions begin with a verb phrase that describes what the method does. This phrase is not an imperative sentence, but instead is written in the third person, as if there is an implied “This method …” before it.

#### 8.8 Parameter property comments

A [parameter property](https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties) is a constructor parameter that is prefixed by one of the modifiers `private`, `protected`, `public`, or `readonly`. A parameter property declares both a parameter and an instance property, and implicitly assigns into it. For example, `constructor(private readonly foo: Foo)`, declares that the constructor takes a parameter `foo`, but also declares a private readonly property `foo`, and assigns the parameter into that property before executing the remainder of the constructor.

To document these fields, use JSDoc’s `@param` annotation. Editors display the description on constructor calls and property accesses.

**Good:**

``` ts
/** This class demonstrates how parameter properties are documented. */
class ParamProps {
  /**
   * @param percolator The percolator used for brewing.
   * @param beans The beans to brew.
   */
  constructor(
    private readonly percolator: Percolator,
    private readonly beans: CoffeeBean[]) {}
}
```

**Good:**

``` ts
/** This class demonstrates how ordinary fields are documented. */
class OrdinaryClass {
  /** The bean that will be used in the next call to brew(). */
  nextBean: CoffeeBean;

  constructor(initialBean: CoffeeBean) {
    this.nextBean = initialBean;
  }
}
```

#### 8.10 Make comments that actually add information

##### 8.10.1 Comments when calling a function

“Parameter name” comments should be used whenever the method name and parameter value do not sufficiently convey the meaning of the parameter.

Before adding these comments, consider refactoring the method to instead accept an interface and destructure it to greatly improve call-site readability.

“Parameter name” comments go before the parameter value, and include the parameter name and a `=` suffix:

**Good:**

``` ts
someFunction(obviousParam, /* shouldRender= */ true, /* name= */ 'hello');
```

Existing code may use a legacy parameter name comment style, which places these comments ~after~ the parameter value and omits the `=`. Continuing to use this style within the file for consistency is acceptable.

``` ts
someFunction(obviousParam, true /* shouldRender */, 'hello' /* name */);
```

#### 8.11 Place documentation prior to decorators

When a class, method, or property have both decorators like `@Component` and JsDoc, please make sure to write the JsDoc before the decorator.

- Do not write JsDoc between the Decorator and the decorated statement.

  **Bad:**

  ``` ts
  @Component({
    selector: 'foo',
    template: 'bar',
  })
  /** Component that prints "bar". */
  export class FooComponent {}
  ```

- Write the JsDoc block before the Decorator.

  **Good:**

  ``` ts
  /** Component that prints "bar". */
  @Component({
    selector: 'foo',
    template: 'bar',
  })
  export class FooComponent {}
  ```

### 9 Policies

#### 9.1 Consistency

##### 9.1.1 Reformatting existing code

You will occasionally encounter files in the codebase that are not in proper Google Style. These may have come from an acquisition, or may have been written before Google Style took a position on some issue, or may be in non-Google Style for any other reason.

When updating the style of existing code, follow these guidelines.

1.  It is not required to change all existing code to meet current style guidelines. Reformatting existing code is a trade-off between code churn and consistency. Style rules evolve over time and these kinds of tweaks to maintain compliance would create unnecessary churn. However, if significant changes are being made to a file it is expected that the file will be in Google Style.
2.  Be careful not to allow opportunistic style fixes to muddle the focus of a CL. If you find yourself making a lot of style changes that aren’t critical to the central focus of a CL, promote those changes to a separate CL.

#### 9.2 Deprecation

Mark deprecated methods, classes or interfaces with an `@deprecated` JSDoc annotation. A deprecation comment must include simple, clear directions for people to fix their call sites.

#### 9.3 Generated code: mostly exempt

##### 9.3.1 Style guide goals

In general, engineers usually know best about what’s needed in their code, so if there are multiple options and the choice is situation dependent, we should let decisions be made locally. So the default answer should be “leave it out”.

The following points are the exceptions, which are the reasons we have some global rules. Evaluate your style guide proposal against the following:

1.  **Code should avoid patterns that are known to cause problems, especially for users new to the language.**

2.  **Code across projects should be consistent across irrelevant variations.**

    When there are two options that are equivalent in a superficial way, we should consider choosing one just so we don’t divergently evolve for no reason and avoid pointless debates in code reviews.

    Examples:

    - The capitalization style of names.
    - `x as T` syntax vs the equivalent `<T>x` syntax (disallowed).
    - `Array<[number, number]>` vs `[number, number][]`.

3.  **Code should be maintainable in the long term.**

    Code usually lives longer than the original author works on it, and the TypeScript team must keep all of Google working into the future.

    Examples:

    - We use software to automate changes to code, so code is autoformatted so it’s easy for software to meet whitespace rules.
    - We require a single set of compiler flags, so a given TS library can be written assuming a specific set of flags, and users can always safely use a shared library.
    - Code must import the libraries it uses (“strict deps”) so that a refactor in a dependency doesn’t change the dependencies of its users.
    - We ask users to write tests. Without tests we cannot have confidence that changes that we make to the language, don’t break users.

4.  **Code reviewers should be focused on improving the quality of the code, not enforcing arbitrary rules.**

    If it’s possible to implement your rule as an automated check that is often a good sign. This also supports principle 3.

    If it really just doesn’t matter that much – if it’s an obscure corner of the language or if it avoids a bug that is unlikely to occur – it’s probably worth leaving out.


