import moment from 'moment'

export const JSON_FIELDS_CSV = {
    notVisitedPatrolPoint: {
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
            title: 'Rondas não realizadas - Pontos de ronda não visitados',
            filename: 'rondas_nao_realizadas_' + moment().format('DD/MM/YYYY'),
        },
        en: {
            json_fields: {
                'Patrol Point': 'patrolPoint',
                Event: 'event',
                Vigilant: 'vigilant',
                'Start date': 'startDate',
                'End date': 'endDate',
                Account: 'account',
                Client: 'client',
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
            title: 'Missed patrols - Patrol points not visited',
            filename: 'missed_patrols_' + moment().format('DD/MM/YYYY'),
        },
    },
}
