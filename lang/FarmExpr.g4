grammar FarmExpr;

options { 
    visitor = true; 
}

prog: stmt+;

stmt: decl_stmt
    | expr_stmt
    | assign_stmt
    ;

decl_stmt: type NAME '=' expr ';' ;
expr_stmt: expr ';' ;
assign_stmt: NAME '=' expr ';' ;

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
