var React = window.React = require('react'),
    addons = require('react-addons'),
    $ = window.$ = require('jquery'),
    Timer = require("./ui/Timer"),
    mountNode = document.getElementById("app"),
    $clamp = require('clamp-js');

var client_id = '68e4108b43354b028b96be615901fab1';
var tag = 'occupyhk';
var gramUrl = 'https://api.instagram.com/v1/tags/' + tag +'/media/recent?';
var requestData = { client_id: client_id, count: 10 };

var InstaList = React.createClass({

  componentDidMount: function() {
    console.log('mounted');
  },
  render: function() {
    var createItem = function(gram, index) {
      var clampID = 'caption-' + index;
      return <div className="row article" key={index}>
                <div className="col-md-6">
                  <img src={gram.img} className="img-responsive" />
                </div>
                <div className="col-md-6">
                  <h2 className="caption" id={clampID}>{gram.caption}</h2>
                  <h3>by {gram.author}</h3>
                  <h4>Posted on {gram.time}</h4>
                </div>
              </div>;
    }
    return <div>{this.props.grams.map(createItem)}</div>;
  }
});

var InstaApp = React.createClass({
  getInitialState: function() {
    return { grams : [], loading: 'hidden' };
  },
  loadGramsFromServer: function() {
    
    var self = this;

    self.setState({
      loading: ''
    });

    $.ajax({
      url: gramUrl,
      type: 'GET',
      dataType: 'jsonp',
      data: requestData
    }).success(function(response) {

      var data = response.data;
      var newGrams = [];

      gramUrl = response.pagination.next_url;

      for (var key in data) {
        if (data.hasOwnProperty(key)) {

          console.log(data[key]);

          var img = data[key].images.standard_resolution.url;
          var caption = data[key].caption.text;
          var time = timeConverter(data[key].created_time);
          var author = data[key].user.full_name != '' ? data[key].user.full_name : data[key].user.username; 
          newGrams.push({
            img : img, 
            caption : caption,
            time: time,
            author: author
          });

        }
      }

      console.log('newGrams', newGrams);
      self.setState({
        loading: 'hidden'
      });
      self.setState({ grams : self.state.grams.concat(newGrams) });

    }).error(function(xhr, status, err){
      console.log('Error getting the data: ', err.toString());
    });
  },
  loadMoreGrams: function() {
    // Load more grams on button press
    this.loadGramsFromServer();
  },
  componentDidMount: function() {
    // Get initial grams
    this.loadGramsFromServer();
  },
  render: function() {
    var cx = addons.classSet;
    var spanClasses = cx('glyphicon', 'glyphicon-refresh', 'glyphicon-refresh-animate', this.state.loading);
    return (
      <div className="row">
        <InstaList grams={this.state.grams} />
        <button onClick={this.loadMoreGrams} className="btn btn-raised btn-primary btn-block btn-lg"><span className={spanClasses}></span> Load More Articles</button>
      </div>
    );
  }
});


React.render(<InstaApp />, mountNode);

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
  var time = month + ' ' + date + ', ' + year + ' ' + hour + ':' + min + ' ' + ampm;
  return time;
}
