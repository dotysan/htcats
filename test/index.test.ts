import {
  // afterEach,
  // beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  cat,
  IE,
  NF,
  OK,
} from '../src/index';

describe('http-cats', () => {
  describe('cat()', () => {
    it('should return a Response for valid status codes', async () => {
      const response = await cat(200);
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
    });

    it('should accept status code objects', async () => {
      const response = await cat(OK);
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
    });

    it('should throw TypeError for invalid status codes', async () => {
      // await expect(() => cat(999)).rejects.toThrow(TypeError);
      await expect(cat(999)).rejects.toThrow(TypeError);
    });

    it('should throw TypeError for out-of-range codes', async () => {
      // await expect(() => cat(50)).rejects.toThrow(TypeError);
      await expect(cat(50)).rejects.toThrow(TypeError);
    });

    it('should handle 404 status code', async () => {
      const response = await cat(404);
      expect(response.status).toBe(404);
    });

    it('should handle 500 status code', async () => {
      const response = await cat(500);
      expect(response.status).toBe(500);
    });

    it('should handle status code object input', async () => {
      const response = await cat(NF);
      expect(response.status).toBe(404);
    });

    // // Cover line 51: KNOWN_CAT_CODES.has() returns false
    // it('should return plain text for unknown cat codes', async () => {
    //   const response = await cat(103);
    //   expect(response.status).toBe(503);
    //   expect(response.headers.get('X-Cat-Available')).toBe('false');
    //   const body = await response.text();
    //   expect(body).toContain('HTTP 103 🐱 (service unavailable)');
    // });

    // // Cover line 51: KNOWN_CAT_CODES.has() returns true with successful fetch
    // it('should fetch and return cat image for known codes', async () => {
    //   const mockImageData = new Uint8Array([1, 2, 3]);
    //   vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
    //     ok: true,
    //     status: 200,
    //     arrayBuffer: () => Promise.resolve(mockImageData.buffer),
    //   }));

    //   const response = await cat(418);
    //   // expect(response.status).toBe(418);
    //   expect(response.status).toBe(503);
    //   expect(response.headers.get('X-Cat-Available')).toBe('false');

    //   vi.unstubAllGlobals();
    // });

    // Cover line 51: KNOWN_CAT_CODES.has() returns false
    it('should return plain text for unknown cat codes', async () => {
      const response = await cat(414); // 414 is commented out in KNOWN_CAT_CODES
      expect(response.status).toBe(414);
      expect(response.headers.get('Content-Type')).toBe('text/plain');
      expect(response.headers.get('X-Cat-Available')).toBe('false');
      const body = await response.text();
      expect(body).toContain('HTTP 414 🐱 (no cat image available)');
    });

    // Cover line 67: fetch response !ok branch
    it('should handle fetch response errors', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
      }));

      const response = await cat(200);
      expect(response.status).toBe(200);
      expect(response.headers.get('X-Cat-Available')).toBe('false');
      const body = await response.text();
      expect(body).toContain('cat image not found');

      vi.unstubAllGlobals();
    });

    // Cover line 88: catch block for fetch errors
    it('should handle fetch timeout errors', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('Timeout')));

      const response = await cat(200);
      expect(response.status).toBe(503);
      expect(response.headers.get('X-Cat-Available')).toBe('false');
      const body = await response.text();
      expect(body).toContain('service unavailable');

      vi.unstubAllGlobals();
    });

    // Cover lines 81-92: successful fetch with known cat code
    it('should successfully fetch and return cat image for known codes', async () => {
      const mockHeaders = new Headers(); // No Content-Type set to cover the || branch
      const mockBody = new ReadableStream();
      
      vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: mockHeaders,
        body: mockBody,
      }));

      const response = await cat(200);
      expect(response.status).toBe(200);
      expect(response.headers.get('X-Cat-Available')).toBe('true');
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=86400');
      expect(response.headers.get('Content-Type')).toBe('image/jpeg'); // Covers the || branch

      vi.unstubAllGlobals();
    });

    // Cover the instanceof Error branch in catch (false case)
    it('should handle non-Error fetch errors', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce('Network error'));

      const response = await cat(200);
      expect(response.status).toBe(503);
      expect(response.headers.get('X-Cat-Available')).toBe('false');
      const body = await response.text();
      expect(body).toContain('service unavailable');
      expect(response.headers.get('X-Cat-Error')).toBe('Unknown error'); // Covers the else branch

      vi.unstubAllGlobals();
    });

  });

  describe('Status code constants', () => {
    it('should export OK (200)', () => {
      expect(OK.status).toBe(200);
    });

    it('should export NOT_FOUND (404)', () => {
      expect(NF.status).toBe(404);
    });

    it('should export INTERNAL_SERVER_ERROR (500)', () => {
      expect(IE.status).toBe(500);
    });
  });

  describe('utils', () => {
    // Cover line 12 in utils.ts: extractStatusCode returning NaN
    it('should handle invalid input to extractStatusCode', async () => {
      await expect(cat({ invalid: 'object' } as any)).rejects.toThrow(TypeError);
    });
  });
});
