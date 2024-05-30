import { build } from '../../../../src/app.ts';
import assert from 'node:assert';
import { mock, describe, it } from 'node:test';
import mockData from '../../../mock_data/ajax-band-search-immortal.json' assert { type: 'json' };

describe("testing 'bands/search' route", () => {
    it('band search, no offset', async () => {
        const json = () => {
            return mockData;
        };
        mock.method(global, 'fetch', async () => {
            return { json, status: 200, ok: true };
        });
        const app = build();
        const response = await app.inject({
            url: '/bands/search/immortal',
        });
        mock.reset();
        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(response.json().search, 'immortal');
        assert.strictEqual(response.json().offset, 0);
        assert.strictEqual(response.json().countTotal, 105);
        assert.strictEqual(response.json().countCurrent, 105);
        assert('results' in response.json());
        assert.strictEqual(response.json().results.length, 105);
    });
    it('band search, defined offset', async () => {
        const json = () => {
            return mockData;
        };
        mock.method(global, 'fetch', async () => {
            return { json, status: 200, ok: true };
        });
        const app = build();
        const response = await app.inject({
            url: '/bands/search/immortal/10',
        });
        mock.reset();
        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(response.json().search, 'immortal');
        assert.strictEqual(response.json().offset, 10);
        assert.strictEqual(response.json().countTotal, 105);
        assert.strictEqual(response.json().countCurrent, 105);
        assert('results' in response.json());
        assert.strictEqual(response.json().results.length, 105);
    });
    it('missing band', async () => {
        const json = () => {
            return mockData;
        };
        mock.method(global, 'fetch', async () => {
            return { json, status: 200, ok: true };
        });
        const app = build();
        const response = await app.inject({
            url: '/bands/search/',
        });
        mock.reset();
        assert.strictEqual(response.statusCode, 400);
    });
    it('missing band, defined offset', async () => {
        const json = () => {
            return mockData;
        };
        mock.method(global, 'fetch', async () => {
            return { json, status: 200, ok: true };
        });
        const app = build();
        const response = await app.inject({
            url: '/bands/search//10',
        });
        mock.reset();
        assert.strictEqual(response.statusCode, 400);
    });
    it('test for error on getBankLinkFromHTML', { todo: true });
    it('simulate error in FETCH', async () => {
        mock.method(global, 'fetch', async () => {
            return { status: 404, ok: false };
        });
        const app = build();
        const response = await app.inject({
            url: '/bands/search/some-band',
        });
        mock.reset();
        assert.strictEqual(response.statusCode, 500);
    });
});
