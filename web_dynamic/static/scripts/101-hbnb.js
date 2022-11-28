$('document').ready(() => {
  const checkedAmenities = {};
  const checkedStates = {};
  const checkedCities = {};
  const users = {};

  $('div.amenities li input').change(
    function () {
      if ($(this).is(':checked')) {
        checkedAmenities[($(this).attr('data-id'))] = $(this).attr('data-name');
      } else {
        delete checkedAmenities[($(this).attr('data-id'))];
      }
      $('div.amenities h4').html(Object.values(checkedAmenities).join(', ') || '&nbsp;');
    });

  $('div.locations h2 > input').change(
    function () {
      if ($(this).is(':checked')) {
        checkedStates[($(this).attr('data-id'))] = $(this).attr('data-name');
      } else {
        delete checkedStates[($(this).attr('data-id'))];
      }
      const st_city = Object.values(checkedStates).concat(Object.values(checkedCities));
      $('div.locations h4').html(st_city.join(', ') || '&nbsp;');
    });

  $('div.locations li input').change(
    function () {
      if ($(this).is(':checked')) {
        checkedCities[($(this).attr('data-id'))] = $(this).attr('data-name');
      } else {
        delete checkedCities[($(this).attr('data-id'))];
      }
      const st_city = Object.values(checkedStates).concat(Object.values(checkedCities));
      $('div.locations h4').html(st_city.join(', ') || '&nbsp;');
    });

  $.get('http://0.0.0.0:5001/api/v1/status/', (data) => {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  $('button').click(() => {
    const checkedItems = {
      amenities: Object.keys(checkedAmenities),
      states: Object.keys(checkedStates),
      cities: Object.keys(checkedCities)
    };
    $.ajax('http://0.0.0.0:5001/api/v1/places_search/', {
      data: JSON.stringify(checkedItems),
      contentType: 'application/json',
      type: 'POST',
      success: data => {
        console.log(data);
        $('section.places').empty();
        for (const place of data) {

          const template = `<article>
              <div class="title_box">
                <h2>${place.name}</h2>
                <div class="price_by_night">
                  $${place.price_by_night}
                </div>
              </div>

              <div class="information">
                <div class="max_guest">${place.max_guest} Guest${ place.max_guest !== 1 ? 's' : ''}</div>
                <div class="number_rooms">${place.number_rooms} Bedroom${ place.number_rooms !== 1 ? 's' : ''}</div>
                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${ place.number_bathrooms !== 1 ? 's' : ''}</div>
              </div>
              <div class="description">
                ${place.description}
              </div>

              <div class="reviews">
                <h2><span class="num">Reviews</span> <span class="reviews" data-id="${place.id}">Show</span></h2>
                <ul></ul>
              </div>
            </article>`;
          $('section.places').append(template);
        // TOO MANY Amenities - Just render selected amenities
        //   $.get(`http://0.0.0.0:5001/api/v1/places/${ place.id }/amenities`, (allAmenities) => {
        //    for (amenity of allAmenities) {
        //       $('div.amenities').append(`<li>${amenity.name}</li>`);
        //    } 
        //  });

        }
      }
    });
  });

  $(document).on('click', 'span.reviews', function () {
    const ul = $(this).parent().parent().children('ul').last();
    if ($(this).text() === 'Show') {
      $(this).text('Hide');
      const url = `http://0.0.0.0:5001/api/v1/places/${$(this).attr('data-id')}/reviews`;
      const parent = $(this).parent();
      $.get(url, function (data) {
        const len = Object.keys(data).length;
        parent.children('span.num').text(`${len} Review${len !== 1 ? 's' : ''}`);
        ul.empty();
        for (const review of data) {
          const datestr = (new Date(Date.parse(review.updated_at))).toDateString();
          const template = `<li>
          <!--my db is messed up with vals exchanged
          user_id -> text
          place_id -> user_id
          text -> place_id -->
            <h3>From ${users[review.place_id]} the ${datestr}</h3>
            <p>${review.user_id}</p>
          </li>`;
          ul.append(template);
          ul.show();
        }
      });
    } else {
      $(this).parent().children('span.num').text('Reviews');
      $(this).text('Show');
      ul.hide();
    }
  });

  $.getJSON('http://0.0.0.0:5001/api/v1/users/', (data) => {
    for (const user of data) {
      users[user.id] = `${user.first_name} ${user.last_name}`;
    }
  });
});
