import axios from 'axios'
import Ajv from 'ajv'
import {
    createEndpointClient,
    HttpMethod,
    validateRequestData,
    compileResponseSchemas,
    EndpointSchema
} from '../endpointSchemaClient'
import { Type } from '@sinclair/typebox'

jest.mock('axios')
const mockedAxios = jest.mocked(axios)

describe('createEndpointClient', () => {
    const ajv = new Ajv()

    const mockSchema: EndpointSchema = {
        headers: Type.Object({
            Authorization: Type.String()
        }),

        params: Type.Object({
            id: Type.String()
        }),

        body: Type.Object({
            name: Type.String()
        }),

        response: {
            200: Type.Object({
                message: Type.String()
            })
        }
    }

    describe('validateRequestData', () => {
        const compiledSchemas = {
            headers: mockSchema.headers
                ? ajv.compile(mockSchema.headers)
                : undefined,
            params: mockSchema.params
                ? ajv.compile(mockSchema.params)
                : undefined,
            body: mockSchema.body ? ajv.compile(mockSchema.body) : undefined,
            response: compileResponseSchemas(mockSchema.response)
        }

        it('should throw an error if params validation fails', async () => {
            const invalidParameters = { id: 123 } // Not a string

            expect(() =>
                validateRequestData(
                    { params: invalidParameters },
                    compiledSchemas
                )
            ).toThrow('Params validation failed')
        })

        it('should throw an error if body validation fails', async () => {
            const invalidBody = { name: 123 } // Not a string

            expect(() =>
                validateRequestData({ body: invalidBody }, compiledSchemas)
            ).toThrow('Body validation failed')
        })

        it('should not throw an error if no params or body are provided', () => {
            expect(() =>
                validateRequestData(undefined, compiledSchemas)
            ).not.toThrow()
        })
    })

    describe('compileResponseSchemas', () => {
        it('should compile response schemas correctly', () => {
            const compiledResponseSchemas = compileResponseSchemas(
                mockSchema.response
            )
            expect(compiledResponseSchemas).toHaveProperty('200')
            expect(typeof compiledResponseSchemas['200']).toBe('function')
        })
    })

    describe('createEndpointClient Success Codes', () => {
        const client = createEndpointClient(mockSchema)

        it('should validate response data for success status codes', async () => {
            const responseData = { message: 'Success' }

            mockedAxios.mockResolvedValueOnce({
                status: 200,
                data: responseData
            })

            const response = await client({
                method: HttpMethod.GET,
                url: '/test',
                params: { id: '123' },
                body: { name: 'Test' }
            })

            expect(response).toEqual(responseData)
        })

        it('should throw an error if response validation fails', async () => {
            const invalidResponseData = { incorrectField: 'Invalid' } // Doesn't match the schema

            mockedAxios.mockResolvedValueOnce({
                status: 200,
                data: invalidResponseData
            })

            await expect(
                client({
                    method: HttpMethod.GET,
                    url: '/test',
                    params: { id: '123' },
                    body: { name: 'Test' }
                })
            ).rejects.toThrow('Response validation failed')
        })

        it('should throw an error on non-success status codes', async () => {
            mockedAxios.mockResolvedValueOnce({ status: 404 })

            await expect(
                client({
                    method: HttpMethod.GET,
                    url: '/not-found',
                    params: { id: '123' },
                    body: { name: 'Test' }
                })
            ).rejects.toThrow('Error response: 404')
        })
    })
})
