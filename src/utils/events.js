export const EVENT_TYPES = [
    // { value: 'MULTIMEDIA', label: 'str.event.filter.multimedia' },
    { value: 'INCIDENT', label: 'str.event.filter.incident' },
    // { value: 'SCAN', label: 'str.event.filter.scan' },
    { value: 'SOS_ALERT', label: 'str.event.filter.sos_alert' },
    // { value: 'START_PATROL', label: 'str.event.filter.start_patrol' },
    // { value: 'END_PATROL', label: 'str.event.filter.end_patrol' },
    { value: 'FAILURE_PATROL', label: 'str.event.filter.failure_patrol' },
    { value: 'CANCEL_PATROL', label: 'str.event.filter.cancel_patrol' },
]

export const EVENT_STATUS = {
    ACTIVE: 'ACTIVE',
    ARCHIVED: 'ARCHIVED',
}

export const EVENT_CHART_TYPES = ['FAILURE_PATROL', 'SOS_ALERT', 'INCIDENT']
