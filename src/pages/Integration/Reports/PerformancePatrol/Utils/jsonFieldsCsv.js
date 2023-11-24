import moment from 'moment'

export const JSON_FIELDS_CSV = {
    events: {
        pt: {
            json_fields: {
                'Hora Inicio': 'BeginTime',
                Local: 'SiteName',
                'Hora Ronda': 'PatrolTime',
                Empresa: 'DeptName',
                Status: 'Status',
            },
            json_data: [
                {
                    BeginTime: '',
                    SiteName: '',
                    PatrolTime: '',
                    DeptName: '',
                    Status: '',
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
            pdfTitle: 'Relatório de rondas',
            title: 'Relatório de rondas - ' + 'Gerado em: ' + moment().format('DD/MM/YYYY') + ' às ' + moment().format('HH:mm:ss'),
            filename: 'rondas_' + moment().format('YYYY-MM-DD'),
        },
        en: {
            json_fields: {
                'Begin Time': 'BeginTime',
                Site: 'SiteName',
                'Patrol Time': 'PatrolTime',
                Company: 'DeptName',
                Status: 'Status',
            },
            json_data: [
                {
                    BeginTime: '',
                    SiteName: '',
                    PatrolTime: '',
                    DeptName: '',
                    Status: '',
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
            pdfTitle: 'Events Report',
            title: 'Events Report - ' + 'Generated at: ' + moment().format('DD/MM/YYYY') + ' at ' + moment().format('HH:mm:ss'),
            filename: 'events_' + moment().format('YYYY-MM-DD'),
        },
    },
}
