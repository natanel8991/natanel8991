import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc: true});
};

export {parseCode};



export function ParsedCodeHandler(parsedCode){
    let result=[];
    let FName= parsedCode.body[0].id.name;
    result.push([1,'function declaration',FName,'','']);
    let Fparams=ParamsHandler(parsedCode['body'][0]['params']);//array of parameters
    for(let i=0;i<Fparams.length;i++){
        result.push([1,'variable declaration',Fparams[i],'','']);
    }

    let rest=parsedCode['body'][0]['body']['body'];
    for(let i=0;i<rest.length;i++){
        result=result.concat(restHandler(rest[i]));
    }

    return result;


}

function ParamsHandler(array){
    let result=[];
    for(let i=0;i<array.length;i++){
        result.push(array[i]['name']);
    }
    return result;
}



//const TYPE_FUNCTIONS_MAP = {VariableDeclaration:VarDeclarationHandler,ExpressionStatement:ExpStatementHandler,WhileStatement: WhileHandler ,IfStatement:IfHandler,ReturnStatement:ReturnHandler,ForStatement:ForHandler};

function restHandler(obj){
    if(obj['type']=='VariableDeclaration'){
        return VarDeclarationHandler(obj);
    }
    if(obj['type']=='ExpressionStatement'){
        return ExpStatementHandler(obj);
    }
    if(obj['type']=='ReturnStatement'){
        return ReturnHandler(obj);
    }
    if(obj['type']=='WhileStatement' | obj['type']=='ForStatement'){
        return ForOrWhileHandler(obj);
    }
    if(obj['type']=='IfStatement'){
        return IfHandler(obj);
    }

}

function VarDeclarationHandler(obj){
    let result=[];
    for(let i=0;i<obj['declarations'].length;i++){
        result.push([obj['loc']['start']['line'],'variable declaration',obj['declarations'][i]['id']['name'],'',RightSideHandler(obj['declarations'][i]['init'])]);
    }
    return result;
}

function RightSideHandler(obj){
    if(obj==null)
        return '';
    return escodegen.generate(obj);
}

function ExpStatementHandler(obj){
    if(obj['expression']['type']=='UpdateExpression'){
        return [[obj['loc']['start']['line'],'update expression',obj['expression']['argument']['name'],'',escodegen.generate(obj)]];
    }
    else{
        let leftSide = obj['expression']['left']['name'];
        let rightSide = RightSideHandler(obj['expression']['right']);
        return [[obj['loc']['start']['line'], 'assignment expression', leftSide, '', rightSide]];
    }
}
function ForOrWhileHandler(obj){
    let result=[];
    if(obj['type']=='WhileStatement')
        result.push([obj['loc']['start']['line'],'while statement','',ConditionHandler(obj['test']),'' ]);
    else{
        let condition=escodegen.generate(obj['init'])+escodegen.generate(obj['test'])+';'+escodegen.generate(obj['update']);
        result.push([obj['loc']['start']['line'],'for statement','',condition,'']);
    }

    if(obj['body']['type']=='BlockStatement') {
        for (var i = 0; i < obj['body']['body'].length; i++) {
            result = result.concat(restHandler(obj['body']['body'][i]));
        }
    }
    else
        result=result.concat(restHandler(obj['body']));
    return result;
}

function ConditionHandler(obj){
    return RightSideHandler(obj);
}

function IfHandler(obj){
    let result=[];
    result.push([obj['loc']['start']['line'],'if statement','',ConditionHandler(obj['test']),'']);
    result=result.concat(IfConsequentHandler(obj,[]));
    result=result.concat(IfAlternateHandler(obj,[]));
    return result;

}
function IfConsequentHandler(obj,result){
    if(obj['consequent']['type']=='BlockStatement'){
        for(var i=0;i<obj['consequent']['body'].length;i++){
            result=result.concat(restHandler(obj['consequent']['body'][i]));
        }
    }
    else
        result=result.concat(restHandler(obj['consequent']));
    return result;
}

function IfAlternateHandler(obj,result){
    if(obj['alternate']!=null) {
        if (obj['alternate']['type'] == 'BlockStatement') {
            for (var i = 0; i < obj['alternate']['body'].length; i++) {
                result = result.concat(restHandler(obj['alternate']['body'][i]));
            }
        }
        else
            result = result.concat(restHandler(obj['alternate']));
    }
    return result;
}

function ReturnHandler(obj){//must to implement
    let ReturnValue=RightSideHandler(obj['argument']);
    let result=[];
    result.push([obj['loc']['start']['line'],'return expression','','' ,ReturnValue]);
    return result;
}




