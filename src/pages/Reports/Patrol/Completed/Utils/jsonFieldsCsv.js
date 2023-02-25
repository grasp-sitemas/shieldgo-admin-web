import moment from 'moment'

export const JSON_FIELDS_CSV = {
    completedPatrolPoints: {
        pt: {
            json_fields: {
                'Ponto de ronda': 'patrolPoint',
                Evento: 'event',
                Vigilante: 'vigilant',
                'Data de início': 'startDate',
                'Data fim': 'endDate',
                'Data da leitura': 'scannedDate',
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
            title: 'Pontos de rondas visitados - Rondas concluídas',
            filename: 'rondas_concluidas_' + moment().format('YYYY-MM-DD'),
        },
        en: {
            json_fields: {
                'Patrol Point': 'patrolPoint',
                Event: 'event',
                Vigilant: 'vigilant',
                'Start date': 'startDate',
                'End date': 'endDate',
                'Scanned date': 'scannedDate',
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
                    scannedDate: '',
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
            title: 'Patrol points visited - Completed patrols',
            filename: 'completed_patrols_' + moment().format('YYYY-MM-DD'),
        },
    },
}
