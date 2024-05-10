import moment from 'moment'

export const JSON_FIELDS_CSV = {
    incompletedPatrolPoints: {
        pt: {
            json_fields: {
                'Ponto de checagem': 'patrolPoint',
                Vigilante: 'vigilant',
                'Data da leitura': 'scannedDate',
                'Início da ronda': 'startDate',
                'Fim da ronda': 'endDate',
                Empresa: 'account',
                Cliente: 'client',
                Local: 'site',
            },
            json_data: [
                {
                    patrolPoint: '',
                    vigilant: '',
                    scannedDate: '',
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
            title: 'Relatório de Rondas livres',
            filename: 'rondas_livres_' + moment().format('YYYY-MM-DD'),
        },
        en: {
            json_fields: {
                'Patrol Point': 'patrolPoint',
                Vigilant: 'vigilant',
                'Scanned date': 'scannedDate',
                'Patrol start': 'startDate',
                'Patrol end': 'endDate',
                Account: 'account',
                Client: 'client',
                Local: 'site',
            },
            json_data: [
                {
                    patrolPoint: '',
                    vigilant: '',
                    scannedDate: '',
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
            title: 'Alone patrols report',
            filename: 'alone_patrols_' + moment().format('YYYY-MM-DD'),
        },
    },
}
