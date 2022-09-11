const analyze = (inputCode) => {
  let code = ``;
  code += "\n";
  let state = 0;
  let c = code.charAt(0);
  let cIndex = 1;
  let token = "";
  let col = 1,
    row = 1,
    block = 0;

  let analysedTokens = [];

  const isLetter = (c) => {
    return (
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c) !== -1
    );
  };
  const isDigit = (c) => {
    return "0123456789".indexOf(c) !== -1;
  };
  const isSeparator = (c) => {
    return "()[]{},;".indexOf(c) !== -1;
  };
  const tokens = {
    identifier: "identifier",
    keyword: "keyword",
    literal: "literal",
    operator: "operator",
    separator: "separator",
    comment: "comment",
    libraryImport: "lib call",
  };
  const fail = () => {
    analysedTokens.push({
      row: row,
      col: col,
      block: block,
      near: token.trim(),
      self: c,
      type: "error",
    });
    //console.log("Lexical Error: near '" + token + "' => '" + c + "' is not a valid character in state : " + state);
  };
  const returnToken = (t) => {
    //console.log(token.trim() + ' -> ' + t + " --> [" + row + " , " + col + "] at block: " + (block < 0 ? 0 : block));
    analysedTokens.push({
      row: row,
      col: col,
      block: block < 0 ? 0 : block,
      self: token.trim(),
      type: t,
    });
    col += token.length;
  };
  const isKeyword = () => {
    let keywords = [
      "auto",
      "break",
      "case",
      "char",
      "const",
      "continue",
      "default",
      "do",
      "double",
      "else",
      "enum",
      "extern",
      "float",
      "for",
      "goto",
      "if",
      "int",
      "long",
      "register",
      "return",
      "short",
      "signed",
      "sizeof",
      "static",
      "struct",
      "switch",
      "typedef",
      "union",
      "unsigned",
      "void",
      "volatile",
      "while",
      "_Packed",
      "true",
      "false",
      "signed",
    ];
    return keywords.indexOf(token) !== -1;
  };
  const readNextChar = () => {
    c = code[cIndex++];
    //console.log("NEW -->[" + c + "]");
  };
  let infinitePreventer = 1;
  const analyzeCodeInStateMachine = () => {
    code = inputCode + "\n";
    c = code.charAt(0);
    cIndex = 1;
    token = "";
    analysedTokens = [];
    infinitePreventer = 0;
    row = 1;
    block = 0;
    col = 1;
    state = 0;
    while (cIndex <= code.length) {
      infinitePreventer++;
      if (infinitePreventer > code.length * 2) {
        console.log(
          "______________________________[Infinite Loop]______________________________Because of -> " +
            token
        );
        return;
      }
      switch (state) {
        case 0:
          if (c === " " || c === "\n" || c === "\t") {
            col = c === " " ? col + 1 : c === "\n" ? 1 : col + 4;
            row += c === "\n" ? 1 : 0;
            readNextChar();
          } else if (isLetter(c)) {
            state = 1;
            token = c;
            readNextChar();
          } else if (isDigit(c)) {
            state = 3;
            token = c;
            readNextChar();
          } else if (c === "-") {
            state = 8;
            token = c;
            readNextChar();
          } else if (c === "+") {
            state = 12;
            token = c;
            readNextChar();
          } else if (c === "*") {
            state = 16;
            token = c;
            readNextChar();
          } else if (c === "=") {
            state = 19;
            token = c;
            readNextChar();
          } else if (c === "!") {
            state = 22;
            token = c;
            readNextChar();
          } else if (c === "%") {
            state = 25;
            token = c;
            readNextChar();
          } else if (c === "&") {
            state = 28;
            token = c;
            readNextChar();
          } else if (c === "|") {
            state = 32;
            token = c;
            readNextChar();
          } else if (c === ">") {
            state = 36;
            token = c;
            readNextChar();
          } else if (c === "<") {
            state = 40;
            token = c;
            readNextChar();
          } else if (c === '"') {
            state = 44;
            token = c;
            readNextChar();
          } else if (c === "'") {
            state = 47;
            token = c;
            readNextChar();
          } else if (c === "/") {
            state = 54;
            token = c;
            readNextChar();
          } else if (c === "#") {
            state = 62;
            token = c;
            readNextChar();
          } else if (isSeparator(c)) {
            state = 0;
            token = c;
            returnToken(tokens.separator);
            if (c === "{") {
              block++;
            } else if (c === "}") {
              block--;
            }
            readNextChar();
          } else if (c === "?" || c === ":" || c === "~" || c === "^") {
            state = 0;
            token = c;
            returnToken(tokens.operator);
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        // -------------------------------------[ Identifier , Keyword ]-------------------------------------
        case 1:
          if (isLetter(c) || c === "_" || isDigit(c)) {
            state = 1;
            token += c;
            readNextChar();
          } else {
            state = 2;
          }
          break;
        // -- End State --
        case 2:
          state = 0;
          returnToken(isKeyword() ? tokens.keyword : tokens.identifier);
          break;
        // -------------------------------------[ Literal_INT , Literal_REAL ]-------------------------------------
        case 3:
          if (isDigit(c)) {
            state = 3;
            token += c;
            readNextChar();
          } else if (c === ".") {
            state = 5;
            token += c;
            readNextChar();
          } else {
            state = 4;
          }
          break;
        // -- End State --
        case 4:
          state = 0;
          returnToken(tokens.literal);
          break;
        case 5:
          if (isDigit(c)) {
            state = 6;
            token += c;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        case 6:
          if (isDigit(c)) {
            state = 6;
            token += c;
            readNextChar();
          } else {
            state = 7;
          }
          break;
        // -- End State --
        case 7:
          state = 0;
          returnToken(tokens.literal);
          break;
        // -------------------------------------[ - , -- , -= ]-------------------------------------
        case 8:
          if (c === "-") {
            state = 9;
            token += c;
            readNextChar();
          } else if (c === "=") {
            state = 10;
            token += c;
            readNextChar();
          } else {
            state = 11;
          }
          break;
        // -- End State --
        case 9:
        // -- End State --
        case 10:
        // -- End State --
        case 11:
          state = 0;
          returnToken(tokens.operator);
          break;
        // -------------------------------------[ + , ++ , += ]-------------------------------------
        case 12:
          if (c === "+") {
            state = 13;
            token += c;
            readNextChar();
          } else if (c === "=") {
            state = 14;
            token += c;
            readNextChar();
          } else {
            state = 15;
          }
          break;
        // -- End State --
        case 13:
        // -- End State --
        case 14:
        // -- End State --
        case 15:
          state = 0;
          returnToken(tokens.operator);
          break;
        // -------------------------------------[ * , *= ]-------------------------------------
        case 16:
          if (c === "=") {
            state = 17;
            token += c;
            readNextChar();
          } else {
            state = 18;
          }
          break;
        // -- End State --
        case 17:
        // -- End State --
        case 18:
          state = 0;
          returnToken(tokens.operator);
          break;
        // -------------------------------------[ = , == ]-------------------------------------
        case 19:
          if (c === "=") {
            state = 20;
            token += c;
            readNextChar();
          } else {
            state = 21;
          }
          break;
        // -- End State --
        case 20:
        // -- End State --
        case 21:
          state = 0;
          returnToken(tokens.operator);
          break;
        // -------------------------------------[ ! , != ]-------------------------------------
        case 22:
          if (c === "=") {
            state = 23;
            token += c;
            readNextChar();
          } else {
            state = 24;
          }
          break;
        // -- End State --
        case 23:
        // -- End State --
        case 24:
          state = 0;
          returnToken(tokens.operator);
          break;
        // -------------------------------------[ % , %= ]-------------------------------------
        case 25:
          if (c === "=") {
            state = 26;
            token += c;
            readNextChar();
          } else {
            state = 27;
          }
          break;
        // -- End State --
        case 26:
        // -- End State --
        case 27:
          state = 0;
          returnToken(tokens.operator);
          break;
        // -------------------------------------[ & , && , &= ]-------------------------------------
        case 28:
          if (c === "=") {
            state = 29;
            token += c;
            readNextChar();
          } else if (c === "&") {
            state = 30;
            token += c;
            readNextChar();
          } else {
            state = 31;
          }
          break;
        // -- End State --
        case 29:
        // -- End State --
        case 30:
        // -- End State --
        case 31:
          state = 0;
          returnToken(tokens.operator);
          break;
        // -------------------------------------[ | , || , |= ]-------------------------------------
        case 32:
          if (c === "=") {
            state = 33;
            token += c;
            readNextChar();
          } else if (c === "|") {
            state = 34;
            token += c;
            readNextChar();
          } else {
            state = 35;
          }
          break;
        // -- End State --
        case 33:
        // -- End State --
        case 34:
        // -- End State --
        case 35:
          state = 0;
          returnToken(tokens.operator);
          break;
        // -------------------------------------[ > , >= , >> ]-------------------------------------
        case 36:
          if (c === "=") {
            state = 37;
            token += c;
            readNextChar();
          } else if (c === ">") {
            state = 38;
            token += c;
            readNextChar();
          } else {
            state = 39;
          }
          break;
        // -- End State --
        case 37:
        // -- End State --
        case 38:
        // -- End State --
        case 39:
          state = 0;
          returnToken(tokens.operator);
          break;
        // -------------------------------------[ < , <= , << ]-------------------------------------
        case 40:
          if (c === "=") {
            state = 41;
            token += c;
            readNextChar();
          } else if (c === "<") {
            state = 42;
            token += c;
            readNextChar();
          } else {
            state = 43;
          }
          break;
        // -- End State --
        case 41:
        // -- End State --
        case 42:
        // -- End State --
        case 43:
          state = 0;
          returnToken(tokens.operator);
          break;
        // -------------------------------------[ "String" ]-------------------------------------
        case 44:
          if (c === '"') {
            state = 46;
            token += c;
            readNextChar();
          } else if (c === "\\") {
            state = 45;
            token += c;
            readNextChar();
          } else {
            state = 44;
            token += c;
            readNextChar();
          }
          if (c === undefined) {
            fail();
            return analysedTokens;
          }

          break;
        // -- End State --
        case 45:
          state = 44;
          token += c;
          readNextChar();
          break;
        // -- End State --
        case 46:
          state = 0;
          returnToken(tokens.literal);
          break;
        // -------------------------------------[ 'c' ]-------------------------------------
        case 47:
          if (c === "'") {
            state = 48;
            token += c;
            readNextChar();
          } else if (c === "\\") {
            state = 49;
            token += c;
            readNextChar();
          } else {
            state = 52;
            token += c;
            readNextChar();
          }
          break;
        // -- End State --
        case 48:
          state = 0;
          returnToken(tokens.literal);
          break;
        case 49:
          state = 50;
          token += c;
          readNextChar();
          break;
        case 50:
          if (c === "'") {
            state = 51;
            token += c;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        // -- End State --
        case 51:
          state = 0;
          returnToken(tokens.literal);
          break;
        case 52:
          if (c === "'") {
            state = 53;
            token += c;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        // -- End State --
        case 53:
          state = 0;
          returnToken(tokens.literal);
          break;
        // -------------------------------------[ / , /= , //--- , /*...*/ ]-------------------------------------
        case 54:
          if (c === "=") {
            state = 55;
            token += c;
            readNextChar();
          } else if (c === "/") {
            state = 56;
            token += c;
            readNextChar();
          } else if (c === "*") {
            state = 58;
            token += c;
            readNextChar();
          } else {
            state = 61;
          }
          break;
        // -- End State --
        case 55:
          state = 0;
          returnToken(tokens.operator);
          break;
        case 56:
          if (c === "\n" || c === undefined) {
            state = 57;
            //readNextChar();
          } else {
            state = 56;
            token += c;
            readNextChar();
          }
          break;
        // -- End State --
        case 57:
          state = 0;
          returnToken(tokens.comment);
          break;
        case 58:
          if (c === "*") {
            state = 59;
            token += c;
            readNextChar();
          } else if (cIndex >= code.length) {
            fail();
            return analysedTokens;
          } else {
            state = 58;
            token += c;
            readNextChar();
          }
          break;
        case 59:
          if (c === "*") {
            state = 59;
            token += c;
            readNextChar();
          } else if (c === "/") {
            state = 60;
            token += c;
            readNextChar();
          } else {
            state = 58;
            token += c;
            readNextChar();
          }
          break;
        // -- End State --
        case 60:
        // -- End State --
        case 61:
          state = 0;
          returnToken(tokens.comment);
          break;
        // -------------------------------------[ #include<stdio.h> ]-------------------------------------
        case 62:
          if (c === "i") {
            state = 63;
            token += c;
            readNextChar();
          } else if (c === " ") {
            state = 62;
            readNextChar();
          } else if (c === "\t") {
            state = 62;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        case 63:
          if (c === "n") {
            state = 64;
            token += c;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        case 64:
          if (c === "c") {
            state = 65;
            token += c;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        case 65:
          if (c === "l") {
            state = 66;
            token += c;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        case 66:
          if (c === "u") {
            state = 67;
            token += c;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        case 67:
          if (c === "d") {
            state = 68;
            token += c;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        case 68:
          if (c === "e") {
            state = 69;
            token += c;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        case 69:
          if (c === '"') {
            state = 70;
            token += c;
            readNextChar();
          } else if (c === "<") {
            state = 74;
            token += c;
            readNextChar();
          } else if (c === " ") {
            state = 69;
            readNextChar();
          } else if (c === "\t") {
            state = 69;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        case 70:
          if (isLetter(c)) {
            state = 71;
            token += c;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        case 71:
          if (isDigit(c) || isLetter(c)) {
            state = 71;
            token += c;
            readNextChar();
          } else if (c === ".") {
            state = 72;
            token += c;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        case 72:
          if (c === "h") {
            state = 73;
            token += c;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        case 73:
          if (c === '"') {
            state = 78;
            token += c;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        case 74:
          if (isLetter(c)) {
            state = 75;
            token += c;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        case 75:
          if (isDigit(c) || isLetter(c)) {
            state = 75;
            token += c;
            readNextChar();
          } else if (c === ".") {
            state = 76;
            token += c;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        case 76:
          if (c === "h") {
            state = 77;
            token += c;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        case 77:
          if (c === ">") {
            state = 78;
            token += c;
            readNextChar();
          } else {
            fail();
            return analysedTokens;
          }
          break;
        case 78:
          state = 0;
          returnToken(tokens.libraryImport);
          break;
        default:
          break;
      }
      //console.log(token);
    }
    console.log("Finished");
    return analysedTokens;
  };
  return analyzeCodeInStateMachine()
};

export default analyze