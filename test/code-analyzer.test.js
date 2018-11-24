import assert from 'assert';
import {parseCode, ParsedCodeHandler} from '../src/js/code-analyzer';
//import * as escodegen from 'escodegen';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script","loc":{"start":{"line":0,"column":0},"end":{"line":0,"column":0}}}'
        );
    });

});

describe('The ParsedCodeHandler function', () => {
    it('handle a function with at least one parameter and one code line in the body ', () => {
        assert.equal(JSON.stringify(ParsedCodeHandler(parseCode('function F(x){ return x; }'))),JSON.stringify([[1, 'function declaration', 'F', '', ''], [1, 'variable declaration', 'x', '', ''], [1, 'return expression', '', '', 'x']]));
        //assert.equal('[1]','[1]');

    });
});

describe('The RestHandlerFunction function', () => {
    it('handle a vardeclaration of type let v,w; ', () => {
        assert.equal(JSON.stringify(ParsedCodeHandler(parseCode('function F(x){ let v,w; }'))), JSON.stringify([[1, 'function declaration', 'F', '', ''], [1, 'variable declaration', 'x', '', ''], [1, 'variable declaration', 'v', '', ''], [1, 'variable declaration', 'w', '', '']]));
        //assert.equal('[1]','[1]');

    });

    it('handle a vardeclaration of type let v=5+2; ', () => {
        assert.equal(JSON.stringify(ParsedCodeHandler(parseCode('function F(x){ let v=5+2; }'))), JSON.stringify([[1, 'function declaration', 'F', '', ''], [1, 'variable declaration', 'x', '', ''], [1, 'variable declaration', 'v', '', '5 + 2']]));
        //assert.equal('[1]','[1]');

    });
});

describe('the expressionHandler function',() => {

    it('handle a expression statement of type update ; ', () => {
        assert.equal(JSON.stringify(ParsedCodeHandler(parseCode('function F(x){ x++; }'))),JSON.stringify([[1, 'function declaration', 'F', '', ''], [1, 'variable declaration', 'x', '', ''], [1,'update expression','x','','x++;']]));
        //assert.equal('[1]','[1]');

    });

    it('handle a expression statement of type assignment ; ', () => {
        assert.equal(JSON.stringify(ParsedCodeHandler(parseCode('function F(x){ x=1+2; }'))),JSON.stringify([[1, 'function declaration', 'F', '', ''], [1, 'variable declaration', 'x', '', ''], [1,'assignment expression','x','','1 + 2']]));
        //assert.equal('[1]','[1]');

    });
});

describe('the while/for handler',()=> {

    it('handle a while statement with {} ; ', () => {
        assert.equal(JSON.stringify(ParsedCodeHandler(parseCode('function F(x){ while(x<5){ high=high+x; } }'))), JSON.stringify([[1, 'function declaration', 'F', '', ''], [1, 'variable declaration', 'x', '', ''], [1, 'while statement', '', 'x < 5', ''], [1, 'assignment expression', 'high', '', 'high + x']]));
        //assert.equal('[1]','[1]');
    });
    it('handle a while statement without {} ; ', () => {
        assert.equal(JSON.stringify(ParsedCodeHandler(parseCode('function F(x){ while(x<5) high=high+x;  }'))), JSON.stringify([[1, 'function declaration', 'F', '', ''], [1, 'variable declaration', 'x', '', ''], [1, 'while statement', '', 'x < 5', ''], [1, 'assignment expression', 'high', '', 'high + x']]));
        //assert.equal('[1]','[1]');
    });
    it('handle a for statement with {} ; ', () => {
        assert.equal(JSON.stringify(ParsedCodeHandler(parseCode('function F(x){ for(let i=0;i<6;i++) {high=high+x;}  }'))), JSON.stringify([[1, 'function declaration', 'F', '', ''], [1, 'variable declaration', 'x', '', ''], [1, 'for statement', '', 'let i = 0;i < 6;i++', ''], [1, 'assignment expression', 'high', '', 'high + x']]));
        //assert.equal('[1]','[1]');
    });
    it('handle a for statement without {} ; ', () => {
        assert.equal(JSON.stringify(ParsedCodeHandler(parseCode('function F(x){ for(let i=0;i<6;i++) high=high+x;  }'))), JSON.stringify([[1, 'function declaration', 'F', '', ''], [1, 'variable declaration', 'x', '', ''], [1, 'for statement', '', 'let i = 0;i < 6;i++', ''], [1, 'assignment expression', 'high', '', 'high + x']]));
        //assert.equal('[1]','[1]');
    });
});


describe('forHandler ',()=> {

    it('handle a for if + else statement with {} ; ', () => {
        assert.equal(JSON.stringify(ParsedCodeHandler(parseCode('function F(x){ if(x<5){return x; } else{ return 0;}  }'))), JSON.stringify([[1, 'function declaration', 'F', '', ''], [1, 'variable declaration', 'x', '', ''], [1, 'if statement', '', 'x < 5', ''], [1, 'return expression', '', '', 'x'], [1, 'return expression', '', '', '0']]));
        //assert.equal('[1]','[1]');

    });
    it('handle a for if + else statement without {} ; ', () => {
        assert.equal(JSON.stringify(ParsedCodeHandler(parseCode('function F(x){ if(x<5)return x;  else return 0;  }'))), JSON.stringify([[1, 'function declaration', 'F', '', ''], [1, 'variable declaration', 'x', '', ''], [1, 'if statement', '', 'x < 5', ''], [1, 'return expression', '', '', 'x'], [1, 'return expression', '', '', '0']]));
        //assert.equal('[1]','[1]');

    });

    it('handle a for if  statement without else ; ', () => {
        assert.equal(JSON.stringify(ParsedCodeHandler(parseCode('function F(x){ if(x<5)return x;   }'))), JSON.stringify([[1, 'function declaration', 'F', '', ''], [1, 'variable declaration', 'x', '', ''], [1, 'if statement', '', 'x < 5', ''], [1, 'return expression', '', '', 'x']]));
        assert.equal('[1]', '[1]');

    });

});