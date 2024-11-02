import type { Config } from '@jest/types'
import path from 'node:path'

import * as dotenv from 'dotenv'

//eslint-disable-next-line unicorn/prefer-module
dotenv.config({ path: path.join(__dirname, '.env.jest') })

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    reporters: ['default', 'jest-junit'],
    moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1'
    },
    testPathIgnorePatterns: ['/node_modules/', '/build/', '/dist/']
}

export default config
