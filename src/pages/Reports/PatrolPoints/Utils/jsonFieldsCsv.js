import moment from 'moment'

export const JSON_FIELDS_CSV = {
    patrolPoint: {
        pt: {
            json_fields: {
                ID: 'patrolPointCode',
                Nome: 'name',
            },
            json_data: [
                {
                    patrolPointCode: '',
                    name: '',
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
            title: 'Relatório de Pontos de Ronda',
            filename: 'pontos_ronda_' + moment().format('YYYY-MM-DD:HH:mm:ss'),
        },
        en: {
            json_fields: {
                ID: 'patrolPointCode',
                Name: 'name',
            },
            json_data: [
                {
                    patrolPointCode: '',
                    name: '',
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
            title: 'Patrol Points Report',
            filename: 'patrol_points_' + moment().format('YYYY-MM-DD:HH:mm:ss'),
        },
    },
}
