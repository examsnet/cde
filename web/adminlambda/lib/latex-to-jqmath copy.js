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
    st1 = mathrm(st1);  
    st1 = stackrelcheck(st1);
    st1 = substack_check(st1);
    
    st1 = undersetcheck(st1);
    //st1 = undersetcheck1(st1);
    st1 = matricescheck(st1);
    console.log(st1);
    st1 = cleanbrackets(st1);
   
    st1 = square_root_new(st1);

     //before fraction clean all forward slash with \/
    st1 = st1.replace(/\//g, '\\/');    
    //st1 = fraction2(st1); // some time & operation is annoying.
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
    // Case 1: \int_{a}^{b} OR \int^{b}_{a}
    input = input.replace(/\\int(?:_\{([^}]*)\}\^\{([^}]*)\}|\^\{([^}]*)\}_\{([^}]*)\})/g, (match, a1, b1, b2, a2) => {
        const lower = a1 || a2;
        const upper = b1 || b2;
        return `∫↙{${lower}}↖{${upper}}`;
    });

    // Case 2: \int_a^b OR \int^b_a
    input = input.replace(/\\int(?:_([^{}\s]+)\^([^{}\s]+)|\^([^{}\s]+)_([^{}\s]+))/g, (match, a1, b1, b2, a2) => {
        const lower = a1 || a2;
        const upper = b1 || b2;
        return `∫↙{${lower}}↖{${upper}}`;
    });

    // Fallback cases: single-sided or malformed integrals
    input = input.replace(/\\int_([^\s^]+)/g, "∫↙{$1}");
    input = input.replace(/\\int\^([^\s_]+)/g, "∫↖{$1}");

    // Plain integral
    input = input.replace(/\\int/g, "∫");

    return input;
}







 



function summationcheck_new(input) {
    // Case: \sum_{a}^{b}
    input = input.replace(/\\sum\s*_\{([^{}]+)\}\s*\^\{([^{}]+)\}/g, "∑↙{$1}↖{$2}");

    // Case: \sum^{b}_{a}
    input = input.replace(/\\sum\s*\^\{([^{}]+)\}\s*_\{([^{}]+)\}/g, "∑↙{$2}↖{$1}");

    // Case: \sum_{a}^b
    input = input.replace(/\\sum\s*_\{([^{}]+)\}\s*\^([^\s{]+)/g, "∑↙{$1}↖{$2}");

    // Case: \sum^b_{a}
    input = input.replace(/\\sum\s*\^([^\s{]+)\s*_\{([^{}]+)\}/g, "∑↙{$2}↖{$1}");

    // Case: \sum_a^b
    input = input.replace(/\\sum\s*_([^{}\s]+)\s*\^([^{}\s]+)/g, "∑↙{$1}↖{$2}");

    // Case: \sum^b_a
    input = input.replace(/\\sum\s*\^([^{}\s]+)\s*_([^{}\s]+)/g, "∑↙{$2}↖{$1}");

    // Fallback: just replace \sum_ or \sum
    input = input.replace(/\\sum_/g, "∑↙");
    input = input.replace(/\\sum/g, "∑");

    return input;
}



 function summationcheck_Symbol(input) {
    const regexes = [
        /Σ_(\{.*?\})\^(\{.*?\})/g, // Σ_{a}^{b}
        /Σ\^(\{.*?\})_(\{.*?\})/g, // Σ^{b}_{a}
        /Σ_(.*?)\^(\{.*?\})/g,     // Σ_a^{b}
        /Σ\^(.*?)_(\{.*?\})/g,     // Σ^b_{a}
        /Σ_(\{.*?\})\^([^\s\{\}]+)/g, // Σ_{a}^b
        /Σ\^(\{.*?\})_([^\s\{\}]+)/g, // Σ^{b}_a
        /Σ_(.*?)\^([^\s\{\}]+)/g,     // Σ_a^b
        /Σ\^(.*?)_(.*?)/g             // Σ^b_a
    ];

    for (const regex of regexes) {
        input = input.replace(regex, (match, lower, upper) => {
            return `Σ↙{${lower.replace(/[{}]/g, "")}}↖{${upper.replace(/[{}]/g, "")}}`;
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
 function fixBrackets(input) {
    const leftBrackets = (input.match(/{/g) || []).length;
    const rightBrackets = (input.match(/}/g) || []).length;

    if (leftBrackets === rightBrackets) {
        return input;  // balanced
    } else if (leftBrackets > rightBrackets) {
        // Append missing closing brackets
        const missing = leftBrackets - rightBrackets;
        return input + '}'.repeat(missing);
    } else {
        // More right brackets than left, optionally handle this if needed
        // For now, just return input as is.
        return input;
    }
}

function stackrelcheck(input) {
    const stackrelRegex = /\\stackrel\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/g;

    return input.replace(stackrelRegex, (match, a, b) => {
        return `{${b}}↖{${a}}`;
    });
}
  function undersetcheck(input) {
    // Step 1: Normalize any malformed or nested \underset inside the first argument
    const fixNestedUnderset = /\\underset\s*{((?!\\underset{).*?)}{((?!\\underset{).*?)}/;
    let nestedFixMatch = true;
    while (nestedFixMatch) {
        nestedFixMatch = false;
        input = input.replace(fixNestedUnderset, (match, a, b) => {
            nestedFixMatch = true;
            if (a.includes('\\underset')) {
                a = a.replace(/\\underset/, '');
                return '\\underset{' + a + '}{' + b + '}';
            }
            return '\\;{' + b + '}↙{' + a + '}';
        });
    }

    // Step 2: Handle various patterns of \underset from complex to simple
    const regexes = [
        /\\underset({[^}]*{[^}]*}[^}]*}+)\s*({[^}]*{[^}]*}[^}]*}+)/gm,
        /\\underset{([^}]*{[^}]*}[^}]*)}\s*({[^}]*{[^}]*}[^}]*}+)/gm,
        /\\underset{([^}]*{[^}]*}[^}]*)}{([^}]*)}/gm,
        /\\underset{([^}]*)}{([^}]*{[^}]*}[^}]*)}/gm,
        /\\underset{([^}]*)}{([^}]*)}/gm
    ];

    for (const re of regexes) {
        while (input.search(re) >= 0) {
            input = input.replace(re, (match, one, two) => {
                return `\\;{${two}}↙{${one}}`;
            });
        }
    }

    return input;
} 

 function overrightarrow(input) {
    // \overleftarrow{}
    input = input.replace(/\\overleftarrow\{(.*?)\}/g, "{$1}↖{←}");

    // \overrightarrow{}
    input = input.replace(/\\overrightarrow\{(.*?)\}/g, "{$1}↖{→}");

    // \vec{}
    input = input.replace(/\\vec\{(.*?)\}/g, "{$1}↖{→}");

    // \underline{}
    input = input.replace(/\\underline\{(.*?)\}/g, "{$1}↙{‾}");

    return input;
}


 function hatsymbol(input) {
    // Handle \widehat{...}
    input = input.replace(/\\widehat\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/g, (match, content) => {
        return `{${content}}↖{∧}`;
    });

    // Handle \hat{...}
    input = input.replace(/\\hat\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/g, (match, content) => {
        return `{${content}}↖{∧}`;
    });

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
    // \square[...] {...} - two arguments: optional [] then {}
    input = input.replace(/\\square\[(.*?)\]\{(.*?)\}/g, (_, opt, content) => {
        return `<span class='bordered'>${opt}${content}</span>`;
    });

    // \square{...} - single argument in {}
    input = input.replace(/\\square\{(.*?)\}/g, (_, content) => {
        return `<span class='bordered'>${content}</span>`;
    });

    // \square(...) - single argument in ()
    input = input.replace(/\\square\((.*?)\)/g, (_, content) => {
        return `<span class='bordered'>${content}</span>`;
    });

    return input;
}
function mathrm(input) {
    // &\mathrm[...] {...}
    input = input.replace(/&\\mathrm\[(.*?)\]\{(.*?)\}/g, (_, opt, content) => {
        return `^{\\${opt}}{\\${content}}`;
    });

    // &\mathrm{...}
    input = input.replace(/&\\mathrm\{(.*?)\}/g, (_, content) => {
        return ` {${content}}`;
    });

    // \mathrm[...] {...}
    input = input.replace(/\\mathrm\[(.*?)\]\{(.*?)\}/g, (_, opt, content) => {
        return `^{\\${opt}}{\\${content}}`;
    });

    // \mathrm{...}
    input = input.replace(/\\mathrm\{(.*?)\}/g, (_, content) => {
        return ` {\\${content}}`;
    });

    return input;
}

function text_input(input) {
    // Match \text{...} with optional leading &
    const regex = /&?\\text\s*\{([^{}]*)\}/g;

    // Wrap with \; spacing and convert to \text "..." with quotes for JQMath
    return input.replace(regex, (_, content) => {
        // Return \text "content" with quotes, and optional \; spacing if needed
        return `\\;\\text "${content}"\\;`;
    });
}



function text_input_old(input) {
    // regex to match \text{...} or &\text{...} with optional space after \text
    const regex = /&?\\text\s*\{([^{}]*)\}/g;

    // replace all matches with \;\text "content"\;
    return input.replace(regex, (_, content) => {
        return `\\;\\text "${content}"\\;`;
    });
}

 
function fractionextrachecks(input){
    input = input.replace(/\\sum/g, "Σ");
    return input;
}
 
function fraction(input) {
    const patterns = [
        /\\frac\s*{((?!\\frac{).*?)}{((?!\\frac{).*?)}/,
        /&\\frac\s*{((?!&\\frac{).*?)}{((?!&\\frac{).*?)}/
    ];

    let foundMatch = true;
    while (foundMatch) {
        foundMatch = false;
        for (const re of patterns) {
            input = input.replace(re, (match, a, b) => {
                foundMatch = true;

                // Clean recursive nested \frac
                if (a.includes('\\frac')) {
                    a = a.replace(/\\frac/, '');
                    return `\\frac{${a}}/{${b}}`;
                }

                if (a.includes('&\\frac')) {
                    a = a.replace(/&\\frac/, '');
                    return `\\frac{${a}}/{${b}}`;
                }

                // Run extra checks if defined
                if (typeof fractionextrachecks === 'function') {
                    a = fractionextrachecks(a);
                    b = fractionextrachecks(b);
                }

                return `\\;{${a}}/{${b}}`;
            });
        }
    }

    return input;
}




function checkmulticolumn(input) {
    const regex = /&\\multicolumn\{(\d+)\}\{[\|c\|]*\}/g;

    return input.replace(regex, function(match, colspan) {
        return `</td><td colspan="${colspan}">`;
    });
}
 function tabularcheck(input) {
    // Regex to match \begin{tabular}{column_spec} ... \end{tabular}
    const regex = /\\begin\{tabular\}\{([clrp|]+)\}([\s\S]*?)\\end\{tabular\}/g;

    return input.replace(regex, function(match, colSpec, tableContent) {
        // Replace \hline with a <tr> separator or a styled <tr> for horizontal line
        // For simplicity, we replace \hline with a horizontal line row <tr><td colspan="N" style="border-top:1px solid #000;"></td></tr>
        const colCount = colSpec.replace(/\|/g, '').length; // count columns ignoring pipe |

        tableContent = tableContent
            .replace(/\\hline/g, `<tr><td colspan="${colCount}" style="border-top:1px solid #000;"></td></tr>`)
            .replace(/&/g, '</td><td>')    // cells separator
            .replace(/\\\\/g, '</td></tr><tr><td>')  // end of row + start of new row
            .trim();

        // Sometimes there might be trailing <tr><td> after replacement - fix it
        if (!tableContent.startsWith('<tr>')) {
            tableContent = '<tr><td>' + tableContent;
        }
        if (!tableContent.endsWith('</td></tr>')) {
            tableContent = tableContent + '</td></tr>';
        }

        // Fix multicolumn inside the table content
        tableContent = checkmulticolumn(tableContent);

        return `<table class="table-bordered">${tableContent}</table>`;
    });
}
function substack_check(input) {
    const regex = /\\substack{([^}]*)}/gm;

    while (input.search(regex) >= 0) {
        input = input.replace(regex, function(match, content) {
            const splits = content.split(/\\\\/g);
            let output = '';

            for (let i = 0; i < splits.length; i++) {
                const line = splits[i].trim();
                if (i === 0) {
                    output += `{${line}}`;
                } else {
                    output += `↙{${line}}`;
                }
            }

            output = output.replace(/\r\n|\r|\n/g, '');
            return `{${output}}`;
        });
    }

    return input;
}

 
function matricescheck(input) { 
    // Regex to match \left<delimiter>\begin{array}{column_spec} ... \end{array}\right<delimiter>
    const matrixRegex = /\\left(\.?|\\?[\{\[\(\|])\\begin{array}{([clr|]+)}([\s\S]*?)\\end{array}\\right(\\?[\}\]\)\|])/gm;

    while (input.search(matrixRegex) >= 0) {
        input = input.replace(matrixRegex, function(match, leftDelim, colSpec, arrayContent, rightDelim) {
            // Remove dot delimiter completely (e.g. \left.)
            if (leftDelim === '.') {
                leftDelim = '';
            } else if (leftDelim) {
                // Escape braces only if unescaped
                leftDelim = leftDelim.replace(/(?<!\\)\{/g, '\\{').replace(/(?<!\\)\}/g, '\\}');
            }

            // For rightDelim, escape braces only if not already escaped
            if (rightDelim) {
                if (!(/\\[\}\{]/.test(rightDelim))) {
                    rightDelim = rightDelim.replace(/(?<!\\)\{/g, '\\{').replace(/(?<!\\)\}/g, '\\}');
                }
            }

            // Process the content inside the array
            let processed = preprocessmatrics(arrayContent);

            // Remove trailing double backslash (\\) before right delimiter if present
            processed = processed.replace(/\\\\\s*$/, '');

            // Compose final output wrapped with \table and delimiters
            return `{${leftDelim}\\table ${processed}${rightDelim}}`;
        });
    }

    // If you have other matrix types, call their checkers here
    // input = checkOtherMatricsTypes(input);

    return input;
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


function preprocessOthermatrics(st1) {
    // Replace LaTeX array line breaks with semicolons (row separators)
    st1 = st1.replace(/\\\\/g, ';');

    // Replace commas with '{, \;}' (comma plus a small space)
    st1 = st1.replace(/,/g, '{, \\;}');

    // Replace LaTeX array column separators (&) with commas
    st1 = st1.replace(/\&/g, ',');

    // Optionally wrap text inside pipes with curly braces to preserve formatting
    st1 = st1.replace(/\|([^|]+)\|/g, '{|$1|}');

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






 