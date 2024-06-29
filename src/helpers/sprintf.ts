/*********
 * https://github.com/alexei/sprintf.js
 * https://www.npmjs.com/package/sprintf-js
 * @version 1.1.3
 */

let __jamvietFIXre = {
    not_string: /[^s]/,
    not_bool: /[^t]/,
    not_type: /[^T]/,
    not_primitive: /[^v]/,
    number: /[diefg]/,
    numeric_arg: /[bcdiefguxX]/,
    json: /[j]/,
    not_json: /[^j]/,
    text: /^[^\x25]+/,
    modulo: /^\x25{2}/,
    placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
    key: /^([a-z_][a-z_\d]*)/i,
    key_access: /^\.([a-z_][a-z_\d]*)/i,
    index_access: /^\[(\d+)\]/,
    sign: /^[+-]/,
}



function sprintf_format(parse_tree: string | any[], argv: IArguments | any[]) {
    var cursor = 1, tree_length = parse_tree.length, arg, output = '', i, k, ph, pad, pad_character, pad_length, is_positive, sign
    for (i = 0; i < tree_length; i++) {
        if (typeof parse_tree[i] === 'string') {
            output += parse_tree[i]
        }
        else if (typeof parse_tree[i] === 'object') {
            ph = parse_tree[i] // convenience purposes only
            if (ph.keys) { // keyword argument
                arg = argv[cursor]
                for (k = 0; k < ph.keys.length; k++) {
                    if (arg === undefined) {
                        // @ts-ignore
                        throw new Error(sprintf('[sprintf] Cannot access property "%s" of undefined value "%s"', ph.keys[k], ph.keys[k-1]))
                    }
                    arg = arg[ph.keys[k]]
                }
            }
            else if (ph.param_no) { // positional argument (explicit)
                arg = argv[ph.param_no]
            }
            else { // positional argument (implicit)
                arg = argv[cursor++]
            }

            if (__jamvietFIXre.not_type.test(ph.type) && __jamvietFIXre.not_primitive.test(ph.type) && arg instanceof Function) {
                arg = arg()
            }

            if (__jamvietFIXre.numeric_arg.test(ph.type) && (typeof arg !== 'number' && isNaN(arg))) {
                // @ts-ignore
                throw new TypeError(sprintf('[sprintf] expecting number but found %T', arg))
            }

            if (__jamvietFIXre.number.test(ph.type)) {
                is_positive = arg >= 0
            }

            switch (ph.type) {
                case 'b':
                    arg = parseInt(arg, 10).toString(2)
                    break
                case 'c':
                    arg = String.fromCharCode(parseInt(arg, 10))
                    break
                case 'd':
                case 'i':
                    arg = parseInt(arg, 10)
                    break
                case 'j':
                    arg = JSON.stringify(arg, null, ph.width ? parseInt(ph.width) : 0)
                    break
                case 'e':
                    arg = ph.precision ? parseFloat(arg).toExponential(ph.precision) : parseFloat(arg).toExponential()
                    break
                case 'f':
                    arg = ph.precision ? parseFloat(arg).toFixed(ph.precision) : parseFloat(arg)
                    break
                case 'g':
                    arg = ph.precision ? String(Number(arg.toPrecision(ph.precision))) : parseFloat(arg)
                    break
                case 'o':
                    arg = (parseInt(arg, 10) >>> 0).toString(8)
                    break
                case 's':
                    arg = String(arg);
                    arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                    break
                case 't':
                    arg = String(!!arg)
                    arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                    break
                case 'T':
                    arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase()
                    arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                    break
                case 'u':
                    arg = parseInt(arg, 10) >>> 0
                    break
                case 'v':
                    arg = arg.valueOf()
                    arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                    break
                case 'x':
                    arg = (parseInt(arg, 10) >>> 0).toString(16)
                    break
                case 'X':
                    arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase()
                    break
            }
            if (__jamvietFIXre.json.test(ph.type)) {
                output += arg
            }
            else {
                if (__jamvietFIXre.number.test(ph.type) && (!is_positive || ph.sign)) {
                    sign = is_positive ? '+' : '-'
                    arg = arg.toString().replace(__jamvietFIXre.sign, '')
                }
                else {
                    sign = ''
                }
                pad_character = ph.pad_char ? ph.pad_char === '0' ? '0' : ph.pad_char.charAt(1) : ' '
                pad_length = ph.width - (sign + arg).length
                pad = ph.width ? (pad_length > 0 ? pad_character.repeat(pad_length) : '') : ''
                output += ph.align ? sign + arg + pad : (pad_character === '0' ? sign + pad + arg : pad + sign + arg)
            }
        }
    }
    return output
}

var sprintf_cache = Object.create(null)

function sprintf_parse(fmt: any) {
    if (sprintf_cache[fmt]) {
        return sprintf_cache[fmt]
    }

    var _fmt = fmt, match: any, parse_tree = [], arg_names = 0
    while (_fmt) {
        if ((match = __jamvietFIXre.text.exec(_fmt)) !== null) {
            parse_tree.push(match[0])
        }
        else if ((match = __jamvietFIXre.modulo.exec(_fmt)) !== null) {
            parse_tree.push('%')
        }
        else if ((match = __jamvietFIXre.placeholder.exec(_fmt)) !== null) {
            if (match[2]) {
                arg_names |= 1
                var field_list = [], replacement_field = match[2], field_match: RegExpExecArray | any = []
                if ((field_match = __jamvietFIXre.key.exec(replacement_field)) !== null) {
                    field_list.push(field_match[1])
                    while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                        if ((field_match = __jamvietFIXre.key_access.exec(replacement_field)) !== null) {
                            field_list.push(field_match[1])
                        }
                        else if ((field_match = __jamvietFIXre.index_access.exec(replacement_field)) !== null) {
                            field_list.push(field_match[1])
                        }
                        else {
                            throw new SyntaxError('[sprintf] failed to parse named argument key')
                        }
                    }
                }
                else {
                    throw new SyntaxError('[sprintf] failed to parse named argument key')
                }
                match[2] = field_list
            }
            else {
                arg_names |= 2
            }
            if (arg_names === 3) {
                throw new Error('[sprintf] mixing positional and named placeholders is not (yet) supported')
            }

            parse_tree.push(
                {
                    placeholder: match[0],
                    param_no:    match[1],
                    keys:        match[2],
                    sign:        match[3],
                    pad_char:    match[4],
                    align:       match[5],
                    width:       match[6],
                    precision:   match[7],
                    type:        match[8]
                }
            )
        }
        else {
            throw new SyntaxError('[sprintf] unexpected placeholder')
        }
        _fmt = _fmt.substring(match[0].length)
    }
    return sprintf_cache[fmt] = parse_tree
}

/*
* A type specifier that can be any of:
*
    % — yields a literal % character
    b — yields an integer as a binary number
    c — yields an integer as the character with that ASCII value
    d or i — yields an integer as a signed decimal number
    e — yields a float using scientific notation
    u — yields an integer as an unsigned decimal number
    f — yields a float as is; see notes on precision above
    g — yields a float as is; see notes on precision above
    o — yields an integer as an octal number
    s — yields a string as is
    t — yields true or false
    T — yields the type of the argument1
    v — yields the primitive value of the specified argument
    x — yields an integer as a hexadecimal number (lower-case)
    X — yields an integer as a hexadecimal number (upper-case)
    j — yields a JavaScript object or array as a JSON encoded string
*/

/**
 * Sprintf - giống như php
 * Cách dùng: sprintf('Chào %s', user_name);
 * @example sprintf('%2$s %3$s a %1$s', 'cracker', 'Polly', 'wants')
 * @example vsprintf('The first 4 letters of the english alphabet are: %s, %s, %s and %s', ['a', 'b', 'c', 'd'])
 * @param _string string 
 * @param args any
 * @returns 
 */
export function sprintf(_string: string, ...args: any): string {
    // `arguments` is not an array, but should be fine for this call
    return sprintf_format(sprintf_parse(_string), arguments)
}

export function vsprintf(fmt: any, argv: any) {
    // @ts-ignore
    return sprintf.apply(null, [fmt].concat(argv || []))
}