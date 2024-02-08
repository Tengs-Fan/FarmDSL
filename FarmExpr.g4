grammar FarmExpr;

// A program is a bunch of statements
prog: stmt+;

stmt: decl_stmt
    | if_stmt
    | expr_stmt
    | assign_stmt
    ;

// Declarations 
decl_stmt: type NAME ('=' (expr | pairs) )? ';' ;

// Expression, they evaluate to a value
expr_stmt: expr ';' ;

// Assign the evaluated value to a variable
assign_stmt: NAME '=' expr ';' ;

// If statement
if_stmt: 'if' expr block ('else' block)? ;

// Argument to function call
args: expr (',' expr)* ;

pairs: '[' pair (',' pair)* ']' ;
pair:  NAME ':' expr ;

block: '{' stmt* '}' ;

// Types 
type: 'Num' 
    | 'Bool'
    | 'Farm'
    | 'Crop'
    ;

// Function call
call_expr: NAME '(' args? ')' ;

expr:   expr op=('*'|'/') expr
      | expr op=('+'|'-') expr
      | expr op=( '!=' | '==' | '>=' | '<=' | '<' | '>' ) expr
      | expr '.' call_expr
      | call_expr
      | BOOL
      | INT
      | FLOAT
      | NAME
      | STRING
      | '(' expr ')'
      ;



// Tokens

END  : ';' ;
INT  : [0-9]+ ;
FLOAT: [0-9]+ '.' [0-9]+ ;
BOOL : 'true' | 'false' ;
STRING: '"' ( ~["\\] | '\\' . )* '"' ;
NAME : [a-zA-Z_][a-zA-Z_0-9]*;
WS   : [ \t\r\n]+ -> skip ;

LINE_COMMENT : '//' ~[\r\n]* -> skip ;
