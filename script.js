let error =/^\.|\.$|\.[^0-9]|[^0-9]\.|\.[0-9]*\.|[0-9]\(|\-\-|\-\+|\-\*|\-\*|\+\-|\+\+|\+\*|\+\/|\*\-|\*\+|\*\*|\*\/|\/\-|\/\+|\/\*|\/\/|\-$|\*$|\/$|\+$|[^0-9\+\-\/\*\(\)\.]|\(\)|\)\(|\(\*|\(\/|\+\)|\-\)|\/\)|\*\)/
let numb = /[0-9]+[\.\]?[0-9]*/g;
function hookNumber(str){
    let rightHook = 0;
    let leftHook = 0;
    let hookError = false;
    for (let k = 0; k<str.length; k++){
        if (str[k] === ')'){
            rightHook++;
        }
        if (str[k] === '('){
            leftHook++;
        }
        if (leftHook < rightHook){
           hookError = true;
        }        
    }
    if (rightHook != leftHook){
        hookError = true;
    }
     return hookError;
}

function examineError(str){
if (error.test(str)||hookNumber(str)){
    return true;
}
else return false;
}

function diff(str) {
    let res = [];
    res[0] = {
             n:  Number( numb.exec(str)),
             begin: str[0],
             end: str[numb.lastIndex]            
       }    
    let b  = numb.lastIndex;     
    let i =1;
    while (b>0){     
       string = numb.exec(str);       
       b = numb.lastIndex;
       if (b>0){       
        res[i] = {       
            n: Number(string),
            begin: str[b-string[0].length-1],
            end: str[b]           
    }
   i = i+1;
}
}
return res;
}
function sum(res){
    let resSum= 0;
    for (let i=0;i<res.length; i++){
       
       if (res[i].begin == '-'){
        resSum =resSum-res[i].n;
       }
       else resSum =resSum+res[i].n;
    }
     return resSum;
}
function minus(str){
    let str1 = /\-\-/g;
    let str2 = /\+\-/g;
    str = str.replace(str1, '+');
    str=  str.replace(str2, '-');
    return str;
}
function operate(res){
    for(let i =0; i<res.length; i++ ){
        if (res[i].end === '/' && res[i+1].n=== 0){
            res = 'Делить на ноль нельзя'                  
            }
        }
    for(let i =0; i<res.length; i++ ){        
         if (res[i].end === '*' && res[i+1].begin === '-' && res[i].begin === '-' ){
            res[i] = {
                n: res[i].n * res[i+1].n,
                begin: '+',
                end: res[i+1].end
            }
            res.splice(i+1,1);
              operate(res);
        }
        if (res[i].end === '*' && res[i+1].begin === '-' && res[i].begin != '-' ){
            res[i] = {
                n: res[i].n * res[i+1].n,
                begin: '-',
                end: res[i+1].end
            }
            res.splice(i+1,1);
              operate(res);
        }
        if (res[i].end === '/'&& res[i+1].begin === '-' && res[i].begin === '-' ){
            res[i] = {
                n: res[i].n / res[i+1].n,
                begin: '+',
                end: res[i+1].end
            }
            res.splice(i+1,1);
              operate(res);
        }
        if (res[i].end === '/' && res[i+1].begin === '-' &&  res[i].begin != '-' ){
            res[i] = {
                n: res[i].n / res[i+1].n,
                begin: '-',
                end: res[i+1].end
            }
            res.splice(i+1,1);
              operate(res);
        }
         if (res[i].end === '*' && res[i+1].begin != '-'){
            res[i] = {
                n: res[i].n * res[i+1].n,
                begin: res[i].begin,
                end: res[i+1].end
            }
            res.splice(i+1,1);
              operate(res);
        }
         if (res[i].end === '/' && res[i+1].begin != '-'){
            res[i] = {
                n: res[i].n / res[i+1].n,
                begin: res[i].begin,
                end: res[i+1].end
            }
            res.splice(i+1,1);
              operate(res);
        }
  }
return res;
}
function hooks(inialString){
    let close = 0;
    let open = 0;
  if (inialString.indexOf(")") >0){
    for (let i=0;i<=inialString.indexOf(")"); i++){
               close = inialString.indexOf(")");
                for (let j = 0 ; j<inialString.substr(0,close-1).length; j++){
                    if (inialString.substr(0,close-1)[j] === "("){open =j ; }
                }               
            let str = inialString.substr(open+1,close-open-1);            
            inialString = minus(inialString.substr(0,open)+(sum(operate(diff(str))))+inialString.substr(close+1,inialString.length-close));
            hooks(inialString);}
       }
      if (operate(diff(inialString))=== 'Делить на ноль нельзя'){
            return 'Error: Division by zero'
        }
        else return sum(operate(diff(inialString)));
    }
document.querySelector('.button').addEventListener('click', function(){  
    event.preventDefault()
    const form = document.forms.popup;
    const name = form.elements.name;
     console.log(hookNumber(name.value))
     if (examineError(name.value)){
        document.querySelector('.answer').textContent = `Error: Syntax`;
     }
     else if (!examineError(name.value)){
     if (hooks(name.value) !== 'Error: Division by zero'){
    document.querySelector('.answer').textContent = `Result: ${hooks(name.value)}`;}
    else {document.querySelector('.answer').textContent = `${hooks(name.value)}`;}
     }
    });