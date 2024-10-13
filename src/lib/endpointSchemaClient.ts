import { Static, TSchema } from '@sinclair/typebox'
import { Data } from '@src/shared/types'
import Ajv, { ValidateFunction } from 'ajv'
import axios, { AxiosRequestConfig } from 'axios'

const ajv = new Ajv()

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH'
}

interface EndpointSchema {
    querystring?: TSchema
    body?: TSchema
    response: TSchema
}

export interface ClientOptions {
    method: HttpMethod
    url: string
    data: Data
}

interface CompiledSchema {
    querystring?: ValidateFunction<unknown>
    body?: ValidateFunction<unknown>
    response: ValidateFunction<unknown>
}

const validateRequestData = (
    method: HttpMethod,
    data: Data,
    compiledSchemas: CompiledSchema
) => {
    const schemaMap = {
        GET: compiledSchemas.querystring,
        POST: compiledSchemas.body,
        PUT: compiledSchemas.body,
        DELETE: compiledSchemas.querystring,
        PATCH: compiledSchemas.body
    }

    const schemaValidator = schemaMap[method]

    if (!schemaValidator) return

    const valid = schemaValidator(data)
    if (!valid) {
        const errors = schemaValidator.errors
        throw new Error(`Validation failed: ${ajv.errorsText(errors)}`)
    }
}

export const createEndpointClient = <T extends EndpointSchema>(schema: T) => {
    const compiledSchemas = {
        querystring: schema.querystring
            ? ajv.compile(schema.querystring)
            : undefined,
        body: schema.body ? ajv.compile(schema.body) : undefined,
        response: ajv.compile(schema.response)
    }

    return async (options: ClientOptions): Promise<Static<T['response']>> => {
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

        if (compiledSchemas.response) {
            const valid = compiledSchemas.response(response.data)
            if (!valid) {
                const errors = compiledSchemas.response.errors
                throw new Error(
                    `Response validation failed: ${ajv.errorsText(errors)}`
                )
            }
        }

        return response.data
    }
}
