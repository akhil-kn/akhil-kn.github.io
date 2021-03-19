var i = L.map("bbvTreeMap").setView([25, 15], 2.4);

var initSilder = (options) => {
    setTimeout(() => {
        $('.user-wrapper').slick(options || {});
    }, 1000);
};

var popUpTemplate = (markers, single = false) => {
    var html = ``;
    var tempHtml = ``;
    for (var j = 0; j < markers.length; j++) {
        var { options } = markers[j]
        tempHtml += `<div class="user-list d-flex"><div class="avatar" data-index="${j}"><img src="${options.icon.options.iconUrl}" width="48" heigh="48" class="rounded-circle"></div><div class="d-flex flex-column"><h3>${options.title}</h3><p class="position">${options.position}</p></div></div>`;
        if (single || (j % 2 == 1) || j + 1 === markers.length) {
            !!tempHtml && (html += `<div class="user-item">${tempHtml}</div>`);
            tempHtml = '';
        }
    }
    var el = document.createElement('div');
    el.classList.add('user-wrapper');
    el.innerHTML = html;
    return el;
}

var openPopup = (markers) => {
    var el = popUpTemplate(markers);
    $('#exampleModal').find('.modal-body').empty();
    $('#exampleModal').find('.modal-body').append(el);
    $('#exampleModal').modal('toggle');
    initSilder({ dots: true, arrows: true, slidesToShow: 6, slidesToScroll: 6 });

    $('.avatar').on('click', el, function () {
        $('.user-wrapper').slick('destroy');
        var el = popUpTemplate(markers,true);
        $('#exampleModal').find('.modal-body').empty();
        $('#exampleModal').find('.modal-body').append(el);
        initSilder({
            initialSlide: $(this).data('index') || 0,
            dots: false,
            arrows: true,
            slidesToShow: 1,
            slidesToScroll: 1,
        });
    })
}

var shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
    var data = shuffle(list.data);
    console.log({ data });
    initLayers(data);
};

var initLayers = function (data) {
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
    data.forEach(function (e, index) {
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
        openPopup(markers);
    });
    t.on("click", function (e) {
        var o = t.getVisibleParent(e.layer);
        openPopup([o]);
    });
    i.addLayer(t);
};

$(function () { });

initMap();