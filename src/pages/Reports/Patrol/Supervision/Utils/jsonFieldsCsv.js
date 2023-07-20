import moment from 'moment'

export const JSON_FIELDS_CSV = {
    supervizionPatrol: {
        pt: {
            json_fields: {
                Status: 'read',
                'Ponto de checagem': 'name',
            },
            json_data: [
                {
                    read: '',
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
            title: 'Relátorio de visitas de supervisão',
            filename: 'supervision_' + moment().format('YYYY-MM-DD:HH:mm:ss'),
        },
        en: {
            json_fields: {
                Status: 'read',
                'Patrol point': 'name',
            },
            json_data: [
                {
                    read: '',
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
            title: 'Supervision visits report',
            filename: 'supervision_' + moment().format('YYYY-MM-DD:HH:mm:ss'),
        },
    },
}
