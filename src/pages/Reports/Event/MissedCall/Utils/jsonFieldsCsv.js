import moment from 'moment'

export const JSON_FIELDS_CSV = {
    missedEvents: {
        pt: {
            json_fields: {
                Vigilante: 'vigilant',
                Data: 'date',
                Tipo: 'type',
                'Marca do dispositivo': 'deviceInfoBrand',
                'Modelo do dispositivo': 'deviceInfoModel',
                Latitude: 'latitude',
                Longitude: 'longitude',
                Cliente: 'client',
                Local: 'site',
            },
            json_data: [
                {
                    vigilant: '',
                    date: '',
                    type: '',
                    deviceInfoBrand: '',
                    deviceInfoModel: '',
                    latitude: '',
                    longitude: '',
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
            pdfTitle: 'Eventos não atendidos',
            title: 'Relatório de eventos não atendidos - ' + 'Gerado em: ' + moment().format('DD/MM/YYYY') + ' às ' + moment().format('HH:mm:ss'),
            filename: 'eventos_nao_atendidos_' + moment().format('DD/MM/YYYY'),
        },
        en: {
            json_fields: {
                Vigilant: 'vigilant',
                Date: 'date',
                Type: 'type',
                'Device brand': 'deviceInfoBrand',
                'Device model': 'deviceInfoModel',
                Latitude: 'latitude',
                Longitude: 'longitude',
                Client: 'client',
                Site: 'site',
            },
            json_data: [
                {
                    vigilant: '',
                    date: '',
                    type: '',
                    deviceInfoBrand: '',
                    deviceInfoModel: '',
                    latitude: '',
                    longitude: '',
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
            pdfTitle: 'Missed events',
            title: 'Missed events Report - ' + 'Generated on: ' + moment().format('DD/MM/YYYY') + ' at ' + moment().format('HH:mm:ss'),
            filename: 'missed_events_' + moment().format('YYYY-MM-DD'),
        },
    },
}
