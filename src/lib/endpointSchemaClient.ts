import { Static, TSchema } from '@sinclair/typebox'
import { Data } from '@src/shared/types'
import Ajv, { ValidateFunction } from 'ajv'
import addFormats from 'ajv-formats'
import axios, { AxiosRequestConfig } from 'axios'

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH'
}

type ResponseSchema =
    | { [httpStatusCode: string]: TSchema; 200: TSchema }
    | { [httpStatusCode: string]: TSchema; 201: TSchema }
    | { [httpStatusCode: string]: TSchema; 204: TSchema }

interface EndpointSchema {
    headers?: TSchema
    params?: TSchema
    querystring?: TSchema
    body?: TSchema
    response: ResponseSchema
}

export interface ClientOptions {
    method: HttpMethod
    url: string
    data: Data
}

interface CompiledSchema {
    headers?: ValidateFunction<unknown>
    params?: ValidateFunction<unknown>
    querystring?: ValidateFunction<unknown>
    body?: ValidateFunction<unknown>
    response: { [httpStatusCode: string]: ValidateFunction<unknown> }
}

const ajv = new Ajv()
addFormats(ajv)

const validateRequestData = (
    method: HttpMethod,
    data: Data,
    compiledSchemas: CompiledSchema
) => {
    const schemaValidator = ['GET', 'DELETE'].includes(method)
        ? compiledSchemas.querystring
        : compiledSchemas.body

    if (schemaValidator && !schemaValidator(data)) {
        throw new Error(
            `Validation failed: ${ajv.errorsText(schemaValidator.errors)}`
        )
    }
}

function compileResponseSchemas(responseSchema: {
    [httpStatusCode: string]: TSchema
}): CompiledSchema['response'] {
    return Object.fromEntries(
        Object.entries(responseSchema).map(([statusCode, schema]) => [
            statusCode,
            ajv.compile(schema)
        ])
    )
}

export const createEndpointClient = <T extends EndpointSchema>(schema: T) => {
    const compiledSchemas = {
        headers: schema.headers ? ajv.compile(schema.headers) : undefined,
        params: schema.params ? ajv.compile(schema.params) : undefined,
        querystring: schema.querystring
            ? ajv.compile(schema.querystring)
            : undefined,
        body: schema.body ? ajv.compile(schema.body) : undefined,
        response: compileResponseSchemas(schema.response)
    }

    return async (
        options: ClientOptions
    ): Promise<Static<T['response'][keyof T['response']]>> => {
        const { method, url, data } = options

        validateRequestData(method, data, compiledSchemas)

        const axiosConfig: AxiosRequestConfig = {
            method: method.toLowerCase(),
            url: url,
            params: ['GET', 'DELETE'].includes(method) ? data : undefined,
            data: ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
                ? data
                : undefined
        }

        const response = await axios(axiosConfig)

        const compiledResponse = compiledSchemas.response[response.status]

        if (compiledResponse && !compiledResponse(response.data)) {
            throw new Error(
                `Response validation failed: ${ajv.errorsText(compiledResponse.errors)}`
            )
        }

        return response.data
    }
}
