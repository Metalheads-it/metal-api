import { prepareBandResults } from '../services/prepare-band-results';
import type { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import { searchBandSchema } from '../schema/search';
import { ServiceInfoRoutesOptions } from '../index';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

interface IBandSearch {
    band: string;
    offset: number;
}

const searchBand = async (request: FastifyRequest, reply: FastifyReply, fastify: FastifyInstance) => {
    try {
        const parameters: IBandSearch = request.params as IBandSearch;
        const { band, offset } = {
            band: parameters?.band.trim() ?? '',
            offset: Number(parameters?.offset) || 0,
        } as IBandSearch;

        const data = await fastify.metalArchives.searchBand(band, offset);

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

export const searchRoute: FastifyPluginAsync<ServiceInfoRoutesOptions> = async (fastify) => {
    const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

    server.get('/bands/search/:band', {
        schema: searchBandSchema,
        handler: async (request, reply) => {
            await searchBand(request, reply, fastify);
        },
    });
    server.get('/bands/search/:band/:offset', {
        schema: searchBandSchema,
        handler: async (request, reply) => {
            await searchBand(request, reply, fastify);
        },
    });
};

export default searchRoute;
