import { prepareBandResults } from './services/prepare-band-results.js';
import { archivesSearchBand } from './services/archives-search.js';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

interface IBandSearch {
    band: string;
    offset: number;
}

const searchBand = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const parameters: IBandSearch = request.params as IBandSearch;
        const { band, offset } = {
            band: parameters?.band.trim() ?? '',
            offset: Number(parameters?.offset) || 0,
        } as IBandSearch;

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

const search = async (fastify: FastifyInstance) => {
    fastify.get('/search/:band', options);
    fastify.get('/search/:band/:offset', options);
};
export default search;
