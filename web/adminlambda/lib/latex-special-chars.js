

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
    st1 = st1.replace(/\\iint/g, "∬");
    st1 = st1.replace(/\\iiint/g, "∭");
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

    st1 = st1.replace(/\\square/g, ""); // ignoring for now
    st1 = st1.replace(/\\bigcirc/g, ""); // ignoring for now

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
    st1 = st1.replace(/□/g, "");

    return st1;
}


function replaceSpecialChars(st1) {
    st1 = st1.replace(/\\triangle/g, "△");
    //st1 = st1.replace(/\\overbrace/g, "⏞");
    //st1 = st1.replace(/\\underbrace/g, "⏟");
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