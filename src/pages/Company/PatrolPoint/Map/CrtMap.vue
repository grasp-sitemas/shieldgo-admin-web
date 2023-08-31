<script>
export default {
    init: payload => {
        if (payload?.location[0] === 0 && payload?.location[1] === 0) {
            payload.getLocation()
        } else {
            payload.geolocation = payload.location
            payload.circle.center = payload.location
            payload.circle.radius = payload.radius
        }
    },
    methods: {
        getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        this.geolocation = [position.coords.latitude, position.coords.longitude]
                        this.gettingLocation = false
                    },
                    error => {
                        console.log(error)
                        this.gettingLocation = false
                    },
                )
            } else {
                this.gettingLocation = false
            }
        },
        zoomUpdated(zoom) {
            this.zoom = zoom
        },
        centerUpdated(geolocation) {
            if (geolocation) {
                this.geolocation = geolocation
            }
        },
        boundsUpdated(geolocation) {
            if (geolocation) {
                this.geolocation = geolocation
            }
        },
    },
}
</script>
