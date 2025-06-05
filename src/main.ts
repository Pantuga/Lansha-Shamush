import * as input from './input'
import * as lexer from './lexer'

async function main()
{
    let inp: string = '';

    while (inp !== 'exit')
    {
        inp = await input.ask('>>>');
        lexer.tokenize(inp, true);
    }

    input.end();
}

main()