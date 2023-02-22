import moment from 'moment'

export const JSON_FIELDS_CSV = {
    pt: {
        json_fields: {
            'Ponto de ronda': 'patrolPoint',
            Evento: 'event',
            Vigilante: 'vigilant',
            'Data de início': 'startDate',
            'Data fim': 'endDate',
            Empresa: 'account',
            Cliente: 'client',
            Local: 'site',
        },
        json_data: [
            {
                patrolPoint: '',
                event: '',
                vigilant: '',
                startDate: '',
                endDate: '',
                account: '',
                client: '',
                site: '',
            },
        ],
        json_meta: [
            [
                {
                    key: 'charset',
                    value: 'utf-8',
                },
            ],
        ],
        filename: 'rondas_nao_visitadas_' + moment().format('DD-MM-YYYY') + '.csv',
    },
    en: {
        json_fields: {
            'Patrol Point': 'patrolPoint',
            Event: 'event',
            Vigilant: 'vigilant',
            'Start date': 'startDate',
            'End date': 'endDate',
            Company: 'account',
            Account: 'client',
            Local: 'site',
        },
        json_data: [
            {
                patrolPoint: '',
                event: '',
                vigilant: '',
                startDate: '',
                endDate: '',
                account: '',
                client: '',
                site: '',
            },
        ],
        json_meta: [
            [
                {
                    key: 'charset',
                    value: 'utf-8',
                },
            ],
        ],
        filename: 'not_visited_patrols_' + moment().format('YYYY-MM-DD') + '.csv',
    },
}
