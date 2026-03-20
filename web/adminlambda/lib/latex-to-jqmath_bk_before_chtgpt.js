var canApplyLatex = true;


function latex_to_js(input) {
    var st1 = input;

    //Remove Extra dollars..
    st1 = st1.replace(/\$\$/g, '$');
    //Clean special Chars
    st1 = st1.replace(/\r\n|\r|\n/g, '↫'); // temporarily store newline
    st1 = st1.replace(/\s/g, " "); // remove other special chars.
    st1 = st1.replace(/↫↫↫↫/g, '\n');
    st1 = st1.replace(/↫↫↫/g, '\n');
    st1 = st1.replace(/↫↫/g, '\n');
    st1 = st1.replace(/↫/g, '\n'); // putback newlines. 
    st1 = getDollarsText(st1);
    st1 = checkIncaseIfDollorsMissing(st1);
    st1 = tabularcheck (st1);
    st1 = st1.replace(/\n <br> \n/g, '<br>');
    st1 = st1.replace(/\r\n|\r|\n/g, '<br>');
    st1 = makeTextCharBeautiful(st1);
    return st1;
}



function getDollarsText(text) {
    var matches = text.match(/\$(?:[^\$\\]|\\.)*\$/g);
    if (matches && matches.length > 0) {
        matches.forEach(function (match) {
            //  var temp = match.substring(1, match.length - 1); // to remove dollars 
            var temp = match;
            temp = temp.replace(/\s/g, " "); // removing new lines from formula text..
            temp = performLatexOperations(temp);
            text = text.replace(match, temp);
        });
    }
    return text;
} 
function extract(str,pattern) {

    const countRegEx = RegExp("(?<!"+pattern+"){","g");
    const count = str.match(countRegEx)?.length ?? 0;
    //const count = str.match(/(?<!\\underset){/g)?.length ?? 0;
    const regex = RegExp("(?<="+pattern+"{)[^{}]*" + "({[^{}]*".repeat(count) + "}[^{}]*)*".repeat(count) + "(?=})}" + "{(?<={)[^{}]*" + "({[^{}]*".repeat(count) + "}[^{}]*)*".repeat(count) + "(?=})}", "g");
    var matches = str.match(regex);
    if(matches && matches.length == 2){
        str = str.replace(RegExp(pattern+"{"+matches[1],"g" ),"");
        str = str.replace(RegExp(pattern+"{"+matches[0],"g"), "{"+matches[0]+"↖{"+matches[1]);
    }
    return str;
}

function performLatexOperations(st1){
    st1 = cleanlatex(st1);
    st1 = text_input(st1);    
    st1 = mathrm(st1); // re check again what is this??
    //var test=extract(st1,"\\underset");
    st1 = stackrelcheck(st1);
    st1 = substack_check(st1);
    
    st1 = undersetcheck(st1);
    st1 = undersetcheck1(st1);
    st1 = matricescheck(st1);
    console.log(st1);
    st1 = cleanbrackets(st1);
   
    st1 = square_root_new(st1);

     //before fraction clean all forward slash with \/
    st1 = st1.replace(/\//g, '\\/');    
    st1 = fraction2(st1); // some time & operation is annoying.
    st1 = fraction(st1);

    st1= integrationcheck_new(st1); 
    st1= summationcheck_new(st1);
    st1=summationcheck_Symbol(st1);

     
     
    st1 = hatsymbol(st1); // Hat symbols to goto top.    
    st1 = overrightarrow(st1);
    st1 = st1.replace(/\\underline/g, "x");
    st1 = removeothersglobal(st1);

    st1 = st1.replace(/\$\$/g, '$');
    st1 = otherscheck(st1);
   
    while (st1.search(/\\mathbf\{(((?![\{\}]).)*)\}/) >= 0) {
        st1 = st1.replace(/\\mathbf\{(((?![\{\}]).)*)\}/g, "$1");
    }
    while (st1.search(/\\mathbf \{(((?![\{\}]).)*)\}/) >= 0) {
        st1 = st1.replace(/\\mathbf \{(((?![\{\}]).)*)\}/g, "$1");
    }
    //Check in end..
    while (st1.search(/\\operatorname\{(((?![\{\}]).)*)\}_/) >= 0) {
        st1 = st1.replace(/\\operatorname\{(((?![\{\}]).)*)\}_/g, "{\\$1}↙");
    }

    while (st1.search(/\\operatorname\{(((?![\{\}]).)*)\}/) >= 0) {
        st1 = st1.replace(/\\operatorname\{(((?![\{\}]).)*)\}/g, "{\\$1}");
    }
    st1 = st1.replace(/\\begin{equation}\]/g, "$");
    st1 = st1.replace(/\\end{equation}\]/g, "$<br>");

    st1 = square_box_symbol(st1);

    // \mv to \ my
    st1 = st1.replace(/\\mv/g, "\\ mv");
    st1 = st1.replace(/\\mathrm/g, "");
    st1 = st1.replace(/\\s/g, "\\ s");
    
    return st1;
} 


//inside arrays or tables only
function cleanothers(st1) {
    st1 = st1.replace(/\\\\ &/g, ' $<br>$ ');
    st1 = st1.replace(/\\\\/g, ' $<br>$ '); 
    return st1;
}

function otherscheck(input) {
   
    //$ begin{array}{lll} $
    while (input.search(/\$[^\$]\\begin{array}{[c|l|r]{1,8}}((?:[^\$\\]|\\.)*)\\end{array}[^\$]\$/gm) >= 0) {
        input = input.replace(/\$[^\$]\\begin{array}{[c|l|r]{1,8}}((?:[^\$\\]|\\.)*)\\end{array}[^\$]\$/gm, function (match,one) {
            return   '$'+cleanothers(one) + '$';
        });
    }
   
    //begin{array}{lll}
    while (input.search(/\\begin{array}{[c|l|r]{1,8}}((?:[^\$\\]|\\.)*)\\end{array}/gm) >= 0) {
        input = input.replace(/\\begin{array}{[c|l|r]{1,8}}((?:[^\$\\]|\\.)*)\\end{array}/gm, function (match,one) {
            return  '$'+ cleanothers(one) + '$';
        });
    }


    //$ begin{array}{aligned} $
    while (input.search(/\$[^\$]\\begin{aligned}((?:[^\$\\]|\\.)*)\\end{aligned}[^\$]\$/gm) >= 0) {
        input = input.replace(/\$[^\$]\\begin{aligned}((?:[^\$\\]|\\.)*)\\end{aligned}[^\$]\$/gm, function (match,one) {
            return   '$'+cleanothers(one) + '$';
        });
    }
   
    //begin{array}{aligned}
    while (input.search(/\\begin{aligned}((?:[^\$\\]|\\.)*)\\end{aligned}/gm) >= 0) {
        input = input.replace(/\\begin{aligned}((?:[^\$\\]|\\.)*)\\end{aligned}/gm, function (match,one) {
            return  '$'+ cleanothers(one) + '$';
        });
    }



    return input;
}

function checkIncaseIfDollorsMissing(input){
    while (input.search(/\\begin{array}{l+}((?:[^\$\\]|\\.)*)\\end{array}/gm) >= 0) {
        input = input.replace(/\\begin{array}{l+}((?:[^\$\\]|\\.)*)\\end{array}/gm, function (match,one) {
             return performLatexOperationWithNewLine(one);
        });

    }   
    return input

}


 function performLatexOperationWithNewLine(input){
    var lines = input.split('\\\\');
    var output = '';
    for(var i=0 ;i<lines.length;i++){
        lines[i] = lines[i].replace(/\n <br> \n/g, '');
        lines[i] = lines[i].replace(/\r\n|\r|\n/g, '');
        output+= '$'+performLatexOperations(lines[i])+'$ <br>'
    }    
    return output;

 }





function integrationcheck_new(input) {

    

    //Case1: int_{}^{}
    const regex1a = /\\int(\_){([^int\^\_]*)}(\^){([^int\^\_]*)}/gm; 

    while (input.search(regex1a) >= 0) {
        input = input.replace(regex1a, function (input, one, two,three, four) {            
            if(one == '_'){
                return "∫↙{" + two + "}↖{" + four + "}";
            }else{
                return "∫↖{" + two + "}↙{" + four + "}";
            }            
        });
    }

    const regex1b = /\\int(\^){([^int\^\_]*)}(\_){([^int\^\_]*)}/gm; 

    while (input.search(regex1b) >= 0) {
        input = input.replace(regex1b, function (input, one, two,three, four) {            
            if(one == '_'){
                return "∫↙{" + two + "}↖{" + four + "}";
            }else{
                return "∫↖{" + two + "}↙{" + four + "}";
            }            
        });
    }



    
    //Case1: int_text^{}
    const regex2a = /\\int(\_)([^int\^\_]*)(\^){([^int\^\_]*)}/gm; 
    while (input.search(regex2a) >= 0) {
        input = input.replace(regex2a, function (input, one, two,three, four) {            
            if(one == '_'){
                return "∫↙{" + two + "}↖{" + four + "}";
            }else{
                return "∫↖{" + two + "}↙{" + four + "}";
            }            
        });
    }

    const regex2b = /\\int(\^)([^int\^\_]*)(\_){([^int\^\_]*)}/gm; 
    while (input.search(regex2b) >= 0) {
        input = input.replace(regex2b, function (input, one, two,three, four) {            
            if(one == '_'){
                return "∫↙{" + two + "}↖{" + four + "}";
            }else{
                return "∫↖{" + two + "}↙{" + four + "}";
            }            
        });
    }
    
    
    //Case1: int_{}^text
    const regex3a = /\\int(\_){([^}\^]*)}(\^)([^\s[{(]*)/gm;
    while (input.search(regex3a) >= 0) {
        input = input.replace(regex3a, function (input, one, two,three, four) {            
            if(one == '_'){
                return "∫↙{" + two + "}↖{" + four + "}";
            }else{
                return "∫↖{" + two + "}↙{" + four + "}";
            }            
        });
    }

    const regex3b = /\\int(\^){([^}\^]*)}(\_)([^\s[{(]*)/gm;
    while (input.search(regex3b) >= 0) {
        input = input.replace(regex3b, function (input, one, two,three, four) {            
            if(one == '_'){
                return "∫↙{" + two + "}↖{" + four + "}";
            }else{
                return "∫↖{" + two + "}↙{" + four + "}";
            }            
        });
    }
    
    
    //Case1: int_text^text
    const regex4a = /\\int(\_)([^int\^\_]*)(\^)([^\s[({ ]*)/gm;
    while (input.search(regex4a) >= 0) {
        input = input.replace(regex4a, function (input, one, two,three, four) {            
            if(one == '_'){
                return "∫↙{" + two + "}↖{" + four + "}";
            }else{
                return "∫↖{" + two + "}↙{" + four + "}";
            }            
        });
    }

    const regex4b = /\\int(\^)([^int\^\_]*)(\_)([^\s[({ ]*)/gm;
    while (input.search(regex4b) >= 0) {
        input = input.replace(regex4b, function (input, one, two,three, four) {            
            if(one == '_'){
                return "∫↙{" + two + "}↖{" + four + "}";
            }else{
                return "∫↖{" + two + "}↙{" + four + "}";
            }            
        });
    }
    




    while (input.search(/\\int[\^]([\S]*)[\_]([\S]*)/) >= 0) {
        input = input.replace(/\\int[\^|_]([\S]*)[\^|_]([\S]*)/gm, function (input, one, two) {
            return "∫↙{" + one + "}↖{" + two + "}";
        });
    }

    while (input.search(/\\int[\_]([\S]*)[\^]([\S]*)/) >= 0) {
        input = input.replace(/\\int[\^|_]([\S]*)[\^|_]([\S]*)/gm, function (input, one, two) {
            return "∫↙{" + one + "}↖{" + two + "}";
        });
    }

    while (input.search(/\\int[\^|_]([\S]*)[\^|_]([\S]*)/) >= 0) {
        input = input.replace(/\\int[\^|_]([\S]*)[\^|_]([\S]*)/gm, function (input, one, two) {
            return "∫↙{" + one + "}↖{" + two + "}";
        });
    }
    
    //in case if integration missing..
    input = input.replace(/\\int_/g, "∫↙");
    input = input.replace(/\\int/g, "∫");

    

    return input;
}







 




function summationcheck_new(input) {


    //sum_{}^{}
    const regex0a = /\\sum(\_)(\{((?!{).*?)\})(\^)(\{((?!{).*?)\})/gm; 

    while (input.search(regex0a) >= 0) {
        input = input.replace(regex0a, function (input, one, two,three, four,five) {            
            if(one == '_'){
                return "∑↙{" + two + "}↖{" + five + "}";
            }else{
                return "∑↖{" + two + "}↙{" + five + "}";
            }            
        });
    }


    const regex0b = /\\sum(\^)(\{((?!{).*?)\})(\_)(\{((?!{).*?)\})/gm; 

    while (input.search(regex0b) >= 0) {
        input = input.replace(regex0b, function (input, one, two,three, four,five) {            
            if(one == '_'){
                return "∑↙{" + two + "}↖{" + five + "}";
            }else{
                return "∑↖{" + two + "}↙{" + five + "}";
            }            
        });
    }



    const regex1a = /\\sum(\_){([^}]*)}(\^){([^}]*)}/gm; 

    while (input.search(regex1a) >= 0) {
        input = input.replace(regex1a, function (input, one, two,three, four) {            
            if(one == '_'){
                return "∑↙{" + two + "}↖{" + four + "}";
            }else{
                return "∑↖{" + two + "}↙{" + four + "}";
            }            
        });
    }



    const regex1b = /\\sum(\^){([^}]*)}(\_){([^}]*)}/gm; 

    while (input.search(regex1b) >= 0) {
        input = input.replace(regex1b, function (input, one, two,three, four) {            
            if(one == '_'){
                return "∑↙{" + two + "}↖{" + four + "}";
            }else{
                return "∑↖{" + two + "}↙{" + four + "}";
            }            
        });
    }



    
    //Case1: int_text^{}
    const regex2a = /\\sum(\_)([^sum]*)(\^){([^}]*)}/gm; 
    while (input.search(regex2a) >= 0) {
        input = input.replace(regex2a, function (input, one, two,three, four) {            
            if(one == '_'){
                return "∑↙{" + two + "}↖{" + four + "}";
            }else{
                return "∑↖{" + two + "}↙{" + four + "}";
            }            
        });
    }

    const regex2b = /\\sum(\^)([^sum]*)(\_){([^}]*)}/gm; 
    while (input.search(regex2b) >= 0) {
        input = input.replace(regex2b, function (input, one, two,three, four) {            
            if(one == '_'){
                return "∑↙{" + two + "}↖{" + four + "}";
            }else{
                return "∑↖{" + two + "}↙{" + four + "}";
            }            
        });
    }






    
    
    //Case1: int_{}^text
    const regex3a = /\\sum(\_){([^}\^]*)}(\^)([^\s[{(]*)/gm;
    while (input.search(regex3a) >= 0) {
        input = input.replace(regex3a, function (input, one, two,three, four) {            
            if(one == '_'){
                return "∑↙{" + two + "}↖{" + four + "}";
            }else{
                return "∑↖{" + two + "}↙{" + four + "}";
            }            
        });
    }


    const regex3b = /\\sum(\^){([^}\^]*)}(\_)([^\s[{(]*)/gm;
    while (input.search(regex3b) >= 0) {
        input = input.replace(regex3b, function (input, one, two,three, four) {            
            if(one == '_'){
                return "∑↙{" + two + "}↖{" + four + "}";
            }else{
                return "∑↖{" + two + "}↙{" + four + "}";
            }            
        });
    }
    
    
    //Case1: int_text^text
    const regex4a = /\\sum(\_)([^sum\^\_]*)(\^)([^\s[({ ]*)/gm;
    while (input.search(regex4a) >= 0) {
        input = input.replace(regex4a, function (input, one, two,three, four) {            
            if(one == '_'){
                return "∑↙{" + two + "}↖{" + four + "}";
            }else{
                return "∑↖{" + two + "}↙{" + four + "}";
            }            
        });
    }
    const regex4b = /\\sum(\^)([^sum\^\_]*)(\_)([^\s[({ ]*)/gm;
    while (input.search(regex4b) >= 0) {
        input = input.replace(regex4b, function (input, one, two,three, four) {            
            if(one == '_'){
                return "∑↙{" + two + "}↖{" + four + "}";
            }else{
                return "∑↖{" + two + "}↙{" + four + "}";
            }            
        });
    }
    


    while (input.search(/\\sum[\^]([\S]*)[\_]([\S]*)/) >= 0) {
        input = input.replace(/\\sum[\^|_]([\S]*)[\^|_]([\S]*)/gm, function (input, one, two) {
            return "∑↙{" + one + "}↖{" + two + "}";
        });
    }


    while (input.search(/\\sum[\_]([\S]*)[\^]([\S]*)/) >= 0) {
        input = input.replace(/\\sum[\^|_]([\S]*)[\^|_]([\S]*)/gm, function (input, one, two) {
            return "∑↙{" + one + "}↖{" + two + "}";
        });
    }

    while (input.search(/\\sum[\^|_]([\S]*)[\^|_]([\S]*)/) >= 0) {
        input = input.replace(/\\sum[\^|_]([\S]*)[\^|_]([\S]*)/gm, function (input, one, two) {
            return "∑↙{" + one + "}↖{" + two + "}";
        });
    }
    

    input = input.replace(/\\sum_/g, "∑↙");
    input = input.replace(/\\sum/g, "∑");

    return input;
}







function summationcheck_Symbol(input) {


    //sum_{}^{}
    const regex0a = /Σ(\_)(\{((?!{).*?)\})(\^)(\{((?!{).*?)\})/gm; 

    while (input.search(regex0a) >= 0) {
        input = input.replace(regex0a, function (input, one, two,three, four,five) {            
            if(one == '_'){
                return "Σ↙{" + two + "}↖{" + five + "}";
            }else{
                return "Σ↖{" + two + "}↙{" + five + "}";
            }            
        });
    }


    const regex0b = /Σ(\^)(\{((?!{).*?)\})(\_)(\{((?!{).*?)\})/gm; 

    while (input.search(regex0b) >= 0) {
        input = input.replace(regex0b, function (input, one, two,three, four,five) {            
            if(one == '_'){
                return "Σ↙{" + two + "}↖{" + five + "}";
            }else{
                return "Σ↖{" + two + "}↙{" + five + "}";
            }            
        });
    }



    const regex1a = /Σ(\_){([^}]*)}(\^){([^}]*)}/gm; 

    while (input.search(regex1a) >= 0) {
        input = input.replace(regex1a, function (input, one, two,three, four) {            
            if(one == '_'){
                return "Σ↙{" + two + "}↖{" + four + "}";
            }else{
                return "Σ↖{" + two + "}↙{" + four + "}";
            }            
        });
    }



    const regex1b = /Σ(\^){([^}]*)}(\_){([^}]*)}/gm; 

    while (input.search(regex1b) >= 0) {
        input = input.replace(regex1b, function (input, one, two,three, four) {            
            if(one == '_'){
                return "Σ↙{" + two + "}↖{" + four + "}";
            }else{
                return "Σ↖{" + two + "}↙{" + four + "}";
            }            
        });
    }



    
    //Case1: int_text^{}
    const regex2a = /Σ(\_)([^sum]*)(\^){([^}]*)}/gm; 
    while (input.search(regex2a) >= 0) {
        input = input.replace(regex2a, function (input, one, two,three, four) {            
            if(one == '_'){
                return "Σ↙{" + two + "}↖{" + four + "}";
            }else{
                return "Σ↖{" + two + "}↙{" + four + "}";
            }            
        });
    }

    const regex2b = /Σ(\^)([^sum]*)(\_){([^}]*)}/gm; 
    while (input.search(regex2b) >= 0) {
        input = input.replace(regex2b, function (input, one, two,three, four) {            
            if(one == '_'){
                return "Σ↙{" + two + "}↖{" + four + "}";
            }else{
                return "Σ↖{" + two + "}↙{" + four + "}";
            }            
        });
    }






    
    
    //Case1: int_{}^text
    const regex3a = /Σ(\_){([^}\^]*)}(\^)([^\s[{(]*)/gm;
    while (input.search(regex3a) >= 0) {
        input = input.replace(regex3a, function (input, one, two,three, four) {            
            if(one == '_'){
                return "Σ↙{" + two + "}↖{" + four + "}";
            }else{
                return "Σ↖{" + two + "}↙{" + four + "}";
            }            
        });
    }


    const regex3b = /Σ(\^){([^}\^]*)}(\_)([^\s[{(]*)/gm;
    while (input.search(regex3b) >= 0) {
        input = input.replace(regex3b, function (input, one, two,three, four) {            
            if(one == '_'){
                return "Σ↙{" + two + "}↖{" + four + "}";
            }else{
                return "Σ↖{" + two + "}↙{" + four + "}";
            }            
        });
    }
    
    
    //Case1: int_text^text
    const regex4a = /Σ(\_)([^sum\^\_]*)(\^)([^\s[({ ]*)/gm;
    while (input.search(regex4a) >= 0) {
        input = input.replace(regex4a, function (input, one, two,three, four) {            
            if(one == '_'){
                return "Σ↙{" + two + "}↖{" + four + "}";
            }else{
                return "Σ↖{" + two + "}↙{" + four + "}";
            }            
        });
    }
    const regex4b = /Σ(\^)([^sum\^\_]*)(\_)([^\s[({ ]*)/gm;
    while (input.search(regex4b) >= 0) {
        input = input.replace(regex4b, function (input, one, two,three, four) {            
            if(one == '_'){
                return "Σ↙{" + two + "}↖{" + four + "}";
            }else{
                return "Σ↖{" + two + "}↙{" + four + "}";
            }            
        });
    }
    


    while (input.search(/Σ[\^]([\S]*)[\_]([\S]*)/) >= 0) {
        input = input.replace(/Σ[\^|_]([\S]*)[\^|_]([\S]*)/gm, function (input, one, two) {
            return "Σ↙{" + one + "}↖{" + two + "}";
        });
    }


    while (input.search(/Σ[\_]([\S]*)[\^]([\S]*)/) >= 0) {
        input = input.replace(/Σ[\^|_]([\S]*)[\^|_]([\S]*)/gm, function (input, one, two) {
            return "Σ↙{" + one + "}↖{" + two + "}";
        });
    }

    while (input.search(/Σ[\^|_]([\S]*)[\^|_]([\S]*)/) >= 0) {
        input = input.replace(/Σ[\^|_]([\S]*)[\^|_]([\S]*)/gm, function (input, one, two) {
            return "Σ↙{" + one + "}↖{" + two + "}";
        });
    }
    

    

    return input;
}




















function square_root_new(input){     
    //nth root sqrt[]{}
    while (input.search(/\\sqrt\[(.*?)\]\{(.*?)\}/) >= 0) {
        input = input.replace(/\\sqrt\[(.*?)\]\{(.*?)\}/g, "\\;^{$1}√{$2}");
    }
    while (input.search(/\\sqrt\{(((?![\{\}]).)*)\}/) >= 0) {
        input = input.replace(/\\sqrt\{(((?![\{\}]).)*)\}/g, "{√{$1}}");
    }
    input = input.replace(/\\sqrt/g, "√"); 
    return input;
}



 

function sincostan(input) {
    var st1 = input;
    st1 = st1.replace(/sin /g, 'sin \;');
    st1 = st1.replace(/cos /g, 'cos \;');
    st1 = st1.replace(/tan /g, 'tan \;');

    st1 = st1.replace(/cot /g, 'cot \;');
    st1 = st1.replace(/cosec /g, 'cosec \;');
    st1 = st1.replace(/sec /g, 'sec \;');
    return st1;
}
function transformXRightArrows(input) {
  return input.replace(/\\xrightarrow(?:\[(.*?)\])?(?:\{(.*?)\})?/g, (match, bottom, upper) => {
    const arrow = ' {\\;───────▶\\;}';
    if (bottom && upper) {
      return `${arrow}↙{${bottom}}↖{${upper}}`;
    } else if (bottom) {
      return `${arrow}↙{${bottom}}`;
    } else if (upper) {
      return `${arrow}↖{${upper}}`;
    } else {
      return arrow; // fallback
    }
  });
}

function cleanlatex(input) {
    var st1 = input;
    st1 = st1.replace(/&\\times/g, "×");
    st1 = st1.replace(/\\times/g, "×");
    st1 = st1.replace(/\\lambda/g, "λ");
    st1 = st1.replace(/\\gamma/g, "γ");
    st1 = st1.replace(/\\mu/g, "µ");
    st1 = st1.replace(/\\overline/g, "\\ov");
    st1 = transformXRightArrows(st1);
    st1 = st1.replace(/\\xrightarrow/g, "{───────▶}");
    st1 = st1.replace(/\\rightarrow/g, "⟶");

    st1 = st1.replace(/\\leftarrow/g, "←");
    st1 = st1.replace(/\\cdots/g, "⋯");
    st1 = st1.replace(/\\cdot/g, "⋅");
    st1 = st1.replace(/\\Rightarrow &/g, "⇒");
    st1 = st1.replace(/&\\Rightarrow/g, "⇒");
    st1 = st1.replace(/\\Rightarrow/g, "⇒");
    st1 = st1.replace(/\\circ/g, "∘");
    st1 = st1.replace(/\\div/g, "÷");
    st1 = st1.replace(/\\pi/g, "π");
    st1 = st1.replace(/~/g, "");
    st1 = replaceSpecialChars(st1);

    st1 = performAscciOperations(st1);
    st1 = st1.replace(/\\lim _/g, "\\lim ↙");
    return st1;

}


 
 


function cleanbrackets(st1){

     

     //clean up brackets
     st1 = st1.replace(/\\left\(/g, " (");
     st1 = st1.replace(/\\right\)/g, ") ");
 
     st1 = st1.replace(/\\left\[/g, " [");
     st1 = st1.replace(/\\right\]/g, "] ");
 
     st1 = st1.replace(/\\left\|/g, "{| ");
     st1 = st1.replace(/\\right\|/g, "  |}");
 
     st1 = st1.replace(/\\left\\{/g, " \\{");
     st1 = st1.replace(/\\right\\}/g, "\\} ");
 
 
     st1 = st1.replace(/\\left\\⌊/g, " \\⌊");
     st1 = st1.replace(/\\right\\⌋/g, "\\⌋ ");
 
     st1 = st1.replace(/\\left\\⌈/g, " \\⌈");
     st1 = st1.replace(/\\right\\⌉/g, "\\⌉ ");
 
 
     st1 = st1.replace(/\\left⌊/g, " ⌊");
     st1 = st1.replace(/\\right⌋/g, "⌋ ");
 
     st1 = st1.replace(/\\left⌈/g, " ⌈");
     st1 = st1.replace(/\\right⌉/g, "⌉ ");
 
     st1 = st1.replace(/\\left./g, "");
      
 
     st1 = st1.replace(/\\left/g, "");
     st1 = st1.replace(/\\right/g, "");
     return st1;
}
function makeTextCharBeautiful(st1) {
    st1 = st1.replace(/\\in/g, "∈");
    st1 = st1.replace(/ d t/g, ' \\dt');
    st1 = st1.replace(/ d x/g, ' \\dx');
    st1 = st1.replace(/☍/g, '/');
    st1 = st1.replace(/\\ sin /g, ' sin \\;');
    
    st1 = st1.replace(/ \\&/g, ' &');
    
    return st1;
}




 

function underbracecheck(input) {

    const regex = /\\underbrace{([^}]*{[^}]*}[^}]*)}({([^}]*{[^}]*}[^}]*)}+)/g;

      
     while (input.search(regex) >= 0) {
        input = input.replace(regex, function (input, one, two) {
            return "\\;{" + two + "}↙{" + one + "}";
            //return '\\;{' + b + '}}↙{' + a; // adding some space..
        });
    }

   // var re = /\\underset\s*{((?!\\underset{).*?)}{((?!\\underset{).*?)}/g;
    return input;
    
}

function fixbrackets(input){
    const leftbracket = RegExp("{","g");
    const rightbracket = RegExp("}","g");
    const lcount = input.match(leftbracket)?.length ?? 0;
    const rcount = input.match(rightbracket)?.length ?? 0;
     
    if(lcount == rcount){
        return input;
    }else{
        if(lcount > rcount && lcount-rcount > 1){
            input=input+"}".repeat(lcount-rcount-1);
            return input;
        }
    }
    return input;
}
function stackrelcheck(input) {
    const stackrelRegex = /\\stackrel\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/g;

    return input.replace(stackrelRegex, (match, a, b) => {
        return `{${b}}↖{${a}}`;
    });
}

function stackrelcheck_old(input){

     

    var re = /\\stackrel\s*{((?!&\\stackrel{).*?)}{((?!&\\{).*?)}/,
        bMatch = true;

    while (bMatch) {
        bMatch = false;
        input = input.replace(re, function (tot, a, b) {
            bMatch = true;
            if(!bracketsAreBalanced(a)){
                a = a + '}';
            }
            if(!bracketsAreBalanced(b)){
                b = b + '}';
            }
            return ' {' + b + '}↖{' + a + '}';  
        });
    }


  //Probaly not used below
    const regex0 = /\\stackrel({[^}]*{[^}]*}[^}]*}+)({[^}]*{[^}]*}[^}]*}+)/gm;      
    while (input.search(regex0) >= 0) {
       input = input.replace(regex0, function (input, one, two) {
           return "\\;{" + two + "}↖{" + one + "}";
       });
   }

    const regex = /\\stackrel{([^}]*{[^}]*}[^}]*)}({[^}]*{[^}]*}[^}]*}+)/gm;      
     while (input.search(regex) >= 0) {
        input = input.replace(regex, function (input, one, two) {
            return "\\;{" + two + "}↖{" + one + "}";
        });
    }
	const regex2 = /\\stackrel{([^}]*)}{([^}]*{[^}]*}[^}]*)}/gm;
     while (input.search(regex2) >= 0) {
        input = input.replace(regex2, function (input, one, two) {
            return "\\;{" + two + "}↖{" + one + "}";
            
        });
    }
	const regex3 = /\\stackrel{([^}]*)}{([^}]*)}/gm;
     while (input.search(regex3) >= 0) {
        input = input.replace(regex3, function (input, one, two) {
            return "\\;{" + two + "}↖{" + one + "}";
        });
    }
    return input;
}
function undersetcheck(input) {

    const regex0 = /\\underset({[^}]*{[^}]*}[^}]*}+)({[^}]*{[^}]*}[^}]*}+)/gm;      
    while (input.search(regex0) >= 0) {
       input = input.replace(regex0, function (input, one, two) {
           return "\\;{" + two + "}↙{" + one + "}";
       });
   }

    const regex = /\\underset{([^}]*{[^}]*}[^}]*)}({[^}]*{[^}]*}[^}]*}+)/gm;      
     while (input.search(regex) >= 0) {
        input = input.replace(regex, function (input, one, two) {
            return "\\;{" + two + "}↙{" + one + "}";
        });
    }
	
    const regex1 = /\\underset{([^}]*{[^}]*}[^}]*)}{([^}]*)}/gm;
     while (input.search(regex1) >= 0) {
        input = input.replace(regex1, function (input, one, two) {
            return "\\;{" + two + "}↙{" + one + "}";
        });
    }
	const regex2 = /\\underset{([^}]*)}{([^}]*{[^}]*}[^}]*)}/gm;
     while (input.search(regex2) >= 0) {
        input = input.replace(regex2, function (input, one, two) {
            return "\\;{" + two + "}↙{" + one + "}";
            //return '\\;{' + b + '}}↙{' + a; // adding some space..
        });
    }
	const regex3 = /\\underset{([^}]*)}{([^}]*)}/gm;
     while (input.search(regex3) >= 0) {
        input = input.replace(regex3, function (input, one, two) {
            return "\\;{" + two + "}↙{" + one + "}";
        });
    }
    return input;
    
}



function undersetcheck1(input){
    var re = /\\underset\s*{((?!\\underset{).*?)}{((?!\\underset{).*?)}/,
    bMatch = true;

while (bMatch) {
    bMatch = false;
    input = input.replace(re, function (tot, a, b) {
        bMatch = true;
        if(a.indexOf('\\underset') > 0){
            //console.log("a")
            a = a.replace(/\\underset/,'');
            return '\\underset{' + a + '}{' + b + '}';  
        }
        if(a.indexOf('\\underset') > 0){
           // console.log("b");
            
        }
        //console.log("[" + a + ", " + b + "]");
        //return '{' + a + '}/{' + b + '}';
        return '\\;{' + b + '}}↙{' + a ; // adding some space..
    });
}
return input;

     
}







 

function overrightarrow(input) {

    // \overlefttarrow{}
    while (input.search(/\\overleftarrow\{(((?![\{\}]).)*)\}/) >= 0) {
        input = input.replace(/\\overleftarrow\{(((?![\{\}]).)*)\}/g, "{$1}↖{←}");
    }

    while (input.search(/\\overleftarrow\{((?!{).*?\})\}/) >= 0) {
        input = input.replace(/\\overleftarrow\{((?!{).*?\})\}/g, "{$1}↖{←}");
    }
    // \overrightarrow{}
    while (input.search(/\\overrightarrow\{(((?![\{\}]).)*)\}/) >= 0) {
        input = input.replace(/\\overrightarrow\{(((?![\{\}]).)*)\}/g, "{$1}↖{→}");
    }

    while (input.search(/\\overrightarrow\{((?!{).*?\})\}/) >= 0) {
        input = input.replace(/\\overrightarrow\{((?!{).*?\})\}/g, "{$1}↖{→}");
    }

    // \vec{}
    while (input.search(/\\vec\{(((?![\{\}]).)*)\}/) >= 0) {
        input = input.replace(/\\vec\{(((?![\{\}]).)*)\}/g, "{$1}↖{→}");
    }

    while (input.search(/\\vec\{((?!{).*?)}\}/) >= 0) {
        input = input.replace(/\\vec\{((?!{).*?)}\}/g, "{$1}↖{→}");
    }

     // \vec{}
     while (input.search(/\\underline\{(((?![\{\}]).)*)\}/) >= 0) {
        input = input.replace(/\\underline\{(((?![\{\}]).)*)\}/g, "{$1}↙{‾}");
    }

    while (input.search(/\\underline\{((?!{).*?)}\}/) >= 0) {
        input = input.replace(/\\underline\{((?!{).*?)}\}/g, "{$1}↙{‾}");
    }


     


    return input;
}

function hatsymbol(input) {
    /*
    while (input.search(/\\widehat\{(((?![\{\}]).)*)\}/) >= 0) {
        input = input.replace(/\\widehat\{(((?![\{\}]).)*)\}/g, "{$1}↖{∧}");
    }
    while (input.search(/\\widehat\{((?!{).*?)}\}/) >= 0) {
        input = input.replace(/\\widehat\{((?!{).*?)}\}/g, "{$1}↖{∧}"); ‸ ̂   ^
    }
    */

    
    while (input.search(/\\hat\{((?!{).*?)\}/) >= 0) {
        input = input.replace(/\\hat\{((?!{).*?)\}/g, "{$1}↖{\\^}");
    }

    /*
    var wre = /\\hat\s*{((?!&\\hat{).*?)}\}/,
    wbMatch = true;

    while(wbMatch){
        wbMatch = false;
        input = input.replace(re, function (tot, a, b) {
            wbMatch = true; 
            if(!bracketsAreBalanced(a)){ 
                a = a + '}';
            }
            return  '\\;{' + a + '}↖{∧}';  
        });
    }

    var re = /\\hat\s*{((?!&\\hat{).*?)}\}/,
    bMatch = true;
    while(bMatch){
        bMatch = false;
        input = input.replace(re, function (tot, a, b) {
            bMatch = true;  
            if(!bracketsAreBalanced(a)){
                a = a + '}';
            }
            return  '\\;{' + a + '}↖{∧}'; // adding some space..
        });
    }
   */

    /*
    while (input.search(/\\hat\{(((?![\{\}]).)*)\}/) >= 0) {
        input = input.replace(/\\hat\{(((?![\{\}]).)*)\}/g, "{$1}↖{∧}");
    }
    while (input.search(/\\hat\{((?!{).*?)}\}/) >= 0) {
        input = input.replace(/\\hat\{((?!{).*?)}\}/g, "{$1}↖{∧}");
    } 
    */
    return input;
}

const bracketPairs = { '[':']', '{':'}', '(':')' }                              
const closingBrackets = new Set(Object.values(bracketPairs))                    
                                                                                
function bracketsAreBalanced(text) {                                            
    const open = [] // stack of (closing) brackets that need to be closed                       
    for (char of text) {                                                        
        if (closingBrackets.has(char)) {                                        
            if (char === open[open.length-1]) open.pop()                        
            else return false;                                                  
        }                                                                       
        if (char in bracketPairs) open.push(bracketPairs[char])                 
    }                                                                           
    return open.length === 0                                                    
}        
 


function square_box_symbol(input) {

    while (input.search(/\\square\[(((?![\{\}]).)*)\]\{(((?![\{\}]).)*)\}/) >= 0) {
        input = input.replace(/\\square\[(((?![\{\}]).)*)\]\{(((?![\{\}]).)*)\}/g, "$<span class='bordered'>$1$3</span>$");
    }

    while (input.search(/\\square\{(((?![\{\}]).)*)\}/) >= 0) {
        input = input.replace(/\\square\{(((?![\{\}]).)*)\}/g, "$<span class='bordered'>$1</span>$");
    }
    while (input.search(/\\square\((((?![\{\}]).)*)\)/) >= 0) {
        input = input.replace(/\\square\((((?![\{\}]).)*)\)/g, "$<span class='bordered'>$1</span>$");
    }
    return input;

}

function mathrm(input) {


    while (input.search(/&\\mathrm\[(((?![\{\}]).)*)\]\{(((?![\{\}]).)*)\}/) >= 0) {
        input = input.replace(/&\\mathrm\[(((?![\{\}]).)*)\]\{(((?![\{\}]).)*)\}/g, " ^{\\$1}{\\$3}");
    }
    while (input.search(/&\\mathrm\{(((?![\{\}]).)*)\}/) >= 0) {
        input = input.replace(/&\\mathrm\{(((?![\{\}]).)*)\}/g, " {\$1}");
    }


    while (input.search(/\\mathrm\[(((?![\{\}]).)*)\]\{(((?![\{\}]).)*)\}/) >= 0) {
        input = input.replace(/\\mathrm\[(((?![\{\}]).)*)\]\{(((?![\{\}]).)*)\}/g, " ^{\\$1}{\\$3}");
    }

    while (input.search(/\\mathrm\{(((?![\{\}]).)*)\}/) >= 0) {
        input = input.replace(/\\mathrm\{(((?![\{\}]).)*)\}/g, " {\\$1}");
    }

    return input;

}

function text_input(input) {
    while (input.search(/&\\text\{(((?![\{\}]).)*)\}/) >= 0) {
        input = input.replace(/&\\text\{(((?![\{\}]).)*)\}/g, "\\;\\text \"$1\"\\;");
    }

    while (input.search(/&\\text \{(((?![\{\}]).)*)\}/) >= 0) {
        input = input.replace(/&\\text \{(((?![\{\}]).)*)\}/g, "\\;\\text \"$1\"\\;");
    }


    while (input.search(/\\text\{(((?![\{\}]).)*)\}/) >= 0) {
        input = input.replace(/\\text\{(((?![\{\}]).)*)\}/g, "\\;\\text \"$1\"\\;");
    }

    while (input.search(/\\text \{(((?![\{\}]).)*)\}/) >= 0) {
        input = input.replace(/\\text \{(((?![\{\}]).)*)\}/g, "\\;\\text \"$1\"\\;");
    }
    return input;
}

 
function fractionextrachecks(input){
    input = input.replace(/\\sum/g, "Σ");
    return input;
}


function fraction(input) {

    var re = /\\frac\s*{((?!\\frac{).*?)}{((?!\\frac{).*?)}/,
        bMatch = true;

    while (bMatch) {
        bMatch = false;
        input = input.replace(re, function (tot, a, b) {
            bMatch = true;
            if (a.indexOf('\\frac') > 0) {
                //console.log("a")
                a = a.replace(/\\frac/, '');
                return '\\frac{' + a + '}/{' + b + '}';
            }
            if (a.indexOf('\\frac') > 0) {
                //console.log("b");

            }
            //console.log("[" + a + ", " + b + "]");
            //return '{' + a + '}/{' + b + '}';
            a=fractionextrachecks(a);
            b=fractionextrachecks(b);
            return '\\;{' + a + '}/{' + b + '}'; // adding some space..
        });
    }


    return input;
}

function fraction2(input) {

    var re = /&\\frac\s*{((?!&\\frac{).*?)}{((?!&\\frac{).*?)}/,
        bMatch = true;

    while (bMatch) {
        bMatch = false;
        input = input.replace(re, function (tot, a, b) {
            bMatch = true;
            if (a.indexOf('&\\frac') > 0) {
                //console.log("a")
                a = a.replace(/&\\frac/, '');
                return '\\frac{' + a + '}/{' + b + '}';
            }
            if (a.indexOf('&\\frac') > 0) {
                //console.log("b");

            }
            //console.log("[" + a + ", " + b + "]");
            //return '{' + a + '}/{' + b + '}';
            a=fractionextrachecks(a);
            b=fractionextrachecks(b);
            return '\\;{' + a + '}/{' + b + '}'; // adding some space..
        });
    }


    return input;
}
 
 


function matricscheck(input) {
    var matches = text.match(/\\left\(\\begin{array}{(.*?|)}(.*?|)\\end{array}\\right\)/g);
    if (matches && matches.length > 0) {
        matches.forEach(function (match) {
            //  var temp = match.substring(1, match.length - 1); // to remove dollars 
            var temp = match;
            temp = temp.replace(/\s/g, " "); // removing new lines from formula text..
            temp = performLatexOperations(temp);

            text = text.replace(match, temp);
        });
    }
    return text;

}


function preprocessmatrics(st1) {
    st1 = st1.replace(/ ;/g, '{; \\;}');
    st1 = st1.replace(/\\\\/g, ';');
    st1 = st1.replace(/ ,/g, '{, \\;}');
	st1 = st1.replace(/\&/g,',');
    // if any inside text is enclosed with |xxx| then we need to add {|xxx|}
   // st1 = st1.replace(/\|(\w+)\|/g, '\{\|$1\|\}');
   st1 = st1.replace(/\|([^|]+)\|/g, '\{\|$1\|\}');
    return st1;
}

function checkmulticolumn(input){
    const regex = /\& \\multicolumn\{([\d]*)\}\{[\|c\|]*\}/gm;

    while (input.search(regex) >= 0) {
        input = input.replace(regex, function (match,one) {
            return '</td><td colspan="'+one+'">'; 
        });

    }  
    return input;
}

function tabularcheck(input){
    const regex0 = /\\begin{tabular}{[c|l|r]{1,8}}((?:[^\$]|.)*)\\end{tabular}/gm;    
    
    while (input.search(regex0) >= 0) {
        input = input.replace(regex0, function (match,one) {
            one = one.replace(/\\hline/g, '<tr><td>'); 
            one = checkmulticolumn(one);
            one = one.replace(/\&/g, '</td><td>'); 
            one = one.replace(/\\\\/g, '</td></tr>'); 
            one = one.replace(/\r\n|\r|\n/g, '');
            return "<table class='table-bordered'>"+ one+ "</table>";
            
        });

    }  



    const regex1 = /\\begin{tabular}\{[\|c\|]*\}((?:[^\$]|.)*)\\end{tabular}/gm;    
    
    while (input.search(regex1) >= 0) {
        input = input.replace(regex1, function (match,one) {
            one = one.replace(/\\hline/g, '<tr><td>'); 
            one = checkmulticolumn(one);
            one = one.replace(/\\hline/g, '<tr><td>'); 
            one = one.replace(/\&/g, '</td><td>'); 
            one = one.replace(/\\\\/g, '</td></tr>'); 
            one = one.replace(/\r\n|\r|\n/g, '');
            return "<table class='table-bordered'>"+ one+ "</table>";
            
        });

    }  


    return input;
}

function substack_check(input){
    const regex0 = /\\substack{([^}]*)}/gm;    
    
    while (input.search(regex0) >= 0) {
        input = input.replace(regex0, function (match,one) {
          //  one = one.replace(/\\hline/g, '<tr><td>'); 
          //  one = one.replace(/\&/g, '</td><td>'); 
            var splits = one.split(/\\\\/g); 
            var output = '';
            for(i=0;i<splits.length;i++){
                if(i==0){
                    output += '{'+splits[i]+'}'
                }else{
                    output += '↙{'+splits[i]+'}'
                }
            }
            output = output.replace(/\r\n|\r|\n/g, '');
            return "{"+ output+ "}";
            
        });

    }  
    return input;
}

function matricescheck(input) { 

    const regex0 = /\\left(\\{?|[\||\[|\(|\{]?)\\begin{array}{[c|l|r]{1,8}}((?:[^\$\\right\\]|\\.)*)\\end{array}\\right(\\}?|[|\)|\]|\}\|]?)/gm;    
    
    while (input.search(regex0) >= 0) {
        input = input.replace(regex0, function (match,one,two,three) {
            //one = (one)?one.replace("{","\\{"):"";  
            return "{"+ one+'\\table ' + preprocessmatrics(two) + three+ "}";
            
        });

    }  



    const regex1 = /\\left(\\{?|[\||\[|\(|\{]?)\\begin{array}{[c|l|r]{1,8}}((?:[^\$\\]|\\.)*)\\end{array}\\right(\\}?|[|\)|\]|\}\|]?)/gm;    
    
    while (input.search(regex1) >= 0) {
        input = input.replace(regex1, function (match,one,two,three) {
            //one = (one)?one.replace("{","\\{"):"";  
            return "{"+ one+'\\table ' + preprocessmatrics(two) + three+ "}";
            
        });

    } 


    while (input.search(/\\left([\||\[|\{|\(])\\begin{array}{c+}{(.*?|)}(.*?|)\\end{array}\\right([\||\}|\]|\)]?)/gm) >= 0) {
        input = input.replace(/\\left([\||\[|\{|\(])\\begin{array}{c+}{(.*?|)}(.*?|)\\end{array}\\right([\||\}|\]|\)]?)/gm, function (match,one,two,three,four) {
            one = one.replace("{","\\{");
            if(four){
                four = four.replace("}","\\}");
                return  "{" + one+'\\table ' + preprocessmatrics(three) + four +"}";
            }else{
                return "{"+ one+'\\table ' + preprocessmatrics(three) + "}";
            }
        });

    }  

    while (input.search(/\\left([\||\[|\{|\(])\\begin{array}{c+}{(.*?|)}(.*?|)\\end{array}\\right([\||\}|\]|\)]?)/gm) >= 0) {
        input = input.replace(/\\left([\||\[|\{|\(])\\begin{array}{c+}{(.*?|)}(.*?|)\\end{array}\\right([\||\}|\]|\)]?)/gm, function (match,one,two,three,four) {
            one = one.replace("{","\\{");
            if(four){
                four = four.replace("}","\\}");
                return  "{" + one+'\\table ' + preprocessmatrics(three) + four +"}";
            }else{
                return "{"+ one+'\\table ' + preprocessmatrics(three) + "}";
            }
        });

    }  





    //input = checkOtherMatricsTypes(input);

    return input;
}





function preprocessOthermatrics(st1) {
    // st1 = st1.replace(/\\\\ &/g,' $<br>$ ');
    // st1 = st1.replace(/\\\\/g,' $<br>$ ');
	st1 = st1.replace(/\\\\/g, ';');
    st1 = st1.replace(/,/g, '{, \\;}');
	st1 = st1.replace(/\&/g,',');
    // if any inside text is enclosed with |xxx| then we need to add {|xxx|}
    //st1 = st1.replace(/\|(\w+)\|/g,'\{\|$1\|\}');
    return st1;
}
 

function removeothersglobal(st1) {
    st1 = st1.replace(/&=/gm, ' \\;\\; =');
    st1 = st1.replace(/=&/gm, '= \\;\\; ');
    st1 = st1.replace(/\\quad &/gm, ' \\;\\; ');
    st1 = st1.replace(/\\quad/gm, ' \\;\\; ');
    st1 = st1.replace(/\\qquad/gm, ' \\;\\;\\;\\; ');
    st1 = st1.replace(/& ≈/gm, ' \\;\\; ≈');
    st1 = st1.replace(/&:/gm, ' \\;\\; :');
    st1 = st1.replace(/-&/gm, ' \\;\\; -');
    st1 = st1.replace(/&-/gm, ' \\;\\; -');
    st1 = st1.replace(/ & & /gm, '\\;');
    st1 = st1.replace(/ & /gm, '\\;');
    //st1 = st1.replace(/&/gm,'\\;'); 
    st1 = st1.replace(/</gm, '< ');
    st1 = st1.replace(/< br>/gm, '<br>');

    //  st1 = st1.replace(/\\begin{gathered}/g, "$");
    //  st1 = st1.replace(/\\end{gathered}/g, "$<br>");

    return st1;
}









function performAscciOperations(st1) {
    st1 = st1.replace(/\\sptilde/g, "(∼)");
    st1 = st1.replace(/\\pounds/g, "£");
    st1 = st1.replace(/\\neg/g, "¬");
    st1 = st1.replace(/\\pm/g, "±");
    st1 = st1.replace(/\\times/g, "×");
    st1 = st1.replace(/\\div/g, "÷");
    st1 = st1.replace(/\\imath/g, "𝑖");
    st1 = st1.replace(/\\jmath/g, "𝑗");
    st1 = st1.replace(/\\kmath/g, "𝑘");
    st1 = st1.replace(/\\grave/g, "`");
    st1 = st1.replace(/\\acute/g, "´");
    //st1 = st1.replace(/\\hat/g, "ˆ");
    st1 = st1.replace(/\\tilde/g, "˜");
    //st1 = st1.replace(/\\bar/g, "¯");
    
    st1 = st1.replace(/\\hbar/g, "ħ");
    st1 = st1.replace(/\\bar/g, "\\ov");
    st1 = st1.replace(/\\breve/g, "˘");
    st1 = st1.replace(/\\dots/g, "...");
    st1 = st1.replace(/\\dot/g, "˙");
    st1 = st1.replace(/\\ddot/g, "¨");
	st1 = st1.replace(/\\checkmark/g, "✔");
    st1 = st1.replace(/\\check/g, "ˇ");
    st1 = st1.replace(/\\underbar/g, "x");
    //st1 = st1.replace(/\\underline/g, "x");
    st1 = st1.replace(/\\Gamma/g, "Γ");
    st1 = st1.replace(/\\Delta/g, "∆");
    st1 = st1.replace(/\\Theta/g, "Θ");
    st1 = st1.replace(/\\Lambda/g, "Λ");
    st1 = st1.replace(/\\Xi/g, "Ξ");
    st1 = st1.replace(/\\Pi/g, "Π");

    st1 = st1.replace(/\\Sigma/g, "Σ");
    st1 = st1.replace(/\\Upsilon/g, "Υ");
    st1 = st1.replace(/\\Phi/g, "Φ");
    st1 = st1.replace(/\\Psi/g, "Ψ");
    st1 = st1.replace(/\\Omega/g, "Ω");
    st1 = st1.replace(/\\alpha/g, "α");
    st1 = st1.replace(/\\beta/g, "β");
    st1 = st1.replace(/\\gamma/g, "γ");
    st1 = st1.replace(/\\delta/g, "δ");
    st1 = st1.replace(/\\triangleleft/g, "⊲");
    st1 = st1.replace(/\\triangleright/g, "⊳");

    st1 = st1.replace(/\\varepsilon/g, "ε");
    st1 = st1.replace(/\\zeta/g, "ζ");
    st1 = st1.replace(/\\eta/g, "η");
    st1 = st1.replace(/\\theta/g, "θ");
    st1 = st1.replace(/\\iota/g, "ι");
    st1 = st1.replace(/\\kappa/g, "κ");
    st1 = st1.replace(/\\lambda/g, "λ");
    st1 = st1.replace(/\\mu/g, "µ");
    st1 = st1.replace(/\\nu/g, "ν");
    st1 = st1.replace(/\\xi/g, "ξ");
    st1 = st1.replace(/\\pi/g, "π");
    st1 = st1.replace(/\\rho/g, "ρ");
    st1 = st1.replace(/\\varsigma/g, "ς");
    st1 = st1.replace(/\\sigma/g, "σ");
    st1 = st1.replace(/\\tau/g, "τ");
    st1 = st1.replace(/\\upsilon/g, "υ");
    st1 = st1.replace(/\\varphi/g, "ϕ");
    st1 = st1.replace(/\\chi/g, "χ");
    st1 = st1.replace(/\\psi/g, "ψ");
    st1 = st1.replace(/\\omega/g, "ω");
    st1 = st1.replace(/\\vartheta/g, "ϑ");
    st1 = st1.replace(/\\phi/g, "φ");
    st1 = st1.replace(/\\dagger/g, "†");
    st1 = st1.replace(/\\ddagger/g, "‡");
    st1 = st1.replace(/\\ldots/g, ". . .");

    st1 = st1.replace(/\\prime/g, "'");
    st1 = st1.replace(/\\tcohm/g, "(Ω)");
    st1 = st1.replace(/\\mathcal{B}/g, "ℬ");
    st1 = st1.replace(/\\mathcal{E}/g, "ℰ");
    st1 = st1.replace(/\\mathcal{F}/g, "ℱ");
    st1 = st1.replace(/\\mathcal{M}/g, "ℳ");
    st1 = st1.replace(/\\aleph/g, "ℵ");
    st1 = st1.replace(/\\leftarrow/g, "←");
    st1 = st1.replace(/\\uparrow/g, "↑");
    
    st1 = st1.replace(/\\nearrow/g, "↗");
    st1 = st1.replace(/\\searrow/g, "↘");
    st1 = st1.replace(/\\swarrow/g, "↙");
    st1 = st1.replace(/\\mapsto/g, "↦");
    st1 = st1.replace(/\\hookleftarrow/g, "↩");
    st1 = st1.replace(/\\hookrightarrow/g, "↪");
    st1 = st1.replace(/\\leftharpoonup/g, "↼");
    st1 = st1.replace(/\\leftharpoondown/g, "↽");
    st1 = st1.replace(/\\rightharpoonup/g, "⇀");
    st1 = st1.replace(/\\rightharpoondown/g, "⇁");
    st1 = st1.replace(/\\rightleftharpoons/g, "⇌");
    st1 = st1.replace(/\\Leftarrow/g, "⇐");
    st1 = st1.replace(/\\Uparrow/g, "⇑");
    st1 = st1.replace(/\\mathcal{H}/g, "ℋ");
    st1 = st1.replace(/\\mathcal{I}/g, "ℐ");
    st1 = st1.replace(/\\Im/g, "ℑ");
    st1 = st1.replace(/\\mathcal{L}/g, "ℒ");
    st1 = st1.replace(/\\ell/g, "ℓ");
    st1 = st1.replace(/\\mathcal{R}/g, "ℛ");
    st1 = st1.replace(/\\Re/g, "ℜ");
    st1 = st1.replace(/\\tcohm/g, "Ω");
    st1 = st1.replace(/\\Angstroem/g, "Å");
    st1 = st1.replace(/\\AA/g, "Å");
    st1 = st1.replace(/\\mathcal{B}/g, "ℬ");
    st1 = st1.replace(/\\mathcal{E}/g, "ℰ");
    st1 = st1.replace(/\\mathcal{F}/g, "ℱ");
    st1 = st1.replace(/\\hline/g, "───");
    st1 = st1.replace(/&\\Rightarrow/g, "⇒");
    st1 = st1.replace(/&\\Downarrow/g, "⇓");
    st1 = st1.replace(/&\\Leftrightarrow/g, "⇔");
    st1 = st1.replace(/&\\Updownarrow/g, "⇕");

	st1 = st1.replace(/\\leftrightharpoons/g, "⇋");
	st1 = st1.replace(/\\rightleftharpoons/g, "⇌");
	
	st1 = st1.replace(/\\leftrightarrows/g, "⇆");
	st1 = st1.replace(/\\rightleftarrows/g, "⇄");

    st1 = st1.replace(/\\Rightarrow/g, "⇒");
    st1 = st1.replace(/\\Downarrow/g, "⇓");
    st1 = st1.replace(/\\Leftrightarrow/g, "⇔");
    st1 = st1.replace(/\\Updownarrow/g, "⇕");

    st1 = st1.replace(/\\rightarrow/g, "→");
    st1 = st1.replace(/\\downarrow/g, "↓");
    st1 = st1.replace(/\\leftrightarrow/g, "↔");
    st1 = st1.replace(/\\updownarrow/g, "↕");

    st1 = st1.replace(/\\forall/g, "∀");
    st1 = st1.replace(/\\partialup/g, "∂");
    st1 = st1.replace(/\\exists/g, "∃");
    st1 = st1.replace(/\\nabla/g, "∇");
    st1 = st1.replace(/\\notin/g, "∉");
    st1 = st1.replace(/\\ni/g, "∋");
    st1 = st1.replace(/\\prod/g, "∏");
    st1 = st1.replace(/\\coprod/g, "∐");

    st1 = st1.replace(/\\lfloor/g, "⌊");
    st1 = st1.replace(/\\rfloor/g, "⌋");

    st1 = st1.replace(/\\lceil /g, "⌊");
    st1 = st1.replace(/\\rceil/g, "⌋");

    //st1 = st1.replace(/\\sum/g, "∑");
    st1 = st1.replace(/\\mp/g, "∓");
    st1 = st1.replace(/\\slash/g, "∕");
    st1 = st1.replace(/\\ast/g, "∗");
    st1 = st1.replace(/\\circ/g, "∘");
    st1 = st1.replace(/\\bullet/g, "∙");
    st1 = st1.replace(/\\sqrt[3]/g, "∛");
    st1 = st1.replace(/\\sqrt[4]/g, "∜");

    st1 = st1.replace(/\\propto/g, "∝");
    st1 = st1.replace(/\\infty/g, "∞");
    st1 = st1.replace(/\\angle/g, "∠");
    st1 = st1.replace(/\\mid/g, "∣");
    st1 = st1.replace(/\\parallel/g, "∥");
    st1 = st1.replace(/\\wedge/g, "∧");
    st1 = st1.replace(/\\vee/g, "∨");
    st1 = st1.replace(/\\cap/g, "∩");
    st1 = st1.replace(/\\cup/g, "∪");
    st1 = st1.replace(/\\oint/g, "∮");
    st1 = st1.replace(/\\Proportion/g, "∷");
    st1 = st1.replace(/\\eqcolon/g, "∹");
    st1 = st1.replace(/\\simeq/g, "≃");
    st1 = st1.replace(/\\sim/g, "∼");

    st1 = st1.replace(/\\cong/g, "≅");
    st1 = st1.replace(/\\approx/g, "≈");
    st1 = st1.replace(/\\asymp/g, "≍");
    st1 = st1.replace(/\\doteq/g, "≐");
    st1 = st1.replace(/\\coloneq/g, "≔");
    st1 = st1.replace(/\\eqcolon/g, "≕");
    st1 = st1.replace(/\\neq/g, "≠");
    st1 = st1.replace(/\\equiv/g, "≡");

    st1 = st1.replace(/\\leqslant/g, "≤");
    st1 = st1.replace(/\\geqslant/g, "≥");


    st1 = st1.replace(/\& \\leq/g, "≤");
    st1 = st1.replace(/\& \\geq/g, "≥");

    st1 = st1.replace(/\\leq/g, "≤");
    st1 = st1.replace(/\\geq/g, "≥");
    st1 = st1.replace(/\\ll/g, "≪");
    st1 = st1.replace(/\\gg/g, "≫");
    st1 = st1.replace(/\\prec/g, "≺");
    st1 = st1.replace(/\\succ/g, "≻");
    st1 = st1.replace(/\\sqsubseteq/g, "⊑");
    st1 = st1.replace(/\\sqsupseteq/g, "⊒");
    st1 = st1.replace(/\\subseteq/g, "⊆");
    st1 = st1.replace(/\\supseteq/g, "⊇");
    st1 = st1.replace(/\\uplus/g, "⊎");

    st1 = st1.replace(/\\subset/g, "⊂");
    st1 = st1.replace(/\\supset/g, "⊃");
    st1 = st1.replace(/\\sqcap/g, "⊓");
    st1 = st1.replace(/\\sqcup/g, "⊔");
    st1 = st1.replace(/\\oplus/g, "⊕");
    st1 = st1.replace(/\\ominus/g, "⊖");
    st1 = st1.replace(/\\otimes/g, "⊗");
    st1 = st1.replace(/\\oslash/g, "⊘");
    st1 = st1.replace(/\\odot/g, "⊙");
    st1 = st1.replace(/\\vdash/g, "⊢");
    st1 = st1.replace(/\\top/g, "⊤");
    st1 = st1.replace(/\\bot/g, "⊥");
    st1 = st1.replace(/\\models/g, "⊧");
    st1 = st1.replace(/\\bigwedge/g, "⋀");
    st1 = st1.replace(/\\bigvee/g, "⋁");
    st1 = st1.replace(/\\bigcap/g, "⋂");
    st1 = st1.replace(/\\bigcup/g, "⋃");
    st1 = st1.replace(/\\cdots/g, "⋯");
    st1 = st1.replace(/\\cdot/g, "⋅");
    st1 = st1.replace(/\\diamond/g, "⋄");
    st1 = st1.replace(/\\star/g, "⋆");
    st1 = st1.replace(/\\bowtie/g, "⋈");
    st1 = st1.replace(/\\vdots/g, "⋮");

    st1 = st1.replace(/\\ddots/g, "⋱");
    st1 = st1.replace(/\\lceil/g, "⌈");
    st1 = st1.replace(/\\rceil/g, "⌉");
    st1 = st1.replace(/\\lﬂoor/g, "⌊");
    st1 = st1.replace(/\\rﬂoor/g, "⌋");
    st1 = st1.replace(/\\frown/g, "⌢");
    st1 = st1.replace(/\\smile/g, "⌣");
    st1 = st1.replace(/\\varnothing/g, "∅");
    return st1;
}


function replaceSpecialChars(st1) {
    st1 = st1.replace(/\\triangle/g, "△");
    st1 = st1.replace(/\\overbrace/g, "⏞");
    st1 = st1.replace(/\\underbrace/g, "⏟");
    st1 = st1.replace(/\\bigtriangleup/g, "△");
    st1 = st1.replace(/\\smalltriangleright/g, "▹");
    st1 = st1.replace(/\\bigtriangledown/g, "▽");
    st1 = st1.replace(/\\smalltriangleleft/g, "◃");
    st1 = st1.replace(/\\spadesuit/g, "♠");
    st1 = st1.replace(/\\heartsuit/g, "♡");
    st1 = st1.replace(/\\diamondsuit/g, "♢");
    st1 = st1.replace(/\\clubsuit/g, "♣");
    st1 = st1.replace(/\\ﬂat/g, "♭");
    st1 = st1.replace(/\\natural/g, "♮");
    st1 = st1.replace(/\\sharp/g, "♯");
    st1 = st1.replace(/\\perp/g, "⟂");
    st1 = st1.replace(/\\langle/g, "⟨");
    st1 = st1.replace(/\\rangle/g, "⟩");
    st1 = st1.replace(/\\lgroup/g, "⟮");
    st1 = st1.replace(/\\rgroup/g, "⟯");
    st1 = st1.replace(/\\rightleftarrows/g, "⇄");
    st1 = st1.replace(/\\longleftarrow/g, "←");
    st1 = st1.replace(/\\longrightarrow/g, "→");
    st1 = st1.replace(/\\longleftrightarrow/g, "⟷");
    st1 = st1.replace(/\\Longleftarrow/g, "⟸");
    st1 = st1.replace(/\\Longrightarrow/g, "⟹");
    st1 = st1.replace(/\\Longleftrightarrow/g, "⟺");
    st1 = st1.replace(/\\longmapsto/g, "⟼");
    st1 = st1.replace(/\\setminus/g, "⧵");
    st1 = st1.replace(/\\bigodot/g, "⧵⨀");
    st1 = st1.replace(/\\bigoplus/g, "⨁");
    st1 = st1.replace(/\\bigotimes/g, "⨂");
    st1 = st1.replace(/\\biguplus/g, "⨄");
    st1 = st1.replace(/\\bigsqcup/g, "⨆");
    st1 = st1.replace(/\\amalg/g, "⨿");
    st1 = st1.replace(/\\Coloneqq/g, "⩴");
    st1 = st1.replace(/\\Equal/g, "⩵");
    st1 = st1.replace(/\\Same/g, "⩶");
    st1 = st1.replace(/\\preceq/g, "⪯");
    st1 = st1.replace(/\\succeq/g, "⪰");
    

	
    st1 = st1.replace(/\\mathbb{C}/g, "C");
    st1 = st1.replace(/\\mathbb{H}/g, "ℍ");
    st1 = st1.replace(/\\mathbb{N}/g, "ℕ");
    st1 = st1.replace(/\\mathbb{P}/g, "ℙ");
    st1 = st1.replace(/\\mathbb{Q}/g, "ℚ");
    st1 = st1.replace(/\\mathbb{R}/g, "ℝ");
    st1 = st1.replace(/\\mathbb{Z}/g, "ℤ");
    //st1 = st1.replace(/\\mathbf/g, "\\bo ");
    st1 = st1.replace(/\\mathbf/g, "");
    st1 = st1.replace(/\\boldsymbol/g, "");
    /*
    st1 = st1.replace(/\\mathbf{a}/g, "\\bo a");
    st1 = st1.replace(/\\mathbf{b}/g, "\\bo b");
    st1 = st1.replace(/\\mathbf{c}/g, "\\bo c");
    st1 = st1.replace(/\\mathbf{i}/g, "\\bo i");
    st1 = st1.replace(/\\mathbf{j}/g, "\\bo j");
    st1 = st1.replace(/\\mathbf{k}/g, "\\bo k");
    st1 = st1.replace(/\\mathbf{x}/g, "\\bo x");
    st1 = st1.replace(/\\mathbf{y}/g, "\\bo y");
    st1 = st1.replace(/\\mathbf{z}/g, "\\bo z");

    st1 = st1.replace(/\\mathbf{\Gamma}/g, "Γ");
    st1 = st1.replace(/\\mathbf{\Delta}/g, "∆");
    st1 = st1.replace(/\\mathbf{\Theta}/g, "Θ");
    st1 = st1.replace(/\\mathbf{\Lambda}/g, "Λ");
    st1 = st1.replace(/\\mathbf{\Xi}/g, "Ξ");
    st1 = st1.replace(/\\mathbf{\Pi}/g, "Π");
    st1 = st1.replace(/\\mathbf{\Sigma}/g, "Σ");
    st1 = st1.replace(/\\mathbf{\Upsilon}/g, "Υ");
    st1 = st1.replace(/\\mathbf{\Phi}/g, "Φ");
    st1 = st1.replace(/\\mathbf{\Psi}/g, "Ψ");
    st1 = st1.replace(/\\mathbf{\Omega}/g, "Ω");
   */

    st1 = st1.replace(/\\Gamma/g, "Γ");
    st1 = st1.replace(/\\Delta/g, "∆");
    st1 = st1.replace(/\\Theta/g, "Θ");
    st1 = st1.replace(/\\Lambda/g, "Λ");
    st1 = st1.replace(/\\Xi/g, "Ξ");
    st1 = st1.replace(/\\Pi/g, "Π");
    st1 = st1.replace(/\\Sigma/g, "Σ");
    st1 = st1.replace(/\\Upsilon/g, "Υ");
    st1 = st1.replace(/\\Phi/g, "Φ");
    st1 = st1.replace(/\\Psi/g, "Ψ");
    st1 = st1.replace(/\\Omega/g, "Ω");
    st1 = st1.replace(/\\alpha/g, "α");
    st1 = st1.replace(/\\beta/g, "β");
    st1 = st1.replace(/\\gamma/g, "γ");
    st1 = st1.replace(/\\delta/g, "δ");
    st1 = st1.replace(/\\varepsilon/g, "ε");
    st1 = st1.replace(/\\zeta/g, "ζ");
    st1 = st1.replace(/\\eta/g, "η");
    st1 = st1.replace(/\\theta/g, "θ");
    st1 = st1.replace(/\\iota/g, "ι");
    st1 = st1.replace(/\\kappa/g, "κ");
    st1 = st1.replace(/\\lambda/g, "λ");
    st1 = st1.replace(/\\mu/g, "µ");
    st1 = st1.replace(/\\nu/g, "ν");
    st1 = st1.replace(/\\xi/g, "ξ");
    st1 = st1.replace(/\\pi/g, "π");
    st1 = st1.replace(/\\rho/g, "ρ");
    st1 = st1.replace(/\\varsigma/g, "ς");
    st1 = st1.replace(/\\sigma/g, "σ");
    st1 = st1.replace(/\\tau/g, "τ");
    st1 = st1.replace(/\\upsilon/g, "υ");
    st1 = st1.replace(/\\varphi/g, "ϕ");
    st1 = st1.replace(/\\chi/g, "χ");
    st1 = st1.replace(/\\psi/g, "ψ");
    st1 = st1.replace(/\\omega/g, "ω");
    st1 = st1.replace(/\\partial/g, "∂");
    st1 = st1.replace(/\\epsilon/g, "E");
    st1 = st1.replace(/\\vartheta/g, "ϑ");
    st1 = st1.replace(/\\phi/g, "φ");
    st1 = st1.replace(/\\varrho/g, "1");
    st1 = st1.replace(/\\because/g, " ∵ ");
    st1 = st1.replace(/&\\therefore/g, " ∴ ");
    st1 = st1.replace(/\\therefore/g, " ∴ ");
    st1 = st1.replace(/\\backslash/g, " \\\\ ");
    return st1;
}