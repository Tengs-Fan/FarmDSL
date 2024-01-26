grammar FarmExpr;

options { 
    visitor = true; 
}

// A program is a bunch of statements
prog: stmt+;

stmt: decl_stmt
    | expr_stmt
    | assign_stmt
    | call_stmt
    ;

// Declarations 
decl_stmt: type NAME '=' expr ';' ;

// Expression, they evaluate to a value
expr_stmt: expr ';' ;

// Assign the evaluated value to a variable
assign_stmt: NAME '=' expr ';' ;

// Function call
call_stmt: NAME '(' args? ')' ';' ;

// Argument to function call
args: expr (',' expr)* ;

// Types 
type: 'num' 
    | 'bool'
    ;

expr:   expr op=('*'|'/') expr
      | expr op=('+'|'-') expr
      | expr op=('=='|'>='|'<=') expr
      | INT
      | BOOL
      | NAME
      | '(' expr ')'
      ;

END  : ';' ;
INT  : [0-9]+ ;
BOOL : 'true' | 'false' ;
NAME : [a-zA-Z_][a-zA-Z_0-9]*;
WS   : [ \t\r\n]+ -> skip ;

LINE_COMMENT : '//' ~[\r\n]* -> skip ;
