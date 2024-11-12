import {
    SearchBandAdvancedQuery,
    SearchBandAdvancedResponse
} from '@src/clients/metalArchives/schema/searchBandAdvanced'

export const searchBandAdvancedQueryFixture = {
    bandName: `immortal`,
    status: [1, 2, 3, 4, 5, 6],
    sEcho: 1,
    iColumns: 6,
    sColumns: '',
    iDisplayStart: 0,
    iDisplayLength: 200,
    mDataProp_0: 0,
    mDataProp_1: 1,
    mDataProp_2: 2,
    mDataProp_3: 3,
    mDataProp_4: 4,
    mDataProp_5: 5
} satisfies SearchBandAdvancedQuery

export const searchBandAdvancedResponseFixture = {
    error: '',
    iTotalRecords: 4,
    iTotalDisplayRecords: 4,
    sEcho: 1,
    aaData: [
        [
            '<a href="https://www.metal-archives.com/bands/Immortal/25791">Immortal</a> (<strong>a.k.a.</strong> [i\'mc:tl]) <!-- 11.52033 -->',
            'Death Metal',
            'Denmark',
            'Næstved, Sjælland ',
            'Reincarnation',
            '1988',
            '000INDIE000'
        ],
        [
            '<a href="https://www.metal-archives.com/bands/Immortal/3540470418">Immortal</a>  <!-- 11.52033 -->',
            'Death Metal',
            'Mexico',
            'Guadalupe, Nuevo León ',
            'Witchcraft, Death, Destruction',
            '1989',
            '000INDIE000'
        ],
        [
            '<a href="https://www.metal-archives.com/bands/Immortal/75">Immortal</a>  <!-- 11.52033 -->',
            'Black Metal',
            'Norway',
            'Os/Bergen, Vestland ',
            'Grimness, Winter, War, Winterdemons, Blashyrkh, Dark fantasy, Mysticism',
            '1991',
            'Nuclear Blast'
        ],
        [
            '<a href="https://www.metal-archives.com/bands/Immortal/32331">Immortal</a>  <!-- 11.52033 -->',
            'Speed/Thrash Metal',
            'United States',
            'Bethpage (Long Island), New York ',
            'Christianity',
            '1989',
            '000INDIE000'
        ]
    ]
} satisfies SearchBandAdvancedResponse
