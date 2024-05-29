import { prepareBandResults } from './services/prepareBandResults.js';
import { archivesSearchBand } from './services/archivesSearch.js';

const searchBand = async (request, reply) => {
    try {
        const band = request.params?.band.trim() ?? '';
        const offset = request.params?.offset ?? 0;

        const data = await archivesSearchBand(band, offset);

        const countTotal = data.iTotalRecords ?? 0;
        const results = prepareBandResults(data.aaData ?? []);
        const countCurrent = results?.length ?? 0;

        reply.code(200).send({
            search: band,
            offset,
            countTotal,
            countCurrent,
            results,
        });
    } catch (error) {
        reply.code(500).send(error);
    }
};

const options = {
    schema: {
        params: {
            type: 'object',
            properties: {
                band: { type: 'string', minLength: 1 },
                offset: { type: 'integer' },
            },
            required: ['band'],
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    search: { type: 'string' },
                    offset: { type: 'integer' },
                    countTotal: { type: 'integer' },
                    countCurrent: { type: 'integer' },
                    results: { type: 'array' },
                },
            },
        },
    },
    handler: searchBand,
};

const search = async (fastify) => {
    fastify.get('/search/:band', options);
    fastify.get('/search/:band/:offset', options);
};
export default search;
