//Masaawo site
var app = angular.module('KifeesiTaxi', ['ngRoute', 'ngResource', 'angularUtils.directives.dirPagination']).run(function($rootScope, $window, $location){
    function getUser() {
        if ($rootScope.current_user) {
            return $rootScope.current_user;
        }
        var storage_user = $window.localStorage.getItem('user');
        if (storage_user) {
          try {
            this.user = JSON.parse(storage_user);
          } catch (e) {
            $window.localStorage.removeItem('user');
          }
        }
        return this.user;
      }
      var tempUser = getUser();
      if(tempUser){
        $rootScope.current_user = tempUser;
        $rootScope.current_user_no = tempUser.user.phonenumber;
        $rootScope.current_user_tier = tempUser.user.tier;
        $rootScope.authenticated = true;
        if($rootScope.current_user_tier == 1){
            $rootScope.authorized = true;
        }
        else if($rootScope.current_user_tier == 3){
            $rootScope.authorized = false;
        }
      }
      else{
        $rootScope.current_user_tier = "";
        $rootScope.current_user = "";
        $rootScope.authenticated = false;
        $rootScope.unauthenticated = true;
      }
      $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (next.$$route.authenticated == true){
            if($rootScope.authenticated){
            }
            else{
                event.preventDefault();
                $location.path("/search");
            }
        }
        else if (next.$$route.authorized == true){
            if($rootScope.authorized == true){
            }
            else if ($rootScope.authorized == false){
                event.preventDefault();
                $location.path("/search");
            }
        }
        else if (next.$$route.authenticated == false){
        }
        else if (next.$$route.authorized == false){
        }
    })
    $rootScope.logout = function(){
        $window.localStorage.removeItem('user');
        $rootScope.current_user = "";
        $rootScope.authenticated = false;
        $rootScope.unauthenticated = true;
        $location.path('/search');
    };
});

//angular routing
app.config(function($routeProvider){
    $routeProvider

    .when('/', {
        templateUrl: 'main.html',
        controller: 'mainController',
        authenticated: false,
    })
    .when('/search', {
        templateUrl: 'main.html',
        controller: 'mainController',
        authenticated: false,
    })
    .when('/download', {
        templateUrl: 'download.html',
        controller: 'mainController',
        authenticated: false,
    })
    //Report Plate
    .when('/report', {
        templateUrl: 'report.html',
        controller: 'authController',
        authenticated: true,
    })

    //false report
    .when('/false', {
        templateUrl: 'false.html',
        controller: 'repController',
        authenticated: true,
    })

    //contact
    .when('/contact', {
        templateUrl: 'contact.html',
        controller: 'subController',
        authenticated: false,
    })

    //about us
    .when('/about', {
        templateUrl: 'about.html',
        controller: 'mainController',
        authenticated: false,
    })

    //Terms and conditions
    .when('/tnc', {
        templateUrl: 'tnc.html',
        controller: 'mainController',
        authenticated: false,
    })

    //Disclaimer
    .when('/disclaimer', {
        templateUrl: 'disclaimer.html',
        controller: 'mainController',
        authenticated: false
    })


    //Login
    .when('/login', {
        templateUrl: 'login.html',
        controller: 'authController',
        authenticated: false,
    })

    .when('/gate', {
        templateUrl: 'gate.html',
        controller: 'authController',
        authorized: false
    })

    .when('/logger', {
        templateUrl: 'logger.html',
        controller: 'dashController',
        authorized: true
    })

    //dash
    .when('/dash', {
        templateUrl: 'dash.html',
        controller: 'dashController',
        authorized: true
    })
    //messages
    .when('/messages', {
        templateUrl: 'messages.html',
        controller: 'dashController',
        authorized: true
    })

    //reports
    .when('/reports', {
        templateUrl: 'reports.html',
        controller: 'dashController',
        authorized: true
    })
    //reports
    .when('/reported', {
        templateUrl: 'reported.html',
        controller: 'dashController',
        authorized: true
    })
    //users
    .when('/users', {
        templateUrl: 'users.html',
        controller: 'dashController',
        authorized: true
    })

    .when('/register', {
        templateUrl: 'signup.html',
        controller: 'authController',
        authenticated: false,
        authorized: false
    })
    .when('/404', {
        templateUrl: '404.html',
        controller: 'mainController',
        authenticated: false,
        authorized: false
    })
    .otherwise({ redirectTo: '/404' });
});


app.factory('submissionService', ['$http', function($http){
    var all = [];
    var getData = function(){
        return $http.get('/authapi/plates').then(function(response){
            return response.data;
        }, function(err){
        });
    }
    return{
        getData: getData
    };
    }]);

app.factory('starredService', ['$http', function($http){
    var all = [];
    var getData = function(){
        return $http.get('/authapi/apprplates').then(function(response){
            return response.data;
        }, function(err){
        });
    }
    return{
        getData: getData
    };
}]);

app.factory('messagesService', ['$http', function($http){
    var all = [];
    var getData = function(){
        return $http.get('/authapi/contact').then(function(response){
            return response.data;
        }, function(err){
        });
    }
    return{
        getData: getData
    };
}]);

app.factory('complaintsService', ['$http', function($http){
    var all = [];
    var getData = function(){
        return $http.get('/authapi/platereport').then(function(response){
            return response.data;
        }, function(err){
        });
    }
    return{
        getData: getData
    };
}]);

app.factory('usersService', ['$http', function($http){
    var all = [];
    var getData = function(){
        return $http.get('/authapi/users').then(function(response){
            return response.data;
        }, function(err){
        });
    }
    return{
        getData: getData
    };
}]);

app.factory('searchService', ['$http', function($http){
    var all = [];
    var getData = function(){
        return $http.get('/authapi/querriedplates').then(function(response){
            return response.data;
        }, function(err){
        });
    }
    return{
        getData: getData
    };
}]);

app.controller('dashController', function($scope, $filter, submissionService, starredService, messagesService, complaintsService, usersService, searchService, $http){
    $scope.submissions = [];
    $scope.officials = [];
    $scope.messages = [];
    $scope.complaints = [];
    $scope.users = [];
    $scope.approval = {numberPlate: '', location: '', additionalInfo: ''};
    submissionService.getData().then(function(returnsubmission){
        $scope.submissions = returnsubmission;
        var cnt = 0;
        returnsubmission.forEach(function(itm){if(!itm.__proto__.__proto__){cnt++;}});
        $scope.count = cnt;
    })
    starredService.getData().then(function(returnOfficial){
        $scope.officials = returnOfficial;
        var cntOff = 0;
        returnOfficial.forEach(function(itm){if(!itm.__proto__.__proto__){cntOff++;}});
        $scope.countOff = cntOff;
    })
    messagesService.getData().then(function(returnSent){
        $scope.messages = returnSent;
        var messagesCount = 0;
        returnSent.forEach(function(itm){if(!itm.__proto__.__proto__){messagesCount++;}});
        $scope.messagesCount = messagesCount;
    })
    complaintsService.getData().then(function(returnComp){
        $scope.complaints = returnComp;
        var compCount = 0;
        returnComp.forEach(function(itm){if(!itm.__proto__.__proto__){compCount++;}});
        $scope.compCount = compCount;
    })
    usersService.getData().then(function(returnUser){
        $scope.users = returnUser;
        var userCount = 0;
        returnUser.forEach(function(itm){if(!itm.__proto__.__proto__){userCount++;}});
        $scope.userCount = userCount;
    })
    searchService.getData().then(function(returnSearch){
        $scope.searches = returnSearch;
        var searchCount = 0;
        returnSearch.forEach(function(itm){if(!itm.__proto__.__proto__){searchCount++;}});
        $scope.searchCount = searchCount;
        $scope.second = $scope.searches.sort(function(a, b) { return b - a; })[1];
        $scope.hit = $filter('filter')($scope.searches, {result: '1'}).length;
        $scope.miss = $filter('filter')($scope.searches, {result: '0'}).length;

        function findMorn(){
            var mornCount = 0;returnSearch.forEach(function(itm){var times = itm.runAt;
                if(times.indexOf('T06:') > 0 || times.indexOf('T07:') > 0 || times.indexOf('T08:') > 0 || times.indexOf('T09:') > 0 || times.indexOf('T10:') > 0){
                    mornCount++;}}); return mornCount;};
        function findMid(){
            var mornCount = 0;returnSearch.forEach(function(itm){var times = itm.runAt;
                if(times.indexOf('T11:') > 0 || times.indexOf('T12:') > 0 || times.indexOf('T13:') > 0){
                    mornCount++;}}); return mornCount;};
        function findAft(){
            var mornCount = 0;returnSearch.forEach(function(itm){var times = itm.runAt;
                if(times.indexOf('T14:') > 0 || times.indexOf('T15:') > 0 || times.indexOf('T16:') > 0){
                    mornCount++;}}); return mornCount;};
        function findEve(){
            var mornCount = 0;returnSearch.forEach(function(itm){var times = itm.runAt;
                if(times.indexOf('T17:') > 0 || times.indexOf('T18:') > 0){
                    mornCount++;}}); return mornCount;};
        function findNigh(){
            var mornCount = 0;returnSearch.forEach(function(itm){var times = itm.runAt;
                if(times.indexOf('T19:') > 0 || times.indexOf('T20:') > 0 || times.indexOf('T21:') > 0 || times.indexOf('T22:') > 0 || times.indexOf('T23:') > 0){
                    mornCount++;}}); return mornCount;};
        function findLate(){
            var mornCount = 0;returnSearch.forEach(function(itm){var times = itm.runAt;
                if(times.indexOf('T00:') > 0 || times.indexOf('T01:') > 0 || times.indexOf('T02:') > 0 || times.indexOf('T03:') > 0 || times.indexOf('T04:') > 0 || times.indexOf('T05:') > 0){
                    mornCount++;}}); return mornCount;};
        $scope.mornFigures = findMorn();
        $scope.midFigures = findMid();
        $scope.afterFigures = findAft();
        $scope.evenFigures = findEve();
        $scope.nightFigures = findNigh();
        $scope.lateFigures = findLate();
        function getTopN(arr, prop, n) {
            var clone = arr.slice(0);
            // sort descending
            clone.sort(function(x, y) {
                if (x[prop] == y[prop]) return 0;
                else if (parseInt(x[prop]) < parseInt(y[prop])) return 1;
                else return -1;
            });
            return clone.slice(0, n);
        }
        var n = 5;
        $scope.topScorers = getTopN(returnSearch, "numberPlate", n);
    });



    $scope.passToModal = function(submission) {
        $scope.individualPlate = submission;
      };
    $scope.approve = function(toApprove){
        var approvalplate = toApprove;
        var np = approvalplate.numberplate;
        var loc = approvalplate.location;
        var ad = approvalplate.additionalInfo;
        $scope.approval = {numberPlate: np, location: loc, additionalInfo: ad};
        $http.post('/authapi/plates', $scope.approval).then(function(response){
            if(response.data.approved == 1){
                $.notify("License plate added to official list", "success");
            }
            else{
                $.notify("Error adding plate", "error");
            }
        });
    };
    $scope.demote = function(toDemote){
        var id = toDemote._id;
        $scope.updatevar = {approved: '0'};
        $http.put('/authapi/plates/'+id+'', $scope.updatevar).then(function(response){
            if(response.data.approved == 0){
                $.notify("Successfully demoted number", "success");
            }
            else{
                $.notify(""+response.data+"", "error");
            }
        })
    };
    $scope.promote = function(toPromote){
        var id = toPromote._id;
        $scope.updatevar = {approved: '1'};
        $http.put('/authapi/plates/'+id+'', $scope.updatevar).then(function(response){
            if(response.data.approved == 1){
                $.notify("Successfully promoted number", "success");
            }
            else{
                $.notify(""+response.data+"", "error");
            }
        })
    };
    $scope.block = function(data){
        var id = data._id;
        var excl = data.phonenumber;
        console.log(excl);
        if (excl.match(/[a-z]/i)){
            $.notify("You cannot block this user", "error");
            return;
        };
        $scope.updatevar = {blocked: '1'};
        $http.put('/authapi/users/'+id+'', $scope.updatevar).then(function(response){
            if(response.data.blocked == 1){
                $.notify("Successfully blocked user", "success");
            }
            else{
                $.notify(""+response.data+"", "error");
            }
        })
    };
    $scope.unblock = function(data){
        var id = data._id;
        $scope.updatevar = {blocked: '0'};
        $http.put('/authapi/users/'+id+'', $scope.updatevar).then(function(response){
            if(response.data.blocked == 0){
                $.notify("Successfully unblocked user", "success");
            }
            else{
                $.notify(""+response.data+"", "error");
            }
        })
    };
    $scope.demoteUser = function(data){
        var id = data._id;
        $scope.updatevar = {tier: '3'};
        $http.put('/authapi/users/'+id+'', $scope.updatevar).then(function(response){
            if(response.data.tier == 3){
                $.notify("Successfully demoted admin to user", "success");
            }
            else{
                $.notify(""+response.data+"", "error");
            }
        })
    };
    $scope.promoteAdmin = function(data){
        var id = data._id;
        $scope.updatevar = {tier: '1'};
        $http.put('/authapi/users/'+id+'', $scope.updatevar).then(function(response){
            if(response.data.tier == 1){
                $.notify("Successfully promoted user to admin", "success");
            }
            else{
                $.notify(""+response.data+"", "error");
            }
        })
    };
})


app.factory('PlateService', ['$http',
    function($http){
        function getByPlate(Plate){
            var requestUrl = '/api/search/'+Plate+'';
            return $http.get(requestUrl).then(function(response){
                return response.data;
            }, function (err) {
            });
        }
        return{
            getByPlate: getByPlate
        };
    }]);

app.controller('mainController', ['$scope', '$http', 'PlateService', function($scope, $http, PlateService){
    $scope.search = function(){
        if($scope.platenumber){$scope.platenumber = $scope.platenumber.toUpperCase()}
        else if(!$scope.platenumber){$scope.platenumber = $scope.platenumber}
        PlateService.getByPlate($scope.platenumber).then(function(queryresponse){
            $scope.searchProfile = {phoneNumber: '', numberPlate: '', result: ''}
            var notifsound = $('#notification')[0];
            if($('#numput').val() == ''){
                $('#replyn').hide();
                $('#replyp').hide();
                notifsound.play();
                $('#replye').slideDown().delay(5000).slideUp();
                return;
            }
            else{
                var resultDesignation;
                if($scope.current_user_no){var Pnumber = $scope.current_user_no;}else if(!$scope.current_user_no){var Pnumber = 'undefinedPC';}
                if(queryresponse.response.state == "safe"){resultDesignation = '0'}else if(queryresponse.response.state == "reported"){resultDesignation = '1'};
                $scope.searchProfile = {phoneNumber: Pnumber, numberPlate: $scope.platenumber, result: resultDesignation}
                $http.post('/api/platequery', $scope.searchProfile).then(function(response){})
            var verdict = queryresponse.response.state;
            if($('#numput').val() != '' && verdict == "safe"){
                $('#replyn').hide();
                $('#replye').hide();
                notifsound.play();
                $('#replyp').slideDown().delay(5000).slideUp();
            }
            else if($('#numput').val() != '' && verdict == "reported"){
                $('#replyp').hide();
                $('#replye').hide();
                notifsound.play();
                $('#replyn').slideDown().delay(5000).slideUp();
            }
        }
        });
    }
}]);

app.factory('contactService', function($resource){
    return $resource('/api/contact');
});

app.controller('subController', function($rootScope, $scope, contactService, $location){
    $scope.newmessage = {name: '', email: '', type: '', content: ''};
    $scope.addPlate = {numberplate: '', location: '', additionalInfo: ''};
    $scope.error_message = '';

    $scope.contact = function(){
        contactService.save($scope.newmessage, function(){
            $scope.newmessage = {name: '', email: '', type: '', content: ''};
            document.getElementById('modal_message').innerHTML = " Message Sent ";
            $location.path('/search');
        });
    };
});


app.controller('repController', function($scope, $rootScope, $http, $location, $window){
    $scope.falseplate = {phonenumber: '', numberPlate: '', content: ''};
    $scope.error_message = '';

    $scope.falserep = function(){
        $scope.falseplate.phonenumber = $scope.current_user_no;
        if($rootScope.blocked){
            document.getElementById('modal_message').innerHTML = "You've been blocked";
            $location.path('/search');
        }
        $http.post('/api/falsereports', $scope.falseplate).then(function(response){
            if(response.data){
                document.getElementById('modal_message').innerHTML = ""+$scope.falseplate.numberPlate+" Reported";
                $location.path('/search');
            }
            else{
                document.getElementById('modal_message').innerHTML = "Can't report";
            }
        });
    };
});


app.controller('authController', function($scope, $rootScope, $http, $location, $window){
    $scope.user = {phonenumber: '', password: ''};
    $scope.addPlate = {numberplate: '', location: '', additionalInfo: '', addedby: ''};
    $scope.error_message = '';

    $scope.report = function(){
        $scope.addPlate.addedby = $scope.current_user_no;
        console.log($scope.addPlate);
        $http.post('/api/plates', $scope.addPlate).then(function(response, state){
            if(response.data){
                document.getElementById('modal_message').innerHTML = ""+$scope.addPlate.numberplate+" Reported";
                $location.path('/search');
            }
            else{
                document.getElementById('modal_message').innerHTML = "Can't report";
            }
        });
    };

    $scope.login = function(){
        $http.post('/auth/login', $scope.user).then(function(response, state){
            if(response.data.state == "success"){
                $rootScope.authenticated = true;
                $rootScope.unauthenticated = false;
                $window.localStorage.setItem('user', JSON.stringify(response.data));
                $location.path('/search');
            }

            else{
                $('#message').delay(5).fadeIn().delay(3000).fadeOut();
                $scope.error_message = response.data.message;
            }
        });
    };

    $scope.login2 = function(){
        $http.post('/auth/login', $scope.user).then(function(response, state){
            if(response.data.state == "success" && response.data.user.tier == 1){
                $rootScope.authenticated = true;
                $rootScope.unauthenticated = false;
                $rootScope.authorized = true;
                $window.localStorage.setItem('user', JSON.stringify(response.data));
                $location.path('/dash');
            }

            else{
                document.getElementById('message').style.color = 'red';
                $('#message').delay(5).fadeIn().delay(3000).fadeOut();
                $scope.error_message = "You don't have the credentials to be here";
            }
        });
    };

    $scope.register = function(){
        $http.post('/auth/register', $scope.user).then(function(response, state){
            if(response.data.state == "success"){
                $rootScope.authenticated = true;
                $rootScope.unauthenticated = false;
                $rootScope.current_user = response.data.user['phonenumber'];
                console.log(response);
                $location.path('/dash');
            }
            else{
                $('#message').delay(5).fadeIn().delay(3000).fadeOut();
                $scope.error_message = response.data.message;
            }
        });
    };
});

