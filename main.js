var i = L.map("bbvTreeMap").setView([25, 15], 2.4);

var initMap = async function () {
    var list = await fetch('./assets/data.json').then(response => response.json());
    var tileLayer = L.tileLayer("https://api.mapbox.com/styles/v1/akhil-kn/ckmc2m2fxhusz17ryzpnx7uo4/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWtoaWwta24iLCJhIjoiY2ttYzF0YjlrMW81MDJvbnV6bmp1bzJzcCJ9.d8PsvHAItxrjAS74p1GxAg", {
        maxZoom: 15,
        minZoom: 2,
        attribution: '&copy; <a href="https://mapbox.com/">Mapbox</a>'
    });

    i.scrollWheelZoom && i.scrollWheelZoom.disable();
    tileLayer.addTo(i)
    initLayers(list);
};

var initLayers = function (list) {
    var t = L.markerClusterGroup({
        showCoverageOnHover: !1,
        maxClusterRadius: 40,
        spiderfyDistanceMultiplier: 2,
        iconCreateFunction: function (t) {
            var e = t.getAllChildMarkers()
                , o = e[0].options.icon.options.iconUrl;
            return L.divIcon({
                html: '<div class="custom-cluster"> <img src="' + o + '" alt="icon"> <span>' + t.getChildCount() + "</span></div>"
            })
        }
    });
    list.data.forEach(function (e, index) {
        if (e.location) {
            var o = L.icon({
                iconUrl: `https://picsum.photos/200/300?image_idx=${index}`,
                iconSize: [45, 45],
                iconAnchor: [30, 30],
                popupAnchor: [-10, -30]
            })
                , i = '<div><img src="https://picsum.photos/200/300?image_idx=' + index + '" alt="' + e.title + '"><div><h3>' + e.title + '</h3><div class="d-flex flex-column"><span class="position">' + e.position + "</span><span>" + e.location.name + "</span></div></div></div>"
                , n = {
                    minWidth: "240",
                    maxWidth: "500",
                    className: "custom"
                }
                , a = e.location;
            if (a) {
                var r = L.marker([a.latitude, a.longitude], {
                    icon: o
                }).bindPopup(i, n);
                t.addLayer(r)
            }
        }
    });
    t.on("spiderfied", function (t) {
        console.log('spiderfied');
        t.cluster.setOpacity(0)
    });
    t.on("clusterclick", function (t) {
        console.log('clusterclick');
        i.panTo(t.latlng)
    });
    t.on("click", function (e) {
        console.log('click');
        var o = t.getVisibleParent(e.layer)
            , n = o.options.zIndexOffset;
        n || (i.getZoom() < 6 ? i.setView(e.latlng, 6) : i.panTo(e.latlng))
    });
    i.addLayer(t);
};

initMap();