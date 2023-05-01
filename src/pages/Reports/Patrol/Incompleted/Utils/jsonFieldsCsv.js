import moment from 'moment'

export const JSON_FIELDS_CSV = {
    incompletedPatrolPoints: {
        pt: {
            json_fields: {
                'Ponto de ronda': 'patrolPoint',
                Evento: 'event',
                Vigilante: 'vigilant',
                'Data de início': 'startDate',
                'Data fim': 'endDate',
                'Data da leitura': 'scannedDate',
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
                    scannedDate: '',
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
            title: 'Rondas incompletas - Pontos visitados e não visitados',
            filename: 'rondas_incompletas_' + moment().format('YYYY-MM-DD'),
        },
        en: {
            json_fields: {
                'Patrol Point': 'patrolPoint',
                Event: 'event',
                Vigilant: 'vigilant',
                'Start date': 'startDate',
                'End date': 'endDate',
                'Scanned date': 'scannedDate',
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
                    scannedDate: '',
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
            title: 'Incompleted patrols - Visited and not visited points',
            filename: 'incompleted_patrols_' + moment().format('YYYY-MM-DD'),
        },
    },
}
