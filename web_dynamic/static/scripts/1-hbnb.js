$(() => {
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
});
