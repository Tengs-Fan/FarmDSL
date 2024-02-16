grammar FarmExpr;

func: 'def' NAME '(' (parameter)? (',' parameter)* ')' ('->' type)? '{' prog '}' ;

parameter: NAME ':' type ;

// A program is a bunch of statements
prog: (stmt | func)* ;

stmt: decl_stmt
    | if_stmt
    | expr_stmt
    | assign_stmt
    | loop_stmt
    | return_stmt
    ;

// Declarations 
decl_stmt: type NAME ('=' (expr | pairs) )? ';' ;

// Expression, they evaluate to a value
expr_stmt: expr ';' ;

// Assign the evaluated value to a variable
assign_stmt: NAME '=' expr ';' ;

// If statement
if_stmt: 'if' expr '{' prog '}' ('else' '{' prog '}')? ;

// Loop statement
loop_stmt: 'for' NAME 'in' NAME '{' prog '}';

// Final return of function
return_stmt: 'return' expr ';' ; 

// Argument to function call
args: expr (',' expr)* ;

pairs: '[' pair (',' pair)* ']' ;
pair:  NAME ':' expr ;

// Types 
type: 'Num' 
    | 'Bool'
    | 'Farm'
    | 'Crop'
    ;

// Function call
call_expr: NAME '(' args? ')' ;

expr: '(' expr ')'
      | expr op=( 'and' | 'or' ) expr
      | expr op=('*'|'/') expr
      | expr op=('+'|'-') expr
      | expr op=( '!=' | '==' | '>=' | '<=' | '<' | '>' ) expr
      | call_expr
      | NAME '.' call_expr
      | BOOL
      | INT
      | FLOAT
      | NAME
      | STRING
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
