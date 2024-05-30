import { prepareBandName, prepareOffset } from '../../../../../src/routes/bands/services/archivesSearch.ts';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import mockData from '../../../../mock_data/ajax-band-search-immortal.json' assert { type: 'json' };
import mockDataGenerated from '../../../../mock_data/complete-200-band-data.json' assert { type: 'json' };
import esmock from 'esmock';

describe('testing parameters generation', () => {
    it('check band names slug generation, use mock data', async () => {
        mockDataGenerated.map((element) => {
            assert.strictEqual(prepareBandName(element.band), element.preparedBandName);
        });
    });
    it('check band names slug generation, undefined', async () => {
        assert.strictEqual(prepareBandName(undefined), '');
    });
    it('check offset generation, normal', () => {
        assert.strictEqual(prepareOffset(10), 10);
    });
    it('check offset generation, 0', () => {
        assert.strictEqual(prepareOffset(0), 0);
    });
    it('check offset generation, null', () => {
        // @ts-expect-error testing wrong argument type
        assert.strictEqual(prepareOffset(null), 0);
    });
    it('check offset generation, undefined', () => {
        assert.strictEqual(prepareOffset(undefined), 0);
    });
    it('check offset generation, negative', () => {
        assert.strictEqual(prepareOffset(-1), 0);
    });
    it('check offset generation, invalid', () => {
        // @ts-expect-error testing wrong argument type
        assert.strictEqual(prepareOffset('invalid'), 0);
    });
});
describe("testing 'bands/search' route", async () => {
    it('normal band, no offset', async () => {
        const archivesSearch = await esmock('../../../../../src/routes/bands/services/archivesSearch.ts', {
            '../../../../../src/lib/fetch.ts': {
                getJSON: () => mockData,
            },
        });
        const data = await archivesSearch.archivesSearchBand('some random band');
        assert.strictEqual(data.error, '');
        assert.strictEqual(data.iTotalRecords, 105);
        assert.strictEqual(data.iTotalDisplayRecords, 105);
        assert.strictEqual(data.aaData.length, 105);
    });
    it('normal band, with offset', async () => {
        const archivesSearch = await esmock('../../../../../src/routes/bands/services/archivesSearch.ts', {
            '../../../../../src/lib/fetch.ts': {
                getJSON: () => mockData,
            },
        });
        const data = await archivesSearch.archivesSearchBand('some random band', 10);
        assert.strictEqual(data.error, '');
        assert.strictEqual(data.iTotalRecords, 105);
        assert.strictEqual(data.iTotalDisplayRecords, 105);
        assert.strictEqual(data.aaData.length, 105);
    });
    it('empty band', async () => {
        const archivesSearch = await esmock('../../../../../src/routes/bands/services/archivesSearch.ts', {
            '../../../../../src/lib/fetch.ts': {
                getJSON: () => mockData,
            },
        });
        const data = await archivesSearch.archivesSearchBand('');
        assert.strictEqual(data.error, '');
        assert.strictEqual(data.iTotalRecords, 0);
        assert.strictEqual(data.iTotalDisplayRecords, 0);
        assert.strictEqual(data.aaData.length, 0);
    });
    it('empty band, force all', async () => {
        const archivesSearch = await esmock('../../../../../src/routes/bands/services/archivesSearch.ts', {
            '../../../../../src/lib/fetch.ts': {
                getJSON: () => mockData,
            },
        });
        const data = await archivesSearch.archivesSearchBand('', 10, true);
        assert.strictEqual(data.error, '');
        assert.strictEqual(data.iTotalRecords, 105);
        assert.strictEqual(data.iTotalDisplayRecords, 105);
        assert.strictEqual(data.aaData.length, 105);
    });
    it('normal band, invalid offset', async () => {
        const archivesSearch = await esmock('../../../../../src/routes/bands/services/archivesSearch.ts', {
            '../../../../../src/lib/fetch.ts': {
                getJSON: () => mockData,
            },
        });
        const data = await archivesSearch.archivesSearchBand('some random band', -10);
        assert.strictEqual(data.error, '');
        assert.strictEqual(data.iTotalRecords, 105);
        assert.strictEqual(data.iTotalDisplayRecords, 105);
        assert.strictEqual(data.aaData.length, 105);
    });
    it('test for error on getJSON', { todo: true });
});
