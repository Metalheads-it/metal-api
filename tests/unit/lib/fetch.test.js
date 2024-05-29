import { getJSON } from '../../../src/lib/fetch.js';
import assert from 'node:assert';
import { mock, describe, it } from 'node:test';
import mockData from '../../mock_data/ajax-band-search-immortal.json' assert { type: 'json' };

describe('testing fetch lib', () => {
    it('normal fetch recovery', async () => {
        const json = () => {
            return mockData;
        };
        mock.method(global, 'fetch', async () => {
            return { json, status: 200, ok: true };
        });
        const data = await getJSON(
            'https://www.metal-archives.com/search/ajax-band-search/?field=name&query=immortal&sEcho=1&iColumns=3&sColumns=&iDisplayStart=0&iDisplayLength=200&mDataProp_0=0&mDataProp_1=1&mDataProp_2=2',
        );
        mock.reset();
        assert('error' in data);
        assert('iTotalRecords' in data);
        assert('iTotalDisplayRecords' in data);
        assert('aaData' in data);
    });
    it('test for error 404 error', { todo: true });
    it('test for error 500 error', { todo: true });
    it('test for error other server error', { todo: true });
    it('test for error other generic error', { todo: true });
});
