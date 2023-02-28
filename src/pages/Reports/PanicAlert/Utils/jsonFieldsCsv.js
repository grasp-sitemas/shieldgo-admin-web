import moment from 'moment'

export const JSON_FIELDS_CSV = {
    sosAlert: {
        pt: {
            json_fields: {
                Data: 'date',
                Vigilante: 'vigilant',
                Geolocalização: 'geolocation',
                Evento: 'event',
                Atendido: 'attendance',
                Cliente: 'client',
                Local: 'site',
            },
            json_data: [
                {
                    date: '',
                    vigilant: '',
                    geolocation: '',
                    event: '',
                    attendance: '',
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
            title: 'Alertas de SOS',
            filename: 'alertas_sos_' + moment().format('YYYY-MM-DD'),
        },
        en: {
            json_fields: {
                Date: 'date',
                Vigilant: 'vigilant',
                Geolocation: 'geolocation',
                Event: 'event',
                Attended: 'attendance',
                Client: 'client',
                Site: 'site',
            },
            json_data: [
                {
                    date: '',
                    vigilant: '',
                    geolocation: '',
                    event: '',
                    attendance: '',
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
            title: 'SOS Alerts',
            filename: 'sos_alerts_' + moment().format('YYYY-MM-DD'),
        },
    },
}
