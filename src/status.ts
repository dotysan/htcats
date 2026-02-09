/*
    HTTP Status codes
*/

// 1xx
export const CN = { status: 100 } as const; // Continue
export const SP = { status: 101 } as const; // Switching Protocols
export const PS = { status: 102 } as const; // Processing
export const EH = { status: 103 } as const; // Early Hints

// 2xx Success
export const OK = { status: 200 } as const; // OK
export const CR = { status: 201 } as const; // Created
export const AC = { status: 202 } as const; // Accepted
export const NAI= { status: 203 } as const; // Non-Authoritative Information
export const NC = { status: 204 } as const; // No Content
export const RC = { status: 205 } as const; // Reset Content
export const PC = { status: 206 } as const; // Partial Content
export const MS = { status: 207 } as const; // Multi-Status
export const AR = { status: 208 } as const; // Already Reported
export const TA = { status: 214 } as const; // Transformation Applied
export const IM = { status: 226 } as const; // IM Used

// 3xx Redirection
export const MC = { status: 300 } as const; // Multiple Choices
export const MP = { status: 301 } as const; // Moved Permanently
export const FD = { status: 302 } as const; // Found
export const SO = { status: 303 } as const; // See Other
export const NM = { status: 304 } as const; // Not Modified
export const UP = { status: 305 } as const; // Use Proxy
// 306?
export const TR = { status: 307 } as const; // Temporary Redirect
export const PR = { status: 308 } as const; // Permanent Redirect

// 4xx Client Errors
export const BR = { status: 400 } as const; // Bad Request
export const UA = { status: 401 } as const; // Unauthorized
export const PQ = { status: 402 } as const; // Payment Required
export const FB = { status: 403 } as const; // Forbidden
export const NF = { status: 404 } as const; // Not Found
export const MN = { status: 405 } as const; // Method Not Allowed
export const NA = { status: 406 } as const; // Not Acceptable
export const PA = { status: 407 } as const; // Proxy Authentication Required
export const RT = { status: 408 } as const; // Request Timeout
export const CF = { status: 409 } as const; // Conflict
export const GO = { status: 410 } as const; // Gone
export const LR = { status: 411 } as const; // Length Required
export const PF = { status: 412 } as const; // Precondition Failed
export const PL = { status: 413 } as const; // Payload Too Large
// TODO: 414-417
export const IT = { status: 418 } as const; // I'm a Teapot
// TODO: 419-426
export const TM = { status: 429 } as const; // Too Many Requests
// TODO: 431, 444, 450, 451, 495-499

export const IE = { status: 500 } as const; // Internal Error
export const NI = { status: 501 } as const; // Not Implemented
export const BG = { status: 502 } as const; // Bad Gateway
export const SU = { status: 503 } as const; // Service Unavailable
export const GT = { status: 504 } as const; // Gateway Timeout
export const HV = { status: 505 } as const; // HTTP Version Not Supported
// TODO: 506-511, 521-523, 525, 530, 599
