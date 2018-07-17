# tslint-rules-jeongho
Custom utility rules for TSLint.

## How to use
```
yarn add tslint-rules-jeongho
```

in `tslint.json`,
```json
{
    "rulesDirectory": ["./node_modules/tslint-rules-jeongho/dist"],
    "rules": {
        "symmetric-enum": [true, {
            "path": ".*.ts$" // Optional regex to restrict files to apply this rule.
        }]
    }
}
```

## `symmetric-enum`
This rule restricts enum string literals to be exactly same as its key name.

```ts
enum Action {
  FETCH_USER = 'FETCH_USER',
  LOGIN = 'Login', // ERROR! The string value must be 'LOGIN'.
}
```
