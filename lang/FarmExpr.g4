grammar FarmExpr;

expr:   expr op=('*'|'/') expr
      | expr op=('+'|'-') expr
      | INT
      | '(' expr ')'
      ;

INT : [0-9]+ ;
WS : [ \t\r\n]+ -> skip ;

LINE_COMMENT : '//' ~[\r\n]* -> skip ;
