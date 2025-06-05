const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_'.split('');
const numbers = '0123456789'.split('');
const symbols: string[] = '\\|!@#$%&/()=?{[]}\'*+-.:,;<>~^'.split('')
const multiCharSymbols: string[] = '!=<>*'.split(''); // for '==', '>=', '**', etc.
const whitespace: string[] = [' ', '\t', '\n'];
const quote: string = '"'

class Token {
    public value: string;
    public type: TokenType;

    constructor (value: string, type: TokenType) {
        this.value = value;
        this.type = type;
    }
    log (): void {
        console.log([this.value, this.type])
    }
}

enum TokenType {
    Error,
    Identifier,
    Symbol,
    StringLit,
    NumberLit,
}

export function tokenize (str: string, debugLogs: boolean = false): Token[] {
    let out: Token[] = [];
    let buff: string = '';
    let typeBuff: TokenType = TokenType.Error;

    function resetBuff(allowEmpty: boolean = false) { // Push buffer into output
        if (buff !== '' || allowEmpty) {
            out.push(new Token(buff, typeBuff))
            buff = ''
            typeBuff = TokenType.Error
        }
    }

    for (let i = 0; i < str.length; i++) {
        const ch = str[i];

        if (ch === quote) {
            // Parse quoted string
            typeBuff = TokenType.StringLit;

            while (i + 1 < str.length &&  str[i + 1] !== quote) {
                buff += str[++i];
            }
            resetBuff(true);
            i++
        }
        else if (whitespace.includes(ch)) {
            resetBuff();
            // Skip remaining whitespace
            while (i + 1 < str.length && whitespace.includes(str[i + 1])) i++;
        }
        else if (letters.includes(ch)) {
            // Parse words
            typeBuff = TokenType.Identifier;

            buff += ch;
            while (i + 1 < str.length && 
                   (letters.includes(str[i + 1]) || numbers.includes(str[i + 1]))) {
                buff += str[++i];
            }
            resetBuff();
        }
        else if (numbers.includes(ch)) {
            // Parse numbers
            typeBuff = TokenType.NumberLit;

            buff += ch;
            while (i + 1 < str.length && (numbers.includes(str[i + 1]) || str[i + 1] === '.')) {
                buff += str[++i];
            }
            resetBuff();
        }
        else if (multiCharSymbols.includes(ch) && 
                 i + 1 < str.length && 
                 symbols.includes(str[i + 1])) {
            // Parse multi-character symbols
            typeBuff = TokenType.Symbol;

            buff += ch + str[++i];
            resetBuff();
        }
        else if (symbols.includes(ch)) {
            // Parse single-character symbols
            typeBuff = TokenType.Symbol;

            buff += ch;
            resetBuff();
        }
        else {
            // Unknown character
            buff = ch;
            resetBuff();
        }
    }

    if (debugLogs) for (let i = 0; i < out.length; i++) {
        out[i].log();
    }

    return out
}