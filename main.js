var i = L.map("bbvTreeMap").setView([25, 15], 2.4);

var openPopup = (i, markers, layer) => {
    var html = `<div class="user-wrapper">`;
    for (var j = 0; j < markers.length; j++) {
        var { options } = markers[j]
        html += `<div class="user-list"><h3>${options.title}</h3><div class="d-flex flex-column"><span class="position">${options.position}</span><span>${options.location.name}</span></div></div>`;
    }
    html += `</div>`;
    $('#exampleModal').find('.modal-body').html(html);
    $('#exampleModal').modal('toggle')
}

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
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false,
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
            }), a = e.location;
            if (a) {
                var r = L.marker([a.latitude, a.longitude], {
                    icon: o,
                    ...e
                });
                t.addLayer(r)
            }
        }
    });
    t.on("clusterclick", function (t) {
        var markers = t.layer.getAllChildMarkers();
        openPopup(i, markers, t.layer);
    });
    t.on("click", function (e) {
        var o = t.getVisibleParent(e.layer);
        openPopup(i, [o], e.layer);
    });
    i.addLayer(t);
};

$(function () { });

initMap();