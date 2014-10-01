
  // Limit to 7 lines
  $clamp(caption, {clamp: 7});

  var next_url;

  var client_id = '68e4108b43354b028b96be615901fab1';
  var tag = 'occupyhk';
  var url = 'https://api.instagram.com/v1/tags/' + tag +'/media/recent?';
  var requestData = { client_id: client_id, count: 1 };

  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'jsonp',
    data: requestData
  }).success(function(response) {
    add_data(response.data);
    next_url = response.pagination.next_url;
    setup_next_link();
  });

  function add_data(data) {
    if (data[0].caption) {
      $('#caption').html('');
      $('#caption').html(data[0].caption.text);
    } else {
      $('#caption').html('#occupyhk');
    }
    $('.article_img').attr('src', data[0].images.standard_resolution.url);
    $('time').html(timeConverter(data[0].created_time));
    $('.instagram_link').attr('href', data[0].link);
  }

  function setup_next_link() {

    $('.next_article').on('click', function(e){

      var $this = $(this);
      $this.attr('disabled', 'disabled');

      $.ajax({
        url: next_url,
        type: 'GET',
        dataType: 'jsonp',
        data: requestData
      }).success(function(response) {
        next_url = response.pagination.next_url;
        add_data(response.data);
        $this.attr('disabled', false);
      });

      e.preventDefault();

    });

  }

  function timeConverter(UNIX_timestamp){
      var a = new Date(UNIX_timestamp*1000);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();

      if (a.getHours() > 12) {
        var ampm = 'pm';
      } else {
        var ampm = 'am';
      }

      var hour = a.getHours() > 12 ? a.getHours() - 12 : a.getHours();
      var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
      var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
      var time = month + ', ' + date + ' ' + year + ' ' + hour + ':' + min + ' ' + ampm;
      return time;
   }


