<template>
    <div id="wrapper" :key="valuekey">
        <div class="content-page">
            <div class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12">
                            <div class="page-title-box">
                                <h4 class="page-title">{{ $t('string.msg.menu.schedules.label.title') }}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dark-box">
                    <!-- <p class="sub-header">
                        {{ $t('str.msg.register.company') }}
                    </p> -->

                    <div class="demo-app">
                        <!-- <div class="demo-app-sidebar">
                            <div class="demo-app-sidebar-section">
                                <label>
                                    <input type="checkbox" :checked="calendarOptions.weekends" @change="handleWeekendsToggle" />
                                    toggle weekends
                                </label>
                            </div>
                            <div class="demo-app-sidebar-section">
                                <h2>All Events ({{ currentEvents.length }})</h2>
                                <ul>
                                    <li v-for="event in currentEvents" :key="event.id">
                                        <b>{{ event.startStr }}</b>
                                        <i>{{ event.title }}</i>
                                    </li>
                                </ul>
                            </div>
                        </div> -->
                        <div class="demo-app-main">
                            <FullCalendar class="demo-app-calendar" :options="calendarOptions">
                                <template v-slot:eventContent="arg">
                                    <b>{{ arg.timeText }}</b>
                                    <i>{{ arg.event.title }}</i>
                                </template>
                            </FullCalendar>
                        </div>
                    </div>
                </div>
            </div>
            <Spinner />
            <Toast :title="titleToast" :message="messageToast" :messageId="messageIdToast" />
        </div>
    </div>
</template>

<script>
import Controller from './CrtSchedule'
import Spinner from '../../components/layout/Spinner'
import Toast from '../../components/layout/Toast'

import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from '../../events/event-utils'
import PTBR_LOCALE from '@fullcalendar/core/locales/pt-br'
export default {
    name: 'Schedule',
    components: {
        Spinner,
        Toast,
        FullCalendar,
    },
    data() {
        return {
            errors: [],
            titleToast: null,
            messageToast: null,
            messageIdToast: null,
            data: {},
            user: {},
            calendarOptions: {
                timeZone: 'America/Sao_Paulo',
                locales: [PTBR_LOCALE],
                plugins: [
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin, // needed for dateClick
                ],
                headerToolbar: {
                    left: 'prev,next,today',
                    center: 'title',
                    // right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    right: 'dayGridMonth',
                },
                initialView: 'dayGridMonth',
                initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
                editable: true,
                selectable: true,
                selectMirror: true,
                dayMaxEvents: true,
                weekends: true,
                select: this.handleDateSelect,
                eventClick: this.handleEventClick,
                eventsSet: this.handleEvents,
                /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
            },
            currentEvents: [],
        }
    },
    methods: Controller.methods,
    created() {
        Controller.init(this)
    },
    mounted() {},
}
</script>

    <style>
</style>
