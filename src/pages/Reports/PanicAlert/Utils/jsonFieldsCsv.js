import moment from 'moment'

export const JSON_FIELDS_CSV = {
    sosAlert: {
        pt: {
            json_fields: {
                Cliente: 'client',
                Local: 'site',
                Vigilante: 'vigilant',
                Data: 'date',
                Geolocalização: 'geolocation',
                Dispositivo: 'deviceInfo',
                Atendido: 'isAttendance',
                Status: 'attendanceStatus',
                Operador: 'operator',
                Abertura: 'openedDate',
                Fechamento: 'closedDate',
            },
            json_data: [
                {
                    client: '',
                    site: '',
                    vigilant: '',
                    date: '',
                    geolocation: '',
                    deviceInfo: '',
                    isAttendance: '',
                    operator: '',
                    openedDate: '',
                    closedDate: '',
                    attendanceStatus: '',
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
            filename: 'alertas_sos_' + moment().format('DD-MM-YYYY'),
        },
        en: {
            json_fields: {
                Client: 'client',
                Local: 'site',
                Vigilant: 'vigilant',
                Date: 'date',
                Geolocation: 'geolocation',
                Device: 'deviceInfo',
                Attendance: 'isAttendance',
                Status: 'attendanceStatus',
                Operator: 'operator',
                Opened: 'openedDate',
                Closed: 'closedDate',
            },
            json_data: [
                {
                    client: '',
                    site: '',
                    vigilant: '',
                    date: '',
                    geolocation: '',
                    deviceInfo: '',
                    isAttendance: '',
                    attendanceStatus: '',
                    operator: '',
                    openedDate: '',
                    closedDate: '',
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
