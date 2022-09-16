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
        savePolygon(paths) {
            this.polygons.push(paths)
        },
        loadMapDrawingManager() {
            const { google } = window

            let self = this
            this.$refs.map.$mapCreated.then(() => {
                const drawingManager = new google.maps.drawing.DrawingManager({
                    drawingControl: true,
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
                    },
                    polygonOptions: {
                        fillColor: '#0099FF',
                        fillOpacity: 0.7,
                        strokeColor: '#AA2143',
                        strokeWeight: 4,
                        editable: true,
                    },
                })
                drawingManager.setMap(this.$refs.map.$mapObject)

                google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
                    // Get overlay paths
                    let paths = event.overlay.getPaths().getArray()
                    // Remove overlay from map
                    event.overlay.setMap(null)

                    // Disable drawingManager
                    drawingManager.setDrawingMode(null)

                    // Create Polygon
                    self.savePolygon(paths)
                })
            })
        },
    },
}
</script>
