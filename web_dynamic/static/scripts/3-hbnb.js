$('document').ready(() => {
  const checkedAmenities = {};

  $('div.amenities li input').change(
    function () {
      if ($(this).is(':checked')) {
        checkedAmenities[($(this).attr('data-id'))] = $(this).attr('data-name');
      } else {
        delete checkedAmenities[($(this).attr('data-id'))];
      }
      $('div.amenities h4').html(Object.values(checkedAmenities).join(', ') || '&nbsp;');
    });

  $.get('http://0.0.0.0:5001/api/v1/status/', (data) => {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  $.ajax('http://0.0.0.0:5001/api/v1/places_search/', {
    data: JSON.stringify({}),
    contentType: 'application/json',
    type: 'POST',
    success: data => {
      for (const place of data) {
        const template = `<article>
            <div class="title_box">
              <h2>${place.name}</h2>
              <div class="price_by_night">
                $${place.price_by_night}
              </div>
						</div>

						<div class="information">
							<div class="max_guest">${place.max_guest} Guests</div>
							<div class="number_rooms">${place.number_rooms} Bedrooms</div>
							<div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
						</div>
						<div class="description">
						 	${place.description}
						</div>
					</article>`;
        $('section.places').append(template);
      }
    }
  });
});
