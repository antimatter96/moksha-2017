var engToGreek = {
  "a" : "α",
  "b" : "β",
  "c" : "ψ",
  "d" : "δ",
  "e" : "ε",
  "f" : "φ",
  "g" : "γ",
  "h" : "η",
  "i" : "ι",
  "j" : "ξ",
  "k" : "κ",
  "l" : "λ",
  "m" : "μ",
  "n" : "ν",
  "o" : "ο",
  "p" : "π",
  "q" : ";",
  "r" : "ρ",
  "s" : "σ",
  "t" : "τ",
  "u" : "θ",
  "v" : "ω",
  "w" : "ς",
  "x" : "χ",
  "y" : "υ",
  "z" : "ζ"
};

var storage = window.localStorage;

function getUserCredentials() {
  return {
    moksha_id: storage.getItem('nsit-moksha-2017_mokshaID'),
    pass: storage.getItem('nsit-moksha-2017_password')
  };
}

function setUserCredentials(id, pass) {
  if (id && pass) {
    storage.setItem('nsit-moksha-2017_mokshaID', id);
    storage.setItem('nsit-moksha-2017_password', pass);
  } else {
    storage.removeItem('nsit-moksha-2017_mokshaID', id);
    storage.removeItem('nsit-moksha-2017_password', pass);
  }
}

function translate(str) {
  var translation = '';

  for(var i = 0; i < str.length ; i++) {
    translation += engToGreek[str[i]];
  }

  return translation;
}

var loadStatusNode = document.querySelector('#load-status');

loadStatusNode.innerHTML = translate(loadStatusNode.innerHTML);

var navNodes = $('.ip-main>nav>a');

navNodes.click(function() {
  navNodes.removeClass('current-demo');

  $(this).addClass('current-demo');

  $('#content-canvas>div').css('display', 'none');
  $('#content-canvas>div[data-tab="' + $(this).text().toLowerCase() + '"]').fadeIn();
});

$('#content-canvas>div[data-tab="about"]').fadeIn();



function validateEmail (emailField) {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        if (reg.test(emailField.value) == false)
        { $("#emailid").removeClass('trans-border');
             $("#emailid").addClass('red-border');

        return false;
        }
        else
  {   $("#emailid").removeClass('red-border');
    $("#emailid").addClass('trans-border');
    return true;}

}

function returnDataObjectFromForm(type) {
  var args = $('form[name="' + type + '-form"]').serializeArray();
  var data = {};
  for(var i = 0; i < args.length ; i++) {
    data[args[i].name] = args[i].value;
  }
  return data;
}


function handleSession() {
  var userCred = getUserCredentials();

  if (userCred.moksha_id && userCred.pass) {
    $('#login-logout').text('Logout');

    var node = $('#content-canvas>div[data-tab="login"]');
    node.attr('data-tab', 'logout');
    node.empty().append('<i class="material-icons" style="opacity:0">check</i><button type="submit" class="moksha-button" id="logout-for-moksha" >Sign Out</button>');
  } else {
    $('#login-logout').text('Login');

    var node = $('#content-canvas>div[data-tab="logout"]');
    if (node) {
      node.attr('data-tab', 'login');
      node.empty().append(`
        <form name="login-form">
          <i class="material-icons">person</i><input type="text" required name="moksha_id" placeholder="Moksha ID"><br>
          <i class="material-icons">lock</i><input type="password" required name="pass" placeholder="Password"><br>
          <i class="material-icons" style="opacity:0">check</i><button type="submit" class="moksha-button" id="login-for-moksha">Login</button>
        </form>
      `);
    }
  }
}

function register() {
  var data = returnDataObjectFromForm('register');
  $.ajax({
    url: '/register',
    type: 'post',
    data: data,
    dataType: 'json',
    success: function(r) {
      console.log(r);
      $('#register-for-moksha').html('Register');
    },
    error: function(e) {
      console.log(e);
    }
  });
}

function login() {
  var data = returnDataObjectFromForm('login');
  $.ajax({
    url: '/login',
    type: 'post',
    data: data,
    dataType: 'json',
    success: function(r) {
      console.log(r);
      if (!r.error) {
        setUserCredentials(r.user.moksha_id, r.user.pass);
        handleSession();
      } else {
        $('#login-for-moksha').html('Login');
      }
    },
    error: function(e) {
      console.log(e);
    }
  });
}


(function() {
     var timer;

     // bind event handler
     $('#register-for-moksha').click(function (e) {
       e.preventDefault();
       $('#register-for-moksha').html('<i class="material-icons">loop</i> Processing');
       if(timer) {
           clearTimeout(timer);
       }
       timer = setTimeout(register, 2000);
     });
}());

(function() {
     var timer;

     // bind event handler
     $('#content-canvas').on('click', '#login-for-moksha', function (e) {
       e.preventDefault();
       $('#login-for-moksha').html('<i class="material-icons">loop</i> Processing');
       if(timer) {
           clearTimeout(timer);
       }
       timer = setTimeout(login, 2000);
     });
}());

(function() {
     var timer;

     // bind event handler
     $('#content-canvas').on('click', '#logout-for-moksha', function (e) {
       e.preventDefault();
       $('#logout-for-moksha').html('<i class="material-icons">loop</i> Processing');
       if(timer) {
           clearTimeout(timer);
       }
       timer = setTimeout(function() {
         setUserCredentials();
         handleSession();
       }, 500);
     });
}());

handleSession();
