
// The type of a value
export type Type = "Num" | "Bool" | "Farm" | "Crop";

// The type of an expression
export type ExprType = 
    "Null"| // Does nothing
    Type  | 
    "String" | "Name" | 
    "Add" | "Sub" | "Mul" | "Div" | "Eq" | // result: Num
    "Neq" | "Gt" | "Lt" | "Gte" | "Lte" |  // result: Bool
    "Call"  // Function call, result: unknown
;
    
