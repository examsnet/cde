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
    st1 = st1.replace(/↫/g, '\n'); // putback newlines. 

    st1 = getDollarsText(st1);

    st1 = checkIncaseIfDollorsMissing(st1);
    st1 = tabularcheck(st1);
    st1 = st1.replace(/\n <br> \n/g, '<br>');
    st1 = st1.replace(/\r\n|\r|\n/g, '<br>');
    st1 = makeTextCharBeautiful(st1);


    //Special handling for \text in arrays or tables only
    st1 = st1.replace(/\$ (?:\\;){4} \$/g, "$ \\_\\_\\_\\_ $");
    st1 = st1.replace(/\\begin\{aligned\}|\\end\{aligned\}|\\begin\{array\}\{l+\}|\\end\{array\}/g, "");
    st1 = st1.replace(/\\begin\{aligned\}|\\end\{aligned\}/g, "");

    st1 = fixUnmatchedBars(st1);

    return st1;
}


function getDollarsText(text) {
    // Regex matches from $ to $ but completely stops if it hits \n\n (which implies standard paragraph breaks or unclosed errors)
    var matches = text.match(/\$(?:[^\$\\\n]|\n(?!\n)|\\.)*\$/g);
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
function extract(str, pattern) {

    const countRegEx = RegExp("(?<!" + pattern + "){", "g");
    const count = str.match(countRegEx)?.length ?? 0;
    //const count = str.match(/(?<!\\underset){/g)?.length ?? 0;
    const regex = RegExp("(?<=" + pattern + "{)[^{}]*" + "({[^{}]*".repeat(count) + "}[^{}]*)*".repeat(count) + "(?=})}" + "{(?<={)[^{}]*" + "({[^{}]*".repeat(count) + "}[^{}]*)*".repeat(count) + "(?=})}", "g");
    var matches = str.match(regex);
    if (matches && matches.length == 2) {
        str = str.replace(RegExp(pattern + "{" + matches[1], "g"), "");
        str = str.replace(RegExp(pattern + "{" + matches[0], "g"), "{" + matches[0] + "↖{" + matches[1]);
    }
    return str;
}

function performLatexOperations(st1) {
    st1 = cleanlatex(st1);
    st1 = text_input(st1);
    st1 = mathrm(st1);
    st1 = stackrelcheck(st1);
    st1 = oversetcheck(st1);
    st1 = substack_check(st1);

    st1 = undersetcheck(st1);
    st1 = casescheck(st1);
    st1 = matricescheck(st1);

    st1 = cleanbrackets(st1);

    st1 = square_root_new(st1);

    //before fraction clean all forward slash with \/
    st1 = st1.replace(/\//g, '\\/');
    //st1 = fraction2(st1); // some time & operation is annoying.
    st1 = fraction(st1);

    st1 = integrationcheck_new(st1);
    st1 = summationcheck_new(st1);
    st1 = summationcheck_Symbol(st1);
    st1 = limitscheck(st1);


    st1 = hatsymbol(st1); // Hat symbols to goto top.    
    st1 = overrightarrow(st1);
    st1 = st1.replace(/\\underline/g, "x");
    st1 = removeothersglobal(st1);

    st1 = st1.replace(/\$\$/g, '$');
    st1 = otherscheck(st1);
    st1 = process_matrix_lines(st1);

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
    const alignedRegex = /(\${1,2})\s*\\begin{aligned}([\s\S]*?)\\end{aligned}\s*\1/gm;
    const arrayRegex = /(\${1,2})\s*\\begin{array}{([clr]{1,8})}([\s\S]*?)\\end{array}\s*\1/gm;
    const gatheredRegex = /(\${1,2})\s*\\begin{gathered}([\s\S]*?)\\end{gathered}\s*\1/gm;

    // Handle aligned environment
    while (input.search(alignedRegex) >= 0) {
        input = input.replace(alignedRegex, function (match, dollarSigns, content) {
            return dollarSigns + cleanothers(content) + dollarSigns;
        });
    }

    // Handle array environment
    while (input.search(arrayRegex) >= 0) {
        input = input.replace(arrayRegex, function (match, dollarSigns, colSpec, content) {
            return dollarSigns + cleanothers(content) + dollarSigns;
        });
    }

    // Handle gathered environment
    while (input.search(gatheredRegex) >= 0) {
        input = input.replace(gatheredRegex, function (match, dollarSigns, content) {
            return dollarSigns + cleanothers(content) + dollarSigns;
        });
    }

    return input;
}

function process_matrix_lines(input) {
    let output = "";

    let regex = /(\${1,2})\s*\\begin\{matrix\}/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(input)) !== null) {
        let dollarSigns = match[1];
        let startIndex = match.index;
        let contentStart = startIndex + match[0].length;

        let depth = 1;
        let j = contentStart;
        while (j < input.length) {
            if (input.startsWith('\\begin{matrix}', j)) {
                depth++;
                j += '\\begin{matrix}'.length;
            } else if (input.startsWith('\\end{matrix}', j)) {
                depth--;
                if (depth === 0) {
                    break;
                }
                j += '\\end{matrix}'.length;
            } else {
                j++;
            }
        }

        if (depth === 0) {
            let contentEnd = j;
            let endTokenLength = '\\end{matrix}'.length;
            let afterEnd = input.substring(contentEnd + endTokenLength);
            let trailingSpaceMatch = afterEnd.match(/^\s*(\${1,2})/);

            if (trailingSpaceMatch && trailingSpaceMatch[1] === dollarSigns) {
                let endMatchLength = trailingSpaceMatch[0].length;
                let content = input.substring(contentStart, contentEnd);

                let maskedEnvironments = [];
                let maskId = 0;
                let prevContent;

                do {
                    prevContent = content;
                    content = content.replace(/\\begin\{([^}]+)\}((?:(?!\\begin\{)[\s\S])*?)\\end\{\1\}/g, function (envMatch) {
                        maskedEnvironments.push(envMatch);
                        return `__MASKED_ENV_${maskId++}__`;
                    });
                } while (content !== prevContent);

                // Clean up outermost braces manually added by user around cells.
                // Do this AFTER masking inner environments so it doesn't swallow \end_matrix} brackets.
                content = content.replace(/\{(\s*=[^{}&]*(\{[^{}]*\}[^{}&]*)*)\}(?=\s*(&|\\\\|$))/g, '$1');
                content = content.replace(/(^|&|\\\\)\s*\{(\s*\\Rightarrow[^{}&]*(\{[^{}]*\}[^{}&]*)*)\}/g, '$1 $2');

                content = cleanothers(content);

                for (let k = maskedEnvironments.length - 1; k >= 0; k--) {
                    content = content.replace(`__MASKED_ENV_${k}__`, maskedEnvironments[k]);
                }

                let processedBlock = dollarSigns + content + dollarSigns;

                output += input.substring(lastIndex, startIndex) + processedBlock;
                lastIndex = contentEnd + endTokenLength + endMatchLength;
                regex.lastIndex = lastIndex;
            }
        }
    }

    // Append any trailing string fragment
    if (lastIndex < input.length) {
        output += input.substring(lastIndex);
    }

    // Now convert any remaining (inner) \begin{matrix} ... \end{matrix} identically
    let finalOutput = output;

    let fallbackRegex = /\\begin\{matrix\}([\s\S]*?)\\end\{matrix\}/g;

    finalOutput = finalOutput.replace(fallbackRegex, function (match, innerContent) {
        innerContent = innerContent.replace(/\{(\s*=[^{}&]*(\{[^{}]*\}[^{}&]*)*)\}(?=\s*(&|\\\\|$))/g, '$1');
        innerContent = innerContent.replace(/(^|&|\\\\)\s*\{(\s*\\Rightarrow[^{}&]*(\{[^{}]*\}[^{}&]*)*)\}/g, '$1 $2');

        let cleaned = cleanothers(innerContent);
        return cleaned;
    });

    return finalOutput;
}


function checkIncaseIfDollorsMissing(input) {
    while (input.search(/\\begin{array}{l+}((?:[^\$\\]|\\.)*)\\end{array}/gm) >= 0) {
        input = input.replace(/\\begin{array}{l+}((?:[^\$\\]|\\.)*)\\end{array}/gm, function (match, one) {
            return performLatexOperationWithNewLine(one);
        });
    }

    // Catch any \begin{matrix} ... \end{matrix} that fell outside the standard $...$ parsing
    while (input.search(/(?:\$*)\s*\\begin\{matrix\}([\s\S]*?)\\end\{matrix\}\s*(?:\$*)/gm) >= 0) {
        input = input.replace(/(?:\$*)\s*\\begin\{matrix\}([\s\S]*?)\\end\{matrix\}\s*(?:\$*)/gm, function (match, innerContent) {
            // Apply similar pre-processing as we do in process_matrix_lines
            innerContent = innerContent.replace(/\{(\s*=[^{}&]*(\{[^{}]*\}[^{}&]*)*)\}(?=\s*(&|\\\\|$))/g, '$1');
            innerContent = innerContent.replace(/(^|&|\\\\)\s*\{(\s*\\Rightarrow[^{}&]*(\{[^{}]*\}[^{}&]*)*)\}/g, '$1 $2');

            // performLatexOperationWithNewLine breaks by \\ and wraps each in $ ... $ <br>
            // Which matches exactly what we want for top-level matrix separated lines!
            let result = performLatexOperationWithNewLine(innerContent);
            return result.replace(/<br>\s*$/, '');
        });
    }

    return input;
}


function performLatexOperationWithNewLine(input) {
    var lines = input.split('\\\\');
    var output = '';
    for (var i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(/\n <br> \n/g, '');
        lines[i] = lines[i].replace(/\r\n|\r|\n/g, '');
        output += '$' + performLatexOperations(lines[i]) + '$ <br>'
    }
    return output;

}



function integrationcheck_oldwithissue(input) {
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
function integrationcheck_new1(input) {
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

    // Case 3: fallback with both upper and lower (non-braced) on same line
    input = input.replace(/\\int_([a-zA-Z0-9]+)\^\{([^}]+)\}/g, (match, lower, upper) => `∫↙{${lower}}↖{${upper}}`);

    // Case 4: fallback with lower only (must not follow any '^')
    input = input.replace(/\\int_([^\s^{}]+)/g, "∫↙{$1}");

    // Case 5: fallback with upper only (must not follow any '_')
    input = input.replace(/\\int\^([^\s_{}]+)/g, "∫↖{$1}");

    // Case 6: plain integral
    input = input.replace(/\\int/g, "∫");

    return input;
}
function integrationcheck_new_testte(input) {

    // 1) normalise suspicious characters that often appear when copying from debuggers/HTML
    input = input
        // drop zero-width/formatting chars that may split sequences
        .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
        // NBSP -> normal space (so \s matches)
        .replace(/\u00A0/g, ' ')
        // convert unicode integral to \int for predictable parsing
        .replace(/∫/g, '\\int')
        // convert division slash or fullwidth backslash to normal backslash
        .replace(/[\u2215\uFF3C]/g, '\\')
        ;

    // 2) core conversion: match \int (now guaranteed to be a backslash+int) with optional spaces
    const INT = '\\\\int'; // literal backslash in RegExp string

    // braced bounds (either order) — allow spaces in between tokens
    input = input.replace(
        new RegExp(INT + '\\s*(?:_\\s*\\{([^}]*)\\}\\s*\\^\\s*\\{([^}]*)\\}|\\^\\s*\\{([^}]*)\\}\\s*_\\s*\\{([^}]*)\\})', 'g'),
        (m, a1, b1, b2, a2) => {
            const lower = a1 || a2;
            const upper = b1 || b2;
            return `∫↙{${lower}}↖{${upper}}`;
        }
    );

    // safe unbraced tokens: restrict to digits, letters, plus/minus/decimal/dot
    const token = '([A-Za-z0-9.+\\-]+)';

    // unbraced lower/upper either order
    input = input.replace(
        new RegExp(INT + '\\s*(?:_\\s*' + token + '\\s*\\^\\s*' + token + '|\\^\\s*' + token + '\\s*_\\s*' + token + ')', 'g'),
        (m, a1, b1, b2, a2) => {
            const lower = a1 || a2;
            const upper = b1 || b2;
            return `∫↙{${lower}}↖{${upper}}`;
        }
    );

    // fallback: unbraced lower, braced upper
    input = input.replace(
        new RegExp(INT + '\\s*_\\s*' + token + '\\s*\\^\\s*\\{([^}]+)\\}', 'g'),
        (m, lower, upper) => `∫↙{${lower}}↖{${upper}}`
    );

    // fallback: lower only
    input = input.replace(
        new RegExp(INT + '\\s*_\\s*' + token, 'g'),
        (m, lower) => `∫↙{${lower}}`
    );

    // fallback: upper only
    input = input.replace(
        new RegExp(INT + '\\s*\\^\\s*' + token, 'g'),
        (m, upper) => `∫↖{${upper}}`
    );

    // finally convert any remaining literal \int sequences (if any) into the plain integral char
    input = input.replace(/\\int/g, "∫");

    return input;
}





function integrationcheck_new(input) {

    // 1) normalise suspicious characters that often appear when copying from debuggers/HTML
    input = input
        // drop zero-width/formatting chars that may split sequences
        .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
        // NBSP -> normal space (so \s matches)
        .replace(/\u00A0/g, ' ')
        // convert unicode integral to \int for predictable parsing
        .replace(/∫/g, '\\int')
        // convert division slash or fullwidth backslash to normal backslash
        .replace(/[\u2215\uFF3C]/g, '\\')
        ;

    // 2) core conversion: match \int (now guaranteed to be a backslash+int) with optional spaces
    const INT = '\\\\int'; // literal backslash in RegExp string

    // braced bounds (either order) — allow spaces in between tokens
    input = input.replace(
        new RegExp(INT + '\\s*(?:_\\s*\\{([^}]*)\\}\\s*\\^\\s*\\{([^}]*)\\}|\\^\\s*\\{([^}]*)\\}\\s*_\\s*\\{([^}]*)\\})', 'g'),
        (m, a1, b1, b2, a2) => {
            const lower = a1 || a2;
            const upper = b1 || b2;
            return `∫↙{${lower}}↖{${upper}}`;
        }
    );

    // ✅ minimal change: allow \pi etc (latex commands) and also unicode π
    const token = '((?:\\\\[A-Za-z]+|[A-Za-z0-9.+\\-π])+)';

    // unbraced lower/upper either order
    input = input.replace(
        new RegExp(INT + '\\s*(?:_\\s*' + token + '\\s*\\^\\s*' + token + '|\\^\\s*' + token + '\\s*_\\s*' + token + ')', 'g'),
        (m, a1, b1, b2, a2) => {
            const lower = a1 || a2;
            const upper = b1 || b2;
            // ✅ minimal change: upper is unbraced -> no { }
            return `∫↙{${lower}}↖${upper}`;
        }
    );

    // fallback: unbraced lower, braced upper
    input = input.replace(
        new RegExp(INT + '\\s*_\\s*' + token + '\\s*\\^\\s*\\{([^}]+)\\}', 'g'),
        (m, lower, upper) => `∫↙{${lower}}↖{${upper}}`
    );

    // ✅ minimal addition: braced lower, unbraced upper (e.g. \int_{\pi-t}^\pi)
    input = input.replace(
        new RegExp(INT + '\\s*_\\s*\\{([^}]+)\\}\\s*\\^\\s*' + token, 'g'),
        (m, lower, upper) => `∫↙{${lower}}↖${upper}`
    );

    // ✅ minimal change: lower-only should NOT trigger if a ^ upper bound follows
    input = input.replace(
        new RegExp(INT + '\\s*_\\s*' + token + '(?!\\s*\\^)', 'g'),
        (m, lower) => `∫↙{${lower}}`
    );

    // ✅ NEW: Handle \int_{...} without upper limit explicitly
    input = input.replace(
        new RegExp(INT + '\\s*_\\s*\\{([^}]+)\\}(?!\\s*\\^)', 'g'),
        (m, lower) => `∫↙{${lower}}`
    );

    // ✅ minimal change: upper-only should NOT trigger if a _ lower bound follows
    input = input.replace(
        new RegExp(INT + '\\s*\\^\\s*' + token + '(?!\\s*_ )', 'g'),
        (m, upper) => `∫↖${upper}`
    );

    // finally convert any remaining literal \int sequences (if any) into the plain integral char
    input = input.replace(/\\int/g, "∫");

    // ✅ minimal: turn \pi into π (so you get ↖π)
    input = input.replace(/\\pi\b/g, "π");

    return input;
}










function summationcheck_oldwithissue(input) {
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


function summationcheck_new(input) {
    // Case: \sum_{a}^{b}
    input = input.replace(/\\sum\s*_\{([^{}]+)\}\s*\^\{([^{}]+)\}/g, "∑↙{$1}↖{$2}");

    // Case: \sum^{b}_{a}
    input = input.replace(/\\sum\s*\^\{([^{}]+)\}\s*_\{([^{}]+)\}/g, "∑↙{$2}↖{$1}");

    // Case: \sum_{a}^b  (make upper token allow \pi etc and unicode π)
    input = input.replace(/\\sum\s*_\{([^{}]+)\}\s*\^((?:\\[A-Za-z]+|[^\s{])+)/g, "∑↙{$1}↖$2");

    // ✅ added: \sum_{a}^{b} already covered, but this covers braced lower + unbraced upper robustly

    // Case: \sum^b_{a} (make upper token allow \pi etc and unicode π)
    input = input.replace(/\\sum\s*\^((?:\\[A-Za-z]+|[^\s{])+)\s*_\{([^{}]+)\}/g, "∑↙{$2}↖$1");

    // ✅ added: \sum_a^{b}
    input = input.replace(/\\sum\s*_([^{}\s]+)\s*\^\{([^{}]+)\}/g, "∑↙{$1}↖{$2}");

    // ✅ added: \sum^{b}_a (upper braced, lower unbraced)
    input = input.replace(/\\sum\s*\^\{([^{}]+)\}\s*_([^{}\s]+)/g, "∑↙{$2}↖{$1}");

    // Case: \sum_a^b (allow upper/lower to be \pi etc or unicode π)
    input = input.replace(/\\sum\s*_((?:\\[A-Za-z]+|[^{}\s])+)\s*\^((?:\\[A-Za-z]+|[^{}\s])+)/g, "∑↙{$1}↖$2");

    // Case: \sum^b_a (allow upper/lower to be \pi etc or unicode π)
    input = input.replace(/\\sum\s*\^((?:\\[A-Za-z]+|[^{}\s])+)\s*_((?:\\[A-Za-z]+|[^{}\s])+)/g, "∑↙{$2}↖$1");

    // ✅ NEW: Handle \sum_{...} without upper limit explicitly
    input = input.replace(/\\sum\s*_\{([^{}]+)\}(?!\s*\^)/g, "∑↙{$1}");

    // ✅ prevent lower-only fallback from firing when a ^ follows
    input = input.replace(/\\sum_\s*(?!\{)(?!\s*\^)/g, "∑↙");

    // Fallback: replace all remaining \sum
    input = input.replace(/\\sum/g, "∑");

    // ✅ minimal: turn \pi into π (so you get ↖π, consistent with your integral)
    input = input.replace(/\\pi\b/g, "π");

    return input;
}



function summationcheck_new_testteed(input) {
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

    // Fallback: replace \sum_ only if NOT followed by '{' or '^'
    input = input.replace(/\\sum_(?![{^])/g, "∑↙");

    // Fallback: replace all remaining \sum
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



function square_root_new(input) {
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


function limitscheck(input) {
    // Case 1: \limits_{lower}^{upper}
    input = input.replace(
        /\\limits\s*_\{\s*([^{}]+?)\s*\}\s*\^\{\s*([^{}]+?)\s*\}/g,
        "↙{$1}↖{$2}"
    );

    // Case 2: \limits^{upper}_{lower}
    input = input.replace(
        /\\limits\s*\^\{\s*([^{}]+?)\s*\}\s*_\{\s*([^{}]+?)\s*\}/g,
        "↙{$2}↖{$1}"
    );

    // Case 3: \limits_{lower}^upper  (no braces on upper)
    input = input.replace(
        /\\limits\s*_\{\s*([^{}]+?)\s*\}\s*\^([^\s{]+)/g,
        "↙{$1}↖{$2}"
    );

    // Case 4: \limits^upper_{lower}  (no braces on lower)
    input = input.replace(
        /\\limits\s*\^([^\s{]+)\s*_\{\s*([^{}]+?)\s*\}/g,
        "↙{$2}↖{$1}"
    );

    // Case 5: \limits_lower^upper (no braces on either)
    input = input.replace(
        /\\limits\s*_([^\s{}]+)\s*\^([^\s{}]+)/g,
        "↙{$1}↖{$2}"
    );

    // Case 6: \limits^upper_lower (no braces on either)
    input = input.replace(
        /\\limits\s*\^([^\s{}]+)\s*_([^\s{}]+)/g,
        "↙{$2}↖{$1}"
    );

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

    st1 = st1.replace(/\\lbrack/g, "[");
    st1 = st1.replace(/\\rbrack/g, "]");

    st1 = replaceSpecialChars(st1);

    st1 = performAscciOperations(st1);
    st1 = st1.replace(/\\lim _/g, "\\lim ↙");
    return st1;

}



function cleanbrackets(st1) {



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

function oversetcheck(input) {
    const oversetRegex = /\\overset\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;

    return input.replace(oversetRegex, (match, a, b) => {
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


function hatsymbol_update(input) {
    const COMBINING_HAT = "\u0302"; // U+0302

    function replHat(content) {
        // Trim whitespace inside braces
        const c = content.trim();

        // If it's exactly ONE ASCII letter, use combining hat
        if (/^[A-Za-z]$/.test(c)) {
            return c + COMBINING_HAT;
        }

        // Otherwise fall back to jqMath hat placement
        return `{${content}}↖{∧}`;
    }

    // \widehat{...}
    input = input.replace(
        /\\widehat\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/g,
        (match, content) => replHat(content)
    );

    // \hat{...}
    input = input.replace(
        /\\hat\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/g,
        (match, content) => replHat(content)
    );

    return input;
}


const bracketPairs = { '[': ']', '{': '}', '(': ')' }
const closingBrackets = new Set(Object.values(bracketPairs))

function bracketsAreBalanced(text) {
    const open = [] // stack of (closing) brackets that need to be closed                       
    for (char of text) {
        if (closingBrackets.has(char)) {
            if (char === open[open.length - 1]) open.pop()
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


function fractionextrachecks(input) {
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

    return input.replace(regex, function (match, colspan) {
        return `</td><td colspan="${colspan}">`;
    });
}
function tabularcheck_old(input) {
    // Regex to match \begin{tabular}{column_spec} ... \end{tabular}
    const regex = /\\begin\{tabular\}\{([clrp|]+)\}([\s\S]*?)\\end\{tabular\}/g;

    return input.replace(regex, function (match, colSpec, tableContent) {
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
// function tabularcheck(input) { ... } -> renamed to backup
function tabularcheck_bk(input) {
    const regex = /\\begin\{tabular\}\{([clrp|]+)\}([\s\S]*?)\\end\{tabular\}/g;

    return input.replace(regex, function (_, colSpec, content) {
        // Count columns by removing pipes.
        const colCount = colSpec.replace(/\|/g, '').length;

        // Split content into lines, filter out empty ones
        const lines = content.split('\n').map(l => l.trim()).filter(l => l !== '');

        const rows = [];
        for (let line of lines) {
            // Check full-line hline
            if (line === '\\hline') {
                rows.push(`<tr><td colspan="${colCount}" style="border-top:1px solid #000;"></td></tr>`);
                continue;
            }

            // Remove inline \hline (e.g. at start of line)
            line = line.replace(/\\hline\s*/g, '').trim();

            // Remove trailing \\ or \\ followed by space
            line = line.replace(/\\\\\s*$/, '').trim();

            // Split line into cells by '&'
            // NOTE: A robust split would need to respect nested braces/environments, 
            // but for simple tabular content, split('&') is the standard approach in this file.
            const cells = line.split('&').map(c => c.trim());

            let htmlCells = '';
            let currentCellCount = 0;

            for (let cell of cells) {
                // Check if cell starts with \multicolumn{num}{colspec}{content}
                // Regex: \multicolumn { num } { colspec } { content }
                // We'll approximate extraction. 
                const mcMatch = cell.match(/^\\multicolumn\s*\{(\d+)\}\s*\{[^}]*\}\s*\{([\s\S]*)\}\s*$/);

                if (mcMatch) {
                    const span = parseInt(mcMatch[1], 10);
                    const cellContent = mcMatch[2];
                    htmlCells += `<td colspan="${span}">${cellContent}</td>`;
                    currentCellCount += span;
                } else {
                    htmlCells += `<td>${cell}</td>`;
                    currentCellCount++;
                }
            }

            // Fill missing cells if any
            while (currentCellCount < colCount) {
                htmlCells += '<td></td>';
                currentCellCount++;
            }

            rows.push(`<tr>${htmlCells}</tr>`);
        }

        return `<div class="hscrollenable"><table class="table table-bordered">${rows.join('')}</table></div>`;
    });
}

function tabularcheck(input) {
    const regex = /\\begin\{tabular\}\{([clrp|]+)\}([\s\S]*?)\\end\{tabular\}/g;

    return input.replace(regex, function (_, colSpec, content) {
        // Count columns by removing pipes.
        const colCount = colSpec.replace(/\|/g, '').length;

        // Split content into lines, filter out empty ones
        const lines = content.split('\n').map(l => l.trim()).filter(l => l !== '');

        const rows = [];
        let rowIdx = 0; // Track content rows for header detection

        for (let line of lines) {
            // Check full-line hline
            if (line === '\\hline') {
                rows.push(`<tr><td colspan="${colCount}" style="border-top:1px solid #000;"></td></tr>`);
                continue;
            }

            // Remove inline \hline (e.g. at start of line)
            line = line.replace(/\\hline\s*/g, '').trim();

            // Remove trailing \\ or \\ followed by space
            line = line.replace(/\\\\\s*$/, '').trim();

            // Split line into cells by '&'
            const cells = line.split('&').map(c => c.trim());

            let htmlCells = '';
            let currentCellCount = 0;
            // Use <th> for the first content row, <td> for others
            const tag = (rowIdx === 0) ? 'th' : 'td';

            for (let cell of cells) {
                // Check if cell starts with \multicolumn{num}{colspec}{content}
                // Relaxed regex: \multicolumn { num } { ... } { content }
                const mcMatch = cell.match(/^\\multicolumn\s*\{(\d+)\}\s*\{.*\}\s*\{([\s\S]*)\}\s*$/);

                if (mcMatch) {
                    const span = parseInt(mcMatch[1], 10);
                    const cellContent = mcMatch[2];
                    htmlCells += `<${tag} colspan="${span}">${cellContent}</${tag}>`;
                    currentCellCount += span;
                } else {
                    htmlCells += `<${tag}>${cell}</${tag}>`;
                    currentCellCount++;
                }
            }

            // Fill missing cells if any
            while (currentCellCount < colCount) {
                htmlCells += `<${tag}></${tag}>`;
                currentCellCount++;
            }

            rows.push(`<tr>${htmlCells}</tr>`);
            rowIdx++;
        }

        return `<div class="hscrollenable"><table class="table table-bordered">${rows.join('')}</table></div>`;
    });
}


function substack_check(input) {
    const regex = /\\substack{([^}]*)}/gm;

    while (input.search(regex) >= 0) {
        input = input.replace(regex, function (match, content) {
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
function casescheck(input) {
    const casesRegex = /\\begin{cases}([\s\S]*?)\\end{cases}/gm;

    while (input.search(casesRegex) >= 0) {
        input = input.replace(casesRegex, function (match, caseContent) {
            // Preprocess the case block (same as matrix preprocessing)
            let processed = preprocessmatrics(caseContent);

            // Remove trailing \\
            processed = processed.replace(/\\\\\s*$/, '');

            // Return formatted replacement
            return `\\{ {\\table ${processed}}`;
        });
    }

    return input;
}


function matricescheck1(input) {
    // Updated regex to match \left<delimiter>\begin{array}{column_spec}...\end{array}\right<delimiter>
    const matrixRegex = /\\left\s*(\.|\\[{\[\(\|])?\s*\\begin{array}{([clr|]+)}([\s\S]*?)\\end{array}\s*\\right\s*(\.|\\[}\]\)\|])?/gm;

    while (input.search(matrixRegex) >= 0) {
        input = input.replace(matrixRegex, function (match, leftDelim, colSpec, arrayContent, rightDelim) {
            // Normalize left delimiter
            leftDelim = leftDelim === '.' ? '' : (leftDelim || '');
            // Normalize right delimiter
            rightDelim = rightDelim === '.' ? '' : (rightDelim || '');

            // Safely escape braces
            leftDelim = leftDelim.replace(/(?<!\\)\{/g, '\\{').replace(/(?<!\\)\}/g, '\\}');
            rightDelim = rightDelim.replace(/(?<!\\)\{/g, '\\{').replace(/(?<!\\)\}/g, '\\}');

            // Process the matrix content
            let processed = preprocessmatrics(arrayContent);

            // Remove trailing \\ before \right
            processed = processed.replace(/\\\\\s*$/, '');

            // Return formatted replacement
            return `{${leftDelim}\\table ${processed}${rightDelim}}`;
        });
    }

    return input;
}
function matricescheck(input) {
    // Allows delimiters like |, {, [, (, }, ], ) with optional backslash
    // Handles spaces and newlines after \left and before \right
    // Also explicitly matches bmatrix, pmatrix, and vmatrix environments.
    const arrayRegex = /\\left\s*(\.|\\?[{\[\(\|}]\s*)?\\begin{array}{([^}]+)}([\s\S]*?)\\end{array}\s*\\right\s*(\.|\\?[}\]\)\|]\s*)?/gm;
    const bmatrixRegex = /\\begin\{(b|p|v|B|V)matrix\}([\s\S]*?)\\end\{\1matrix\}/gm;

    while (input.search(arrayRegex) >= 0) {
        input = input.replace(arrayRegex, function (match, leftDelim, colSpec, arrayContent, rightDelim) {
            // Normalize delimiters
            leftDelim = leftDelim === '.' ? '' : (leftDelim || '').trim();
            rightDelim = rightDelim === '.' ? '' : (rightDelim || '').trim();

            // Escape braces in delimiters to be safe
            leftDelim = leftDelim.replace(/(?<!\\)\{/g, '\\{').replace(/(?<!\\)\}/g, '\\}');
            rightDelim = rightDelim.replace(/(?<!\\)\{/g, '\\{').replace(/(?<!\\)\}/g, '\\}');

            // Process matrix content (your existing preprocessing)
            let processed = preprocessmatrics(arrayContent);

            // Remove trailing \\ before \right
            processed = processed.replace(/\\\\\s*$/, '');

            // Return formatted replacement string
            return `{${leftDelim}\\table ${processed}${rightDelim}}`;
        });
    }

    while (input.search(bmatrixRegex) >= 0) {
        input = input.replace(bmatrixRegex, function (match, type, content) {
            let leftDelim, rightDelim;
            if (type === 'b') { leftDelim = '['; rightDelim = ']'; }
            else if (type === 'p') { leftDelim = '('; rightDelim = ')'; }
            else if (type === 'v') { leftDelim = '|'; rightDelim = '|'; }
            else if (type === 'B') { leftDelim = '\\{'; rightDelim = '\\}'; }
            else if (type === 'V') { leftDelim = '\\|'; rightDelim = '\\|'; }

            let processed = preprocessmatrics(content);
            processed = processed.replace(/\\\\\s*$/, '');
            return `{${leftDelim}\\table ${processed}${rightDelim}}`;
        });
    }

    return input;
}

function preprocessmatrics(st1) {

    // 4. Replace " ;" with {; \;}
    st1 = st1.replace(/ ;/g, '{; \\;}');

    // 1. Replace literal "\\" with ;
    st1 = st1.replace(/\\\\/g, ';');

    // 2. Replace all commas (existing ones first!)
    st1 = st1.replace(/ ?,/g, '{, \\;}');

    // 3. Now replace "&" with a comma — this will be caught above if done earlier
    st1 = st1.replace(/&/g, ',');



    // 5. Wrap text inside |...| with {|...|}
    st1 = st1.replace(/\|([^|]+)\|/g, '{|$1|}');

    return st1;
}


function preprocessmatrics1(st1) {
    st1 = st1.replace(/ ;/g, '{; \\;}');
    st1 = st1.replace(/\\\\/g, ';');
    st1 = st1.replace(/ ,/g, '{, \\;}');
    st1 = st1.replace(/\&/g, '{, \\;}');
    // if any inside text is enclosed with |xxx| then we need to add {|xxx|}
    // st1 = st1.replace(/\|(\w+)\|/g, '\{\|$1\|\}');
    st1 = st1.replace(/\|([^|]+)\|/g, '\{\|$1\|\}');
    return st1;
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



function fixUnmatchedBars(input) {
    // Process only inside $...$ math blocks
    return input.replace(/\$(.*?)\$/gs, (mathBlock) => {
        let s = mathBlock;
        let result = '';
        let openCount = 0;

        for (let i = 0; i < s.length; i++) {
            // Detect "{|"
            if (s[i] === '{' && s[i + 1] === '|') {
                openCount++;
                result += '{|';
                i++; // skip next char
                continue;
            }

            // Detect "|}"
            if (s[i] === '|' && s[i + 1] === '}') {
                if (openCount > 0) {
                    // This |} matches a previous {|
                    openCount--;
                    result += '|}';
                } else {
                    // Unmatched |}: apply your dummy {{}/{} |}
                    result += '{{}/{} |}';
                }
                i++; // skip next char
                continue;
            }

            // Normal character
            result += s[i];
        }

        return result;
    });
}



