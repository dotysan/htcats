// Type definitions
type HttpStatusCode = number;
type StatusObject = { status: HttpStatusCode };

export type HttpCatInput = HttpStatusCode | StatusObject;
