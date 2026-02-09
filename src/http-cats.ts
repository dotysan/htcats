import * as status from './status';

import {
	extractStatusCode,
	isValidHttpStatusCode,
} from './utils';

import type { HttpCatInput } from './types';

// prettier-ignore
const KNOWN_CAT_CODES = new Set([
    100, 101, 102, 103,
    200, 201, 202, 204,
    300, 301, 302, 303, 304, 305, 307, 308,
    400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413,
    //414, 415, 416, 417,
    418,
    //419, 420, 421, 422, 423, 424, 425, 426,
    429,
    // 431, 444, 450, 451, 497, 498, 499,
    500, 501, 502, 503, 504, 505,
    //506, 507, 508, 509, 510, 511, 521, 522, 523, 525, 530, 599
]);

/*
    LOLZ
*/
export async function cat(code: HttpCatInput): Promise<Response> {
    // console.debug(`cat(): Generating cat for code: ${JSON.stringify(code)}`);
    const statusCode = extractStatusCode(code);
    if (!isValidHttpStatusCode(statusCode))
	throw new TypeError(`cat() requires a valid HTTP status code (100-599), got: ${statusCode}`);

    // // Handle 1xx status codes - Cloudflare Workers can't create Response objects with these and will throw
    // // RangeError: Responses may only be constructed with status codes in the range 200 to 599, inclusive.
    // if (statusCode >= 100 && statusCode < 200) {
    //     // Return a 200 response with information about the 1xx status
    //     return new Response(`HTTP ${statusCode} 🐱 (informational status - cannot create Response object)`, {
    //         ...OK, // Use 200 instead of the 1xx code
    //         headers: {
    //             'Content-Type': 'text/plain',
    //             'X-Cat-Status': statusCode.toString(),
    //             'X-Cat-Available': 'false',
    //             'X-Cat-Info': 'Cloudflare Workers cannot create Response objects with 1xx status codes',
    //         },
    //     });
    // }
    // above shouldn't be needed since we don't call cat() anymore with 101 WebSocket upgrade

    if (!KNOWN_CAT_CODES.has(statusCode)) {
	return new Response(`HTTP ${statusCode} 🐱 (no cat image available)`, {
	    status: statusCode,
	    headers: {
		'Content-Type': 'text/plain',
		'X-Cat-Status': statusCode.toString(),
		'X-Cat-Available': 'false',
	    },
	});
    }

    try {
	const resp = await fetch(`https://http.cat/${statusCode}`, {
	    signal: AbortSignal.timeout(2000), // 2 second timeout
	});

	if (!resp.ok) {
	    return new Response(`HTTP ${statusCode} 🐱 (cat image not found)`, {
		status: statusCode,
		headers: {
		    'Content-Type': 'text/plain',
		    'X-Cat-Status': statusCode.toString(),
		    'X-Cat-Available': 'false',
		},
	    });
	}

	return new Response(resp.body, {
	    status: statusCode,
	    // headers: resp.headers,
	    headers: {
		'Content-Type': resp.headers.get('Content-Type') || 'image/jpeg',
		'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
		'X-Cat-Status': statusCode.toString(),
		'X-Cat-Available': 'true',
	    },
	});
    } catch (error) {
	return new Response(`HTTP ${statusCode} 🐱 (service unavailable)`, {
	    ...status.SU,
	    headers: {
		'Content-Type': 'text/plain',
		'X-Cat-Error': error instanceof Error ? error.message : 'Unknown error',
		'X-Cat-Available': 'false',
		'X-Original-Status': statusCode.toString(),
	    },
	});
    }
}
