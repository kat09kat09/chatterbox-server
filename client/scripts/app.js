var app;

$(function() {
  app = {

    server: 'http://127.0.0.1:3000/classes/messages',
    roomname: 'Main room',
    username: 'anonymous',
    rooms: {},
    friends: {},

    init: function() {
      app.$main = $('#main');
      app.$chats = $('#chats');
      app.$room = $('#roomSelect');
      app.$text = $('#message');
      app.$sendMessage = $('#send');

      app.username = window.location.search.substr(10);

      app.$sendMessage.on('submit', app.handleSubmit);
      app.$room.on('change', app.saveRoom);
      app.$main.on('click', '.username', app.addFriend);

      //hide the 'add room' form
      $('#add-room').hide();

      app.fetch();

      //call setInterval to fetch every few seconds
      setInterval(function() {
          app.fetch();
        }, 10000);
    },

    fetch: function() {
      $.ajax({
          url: this.server,
          type: 'GET',
          //data: { order: '-createdAt', limit: 50 },
          contentType: 'application/json',
          success: function(data) {
            console.log(data);
            app.populateMessages(data.results);
            app.populateRooms(data.results);
          },
          error: function(data) {
            console.error('chatterbox: Failed to get data. Error: ', data);
          }
        });
    },

    send: function(message) {
      $.ajax({
          url: this.server,
          type: 'POST',
          data: JSON.stringify(message),
          contentType: 'application/json',
          success: function (data) {
            console.log('success message sent');
          },
          error: function(data) {
            console.error('chatterbox: Failed to send message. Error: ', data);
          }
        });
    },

    clearMessages: function() {
      app.$chats.empty();
    },

    populateMessages: function(results) {
      var byRoom;
      console.log('calling populateMessages with: ', typeof results);
      app.clearMessages();
      //filter by roomname
      byRoom = _.filter(results, function(result) {
        return result.roomname === app.roomname;
      });
      //add all messages to DOM
      _.each(byRoom, function(message) {
        app.addMessage(message);
      })
    },

    addMessage: function(message) {
      //add message to DOM
      var $message = $('<div class="chat"></div>');
      var $user = $('<a class="username"/>');
      if (!message.roomname) {
        message.roomname = 'Main room';
      }
      if (!message.username) {
        message.username = 'anonymous';
      }
      if (!message.text) {
        message.text = 'I don\'t have anything to say!';
      }
      if (app.friends[message.username]) {
        $message.addClass('friend');
      }
      $user.text(message.username);
      $message.attr('data-username', message.username)
        .attr('data-roomname', message.roomname);
      $message.text(': ' + message.text);
      $message.prepend($user);
      app.$chats.append($message);
    },

    addRoom: function(roomname) {
      var $newRoom = $('<option></option>');
      $newRoom.val(roomname).text(roomname);
      app.$room.append($newRoom);
      app.rooms[roomname] = true;
    },

    addFriend: function() {
      var friend = $(this).text();
      app.friends[friend] = !app.friends[friend];
    },

    handleSubmit: function(event) {
      var message = {
        username: app.username,
        text: $('#message').val(),
        roomname: app.$room.find(':selected').text()
      };
      event.preventDefault();
      app.send(message);
      app.$text.val('');
    },

    saveRoom: function() {
      //if 'add room' is selected
      if ($('#roomSelect').prop('selectedIndex') === 0) {
        //show form to gather new room name
        $('#add-room').show();

        $('#main').on('submit', '#add-room', function(e) {
          var $newRoom = $('#new-room');
          e.preventDefault();
          $('#add-room').hide();
          //when you add a new room, change app.roomname to new room
          app.roomname = $newRoom.val();
          app.addRoom($newRoom.val());
          //make the new choice selected
          $('option[value="main-room"]').removeAttr('selected');
          $('option[value="' + $newRoom.val() + '"]').attr('selected', 'selected');
          $newRoom.val('');
        });
      } else {
        $('#add-room').hide();
        //get selected room and change app.roomname
        app.roomname = $('option:selected').text();
      }
    },

    populateRooms: function(results) {
      //loop through the results
      _.each(results, function(message) {
        //if the roomname doesn't exist
        if (message.roomname && !app.rooms[message.roomname]) {
          //insert into roomnames
          app.rooms[message.roomname] = true;
          //add it to dropdown
          app.addRoom(message.roomname);
        }
      });
    }
  };

  app.init();

});
