import {
    getBandIdFromLink,
    getBandNameFromHTML,
    getBandLinkFromHTML,
    prepareBandResults,
} from '../../../../../src/routes/bands/services/prepare-band-results.ts';
import assert from 'node:assert';
import { parse } from 'node-html-parser';
import { describe, it } from 'node:test';
import mockDataEmptyArchives from '../../../../mock_data/ajax-band-search-empty.json' assert { type: 'json' };
import mockDataArchives from '../../../../mock_data/ajax-band-search-immortal.json' assert { type: 'json' };
import mockDataGenerated from '../../../../mock_data/complete-200-band-data.json' assert { type: 'json' };

describe('testing band id generation', () => {
    it('check band id generation from generated data', async () => {
        mockDataGenerated.map((element) => {
            assert.strictEqual(getBandIdFromLink(element.link), element.id);
        });
    });
    it('check band id generation from invalid input', async () => {
        // eslint-disable-next-line unicorn/no-useless-undefined
        assert.strictEqual(getBandIdFromLink(undefined), undefined);
    });
});
describe('testing band id generation', () => {
    it('check band name generation', async () => {
        mockDataGenerated.map((element) => {
            const linkData = parse(element.originalLink);
            assert.strictEqual(getBandNameFromHTML(linkData), element.band);
        });
    });
    it('check band name generation from invalid input', async () => {
        // eslint-disable-next-line unicorn/no-useless-undefined
        assert.strictEqual(getBandNameFromHTML(undefined), undefined);
    });
});
describe('testing band link generation', () => {
    it('check band link generation', async () => {
        mockDataGenerated.map((element) => {
            const linkData = parse(element.originalLink);
            assert.strictEqual(getBandLinkFromHTML(linkData), element.link);
        });
    });
    it('check band link generation from invalid input', async () => {
        // eslint-disable-next-line unicorn/no-useless-undefined
        assert.strictEqual(getBandLinkFromHTML(undefined), undefined);
    });
    it('check band link generation from invalid input', async () => {
        // @ts-expect-error testing wrong argument type
        assert.strictEqual(getBandLinkFromHTML('hello'), undefined);
    });
});

describe('testing prepareBandResults', () => {
    it('check empty band data', async () => {
        const data = mockDataEmptyArchives;
        const results = prepareBandResults(data.aaData ?? []);
        assert.strictEqual(results?.length, 0);
    });
    it('check with generated band data, check results', async () => {
        mockDataGenerated.map((bandData) => {
            const bands = prepareBandResults([bandData?.aaData]);
            const band = bands[0] ?? {};
            assert.strictEqual(band.band, bandData.band);
            assert.strictEqual(band.link, bandData.link);
            assert.strictEqual(band.id, bandData.id);
            assert.strictEqual(band.genre, bandData.genre);
            assert.strictEqual(band.country, bandData.country);
        });
    });
    it('check with real data, check totals', async () => {
        const bands = prepareBandResults(mockDataArchives?.aaData ?? []);
        assert.strictEqual(bands?.length, 105);
    });
    it('check with invalid data', async () => {
        const results = prepareBandResults([
            [
                '<a href="https://www.metal-archives.com/bands/Immortal/25791">Immortal</a> (<strong>a.k.a.</strong> [i\'mc:tl]) <!-- 8.533402 -->',
                'Death Metal',
                'Denmark',
            ],
            // @ts-expect-error testing wrong argument type
            [undefined, undefined, undefined],
            [
                '<a href="https://www.metal-archives.com/bands/Immortal/44201">Immortal</a>  <!-- 8.533402 -->',
                'Death Metal',
                'Malaysia',
            ],
        ]);
        assert.strictEqual(results?.length, 2);
    });
    it('test for error on getBankLinkFromHTML', { todo: true });
});
