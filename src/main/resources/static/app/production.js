/**
 * Created by bboyvlad on 9/7/16.
 */
'use strict';

var jdApp = angular.module('jdApp', [
    'ngAnimate',
    'ngRoute',
    'ngMessages',
    'ngResource',
    'jdmenu',
    'singup',
    'login',
    'ManageUser',
    'dashboard',
    'PayMethod',
    'AddJdCard',
    'reFillJdCard',
    'AddProduct',
    'AddCart',
    'AddGiftJdCard',
    'RedeemGiftJdCard',
    'MyAirCraft',
    'MyCaptain',
    'CardCheck',
    'BankAccount',
    'NotifyPay',
    'CheckPay',
    'BalanceDetails',
    'AdminDeferedPay',
    'DeferedPay',
    'lumx',
    'ui.utils.masks',
    'angularPayments',
    'ngCookies',
    'ngSanitize',
    'pascalprecht.translate',
    'chart.js'

]).run(function($rootScope) {
    $rootScope.user = [];
    //$rootScope.mainPieChart = {labels:[], data:[], payavailable: 0, paylocked:0, paybalance: 0 };
    $rootScope.dateP = { locale: 'es', format: 'YYYY-MM-DD' };
});

/******************************/
/* START SERVICES / FACTORIES */
/******************************/
jdApp.service('helperFunc', ['userResource', 'shopcartResource', 'cardPaymentResource', 'userPaymentResource', '$http', '$rootScope', '$location', '$filter', function (userResource, shopcartResource, cardPaymentResource, userPaymentResource, $http, $rootScope, $location, $filter) {

    this.toogleStatus = function (status) {
        /*console.log('recieved bar: '+status);*/
        status = !status;
        /*console.log('sent bar: '+status);*/
        return status;
    };
    this.mainSetter = function (value) {
        /*console.log('recieved bar: '+value);*/
        //value = !value;
        //console.log('recieved value: '+value.toString());
        return value;
    };

    this.checkauth = function (tologin, roles) {
        var loggedUser=userResource.loggedUser();
        loggedUser.$promise.then(function(data) {
            //console.log("in data: " + data.toString());
            if (!angular.isDefined(data.principal)) {
                if(tologin==true){
                    $location.path("/loginpage");
                    return;
                }
                $location.path("/");
            } else {
                if(roles.indexOf($rootScope.user.authorities[0].authority) !== -1) {
                    $rootScope.cart = shopcartResource.getCartUser();
                    $rootScope.user = data;
                    $rootScope.userDetail = userResource.detailUser();
                    return true;
                }
                return false;

                /* retrieve shop cart, Principal and User details */
            }
        });
    };

    this.dateToDB = function (value, dateFormat , unix ) {
        //console.log('recieved bar: '+value);
        var newDate = "";
        if(unix==true){
            newDate = moment(value, dateFormat).format("x");
            //console.log('Unix to db: '+newDate);
            return newDate;
        }
        newDate = moment(value, dateFormat);
        //console.log('Date to db: '+newDate);
        return newDate;
    };

    this.dateFromDB = function (value, dateFormat) {
        //console.log('recieved bar: '+value);
        var dbDate = moment(value).format(dateFormat);
        //console.log('newDate: '+newDate);
        return dbDate;
    };

    this.pieChart = function () {
        $rootScope.mainPieChart = {labels:[], data:[], show: false };

            $rootScope.mainPieChart.labels = ["Available Balance", "Balance Blocked"];
            //$rootScope.mainPieChart.data = [Math.round($rootScope.mainPieChart.payavailable * 100) / 100, Math.round($rootScope.mainPieChart.paylocked * 100) / 100];
            $rootScope.mainPieChart.data = [$rootScope.totalJdCardBalance.payavailable.toFixed(2), $rootScope.totalJdCardBalance.paylocked.toFixed(2)];
            $rootScope.mainPieChart.show = true;

    }

    this.lineChart = function (data) {
        $rootScope.mainLineChart = {labels:[], series:[], payavailable: 0, paylocked:0, paybalance: 0, lineData:[], data:[  ], show: false };

            angular.forEach(data, function (value, key) {
                console.log(value.toString());
                    console.log("valor es number?: "+angular.isNumber(value.tranamount));
                    if(angular.isNumber(value.tranamount)){
                        console.log("valor es 0?: "+value.tranamount);

                        if(value.tranamount!='0') {
                            console.log("valor es negative?: "+value.tranamount.toString().indexOf('-'));
                            var amount = 0;
                            if(value.tranamount.toString().indexOf('-') !== -1){
                                /************* NEGATIVE VALUE *************/
                                console.log($rootScope.mainLineChart.lineData[$rootScope.mainLineChart.lineData.length -1]);

                                if(angular.isUndefined($rootScope.mainLineChart.lineData[$rootScope.mainLineChart.lineData.length -1])){
                                    amount = value.tranamount;
                                }else{
                                    amount = $rootScope.mainLineChart.lineData[$rootScope.mainLineChart.lineData.length -1] + value.tranamount;
                                }
                                $rootScope.mainLineChart.lineData.push(amount);
                            }else{
                                /************* POSITIVE VALUE *************/
                                if(angular.isUndefined($rootScope.mainLineChart.lineData[$rootScope.mainLineChart.lineData.length -1])){
                                    amount = value.tranamount;
                                }else{
                                    amount = $rootScope.mainLineChart.lineData[$rootScope.mainLineChart.lineData.length -1] + value.tranamount;
                                }
                                $rootScope.mainLineChart.lineData.push(amount);
                            }
                            $rootScope.mainLineChart.labels.push($filter('dateFromDB')(value.trandate, "YYYY-MM-DD"));
                        }
                    }

            });
            $rootScope.mainLineChart.series = ["Available Balance"];
            $rootScope.mainLineChart.data.push($rootScope.mainLineChart.lineData);
            $rootScope.mainLineChart.show = true;

    };

    this.jdCardBalance = function (id, chart) {
        var self = this;
        if(id!=null){
            $rootScope.jdCardBalance = { payavailable: 0, paylocked:0, paybalance: 0 };
            cardPaymentResource.get({pay_id: id}).$promise.then(
                function (data) {
                    $rootScope.jdCardBalance.payavailable =data.payavailable;
                    $rootScope.jdCardBalance.paylocked =data.paylocked;
                    $rootScope.jdCardBalance.paybalance =data.paybalance;
                }
            );
            return;
        }

        $rootScope.totalJdCardBalance = { payavailable: 0, paylocked:0, paybalance: 0 };
        userPaymentResource.get().$promise.then(
            function (data) {
                //console.log("data paymentsDetails" + data.toString());
                var items = $filter('orderBy')(data, "payid");
                //var payments = items;
                //console.log("data payments"+payments.toString());
                angular.forEach(items, function (value, key) {
                    if(value.paytype=="JDCARD"){
                        //console.log(value.payavailable);
                        $rootScope.totalJdCardBalance.payavailable += value.payavailable;
                        $rootScope.totalJdCardBalance.paylocked += value.paylocked;
                        $rootScope.totalJdCardBalance.paybalance += value.paybalance;
                    }

                });
                if(chart==true){
                    self.pieChart();
                }
            }
        );
    };

    /***************** TO AUTHENTICATE ********************/
    /*this.authenticate = function(credentials, callback) {
        console.log("in authenticate: "+ credentials);

        var headers = credentials ? {authorization : "Basic "
        + btoa(credentials.email + ":" + credentials.pass)
        } : {};

        console.log("in authenticate: "+headers.toString());

        $http.get('/users/login', {headers : headers}).then(function(response) {
            console.log("in response: "+response.toString());
            if (response.data.name) {
                $rootScope.authenticated = true;
            } else {
                $rootScope.authenticated = false;
            }
            callback && callback();
        }, function() {
            $rootScope.authenticated = false;
            callback && callback();
        });

    };*/
    /***************** TO AUTHENTICATE ********************/
}]);
jdApp.factory('userResource',  function ($resource) {
    return $resource('/users/manage/:id', {id: "@id"},{
        singUp:{
            method: 'POST',
            url: '/users/create',
            responseType: 'json'
        },
        logIn:{
            method: 'POST',
            url: '/loginpage',
            params:{username: "@username", password: "@password"},
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        },
        checkEmail:{
            method: 'POST',
            url: '/users/checkmail/:email',
            params:{email: "@email"},
        },
        loggedUser:{
            method: 'GET',
            url: '/user'
        },
        detailUser:{
            method: 'GET',
            url: '/users/loggedUser'
        },
        manageUpdate:{
            method: 'PUT',
            url: '/users/manage/:principalid',
            params:{principalid: "@principalid"}
        },
        createCoordinates:{
            method: 'GET',
            url: '/users/setcoordinates',
            headers:{'Content-Type': 'application/octet-stream'},
            responseType:'arraybuffer'
        },
        activateCoordinates:{
            method: 'GET',
            url: '/users/coordinateactivate/:token',
            params:{ token: "@token" }
        },
        checkCoordinates:{
            method: 'POST',
            url: '/users/checkcoordinate'/*,
            params:{ token: "@token" }*/
        },
        myaircraft:{
            method: 'POST',
            url: '/users/myaircraft',
            isArray: true
        }
    });
});
jdApp.factory('jdCardResource',  function ($resource) {
    return $resource('/users/jdcard/', {},{
    });
});
jdApp.factory('userPaymentResource',  function ($resource) {
    return $resource('/users/paymethod/', {},{
        get:{
            url: '/users/paymentmethod/',
            method: 'GET',
            isArray: true
        },
        save:{
            url: '/users/paymethod/',
            method: 'POST',
            isArray: true
        },
        update:{
            method: 'PATCH',
            url: '/users/paymethod/',
            isArray: true
        },
        delete:{
            method: 'DELETE',
            url: '/users/paymethod/:paymethod',
            params:{paymethod: "@paymethod"},
            isArray: true
        },
        datetransactionpay:{
            url: '/users/datetransactionpay/',
            method: 'POST',
            isArray: true
        }
    });
});
jdApp.factory('cardPaymentResource',  function ($resource) {
    return $resource('/payments/:pay_id', {pay_id: "@pay_id"},{
        refill:{
            method: 'POST',
            url: '/payments/:card_id/refill',
            params:{card_id: "@card_id"},
        }
    });
});
jdApp.factory('grpServResource',  function ($resource) {
    return $resource('/servgroup/:id', {id: "@id"},{
        showAll:{
            method: 'GET',
            url: '/servgroup/group/:groupid/product/',
            params:{groupid: "@groupid"},
            isArray: true
        },
        deleteProduct:{
            method: 'DELETE',
            url: '/servgroup/group/:groupid/:productid/',
            params:{groupid: "@groupid", productid: "@productid"}
        },
        update: {
            method:'PUT'/*,
             url: '/servgroup/:item',
             params: {item: "@item"}*/
        },
        productAdd: {
            method:'POST',
            url: '/servgroup/product/:groupid/',
            params: {groupid: "@groupid"}
        }
    });
});
jdApp.factory('productsResource',  function ($resource) {
    return $resource('/products/:id', {id: "@id"},{
        update: {
            method:'PUT'
        },
        save: {
            method:'POST',
            isArray: true
        },
        showProductsGroup:{
            method: 'GET',
            url: '/products/group/:group_id/',
            params:{groupid: "@groupid"},
            isArray: true
        },
        addProductPrice:{
            method: 'POST',
            url: '/products/prices/:productid/',
            params:{ productid: "@productid"}
        },
        getProductPrices:{
            method: 'GET',
            url: '/products/prices/:product_id/',
            params:{ productid: "@productid"},
            isArray: true
        },
        updateProductPrice:{
            method: 'PUT',
            url: '/products/prices/:productid/',
            params:{ productid: "@productid"}
        },
        getProductByTag:{
            method: 'GET',
            url: '/products/productbytag/:tag/',
            params:{ tag: "@tag"},
            isArray: true
        },
    });
});
jdApp.factory('giftCardResource',  function ($resource) {
    return $resource('/giftcard/:id', {id: "@id"},{
        redeem:{
            method: 'POST',
            url: '/giftcard/apply'
        },
        save:{
            method: 'POST',
            url: '/giftcard/'
        }
    });
});
jdApp.factory('locationResource',  function ($resource) {
    return $resource('/location/:id', {id: "@id"},{
        airportByName:{
            method: 'GET',
            url: '/location/airport/:airportname/',
            params:{ airportname: "@airportname"}/*,
             responseType: 'json'*/,
            isArray: true
        },
        allAirportByName:{
            method: 'GET',
            url: '/location/airportall/:airportname/',
            params:{ airportname: "@airportname"}/*,
             responseType: 'json'*/,
            isArray: true
        }
    });
});
jdApp.factory('aircraftResource',  function ($resource) {
    return $resource('/aircraftype/:id', {id: "@id"},{
        aircraftById:{
            method: 'GET',
            url: '/aircraftype/aircraftbyid/:aircraftype_id/',
            params:{ aircraftype_id: "@aircraftype_id"}/*,
             responseType: 'json'*/,
            isArray: true
        },
        aircraftByName:{
            method: 'GET',
            url: '/aircraftype/aircraftbytag/:name',
            params:{ name: "@name"}/*,
             responseType: 'json'*/,
            isArray: true
        },
        usersAircraft:{
            method: 'GET',
            url: '/users/myaircraft/show',
            isArray: true
        },
        updateAircraft:{
            method: 'PATCH',
            url: '/users/myaircraft',
            isArray: true
        },
        deleteAircraft:{
            method: 'DELETE',
            url: '/users/myaircraft/:aircraftid',
             params:{ aircraftid: "@aircraftid"}/*,
             responseType: 'json',
             isArray: true*/
        }
    });
});
jdApp.factory('mycaptainResource',  function ($resource) {
    return $resource('/users/mycaptain/', {},{
        query:{
            url: '/users/mycaptain/show',
            isArray: true
        },
        retrieveMycaptain:{
            method: 'GET',
            url: '/users/mycaptain/:captainId/:principal',
            params:{ captainId: "@captainId", principal: "@principal"}/*,
             responseType: 'json'*/,
            isArray: true
        },
        update:{
            method: 'PATCH',
            url: '/users/mycaptain/'/*,
            params:{ principal: "@principal"},
             responseType: 'json',
             isArray: true*/
        },
        deleteMycaptain:{
            method: 'DELETE',
            url: '/users/mycaptain/:captainId',
            params:{ captainId: "@captainId"}/*,
             responseType: 'json',
             isArray: true*/
        },

    });
});
jdApp.factory('shopcartResource',  function ($resource) {
    return $resource('/users/shopcart/:id', {id: "@id"},{

        prepareFlight:{
            method: 'POST',
            url: '/users/prepareflight/'/*,
             params:{ principal: "@principal"},
             responseType: 'json'*/,
            isArray: true
        },
        addItemCart:{
            method: 'POST',
            url: '/users/shopcart/'/*,
             params:{ principal: "@principal"},
             responseType: 'json'*/,
            isArray: true
        },
        getCartUser:{
            method: 'GET',
            url: '/users/shopcart/show/'/*,
             params:{ principal: "@principal"},
             responseType: 'json'*/,
            isArray: true
        },
        checkOut:{
            method: 'POST',
            url: '/servicerequest/:paymethod_id/:shopcart_id',
            params:{ paymethod_id: "@paymethod_id", shopcart_id: "@shopcart_id"}/*,
             responseType: 'json',
            isArray: true*/
        },
        hardDelete:{
            method: 'DELETE',
            url: '/users/shopcart/:shopcart_id',
            params:{ shopcart_id: "@shopcart_id"}/*,
             responseType: 'json',
             isArray: true*/
        },
        deleteCartItem:{
            method: 'DELETE',
            url: '/users/shopcart/:shopcart_id/:itemcartid',
            params:{ shopcart_id: "@shopcart_id", itemcartid: "@itemcartid"}/*,
             responseType: 'json',
             isArray: true*/
        },

    });
});
jdApp.factory('cardValidateResource',  function ($resource) {
    return $resource('/card/:id', {id: "@id"},{
        cardStatus:{
            method: 'GET',
            url: '/card/status/:fuelCardCode/',
            params:{ fuelCardCode: "@fuelCardCode"}/*,
             responseType: 'json',
             isArray: true*/
        },
        cardBalance:{
            method: 'GET',
            url: '/card/balance/:fuelCardCode/',
            params:{ fuelCardCode: "@fuelCardCode"}/*,
             responseType: 'json',
             isArray: true*/
        }
    });
});
jdApp.factory('bankManageResource',  function ($resource) {
    return $resource('/bank/manage/:id', {id: "@id"},{
        update: {
            method:'PATCH',
             url: '/bank/manage/:id',
             params: {id: "@id"}
        },
        delete: {
            method:'DELETE',
            isArray: true
        },
        getAll:{
            method: 'GET',
            url: '/bank/manage/all',
            isArray: true
        },
        sendpayment:{
            method: 'POST',
            url: '/bank/sendpayment',
            isArray: true
        },
        checkpayment:{
            method: 'POST',
            url: '/bank/checkpayment',
            isArray: true
        },
        showreceived:{
            method: 'GET',
            url: '/bank/showreceived',
            isArray: true
        },
    });
});

jdApp.factory('serviceRequestResource',  function ($resource) {
    return $resource('/servicerequest/:paymethod_id/:shopcart_id', {paymethod_id: "@paymethod_id", shopcart_id: "@shopcart_id"},{
        prepareTicket: {
            method:'GET',
            url: '/servicerequest/manage/prepareticket/:servicerequest',
            params: {servicerequest: "@servicerequest"}
        },
        generateTicket: {
            method:'POST',
            url: '/servicerequest/manage/generateticket'
        },
        reverseServicesRequests: {
            method:'PATCH',
            url: '/servicerequest/reverse/:servicerequest',
            params: {servicerequest: "@servicerequest"},
            isArray: true
        },
        showServicesRequests: {
            method:'GET',
            url: '/servicerequest/manage/all'
        },
        showServicesRequestsPending: {
            method:'GET',
            url: '/servicerequest/manage/pending',
            isArray: true
        },
        showServicesRequestsOpen: {
            method:'GET',
            url: '/servicerequest/manage/open'
        },
        showServicesRequestsClose: {
            method:'GET',
            url: '/servicerequest/manage/closed',
            isArray: true
        },
        userServicesRequestsPending: {
            method:'GET',
            url: '/servicerequest/pending',
            isArray: true
        },
        ServicesRequestsFinalized: {
            method:'GET',
            url: '/servicerequest/finalized',
            isArray: true
        },
        ServicesRequestsCleared: {
            method:'POST',
            url: '/servicerequest/manage/isreleased/:id',
            params: {id: "@id"},
            isArray: true
        },
    });
});
/********************/
/* START DIRECTIVES  / FILTERS*/
/********************/
var capitalize = function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                if (inputValue == undefined) inputValue = '';
                var capitalized = inputValue.toUpperCase();
                if (capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
                return capitalized;
            }
            modelCtrl.$parsers.push(capitalize);
            capitalize(scope[attrs.ngModel]); // capitalize initial value
        }
    };
};

jdApp.directive("capitalize", capitalize);

/*TO COMPARE FIELDS VALUES*/
var compareTo = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
};

jdApp.directive("compareTo", compareTo);

jdApp.filter("tdcmask", function () {
    return function (value) {
        if(angular.isDefined(value)){

            value = value.slice(0, 4)+"********"+value.slice(12, 16);
            return value
        }
    }
});

jdApp.filter("dateFromDB", function () {
    return function (value, dateFormat) {
        //console.log('recieved bar: '+value);
        var dbDate = moment(value).format(dateFormat);
        //console.log('newDate: '+newDate);
        return dbDate;
    }
});

/********************/
/* START CONTROLLER */
/********************/
jdApp.controller('IndexController', ['$rootScope','$scope',
    function IndexController($rootScope, $scope) {
        $scope.cssClass = 'index';
        var vm = this;



        $rootScope.userDetail = {};


        //console.log(moment());
    }]);
/**
 * Created by bboyvlad on 9/7/16.
 */
'use strict';

angular.module('jdApp').
config(['$locationProvider', '$routeProvider', '$httpProvider',
    function config($locationProvider, $routeProvider, $httpProvider){
        //$locationProvider.hashPrefix('!');

        /*To Allow Spring Security responds to do a "WWW-Authenticate" header in a 401 response NOT
        SHOWING an authenticatino pop-up */
        $locationProvider.html5Mode(true);
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';


        $routeProvider.
        when('/', {
            templateUrl: 'partials/index.html',
            controller: 'IndexController'/*,
            controllerAs: 'vm'*/
        }).
        when('/users/sing-up', {
            templateUrl: 'partials/users/singup.html',
            controller: 'singupController'

        })/*.
        when('/users/sms-email', {
            templateUrl: 'partials/users/smsemail.html',
            controller: 'smsController',
            controllerAs: 'vm'
        })*/.
        when('/loginpage', {
            templateUrl: 'partials/users/login.html',
            controller: 'LoginController'/*,
            controllerAs: 'vm'*/
        }).
        when('/users/admin', {
            templateUrl: 'partials/users/manage/admin_users.html',
            controller: 'ManageUserController',
            resolve:{
                "check":function($location, helperFunc, LxNotificationService){
                    if(helperFunc.checkauth(true, ['ROLE_ADMIN', 'ROLE_SYSADMIN'])==false){
                        //$event.preventDefault();
                        $location.path("/401");
                        LxNotificationService.error('Get in contact with the System Administartor!!!');
                    }
                }
            }
        })
        /*.
        when('/users/account-status', {
            templateUrl: 'partials/users/accountstatus.html',
            controller: 'AccountStatusController',
            controllerAs: 'vm'
        }).
        /*when('/users/showall', {

        })*/
        .
        when('/dashboard', {
            templateUrl: 'partials/dashboard/main.html',
            controller: 'DashController'/*,
            controllerAs: 'vm'*/
        })
        .
        when('/dashboard/cardstatus', {
            templateUrl: 'partials/dashboard/cardcheck/cardcheck.html',
            controller: 'CardCheckController',
            resolve:{
                "check":function($location, helperFunc, LxNotificationService){
                    if(helperFunc.checkauth(true, ['ROLE_PROVIDER', 'ROLE_ADMIN', 'ROLE_SYSADMIN'])==false){
                        //$event.preventDefault();
                        $location.path("/401");
                        LxNotificationService.error('Get in contact with the System Administartor!!!');
                    }
                }
            }
        }).
        when('/dashboard/paymentmethod-form', {
            templateUrl: 'partials/dashboard/paymethod/paymethodform.html',
            controller: 'PayMethodController',
            resolve:{
                "check":function($location, helperFunc, LxNotificationService){
                    if(helperFunc.checkauth(true, ['ROLE_ADMIN', 'ROLE_SYSADMIN'])==false){
                        //$event.preventDefault();
                        $location.path("/401");
                        LxNotificationService.error('Get in contact with the System Administartor!!!');
                    }
                }
            }
        }).
        when('/dashboard/sendpayment', {
            templateUrl: 'partials/dashboard/notifypayment/notifypaymentform.html',
            controller: 'NotifyPayController',
            resolve:{
                "check":function($location, helperFunc, LxNotificationService){
                    if(helperFunc.checkauth(true, ['ROLE_ADMIN', 'ROLE_SYSADMIN'])==false){
                        //$event.preventDefault();
                        $location.path("/401");
                        LxNotificationService.error('Get in contact with the System Administartor!!!');
                    }
                }
            }
        }).
        when('/dashboard/showreceived', {
            templateUrl: 'partials/dashboard/checkpayment/checkpaymentform.html',
            controller: 'CheckPayController',
            resolve:{
                "check":function($location, helperFunc, LxNotificationService){
                    if(helperFunc.checkauth(true, ['ROLE_ADMIN', 'ROLE_SYSADMIN'])==false){
                        //$event.preventDefault();
                        $location.path("/401");
                        LxNotificationService.error('Get in contact with the System Administartor!!!');
                    }
                }
            }
        }).
        when('/dashboard/bankmanage', {
            templateUrl: 'partials/dashboard/bankmanage/bankaccount.html',
            controller: 'BankAccountController',
            resolve:{
                "check":function($location, helperFunc, LxNotificationService){
                    if(helperFunc.checkauth(true, ['ROLE_ADMIN', 'ROLE_SYSADMIN'])==false){
                        //$event.preventDefault();
                        $location.path("/401");
                        LxNotificationService.error('Get in contact with the System Administartor!!!');
                    }
                }
            }
        }).
        when('/dashboard/balance_details', {
            templateUrl: 'partials/dashboard/balance/balance.html',
            controller: 'BalanceDetailsController',
            resolve:{
                "check":function($location, helperFunc, LxNotificationService){
                    if(helperFunc.checkauth(true, ['ROLE_ADMIN', 'ROLE_SYSADMIN'])==false){
                        //$event.preventDefault();
                        $location.path("/401");
                        LxNotificationService.error('Get in contact with the System Administartor!!!');
                    }
                }
            }
        }).
        when('/dashboard/admin_pending_payments', {
            templateUrl: 'partials/dashboard/admin_pending/admin_pendingform.html',
            controller: 'AdminDeferedPayController',
            resolve:{
                "check":function($location, helperFunc, LxNotificationService){
                    if(helperFunc.checkauth(true, ['ROLE_ADMIN', 'ROLE_SYSADMIN'])==false){
                        //$event.preventDefault();
                        $location.path("/401");
                        LxNotificationService.error('Get in contact with the System Administartor!!!');
                    }
                }
            }
        }).
        when('/dashboard/defered_payments', {
            templateUrl: 'partials/dashboard/deferedpayment/deferedpaymentform.html',
            controller: 'DeferedPayController',
            resolve:{
                "check":function($location, helperFunc, LxNotificationService){
                    if(helperFunc.checkauth(true, ['ROLE_ADMIN', 'ROLE_SYSADMIN'])==false){
                        //$event.preventDefault();
                        $location.path("/401");
                        LxNotificationService.error('Get in contact with the System Administartor!!!');
                    }
                }
            }
        }).
        when('/dashboard/buy/jdcard', {
            templateUrl: 'partials/dashboard/jdcard/addjdcard.html',
            controller: 'AddJdCardController',
            resolve:{
                "check":function($location, helperFunc, LxNotificationService){
                    if(helperFunc.checkauth(true, ['ROLE_ADMIN', 'ROLE_SYSADMIN'])==false){
                        //$event.preventDefault();
                        $location.path("/401");
                        LxNotificationService.error('Get in contact with the System Administartor!!!');
                    }
                }
            }
        }).
        when('/dashboard/refill/jdcard', {
            templateUrl: 'partials/dashboard/jdcard/refilljdcard.html',
            controller: 'RefillJdCardController',
            resolve:{
                "check":function($location, helperFunc, LxNotificationService){
                    if(helperFunc.checkauth(true, ['ROLE_ADMIN', 'ROLE_SYSADMIN'])==false){
                        //$event.preventDefault();
                        $location.path("/401");
                        LxNotificationService.error('Get in contact with the System Administartor!!!');
                    }
                }
            }
        }).
        when('/dashboard/groupserv/add', {
            templateUrl: 'partials/generaldef/groupserv/addgroupserv.html',
            controller: 'AddGrpServController'
        }).
        when('/dashboard/products/add', {
            templateUrl: 'partials/generaldef/product/index.html',
            controller: 'AddProductController'
        }).
        when('/dashboard/cart', {
            templateUrl: 'partials/dashboard/cart/cartForm.html',
            controller: 'AddCartController',
            resolve:{
                "check":function($location, helperFunc, LxNotificationService){
                    if(helperFunc.checkauth(true, ['ROLE_ADMIN', 'ROLE_SYSADMIN'])==false){
                        //$event.preventDefault();
                        $location.path("/401");
                        LxNotificationService.error('Get in contact with the System Administartor!!!');
                    }
                }
            }
        }).
        when('/dashboard/giftcard/buy', {
            templateUrl: 'partials/dashboard/giftcard/addgiftjdcard.html',
            controller: 'AddGiftJdCardController',
            resolve:{
                "check":function($location, helperFunc, LxNotificationService){
                    if(helperFunc.checkauth(true, ['ROLE_ADMIN', 'ROLE_SYSADMIN'])==false){
                        //$event.preventDefault();
                        $location.path("/401");
                        LxNotificationService.error('Get in contact with the System Administartor!!!');
                    }
                }
            }

        }).
        when('/dashboard/giftcard/redeem', {
            templateUrl: 'partials/dashboard/giftcard/redeemgiftjdcard.html',
            controller: 'RedeemGiftJdCardController',
            resolve:{
                "check":function($location, helperFunc, LxNotificationService){
                    if(helperFunc.checkauth(true, ['ROLE_ADMIN', 'ROLE_SYSADMIN'])==false){
                        //$event.preventDefault();
                        $location.path("/401");
                        LxNotificationService.error('Get in contact with the System Administartor!!!');
                    }
                }
            }
        }).
        when('/dashboard/aircraft/manage', {
            templateUrl: 'partials/dashboard/aircraft/myaircrafts.html',
            controller: 'MyAirCraftsController',
            resolve:{
                "check":function($location, helperFunc, LxNotificationService){
                    if(helperFunc.checkauth(true, ['ROLE_ADMIN', 'ROLE_SYSADMIN'])==false){
                        //$event.preventDefault();
                        $location.path("/401");
                        LxNotificationService.error('Get in contact with the System Administartor!!!');
                    }
                }
            }
        }).
        when('/dashboard/captain/manage', {
            templateUrl: 'partials/dashboard/captain/captain.html',
            controller: 'MyCaptainController',
            resolve:{
                "check":function($location, helperFunc, LxNotificationService){
                    if(helperFunc.checkauth(true, ['ROLE_ADMIN', 'ROLE_SYSADMIN'])==false){
                        //$event.preventDefault();
                        $location.path("/401");
                        LxNotificationService.error('Get in contact with the System Administartor!!!');
                    }
                }
            }
        })

        /******** ERRORS *********/
            .
            when('/401', {
                templateUrl: 'partials/errors/401.html'
            })


            .otherwise({ redirectTo: '/' });



    }
])/*.run( function($rootScope, $location) {

    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        console.log("next: "+ next.toString() +" user: "+angular.isDefined($rootScope.user) +" and user: "+ $rootScope.user.toString()  );
        if ( angular.isDefined($rootScope.user) && !$rootScope.user=='' ) {
            // no logged user, we should be going to #login
            $location.path( next.$$route.originalPath );
        }else {
            console.log("intento de ir a: "+ next.$$route.templateUrl.toString() );
            if (
                next.$$route.templateUrl == "partials/index.html" ||
                next.$$route.templateUrl == "partials/users/login.html"||
                next.$$route.templateUrl == "partials/users/singup.html") {
                // already going to #login, no redirect needed
                 //console.log("continuo a: "+ next.$$route.originalPath.toString() );
                $location.path( next.$$route.originalPath );
            } else {
                // not going to #login, we should redirect now
                $location.path( "/users/log-in" );
            }

        }
    });
})*/;
/**
 * Created by bboyvlad on 11/20/16.
 */
/**
 * Created by bboyvlad on 9/7/16.
 */
'use strict';

angular.module('jdApp').
config(
    ['$translateProvider', function config($translateProvider){
        $translateProvider.translations('en', {
            BUTTON_LANG_EN: 'English',
            BUTTON_LANG_ES: 'Spanish',
            index:{
                card1:{
                    title1:'Welcome ',
                    title2:'to our ',
                    subtitle:'Know more',
                    txt1:'If you already have a ',
                    txt2: 'Log into your account',
                    button: 'Log in',
                    txt3:'Don\'t have an online account ?',
                    link: 'register Now',

                },
                card2:{
                    title:'Log In',
                    text:'Log in to your ',
                    button: 'Log In'

                }
            },
            login:{
                card1:{
                    headline: 'Log to your account',
                    title:'Log in to your account',
                    subtitle:'Don\'t have an online account ?',
                    link: 'Register Now',
                },
                form1:{
                    f1:'Email',
                    f1error:{
                        e1: 'You did not enter a field Name',
                        e2: 'You did not enter a valid Email'
                    },
                    f2:'Password',
                    f2error:{
                        e1: 'You did not enter a password'
                    },
                    button: 'Log In'

                },
                module:{
                    sms1: ' Verify your data'
                }
            },
            singup:{
                card1:{
                    title:'Registration',
                    subtitle:'Register a new Account',
                },
                form1:{
                    f1:'Name',
                    f1error:{
                        e1: 'Don\'t forget to fill your name',
                    },
                    f2:'Last Name',
                    f2error:{
                        e1: 'Don\'t forget to fill your Last name'
                    },
                    f3:'Email',
                    f3error:{
                        e1: 'Don\'t forget to fill your Email',
                        e2: 'You did not enter a valid Email'
                    },
                    f4:'Password',
                    f4error:{
                        e1: 'The password can\'t be empty',
                        e2: 'The password length must be greater than or equal to 8',
                        e3: 'The password must contain one or more uppercase characters',
                        e4: 'The password must contain one or more lowercase characters',
                        e5: 'The password must contain one or more numeric values',
                        e6: 'The password must contain one or more special characters',
                    },
                    f5:'Repeat password',
                    f5error:{
                        e1: 'Check your password',
                        e2: 'Your password do not match'
                    },
                    button1: 'Clear',
                    button2: 'Sign Up'

                },
                module:{
                    sms1: 'This email is already in use',
                    sms2: 'Your account has been created',
                    sms3: "Welcome {{firstname}} {{lastname}},\r\nCheck your email ({{email}}) to activate your account ..\r\nYou\'ll be redirect it to the Login page"
                }
            },
            dashboard:{
                card1:{
                    title: 'Utilities',
                    subtitle: 'take full advantage of the benefits of been part of our team'
                },
                card2:{
                    title:'Add payment method',
                    text1:'Add Credit Cards to buy ',
                    text2:'and you\'ll be able to access products y services',
                    button: 'Add pay method'

                },
                card3:{
                    title:'Buy a',
                    text1:'Buy your custom',
                    text2:', to enjoy our fuel services, catering y more',
                    button: 'Buy a'

                },
                card4:{
                    title:'Balance ',
                    text1:'Available',
                    text2:'Blocked',
                    button: 'Balance details'

                },
                card5:{
                    title:'Refill',
                    text1:'Refill your ',
                    text2:', and keep enjoying our services',
                    button: 'Refill'

                }
            },
            paymethod:{
                tabs:{
                    tab1: 'Add',
                    tab2: 'Manage'
                },
                card1:{
                    headline:'Add Payment method ',
                    title:'Payment method',
                },
                coord:{
                    title: 'Validate coordinates',
                    button1: 'Close',
                    button2: 'Validate',
                },
                datatable:{
                    placeholder: 'Search',
                    f1: 'Method',
                    f2: 'Type',
                    f3: 'Card Holder',
                    f4: 'Number',
                    f5: 'Edit',
                    f6: 'Delete'
                },
                form1:{
                    f1:'payment method',
                    f1error:{
                        e1: 'Choose a payment method',
                    },
                    f2:'Number',
                    f2error:{
                        e1: 'Fill up your credit card\'s number',
                        e2: 'Your credit card number is invalid'
                    },
                    f3:'Card name',
                    f3error:{
                        e1: 'This field can\'t be empty',
                        e2: 'Only letters and spaces are allow, Example: "MATILDE R PEREZ R"'
                    },
                    f4:'Valid thru',
                    f4error:{
                        e1: 'Your credit card valid thru is required',
                        e2: 'Please enter a valid thru format MM/YYYY'
                    },
                    button1: 'Clear',
                    button2: 'Save',
                    button3: 'Update',

                },
                module:{
                    sms1: 'Create a Coordinate Card',
                    sms2: 'To add a paying method you must have a coordinate card.',
                    sms3: 'Card created successfully.. Check your email for your activation instructions',
                    sms4: 'You already have a coordinate card, but you need to activated... in your email you have the necessary instructions to activate, or generate a new one in the user manage menu...',
                    sms5: 'Error, Check Your Internet Connection',
                    sms6: 'Pay Method created',
                    sms7: 'Your card has been added successfully,\r\n to your paying methods...',
                    sms8: 'Invalid Data',
                    sms9: 'You haven\'t activated your card yet',
                    sms10: 'Update successful',
                    sms11: 'Delete Paying Method',
                    sms12: 'Please check that you wish to delete this pay method.',
                    sms13: 'Cancel',
                    sms14: 'Delete',
                    sms15: 'Pay Method, Erased successfully',
                    sms16: 'Disagree'
                }
            },
            notifypay:{
                card1:{
                    headline:'Notify Payment',
                },
                form1:{
                    f1:'Choose a payment method',
                    f1error:{
                        e1: 'Choose a payment method',
                    },
                    f2:'Choose a bank',
                    f2error:{
                        e1: 'Choose a bank',
                    },
                    f3:'Reference Number',
                    f3error:{
                        e1: 'Your deposit / transfer reference number is required',
                    },
                    f4:'Amount',
                    f4error:{
                        e1: 'An amount is required',
                        e2: 'The amount must be grater than 0'
                    },
                    f5:'Date',
                    f5error:{
                        e1: 'Transaction Date  is required',
                    },
                    button1: 'Clear',
                    button2: 'Save'

                },
                module: {
                    sms1: 'Notification Sent',
                    sms2: 'Your Payment has been notified successfully,\r\nour customer service will let you know\r\nonce is clear ...'
                }
            },
            jdcard:{
                add:{
                    card1:{
                        headline:'Buy',
                        title:'Choose a payment method',
                    },
                    card2:{
                        title:'Custom your'
                    },
                    form1:{
                        f1:'Payment method',
                        f1error:{
                            e1: 'Choose a payment method',
                        },
                        f2:'Credit card CVC code',
                        f2error:{
                            e1: 'Please enter your credit card CVC code',
                            e2: 'Please enter your 3 digits credit card CVC code, at the back of your card',
                            e3: 'Please enter your 4 digits credit card CVC code, at the back of your card'
                        },
                        f3:'Identify your',
                        f3error:{
                            e1: 'This field can\'t be empty',
                            e2: 'Only letters and spaces are allow, Example: "MATILDE R PEREZ R"',
                        },
                        f4:'Amount',
                        f4error:{
                            e1: 'Enter an amount',
                            e2: 'The amount must be greater than 0',
                        },
                        button: 'Adquire'

                    },
                    module:{
                        sms1: 'Transaction Canceled Check Your Internet Connection',
                        sms2: 'Transaction Canceled Check your Pay Method',
                        sms3: 'created',
                        sms4: 'You can use now your,',
                    }
                },
                refill:{
                    card1:{
                        headline:'Refill',
                        title:'Choose a payment method',
                    },
                    card2:{
                        title:'Choose your'
                    },
                    form1:{
                        f1:'Payment method',
                        f1error:{
                            e1: 'Choose a payment method',
                        },
                        f2:'Credit card CVC code',
                        f2error:{
                            e1: 'Please enter your credit card CVC code',
                            e2: 'Please enter your 3 digits credit card CVC code, at the back of your card',
                            e3: 'Please enter your 4 digits credit card CVC code, at the back of your card'
                        },
                        f3:'Choose your',
                        f3error:{
                            e1: 'Choose your',
                        },
                        f4:'Amount',
                        f4error:{
                            e1: 'Enter an amount',
                            e2: 'The amount must be greater than 0',
                        },
                        button1: 'Clear',
                        button2: 'Refill'

                    },
                    module:{
                        sms1: 'Transaction Canceled Check Your Internet Connection',
                        sms2: 'Refill',
                        sms3: 'Refill successful, \r\n ${{amount}} has been added to your',
                    }
                }
            },
            giftcard:{
                add:{
                    card1:{
                        headline:'Buy gift card',
                        title:'Choose a credit card',
                    },
                    card2:{
                        title:'Choose a'
                    },
                    card3:{
                        title:'Customize your gift card'
                    },
                    radio:{
                        headline:'Choose between one of these payment methods',
                        option1:{
                            title:'Credit card',
                            subtitle: 'Choose this option to pay with a credit card.'
                        },
                        option2:{
                            title:'',
                            subtitle: 'Choose this option to pay with a'
                        },
                    },
                    form1:{
                        f1:'Payment method',
                        f1error:{
                            e1: 'Choose a payment method',
                        },
                        f2:'Credit card CVC code',
                        f2error:{
                            e1: 'Please enter your credit card CVC code',
                            e2: 'Please enter your 3 digits credit card CVC code, at the back of your card',
                            e3: 'Please enter your 4 digits credit card CVC code, at the back of your card'
                        },
                        f3:'Amount',
                        f3error:{
                            e1: 'Enter an amount',
                            e2: 'The amount must be greater than 0',
                        },
                        f4:'Choose a ',
                        f4error:{
                            e1: 'Choose a ',
                        },
                        f5:'Amount',
                        f5error:{
                            e1: 'Enter an amount',
                            e2: 'The amount must be greater than 0',
                        },
                        f6:'Recipient email',
                        f6error:{
                            e1: 'This field must be fill',
                        },
                        f7:'Recipient name',
                        f7error:{
                            e1: 'This field must be fill',
                        },
                        f8:'Gift card message',
                        f8error:{
                            e1: 'This field must be fill',
                        },
                        button1: 'Clear',
                        button2: 'Buy'

                    },
                    module:{
                        sms1: 'Transaction Canceled Check Your Internet Connection',
                        sms2: 'Transaction Canceled Not enough money on your account ',
                        sms3: 'Gift Card Sent',
                        sms4: 'Your beneficiary will recieve instructions on his email, \r\nto redeem this gift card...',
                    }
                },
                redeem:{
                    card1:{
                        headline:'Redeem gift card',
                        title:'Choose a',
                    },
                    card2:{
                        title:'Claim Code'
                    },
                    form1:{
                        f1:'Choose a ',
                        f1error:{
                            e1: 'Choose a ',
                        },
                        f2:'Gift card claim code',
                        f2error:{
                            e1: 'This field must be fill',
                        },
                        button1: 'Clear',
                        button2: 'Redeem'

                    },
                    module:{
                        sms1: 'Transaction Canceled Check Your Internet Connection',
                        sms2: 'Claimed Gift Card',
                        sms3: 'The gift has been claim successfully...',
                    }
                }
            },
            defered:{
                tabs:{
                    tab1: 'Pending service requests',
                    tab2: 'Closed service requests'
                },
                card1:{
                    headline:'Pending service requests',
                    //title:'Pending payments',
                },
                card2:{
                    title:'Closed service requests',
                },
                datatable1:{
                    placeholder: 'Search',
                    title: 'Pending payments',
                    f1: 'Client',
                    f2: 'Location',
                    f3: 'Creation date',
                    f4: 'Landing date',
                    f5: 'Serial',
                    f6: 'Reverse',
                },
                datatable2:{
                    placeholder: 'Search',
                    title: 'Closed service requests',
                    f1: 'Client',
                    f2: 'Location',
                    f3: 'Creation date',
                    f4: 'Landing date',
                    f5: 'Serial',
                },
                dialog:{
                    title: 'Service request',
                    form1:{
                        f1:'Client',
                        f2:'Location',
                        f3:'Landing date',
                        button1: 'Close',
                        button2: 'Reverse'
                    },
                    datatable1:{
                        title: 'Services',
                        f1: 'Info',
                        f2: 'Unit',
                        f3: 'Price',
                        f4: 'Amount',
                    }
                },
                module:{
                    sms1: 'Reverse service request',
                    sms2: 'Please confirm that your wish to reverse this service request.',
                    btn1: 'Cancel',
                    btn2: 'Reverse',
                    sms3: 'Service request, Reversed successfully',
                }
            },
            checkpayment:{
                card1:{
                    headline:'Received payments',
                    //title:'Pending payments',
                },
                datatable1:{
                    placeholder: 'Search',
                    title: 'Received Payments',
                    f1: 'Bank',
                    f2: 'Reference',
                    f3: 'Creation date',
                    f4: 'Status',
                    f5: 'Edit',
                },
                dialog:{
                    title: 'Deposit / Transfer',
                    form1:{
                        f1:'Bank',
                        f2:'Reference',
                        f3:'Amount',
                        f4:'Date',
                        f5:'Cleared amount',
                        f6:'Approved',
                        button1: 'Close',
                        button2: 'Update'
                    }
                },
                module:{
                    sms1: 'Update successful'
                }
            },
            checkout:{
                card1:{
                    headline:'Items',
                    //title:'Pending payments',
                    sms1: 'Choose a',
                },
                form1:{
                    f1:'Choose a',
                    f1error:{
                        e1: 'Choose a payment method'
                    },
                    f2:'Acept our terms and conditions'
                },
                button1: 'Close',
                button2: 'Pay',
            },
            cart:{
                card1:{
                    headline:'Service request',
                    //title:'Pending payments',
                    sms1: 'Choose a location',
                    sms2: 'Your destination will be',
                    sms3: 'Flight details'
                },
                form1:{
                    f1:'Locations',
                    f1error:{
                        e1: 'Choose your location'
                    },
                    f2:'Estimated arrival',
                    f2error:{
                        e1: 'Don\'t forget your estimated arrival date'
                    },
                    f3:'Time',
                    f3error:{
                        e1: 'Don\'t forget your estimated arrival time',
                        e2: 'Invalid time'
                    },
                    f4:'Estimated departure',
                    f4error:{
                        e1: 'Don\'t forget your estimated departure date'
                    },
                    f5:'Time',
                    f5error:{
                        e1: 'Don\'t forget your estimated departure time',
                        e2: 'Invalid time'
                    },
                    f6:'My aircraft',
                    f6error:{
                        e1: 'Choose your aircraft'
                    },
                    f7:'My pilots',
                    f7error:{
                        e1: 'Choose a pilot'
                    },
                    f8:'Flight name',
                    f8error:{
                        e1: 'This field must be fill'
                    },
                    f9:'Incoming Location',
                    f9error:{
                        e1: 'Choose your location'
                    },

                    button1: 'Clear',
                    button2: 'Search',
                    button3: 'Clear',
                    button4: 'Save'
                },
                datatable1:{
                    f1: 'Select',
                    f2: 'Info',
                    f3: 'Unt',
                    f4: 'Price',
                    f5: 'Quantity',
                    title: 'Services'
                },
                module:{
                    sms1: 'The departure date must be equal or grater than the arrival date, please select a new departure date',
                    sms2: 'Choose the services that you wish to adquire',
                    sms3: 'Saved in your shopping cart, now you can generate this service request from your shopping cart list',
                    sms4: 'Notification',
                    sms5: 'You need to register at least one aircraft and one captain to complete the process of adding an item to the shopcart, please complete those requirements before you can continue!'
                }
            },
            cardcheck:{
                card1:{
                    headline: 'check',
                    title: 'Choose between'
                },
                form1:{
                    R1title: 'Status',
                    R1subtitle1: 'Check this option to get a',
                    R1subtitle2: 'status',
                    R2title: 'Balance',
                    R2subtitle1: 'Check this option to get a',
                    R2subtitle2: 'balance',
                    f1: 'code',
                    f1error:{
                        e1:'Enter the',
                        e2: 'Code'//empty for spanish
                    },
                    button1: 'Clear',
                    button2: 'Check'
                },
                dialog:{
                    title1: 'Card not valid for consumption please contact',
                    title2: 'Card valid for consumption',
                    datatable1:{
                        title: 'Status',
                        f1: 'Card Code',
                        f2: 'Status',
                        f3: 'Card owner',
                        f4: 'Aircraft Plate',
                    },
                    datatable2:{
                        f1: 'Group',
                        f2: 'Currency',
                        f3: 'Balance',
                        f4: 'Credit Condition',
                        f5: 'Days',
                        f6: 'Accumulated',
                        f7: 'Qttinv',
                    },
                    button1: 'Close',
                }
            },
            captain:{
                tabs:{
                    tab1: 'Add',
                    tab2: 'Manage'
                },
                card1:{
                    headline:'Add pilot ',
                    title:'Register pilot',
                },
                card2:{
                    headline:'Pilot ',
                    title:'Update pilot',
                },
                datatable:{
                    placeholder: 'Search',
                    f1: 'Name',
                    f2: 'Email',
                    f3: 'License',
                    f4: 'Phone',
                    f5: 'Edit',
                    f6: 'Delete'
                },
                form1:{
                    f1:'Names',
                    f1error:{
                        e1: 'Don\'t forget to enter the pilot\'s name'
                    },
                    f2:'Licence',
                    f2error:{
                        e1: 'Don\'t forget to enter the pilot\'s license'
                    },
                    f3:'Date of birth',
                    f3error:{
                        e1: 'Don\'t forget to enter the pilot\'s date of birth'
                    },
                    f4:'Address',
                    f4error:{
                        e1: 'Don\'t forget to enter the pilot\'s address'
                    },
                    f5:'Country',
                    f5error:{
                        e1: 'Don\'t forget to enter the pilot\'s country'
                    },
                    f6:'City',
                    f6error:{
                        e1: 'Don\'t forget to enter the pilot\'s city'
                    },
                    f7:'Phone number',
                    f7error:{
                        e1: 'Don\'t forget to enter the pilot\'s phone number'
                    },
                    f8:'Email',
                    f8error:{
                        e1: 'Don\'t forget to enter the pilot\'s email',
                        e2: 'The email is invalid'
                    },
                    f9:'Enable pilot',
                    f9label1: 'Active',
                    f9label2: 'Inactive',
                    button1: 'Clear',
                    button2: 'Save',
                    button3: 'Update',

                },
                module:{
                    sms1: 'Pilot, created successfully',
                    sms2: 'Update successful',
                    sms3: 'Erased Pilot',
                    sms4: 'Please confirm that your wish to erased this pilot.',
                    sms5: 'Pilot, Erased successfully',
                    sms6: 'Disagree'
                }
            },
            bankmanage:{
                tabs:{
                    tab1: 'Add',
                    tab2: 'Manage'
                },
                card1:{
                    headline:'Add bank account',
                },
                dialog:{
                    card1:{
                        headline:'Bank Accounts ',
                        title:'Edit bank account',
                    },
                },
                datatable:{
                    placeholder: 'Search',
                    f1: 'Bank',
                    f2: 'Account',
                    f3: 'Creation date',
                    f4: 'Status',
                    f5: 'Edit',
                    f6: 'Delete'
                },
                form1:{
                    f1:'Bank account name',
                    f1error:{
                        e1: 'Your bank account name is required'
                    },
                    f2:'Bank number',
                    f2error:{
                        e1: 'Your bank account number is required',
                        e2: 'Only numbers are allow'
                    },
                    f3:'Creation date',
                    f3error:{
                        e1: 'Don\'t forget to fill this field'
                    },
                    f4:'Bank account note',
                    f4error:{
                        e1: ''
                    },
                    f5:'Enable',
                    f5error:{
                        e1: 'The bank account status is required'
                    },
                    button1: 'Clear',
                    button2: 'Save',
                    button3: 'Update',

                },
                module:{
                    sms1: 'Bank account created',
                    sms2: "Your bank account has been added successfully,\r\nto your paymenthods...",
                    sms3: 'Update successful',
                    sms4: 'Delete bank account',
                    sms5: 'Please confirm to delete this bank account .',
                    btn1: 'Cancel',
                    btn2: 'Delete',
                    sms6: 'Bank account, Deleted successfully',
                    sms7: 'Disagree'
                }
            },
            balance:{
            tabs:{
                tab1: 'balance',
                    tab2: 'balance details'
            },
            card1:{
                headline:'balance',
                    label1: 'Available',
                    label2: 'Blocked'
            },
            card2:{
                headline:'balance ',
                    label1: 'Available',
                    label2: 'Blocked'
            },
            datatable:{
                placeholder: 'Search',
                    title: 'Transactions',
                    f1: 'Type',
                    f2: 'Amount',
                    f3: 'Date',
            },
            form1:{
                f1:'Choose a',
                    f1error:{
                    e1: 'Choose a'
                },
                f2:'From',
                    f2error:{
                    e1: 'Choose a date',
                },
                f3:'To',
                    f3error:{
                    e1: 'Choose a date',
                },
                button1: 'Clear',
                    button2: 'Search'

            }
        },
            aircraft:{
                tabs:{
                    tab1: 'Add',
                    tab2: 'Manage'
                },
                card1:{
                    headline:'Add aircraft',
                    title: 'New aircraft',
                },
                dialog:{
                    headline:'Aircraft ',
                    card2:{
                        title: 'Update aircraft',
                    },
                },
                datatable:{
                    placeholder: 'Search',
                    title: 'Transactions',
                    f1: 'Name',
                    f2: 'Model',
                    f3: 'MTOW',
                    f4: 'Status',
                    f5: 'Edit',
                    f6: 'Delete',
                },
                form1:{
                    f1:'Aircrafts',
                    f1error:{
                        e1: 'Choose your aircraft'
                    },
                    f2:'Tail number',
                    f2error:{
                        e1: 'Don\'t forget to enter the tail number',
                        e2: 'Blank spaces and symbols are not allowed in this field',
                    },
                    f3:'Aviation type',
                    f3error:{
                        e1: 'Choose an aviation type',
                    },
                    f4:'Name',
                    f4error:{
                        e1: 'Choose an name for your aircraft',
                    },
                    f5: 'Enable aircraft',
                    f5label:{
                        l1:'Active',
                        l2:'Inactive',
                        l3: 'Enable'
                    },
                    button1: 'Clear',
                    button2: 'Save',
                    button3: 'Update'

                },
                module:{
                    sms1: 'Update successful',
                    sms2: 'Error in the Operation , the update didn\'t complete ',
                    sms3: 'Aircraft created successfully',
                    sms4: 'Erase Aircraft',
                    sms5: 'Please confirm that you wish to erase this Aircraft.',
                    btn1: 'Cancel',
                    btn2: 'Delete',
                    sms6: 'Error in the operation, the elimination didn\'t complete ',
                    sms7: 'Aircraft, Deleted successfully',
                    sms8: 'Disagree'
                }
            },
            adminPending:{
                tabs:{
                    tab1: 'Open service requests',
                    tab2: 'Closed service requests'
                },
                card1:{
                    headline:'Service requests Administration',
                },
                card2:{
                    headline:'Closed service requests',
                },
                dialog:{
                    headline:'Service request ',
                    label1: 'Client',
                    label2: 'Location',
                    label3: 'Landing date',
                    datatable1:{
                        title: 'Services',
                        f1: 'Select',
                        f2: 'Info',
                        f3: 'Unt',
                        f4: 'Price',
                        f5: 'Amount',
                    }
                },

                datatable1:{
                    placeholder: 'Search',
                    title: 'Open service requests',
                    f1: 'Client',
                    f2: 'Location',
                    f3: 'Creation date',
                    f4: 'Landing date',
                    f5: 'Serial',
                    f6: 'Cleared',
                    f7: 'Prepare',
                    f8: 'Reverse'
                },
                datatable2:{
                    placeholder: 'Search',
                    title: 'Closed service requests',
                    f1: 'Client',
                    f2: 'Location',
                    f3: 'Creation date',
                    f4: 'Landing date',
                    f5: 'Serial',
                },
                form1:{
                    f1:'Ticket',
                    f1error:{
                        e1: 'Don\'t forget to enter the ticket number'
                    },
                    f2:'Amount',
                    button1: 'Close',
                    button2: 'Generate Ticket',

                },
                module:{
                    sms1: 'Create Ticket',
                    sms2: 'Please confirm that your wish to create this ticket, THIS ACTION CAN NOT BE REVERSE.',
                    btn1: 'Cancel',
                    btn2: 'Create Ticket',
                    sms3: 'Ticket, Created successfully',
                    sms4: 'Disagree',
                    sms5: 'Clear service request',
                    sms6: 'Inform the client that his service request has been cleared to proceed',
                    btn3: 'Cancel',
                    btn4: 'Clear',
                    sms7: 'Service request cleared successfully',
                    sms8: 'Disagreed',
                    sms9: 'Error in the process'

                }
            },
            products:{
                tabs:{
                    tab1: 'Add',
                    tab2: 'Manage'
                },
                card1:{
                    headline:'New Product',
                    title: 'Price'
                },
                dialog:{
                    card1:{
                        headline:'Bank Accounts ',
                        title:'Edit bank account',
                    },
                },
                datatable:{
                    placeholder: 'Search',
                    f1: 'Bank',
                    f2: 'Account',
                    f3: 'Creation date',
                    f4: 'Status',
                    f5: 'Edit',
                    f6: 'Delete'
                },
                form1:{
                    f1:'Product name',
                    f1error:{
                        e1: 'Fill this field with your product name'
                    },
                    f2:'Product description',
                    f2error:{
                        e1: 'Fill this field with your product description'
                    },
                    f3:'Measure unit',
                    f3error:{
                        e1: 'The unit measure is required'
                    },
                    f4:'Measure unit description',
                    f4error:{
                        e1: 'The measure unit description is required'
                    },
                    f5:'Product status',
                    f5label: 'Enable',
                    f6:'Price type',
                    f6error:{
                        e1: 'Choose a price type'
                    },
                    f7:'Location',
                    f7error:{
                        e1: 'Choose a location'
                    },
                    f8:'Aviation type',
                    f8error:{
                        e1: 'Choose a aviation type'
                    },
                    f9:'Price name',
                    f9error:{
                        e1: 'The price name is required'
                    },
                    f10:'Prepaid status',
                    f10label:'Enabled',
                    f11:'Valid thru',
                    f11error:{
                        e1: 'The valid thru date is required'
                    },
                    f12:'Pound range: from',
                    f12error:{
                        e1: 'Fill the starting pound range'
                    },
                    f13:'Pound range: to',
                    f13error:{
                        e1: 'Fill the ending pound range'
                    },
                    f14:'Date range: from',
                    f14error:{
                        e1: 'Fill the starting date range'
                    },
                    f15:'Date range: to',
                    f15error:{
                        e1: 'Fill the ending date range'
                    },
                    f16:'Currency',
                    f16error:{
                        e1: 'Choose a currency'
                    },
                    f17:'Measure',
                    f17error:{
                        e1: 'The measure is required'
                    },
                    f18:'Unit',
                    f18error:{
                        e1: 'The unit is required'
                    },
                    f19:'Unit description',
                    f19error:{
                        e1: 'The unit description is required'
                    },
                    f20:'Price',
                    f20error:{
                        e1: 'The price is required'
                    },
                    f21:'Cost',
                    f21error:{
                        e1: 'The cost is required'
                    },
                    f22:'Differencial',
                    f22error:{
                        e1: 'The differencial is required'
                    },
                    f23:'Is this a fee?',
                    f23label:'Enable',
                    button1: 'Clear',
                    button2: 'Create',
                    //button3: 'Update',

                },
                module:{
                    sms1: 'Your product has been created successfully'
                }
            },
            menu: {
                usermenu: {
                    opt1: 'Sing Up',
                    opt2: 'Log In',
                    tooltip: 'User'
                },
                useradmin: {
                    opt1: 'Manage Users',
                    tooltip: 'Manage Users'
                },
                jdcard: {
                    opt1: 'Buy',
                    opt2: 'Refill',
                    tooltip: 'Manage'
                },
                giftcard: {
                    opt1: 'Buy Gift Card',
                    opt2: 'Redeem Gift Card',
                    tooltip: 'Gift Cards'
                },
                payments: {
                    opt1: 'Add Payment Method',
                    opt2: 'Notify Deposit / Transfer',
                    tooltip: 'Wallet'
                },
                bankmanage: {
                    opt1: 'Bank Account Manage',
                    opt2: 'Check Payment',
                    tooltip: 'Manage Payments'
                },
                defgen: {
                    opt1: 'Products',
                    tooltip: 'Settings'
                },
                aircraft: {
                    opt1: 'Aircrafts',
                    tooltip: 'My Aircrafts'
                },
                captain: {
                    opt1: 'Pilots',
                    tooltip: 'My Pilots'
                },
                cardvalidate: {
                    opt1: 'Validator',
                    tooltip: 'Validate Card'
                },
                balance: {
                    opt1: 'Balance Details',
                    tooltip: 'Balance Details'
                },
                servrequest: {
                    opt1: 'Pending Service Requests',
                    opt2: 'Admin Pending Requests',
                    tooltip: 'Orders'
                },
                cart:{
                    opt1: 'Shopcart',
                    tooltip: 'Shopcart'
                },
                mainmenu: {
                    opt1: 'Home',
                    opt2: 'Contact',
                    opt2link: 'http://jdoilfield.com/en/?page_id=72'
                },
                module: {
                    sms1: 'Create a Coordinate Card',
                    sms2: 'Do you need a coordinate card?',
                    btn1: 'Cancel',
                    btn2: 'Create',
                    sms3: 'Card created successfully.. Check your email for your activation instructions',
                    sms4: 'The operation has been canceled',
                    sms5: 'Insufficient amount',
                    sms6: 'Choose another payment method or refill your',
                    sms7: 'Service Request',
                    sms8: 'Your service request has been successfully created, our costumer service will conctact you as soon as your order is cleared ',
                    sms9: 'Erase shopcart item',
                    sms10: 'Please confirm that you wish to erase this item ',
                    btn3: 'Cancel',
                    btn4: 'Delete',
                    sms11: 'The item has been deleted ',
                    sms12: 'The operation has been canceled',
                    sms13: 'Erase shopcart',
                    sms14: 'Please confirm that you wish to erase this shopcart ',
                    btn15: 'Cancel',
                    btn16: 'Delete',
                    sms17: 'The shopcart has been deleted ',
                    sms18: 'The operation has been canceled',
                }
            }
        });
        $translateProvider.translations('es', {
            BUTTON_LANG_EN: 'Inglés',
            BUTTON_LANG_ES: 'Español',
            index:{
                card1:{
                    title1:'Bienvenidos ',
                    title2:' a nuestra ',
                    subtitle:'Conoce más',
                    txt1:'Si usted posee una',
                    txt2: ' acceda a su cuenta',
                    button: 'acceder',
                    txt3:'Si no tienes cuenta',
                    link: 'regístrate',

                },
                card2:{
                    title:'Inicia sesión',
                    text:'Inicia sesión en tu cuenta',
                    button: 'Inicia sesión'

                }
            },
            login:{
                card1:{
                    headline: 'Acceda a su cuenta',
                    title:'Inicia sesión en tu cuenta ',
                    subtitle:'¿Aún no tienes una cuenta?',
                    link: 'Regístrese ahora',
                },
                form1:{
                    f1:'Email',
                    f1error:{
                        e1: 'Este campo debe ser completado',
                        e2: 'No introdujo un email válido'
                    },
                    f2:'Contraseña',
                    f2error:{
                        e1: 'Este campo debe ser completado'
                    },
                    button: 'Inicia sesión'

                },
                module:{
                    sms1: ' Verifique su datos'
                }
            },
            singup:{
                card1:{
                    title:'Registro',
                    subtitle:'Registre una cuenta nueva',
                },
                form1:{
                    f1:'Nombre',
                    f1error:{
                        e1: 'No olvide colocar su nombre',
                    },
                    f2:'Apellido',
                    f2error:{
                        e1: 'No olvide colocar su apellido'
                    },
                    f3:'Email',
                    f3error:{
                        e1: 'Debe llenar este campo',
                        e2: 'No introdujo un email válido'
                    },
                    f4:'Contraseña',
                    f4error:{
                        e1: 'La contraseña no puede estar vacía',
                        e2: 'La contraseña debe ser superior a 8 caracteres',
                        e3: 'La contraseña debe contener al menos un caracter en mayúscula',
                        e4: 'La contraseña debe contener al menos un caracter en minúscula',
                        e5: 'La contraseña debe contener al menos un caracter numérico',
                        e6: 'La contraseña debe contener al menos un caracter especial, por ejemplo: ',
                    },
                    f5:'Confirmar contraseña',
                    f5error:{
                        e1: 'La contraseña no puede estar vacía',
                        e2: 'Las contaseñas no coinciden'
                    },
                    button1: 'Limpiar',
                    button2: 'Registro'

                },
                module:{
                    sms1: 'Este email ya se encuentra registrado',
                    sms2: 'Su cuenta ha sido creada',
                    sms3: "Bienvenido {{firstname}} {{lastname}},\r\nRevise su correo ({{email}}) para activar su cuenta."
                }
            },
            dashboard:{
                card1:{
                    title: 'Utilidades',
                    subtitle: 'aproveche al máximo los beneficios de formar parte de nosotros'
                },
                card2:{
                    title:'Agregar método de pago',
                    text1:'Agregue tarjetas de crédito para adquirir',
                    text2:' y podrá comprar nuestros productos y servicios',
                    button: 'Agregar método de pago'

                },
                card3:{
                    title:'Comprar',
                    text1:'Con su ',
                    text2:', podrá disfrutar del suministro de combustible y otros servicios.',
                    button: 'Comprar'

                },
                card4:{
                    title:'Balance de',
                    text1:'Disponible',
                    text2:'Bloqueado',
                    button: 'Detalles del balance'

                },
                card5:{
                    title:'Recargar',
                    text1:'Recargue su ',
                    text2:', y siga disfrutando de nuestros servicios',
                    button: 'Recargue'

                }
            },paymethod:{
                tabs:{
                    tab1: 'Agregar',
                    tab2: 'Gestionar'
                },
                card1:{
                    headline:'Agregar método de pago ',
                    title:'Método de pago',
                },
                coord:{
                    title: 'Validar Coordenadas',
                    button1: 'Cerrar',
                    button2: 'Validar',
                },
                datatable:{
                    placeholder: 'Buscar',
                    f1: 'Método',
                    f2: 'Tipo',
                    f3: 'Propietario',
                    f4: 'Número',
                    f5: 'Editar',
                    f6: 'Borrar'
                },
                form1:{
                    f1:'Método de pago',
                    f1error:{
                        e1: 'Escoja un método de pago',
                    },
                    f2:'Número de tarjeta de crédito',
                    f2error:{
                        e1: 'Introduzca su número de tarjeta de crédito',
                        e2: 'Su número de tarjeta de crédito es inválido'
                    },
                    f3:'Nombre del tarjetahabiente',
                    f3error:{
                        e1: 'Este campo no puede estar vacío',
                        e2: 'Solo letras y espacios están permitidos, ejemplo: "MATILDE R PEREZ R"'
                    },
                    f4:'válido hasta',
                    f4error:{
                        e1: 'Introduzca la fecha de vencimiento',
                        e2: 'La fecha debe estar en el siguiente formato MM/YYYY'
                    },
                    button1: 'limpiar',
                    button2: 'Guardar',
                    button3: 'Actualizar'

                },
                module:{
                    sms1: 'Crear tarjeta de coordenadas',
                    sms2: 'Para agregar un método de pago debes tener una tarjeta de coordenada.',
                    sms3: 'Su tarjeta fue creada satisfactoriamente... Revise su correo para las instrucciones de activación',
                    sms4: 'Usted ya ha creado una tarjeta de coordenadas, por favor revise su correo para activarla, o genere una nueva desde el menú de usuarios',
                    sms5: 'Error, revise su conexión a internet',
                    sms6: 'Método de pago creado',
                    sms7: 'Su tarjeta fue creada satisfactoriamente,\r\n a sus métodos de pago',
                    sms8: 'Datos inválidos',
                    sms9: 'Usted no ha activado su tarjeta aún',
                    sms10: 'Actualización satisfactoria',
                    sms11: 'Método de pago borrado',
                    sms12: 'Por favor confirme que desea borrar este método de pago',
                    sms13: 'Cancelar',
                    sms14: 'Borrar',
                    sms15: 'Método de pago borrado satisfactoriamente',
                    sms16: 'Cancelado'
                }
            },
            notifypay:{
                card1:{
                    headline:'Notificar pago',
                },
                form1:{
                    f1:'Método de pago',
                    f1error:{
                        e1: 'Escoja un método de pago',
                    },
                    f2:'Escoja un banco',
                    f2error:{
                        e1: 'Escoja un banco',
                    },
                    f3:'Número de referencia',
                    f3error:{
                        e1: 'El número de depósito o transferencia es requerido',
                    },
                    f4:'Monto',
                    f4error:{
                        e1: 'Debe ingresar un monto',
                        e2: 'El monto debe ser mayor a 0 (CERO)'
                    },
                    f5:'Fecha',
                    f5error:{
                        e1: 'La fecha de la transacción es requerida',
                    },
                    button1: 'Limpiar',
                    button2: 'Guardar'

                },
                module: {
                    sms1: 'Notificación enviada',
                    sms2: 'Su pago ha sido notificado exitosamente, \r\n nuestro equipo de atención al cliente le informará \r\n una vez sea procesado ...'
                }
            },
            jdcard:{
                add:{
                    card1:{
                        headline:'Comprar ',
                        title:'Escoja un método de pago',
                    },
                    card2:{
                        title:'Personalice su '
                    },
                    form1:{
                        f1:'Método de pago',
                        f1error:{
                            e1: 'Escoja un método de pago',
                        },
                        f2:'TDC código CVC',
                        f2error:{
                            e1: 'Por favor introduzca su CVC',
                            e2: 'Por favor introduzca los 3 dígitos al reverso de su TDC ',
                            e3: 'Por favor introduzca los 4 dígitos al reverso de su TDC '
                        },
                        f3:'Identifique su',
                        f3error:{
                            e1: 'Este campo no puede estar vacío',
                            e2: 'Solo letras y espacios están permitidos, ejemplo: "MATILDE R PEREZ R"',
                        },
                        f4:'Monto',
                        f4error:{
                            e1: 'Introduzca un monto',
                            e2: 'El monto debe ser mayor 0 (CERO)',
                        },
                        button: 'Adquirir'

                    },
                    module:{
                        sms1: 'Transacción cancelada, revise su conexión a internet ',
                        sms2: 'Transacción cancelada, revise su método de pago',
                        sms3: 'creada',
                        sms4: 'Ya puedes usar tu',
                    }
                },
                refill:{
                    card1:{
                        headline:'Comprar ',
                        title:'Escoja un método de pago',
                    },
                    card2:{
                        title:'Escoja una '
                    },
                    form1:{
                        f1:'Método de pago',
                        f1error:{
                            e1: 'Escoja un método de pago',
                        },
                        f2:'TDC código CVC',
                        f2error:{
                            e1: 'Por favor introduzca su CVC',
                            e2: 'Por favor introduzca los 3 digitos al reverso de su TDC ',
                            e3: 'Por favor introduzca los 4 digitos al reverso de su TDC '
                        },
                        f3:'Escoja una',
                        f3error:{
                            e1: 'Escoja una ',
                        },
                        f4:'Monto',
                        f4error:{
                            e1: 'Introduzca un monto',
                            e2: 'El monto debe ser mayor 0 (CERO)',
                        },
                        button1: 'Limpiar',
                        button2: 'Recargar'

                    },
                    module:{
                        sms1: 'Transacción cancelada, revise su conexión a internet ',
                        sms2: 'Recargada',
                        sms3: 'Recarga satisfactoria, \r\n ${{amount}} han sido cargados a su',
                    }
                }
            },
            giftcard:{
                add:{
                    card1:{
                        headline:'Comprar tarjeta de regalo',
                        title:'Escoja una TDC',
                    },
                    card2:{
                        title:'Escoja su '
                    },
                    card3:{
                        title:'Personalice su tarjeta de regalo'
                    },
                    radio:{
                        headline:'Escoja uno de estos métodos de pago',
                        option1:{
                            title:'Tarjeta de crédito',
                            subtitle: 'Escoja esta opción para pagar con una tarjeta de crédito.'
                        },
                        option2:{
                            title:'',
                            subtitle: 'Escoja esta opción para pagar con una '
                        },
                    },
                    form1:{
                        f1:'Método de pago',
                        f1error:{
                            e1: 'Escoja un método de pago',
                        },
                        f2:'TDC código CVC',
                        f2error:{
                            e1: 'Por favor introduzca su CVC',
                            e2: 'Por favor introduzca los 3 digitos al reverso de su TDC ',
                            e3: 'Por favor introduzca los 4 digitos al reverso de su TDC '
                        },
                        f3:'Monto',
                        f3error:{
                            e1: 'Introduzca un monto',
                            e2: 'El monto debe ser mayor 0 (CERO)',
                        },
                        f4:'Escoja una ',
                        f4error:{
                            e1: 'Escoja una ',
                        },
                        f5:'Monto',
                        f5error:{
                            e1: 'Introduzca un monto',
                            e2: 'El monto debe ser mayor 0 (CERO)',
                        },
                        f6:'Email del receptor',
                        f6error:{
                            e1: 'Este campo debe ser llenado',
                        },
                        f7:'Nombre del receptor',
                        f7error:{
                            e1: 'Este campo debe ser llenado',
                        },
                        f8:'Mensaje',
                        f8error:{
                            e1: 'Este campo debe ser llenado',
                        },
                        button1: 'Limpiar',
                        button2: 'Comprar'

                    },
                    module:{
                        sms1: 'Transacción cancelada, revise su conexión a internet ',
                        sms2: 'Transacción cancelada, no tiene suficiente dinero',
                        sms3: 'Tarjeta de regalo enviada',
                        sms4: 'Su beneficiario recibirá instrucciones en su email, \r\n para reclamar esta tarjeta de regalo',
                    }
                },
                redeem:{
                    card1:{
                        headline:'Reclamar una tarjeta de regalo ',
                        title:'Escoja una ',
                    },
                    card2:{
                        title:'Código de reclamo'
                    },
                    form1:{
                        f1:'Escoja una ',
                        f1error:{
                            e1: 'Escoja una ',
                        },
                        f2:'Código de reclamo',
                        f2error:{
                            e1: 'Este campo no puede estar vacío'
                        },
                        button1: 'Limpiar',
                        button2: 'Reclamar'

                    },
                    module:{
                        sms1: 'Transacción cancelada, revise su conexión a internet ',
                        sms2: 'Tarjeta de regalo reclamada',
                        sms3: 'La tarjeta de regalo ha sido reclamada satisfactoriamente',
                    }
                }
            },
            defered:{
                tabs:{
                    tab1: 'Peticiónes de servicio pendientes',
                    tab2: 'Peticiónes de servicio cerradas'
                },
                card1:{
                    headline:'Peticiónes de servicio pendientes',
                    //title:'Pending payments',
                },
                card2:{
                    title:'Peticiónes de servicio cerradas',
                },
                datatable1:{
                    placeholder: 'Buscar',
                    title: 'Pagos pendientes',
                    f1: 'Cliente',
                    f2: 'Localidad',
                    f3: 'Fecha de creación',
                    f4: 'Fecha de aterrizaje',
                    f5: 'Serial',
                    f6: 'Reversar',
                },
                datatable2:{
                    placeholder: 'Buscar',
                    title: 'Peticiónes de servicio cerradas',
                    f1: 'Cliente',
                    f2: 'Localidad',
                    f3: 'Fecha de creación',
                    f4: 'Fecha de aterrizaje',
                    f5: 'Serial',
                },
                dialog:{
                    title: 'Peticiónes de servicio',
                    form1:{
                        f1: 'Cliente',
                        f2: 'Localidad',
                        f3: 'Fecha de aterrizaje',
                        button1: 'Cerrar',
                        button2: 'Reversar'
                    },
                    datatable1:{
                        title: 'Servicios',
                        f1: 'Info',
                        f2: 'Und',
                        f3: 'Precio',
                        f4: 'Monto',
                    }
                },
                module:{
                    sms1: 'Reversar petición de servicio',
                    sms2: 'Por favor confirme que desea reversar esta petición de servicio.',
                    btn1: 'Cancelar',
                    btn2: 'Reversar',
                    sms3: 'Petición de servicio, reversada satisfactoriamente',
                }
            },
            checkpayment:{
                card1:{
                    headline:'Pagos recibidos',
                    //title:'Pending payments',
                },
                datatable1:{
                    placeholder: 'Buscar',
                    title: 'Pagos recibidos',
                    f1: 'Banco',
                    f2: 'Referencia',
                    f3: 'Fecha de creación',
                    f4: 'Estatus',
                    f5: 'Editar',
                },
                dialog:{
                    title: 'Depósito / Transferencia',
                    form1:{
                        f1:'Banco',
                        f2:'Referencia',
                        f3:'Monto',
                        f4:'Fecha de creación',
                        f5:'Monto validado',
                        f6:'Aprovado',
                        button1: 'Cerrar',
                        button2: 'Actualizar'
                    }
                },
                module:{
                    sms1: 'Actualización satisfactoria '
                }
            },
            checkout:{
                card1:{
                    headline:'Artículos',
                    //title:'Pending payments',
                    sms1: 'Escoja una',
                },
                form1:{
                    f1:'Escoja una',
                    f1error:{
                        e1: 'Escoja un metodo de pago'
                    },
                    f2:'Acepte los terminos y condiciones'
                },
                button1: 'Cerrar',
                button2: 'Pagar',
            },
            cart:{
                card1:{
                    headline:'Peticiónes de servicios',
                    //title:'Pending payments',
                    sms1: 'Escoja una localidad',
                    sms2: 'Tu destino será',
                    sms3: 'Detalles del viaje'
                },
                form1:{
                    f1:'Locaciones',
                    f1error:{
                        e1: 'Escoja una localidad'
                    },
                    f2:'Llegada aproximada',
                    f2error:{
                        e1: 'No olvide informar sobre su fecha de llegada'
                    },
                    f3:'Hora',
                    f3error:{
                        e1: 'No olvide informar sobre su hora de llegada',
                        e2: 'Hora invalida'
                    },
                    f4:'Partida aproximada',
                    f4error:{
                        e1: 'No olvide informar sobre su fecha de partida'
                    },
                    f5:'Hora',
                    f5error:{
                        e1: 'No olvide informar sobre su hora de partida',
                        e2: 'Hora invalida'
                    },
                    f6:'Mi aeronave',
                    f6error:{
                        e1: 'Escoja su aeronave'
                    },
                    f7:'Mi piloto',
                    f7error:{
                        e1: 'Escoja su piloto'
                    },
                    f8:'Nombre de viaje',
                    f8error:{
                        e1: 'Este campo debe ser llenado'
                    },
                    f9:'Locación de origen',
                    f9error:{
                        e1: 'Escoja una localidad'
                    },

                    button1: 'Limpiar',
                    button2: 'Buscar',
                    button3: 'Limpiar',
                    button4: 'Guardar'
                },
                datatable1:{
                    f1: 'Marcar',
                    f2: 'Info',
                    f3: 'Unidad',
                    f4: 'Precio',
                    f5: 'Cantidad',
                    title: 'Servicios'
                },
                module:{
                    sms1: 'La fecha de partida debe ser igual o superior a la fecha de llegada, por favor seleccione otra fecha de llegada',
                    sms2: 'Seleccione los servicio que desea adquirir',
                    sms3: 'Salvado en su carro de compra, ahora puede generar esta petición de servicio desde su carro de compra.',
                    sms4: 'Notificación',
                    sms5: 'Necesitas registrar al menos una aeronave y un capitán para completar el proceso de agregar un articulo al carro de compra, por favor complete esos requerimientos antes de continuar!'
                }
            },
            cardcheck:{
                card1:{
                    headline: 'Validar',
                    title: 'Escoja entre'
                },
                form1:{
                    R1title: 'Estatus',
                    R1subtitle1: 'Escoja esta opción para obtener  un ',
                    R1subtitle2: 'estatus',
                    R2title: 'Balance',
                    R2subtitle1: 'Escoja esta opción para obtener  un ',
                    R2subtitle2: 'balance',
                    f1: 'código',
                    f1error:{
                        e1:'Introduzca el código de la',
                        e2: ''//empty for spanish
                    },
                    button1: 'Limpiar',
                    button2: 'Validar'
                },
                dialog:{
                    title1: 'Tarjeta con saldo negativo por favor contactar ',
                    title2: 'Tarjeta con saldo positivo',
                    datatable1:{
                        title: 'Estatus',
                        f1: 'Código de tarjeta ',
                        f2: 'Estatus',
                        f3: 'Tarjetahabiente',
                        f4: 'Placa de aeronave',
                    },
                    datatable2:{
                        f1: 'Grupo',
                        f2: 'Moneda',
                        f3: 'Balance',
                        f4: 'Condición de crédito',
                        f5: 'Días',
                        f6: 'Acumulado',
                        f7: 'Qttinv',
                    },
                    button1: 'Cerrar',
                }
            },
            captain:{
                tabs:{
                    tab1: 'Agregar',
                    tab2: 'Gestionar'
                },
                card1:{
                    headline:'Agregar piloto ',
                    title:'Registrar piloto',
                },
                card2:{
                    headline:'Piloto ',
                    title:'Actualizar piloto',
                },
                datatable:{
                    placeholder: 'Búsqueda',
                    f1: 'Nombre',
                    f2: 'Email',
                    f3: 'Licencia',
                    f4: 'Teléfono',
                    f5: 'Editar',
                    f6: 'Borrar'
                },
                form1:{
                    f1:'Nombre',
                    f1error:{
                        e1: 'No olvide ingresar el nombre del piloto'
                    },
                    f2:'Licencia',
                    f2error:{
                        e1: 'No olvide ingresar lalicencia del piloto'
                    },
                    f3:'Fecha de nac.',
                    f3error:{
                        e1: 'No olvide ingresar la fecha de nac. del piloto'
                    },
                    f4:'Dirección',
                    f4error:{
                        e1: 'No olvide ingresar la dirección del piloto'
                    },
                    f5:'Pais',
                    f5error:{
                        e1: 'No olvide ingresar el pais del piloto'
                    },
                    f6:'Ciudad',
                    f6error:{
                        e1: 'No olvide ingresar la ciudad del piloto'
                    },
                    f7:'Tlf',
                    f7error:{
                        e1: 'No olvide ingresar el teléfono del piloto'
                    },
                    f8:'Email',
                    f8error:{
                        e1: 'No olvide ingresar el email del piloto',
                        e2: 'El correo es inválido'
                    },
                    f9:'Habilitar piloto',
                    f9label1: 'Activar',
                    f9label2: 'Desactivar',
                    button1: 'Limpiar',
                    button2: 'Guardar',
                    button3: 'Actualizar',

                },
                module:{
                    sms1: 'Piloto, creado satisfactoriamente',
                    sms2: 'Actualización satisfactoria',
                    sms3: 'Borrar piloto',
                    sms4: 'Por favor confirme que desea borrar este piloto.',
                    sms5: 'Piloto borrado satisfactoriamente',
                    sms6: 'Rechazada'
                }
            },
            bankmanage:{
                tabs:{
                    tab1: 'Agregar',
                    tab2: 'Gestionar'
                },
                card1:{
                    headline:'Agregar cuenta bancaria',
                },
                dialog:{
                    card1:{
                        headline:'Cuentas bancarias ',
                        title:'Editar cuenta bancaria',
                    },
                },
                datatable:{
                    placeholder: 'Buscar',
                    f1: 'Banco',
                    f2: 'Cuenta',
                    f3: 'Fecha de creación',
                    f4: 'Estatus',
                    f5: 'Editar',
                    f6: 'Borrar'
                },
                form1:{
                    f1:'Nombre de cuenta bancaria',
                    f1error:{
                        e1: 'Nombre de cuenta bancaria es requerido'
                    },
                    f2:'Número de cuenta bancaria',
                    f2error:{
                        e1: 'Número de cuenta bancaria es requerido',
                        e2: 'Solo se permiten números'
                    },
                    f3:'Fecha de creación',
                    f3error:{
                        e1: 'Este campo de ser llenado'
                    },
                    f4:'Nota',
                    f4error:{
                        e1: ''
                    },
                    f5:'Habilitado',
                    f5error:{
                        e1: 'Este campo es requerido'
                    },
                    button1: 'Limpiar',
                    button2: 'Guardar',
                    button3: 'Actualizar',

                },
                module:{
                    sms1: 'Cuenta bancaria creada satisfactoriamente',
                    sms2: "Cuenta bancaria creada satisfactoriamente,\r\na sus métodos de pago",
                    sms3: 'Actualización satisfactoria',
                    sms4: 'Borrar cuenta bancaria',
                    sms5: 'Por favor confirme para borrar esta cuenta bancaria',
                    btn1: 'Cancelar',
                    btn2: 'Borrar',
                    sms6: 'Cuenta bancaria eliminada satisfactoriamente',
                    sms7: 'Rechazado'
                }
            },
            balance:{
                tabs:{
                    tab1: 'balance',
                    tab2: 'detalles de balance'
                },
                card1:{
                    headline:'balance',
                    label1: 'Disponible',
                    label2: 'Bloqueado'
                },
                card2:{
                    headline:'balance ',
                    label1: 'Disponible',
                    label2: 'Bloqueado'
                },
                datatable:{
                    placeholder: 'Buscar',
                    title: 'Transacciones',
                    f1: 'Tipo',
                    f2: 'Monto',
                    f3: 'Fecha',
                },
                form1:{
                    f1:'Escoja una',
                    f1error:{
                        e1: 'Escoja una'
                    },
                    f2:'Desde',
                    f2error:{
                        e1: 'Escoja una fecha',
                    },
                    f3:'Hasta',
                    f3error:{
                        e1: 'Escoja una fecha',
                    },
                    button1: 'Limpiar',
                    button2: 'Buscar'

                }
            },
            aircraft:{
                tabs:{
                    tab1: 'Agregar',
                    tab2: 'Gestionar'
                },
                card1:{
                    headline:'Agregue aeronave',
                    title: 'Nueva aeronave',
                },
                dialog:{
                    headline:'Aeronave ',
                    card2:{
                        title: 'Actualizar aeronave',
                    },
                },
                datatable:{
                    placeholder: 'Buscar',
                    title: 'Transacciones',
                    f1: 'Nombre',
                    f2: 'Modelo',
                    f3: 'MTOW',
                    f4: 'Estatus',
                    f5: 'Editar',
                    f6: 'Borrar',
                },
                form1:{
                    f1:'Aeronaves',
                    f1error:{
                        e1: 'Escoja una aeronave'
                    },
                    f2:'Número de cola',
                    f2error:{
                        e1: 'El número de cola es requerido',
                        e2: 'Espacios en blanco y simbolos no estan permitidos en este campo'
                    },
                    f3:'Tipo de aviación',
                    f3error:{
                        e1: 'Escoja un tipo de aviación',
                    },
                    f4:'Nombre',
                    f4error:{
                        e1: 'Escoja un nombre para su aeronave',
                    },
                    f5: 'Habilitar aeronave',
                    f5label:{
                        l1:'Activa',
                        l2:'Inactiva',
                        l3: 'Habilitar'
                    },
                    button1: 'Limpiar',
                    button2: 'Guardar',
                    button3: 'Actualizar'

                },
                module:{
                    sms1: 'Actualización satisfactoria',
                    sms2: 'Error en la operación, la actualización no fue completada ',
                    sms3: 'Aeronave creada satisfactoriamente',
                    sms4: 'Borrar aeronave',
                    sms5: 'Por favor confirme que desea borrar esta aeronave.',
                    btn1: 'Cancelar',
                    btn2: 'Borrar',
                    sms6: 'Error en la operación, la eliminación no se completó ',
                    sms7: 'Aeronave, borrada satisfactoriamente',
                    sms8: 'Rechazado'
                }
            },
            adminPending:{
                tabs:{
                    tab1: 'Ordenes Abiertas',
                    tab2: 'Ordenes cerradas'
                },
                card1:{
                    headline:'Adminstración de peticiones de servicios',
                },
                card2:{
                    headline:'Ordenes cerradas',
                },
                dialog:{
                    headline:'Peticiones de servicios',
                    label1: 'Cliente',
                    label2: 'Localidad',
                    label3: 'Fecha de aterrizaje',
                    datatable1:{
                        title: 'Servicios',
                        f1: 'Seleccionar',
                        f2: 'Info',
                        f3: 'Unidad',
                        f4: 'Precio',
                        f5: 'Monto',
                    }
                },

                datatable1:{
                    placeholder: 'Buscar',
                    title: 'Peticiones de servicios pendientes',
                    f1: 'Cliente',
                    f2: 'Localidad',
                    f3: 'Fecha de creación',
                    f4: 'Fecha de aterrizaje',
                    f5: 'Serial',
                    f6: 'Validar',
                    f7: 'Preparar',
                    f8: 'Reversar'
                },
                datatable2:{
                    placeholder: 'Buscar',
                    title: 'Ordenes cerradas',
                    f1: 'Cliente',
                    f2: 'Localidad',
                    f3: 'Fecha de creación',
                    f4: 'Fecha de aterrizaje',
                    f5: 'Serial',
                },
                form1:{
                    f1:'Ticket',
                    f1error:{
                        e1: 'El número de ticket es requerido'
                    },
                    f2:'Monto',
                    button1: 'Cerrar',
                    button2: 'Generar Ticket',

                },
                module:{
                    sms1: 'Crear Ticket',
                    sms2: 'Por favor confirme que desea crear este ticket, ESTA OPERACIÓN NO PUEDE SER REVERSADA.',
                    btn1: 'Cancelar',
                    btn2: 'Crear Ticket',
                    sms3: 'Ticket creado satisfactoriamente',
                    sms4: 'Rechazado',
                    sms5: 'Validar petición de servicio',
                    sms6: 'Informar al cliente que su orden ha sido validada y sera atendido en la localidad acordada',
                    btn3: 'Cancelar',
                    btn4: 'Validar',
                    sms7: 'Petición de servicio validada satisfactoriamente',
                    sms8: 'Acción cancelada',
                    sms9: 'Error en la operación'


                }
            },
            products:{
                tabs:{
                    tab1: 'Nuevo Producto',
                    tab2: 'Manage'
                },
                card1:{
                    headline:'Nuevo Producto',
                    title: 'Precio'
                },
                card2:{
                    title:'Precio',
                },
                dialog:{
                    card1:{
                        headline:'Bank Accounts ',
                        title:'Edit bank account',
                    },
                },
                form1:{
                    f1:'Nombre del producto',
                    f1error:{
                        e1: 'Introduce el Nombre del Producto'
                    },
                    f2:'Descripción del Producto',
                    f2error:{
                        e1: 'Introduce la Descripción del Producto'
                    },
                    f3:'Medida de unidad',
                    f3error:{
                        e1: 'Introduce la Medida de unidad'
                    },
                    f4:'Descripción de medida de unidad',
                    f4error:{
                        e1: 'Introduce la Descripción de medida de unidad'
                    },
                    f5:'Producto habilitado',
                    f5label: 'Habilitado',
                    f6:'Tipo de precio',
                    f6error:{
                        e1: 'Escoge el tipo de Precio'
                    },
                    f7:'Localidades',
                    f7error:{
                        e1: 'Escoja una localidad'
                    },
                    f8:'Tipo de aviación',
                    f8error:{
                        e1: 'Escoja el tpo de aviación'
                    },
                    f9:'Nombre del precio',
                    f9error:{
                        e1: 'Introduce el nombre del precio'
                    },
                    f10:'Prepago',
                    f10label:'Enabled',
                    f11:'Valido hasta',
                    f11error:{
                        e1: 'Es necesario que llene este campo'
                    },
                    f12:'Libras desde',
                    f12error:{
                        e1: 'Introduce el rango de libras'
                    },
                    f13:'Libras hasta',
                    f13error:{
                        e1: 'Introduce el rango de libras'
                    },
                    f14:'Fecha desde',
                    f14error:{
                        e1: 'Introduce el rango de fechas'
                    },
                    f15:'Fechas hasta',
                    f15error:{
                        e1: 'Introduce el rango de fechas'
                    },
                    f16:'Moneda',
                    f16error:{
                        e1: 'Escoja una moneda'
                    },
                    f17:'Medida',
                    f17error:{
                        e1: 'Introduzca la medida'
                    },
                    f18:'Unidad',
                    f18error:{
                        e1: 'Introduzca la unidad'
                    },
                    f19:'Descripción de la unidad',
                    f19error:{
                        e1: 'Introduce la descripcion de la unidad'
                    },
                    f20:'Precio',
                    f20error:{
                        e1: 'Introduzca el precio'
                    },
                    f21:'Costo',
                    f21error:{
                        e1: 'Introduce el costo'
                    },
                    f22:'Diferencial',
                    f22error:{
                        e1: 'Introduzca el diferencial'
                    },
                    f23:'¿Es esto un impuesto?',
                    f23label:'Habilitado',
                    button1: 'Limpiar',
                    button2: 'Crear',
                    //button3: 'Update',

                },
                module:{
                    sms1: 'Su producto fue creado satisfactoriamente!!!',
                }
            },
            menu: {
                usermenu: {
                    opt1: 'Registro',
                    opt2: 'Logueo',
                    tooltip: 'Usuario'
                },
                useradmin: {
                    opt1: 'Gestionar Usuarios',
                    tooltip: 'Gestionar Usuarios'
                },
                jdcard: {
                    opt1: 'Compra ',
                    opt2: 'Recarga ',
                    tooltip: 'Gestionar'
                },
                giftcard: {
                    opt1: 'Comprar tarjeta de regalo',
                    opt2: 'Reclamar tarjeta de regalo',
                    tooltip: 'Tarjeta de regalo'
                },
                payments: {
                    opt1: 'Agregar método de pago',
                    opt2: 'Notificar depósito / Transferencia',
                    tooltip: 'Cartera'
                },
                bankmanage: {
                    opt1: 'Gestionar cuenta bancaria',
                    opt2: 'Validar pago',
                    tooltip: 'Gestionar pagos'
                },
                defgen: {
                    opt1: 'Productos',
                    tooltip: 'Configuración'
                },
                aircraft: {
                    opt1: 'Mis aeronaves',
                    tooltip: 'Mis aeronaves'
                },
                captain: {
                    opt1: 'Mis pilotos',
                    tooltip: 'Mis pilotos'
                },
                cardvalidate: {
                    opt1: 'Validador',
                    tooltip: 'Validar tarjeta'
                },
                balance: {
                    opt1: 'Detalles de balance',
                    tooltip: 'Balance'
                },
                servrequest: {
                    opt1: 'Peticiones de servicio pendientes',
                    opt2: 'Administrar peticiones de servicio',
                    tooltip: 'Ordenes'
                },
                cart:{
                    opt1: 'Carro de compra',
                    tooltip: 'Carro de compra'
                },
                mainmenu: {
                    opt1: 'Home',
                    opt2: 'Contactos',
                    opt2link: 'http://jdoilfield.com/es/?page_id=72'
                },
                module: {
                    sms1: 'Crear tarjeta de coordenadas',
                    sms2: '¿Necesitas una nueva tarjeta de coordenadas?',
                    btn1: 'Cancelar',
                    btn2: 'Crear',
                    sms3: 'Tarjeta creada satisfactoriamente, verifique su correo para las instrucciones de activación',
                    sms4: 'Su operación ha sido cancelada',
                    sms5: 'Saldo insuficiente',
                    sms6: 'Escoja otro método de pago o recargue su ',
                    sms7: 'para cancelar su peticiones de servicio',
                    sms8: 'Su petición de servicio ha sido creado satisfactoriamente, atención al cliente lo contactara tan pronto su petición haya sdo validada.',
                    sms9: 'Eliminar elemento del carro de compra',
                    sms10: 'Por favor confirme que desea eliminar este elemento ',
                    btn3: 'Cancelar',
                    btn4: 'Borrar',
                    sms11: 'El elemento ha sido borrado ',
                    sms12: 'La operación ha sido cancelada',
                    sms13: 'Eliminar carro de compra',
                    sms14: 'Por favor confirme que desea eliminar este carro de compra ',
                    btn5: 'Cancelar',
                    btn6: 'Borrar',
                    sms17: 'El carro de compra ha sido eliminado ',
                    sms18: 'La operación ha sido cancelada',
                }
            }
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useCookieStorage();
        //$translateProvider.useLocalStorage();
        $translateProvider.useSanitizeValueStrategy('escape');
    }
]);
/**
 * Created by bboyvlad on 9/7/16.
 */
'use strict';

var dashboard = angular.module('dashboard', ['ngRoute', 'chart.js']);

dashboard.controller('DashController', ['$rootScope','$scope', '$http', '$location', 'myJdMenu', 'userResource', '$filter', 'helperFunc',
    function DashController($rootScope, $scope, $http, $location, myJdMenu, userResource, $filter, helperFunc) {
        $scope.cssClass = 'dashboard';

        /*$rootScope.mainPieChart = {labels:[], data:[], payavailable: 0, paylocked:0, paybalance: 0 };

        $scope.calculateBalance = function calculateBalance() {
            //console.log("payments: "+ $rootScope.userDetail.toString());
            var detailUser=userResource.detailUser();
            detailUser.$promise.then( function (data) {
                //console.log("data userDetails"+data);
                $rootScope.userDetail = data;
                $scope.items = $filter('orderBy')($rootScope.userDetail.payments, "payid");
                var payments = $scope.items;
                //console.log("data payments"+payments.toString());
                angular.forEach(payments, function (value, key) {
                    console.log(value.payavailable);
                    $rootScope.mainPieChart.payavailable +=value.payavailable;
                    $rootScope.mainPieChart.paylocked +=value.paylocked;
                    $rootScope.mainPieChart.paybalance +=value.paybalance;

                })
                $rootScope.mainPieChart.labels = ["Available Balance", "Balance Blocked"];
                $rootScope.mainPieChart.data = [$rootScope.mainPieChart.payavailable, $rootScope.mainPieChart.paylocked];
                /!*console.log("TOTAL" + $rootScope.mainPieChart.payavailable);
                console.log($rootScope.datePicker.toString());*!/
            });

        };*/
        helperFunc.jdCardBalance(null, true);
        //$rootScope.$emit('rootScope:emit', 'Emit!');

        /*"paybalance":0.0,"paylocked":0.0,"payavailable":0.0*/



    }]);
/**
 * d by bboyvlad on 9/8/16.
 */
'use strict';

var admindeferedpay = angular.module('AdminDeferedPay', ['ngRoute', 'ngMessages', 'angularPayments', 'ui.utils.masks']);

admindeferedpay.controller('AdminDeferedPayController', ['$rootScope','$scope', '$filter', '$http', '$location', 'LxDatePickerService', 'myJdMenu', 'helperFunc', 'LxNotificationService', 'LxDialogService', 'serviceRequestResource', '$translate',
    function DeferedPayController($rootScope, $scope, $filter, $http, $location, LxDatePickerService, myJdMenu, helperFunc, LxNotificationService, LxDialogService, serviceRequestResource, $translate) {
        $scope.cssClass = 'transitionView';
        var self = this;
        $scope.icon = '../css/icons/plane-flying.png';
        $scope.sendbutton = false;
        $scope.LinearProgress = false;
        $scope.search = { mysearch:'', mysearchClosed:'' };
        $scope.pending = {};

        $scope.getDeferedList = function getDeferedList() {
            var deferedList = serviceRequestResource.showServicesRequestsPending();
            deferedList.$promise.then(
                function (data) {
                    $scope.listPaymentsDefered = $filter('orderBy')(data, "servicerequest");
                }
            );
        };
        $scope.getDeferedList();

        $scope.getClosedList = function getClosedList() {
            var closedList = serviceRequestResource.showServicesRequestsClose();
            closedList.$promise.then(
                function (data) {
                    $scope.listPaymentsClosed = $filter('orderBy')(data, "servicerequest");
                }
            );
        };
        $scope.getClosedList();


        $scope.checkService = [];
        $scope.sync = function sync(bool, item, itemQuantity){
            //console.log(bool+"/item: "+item+"/itemQuantity: "+itemQuantity);
            if(bool){
                // add item
                $scope.checkService.push(item);
            } else {
                // remove item
                $scope.servicesTotal = 0;
                for(var i=0 ; i < $scope.checkService.length; i++) {
                    if($scope.checkService[i].itemid == item.itemid){
                        if(!itemQuantity){
                            $scope.checkService.splice(i,1);
                        }else{
                            $scope.checkService[i].quantity = itemQuantity;
                            $scope.checkService[i].subtotal = itemQuantity * item.price;
                        }
                    }
                    if(angular.isDefined($scope.checkService[i].subtotal)){
                        $scope.servicesTotal += $scope.checkService[i].subtotal;
                    }
                }
            }
        };
        /********** ClearServiceRequest ********/
        //clearServiceRequest
        $scope.clearServiceRequest = function clearServiceRequest( fields) {
            var self = this;

            $scope.LinearProgress = helperFunc.toogleStatus($scope.LinearProgress);
            $scope.sendbutton = helperFunc.toogleStatus($scope.sendbutton);
            $scope.sms5 = $filter('translate')('adminPending.module.sms5');
            $scope.sms6 = $filter('translate')('adminPending.module.sms6');
            $scope.btn3 = $filter('translate')('adminPending.module.btn3');
            $scope.btn4 = $filter('translate')('adminPending.module.btn4');
            LxNotificationService.confirm($scope.sms5, $scope.sms6,
                {
                    cancel: $scope.btn3,
                    ok: $scope.btn4
                }, function(answer)
                {
                    if (answer)
                    {
                        var toSave = {id: fields.servicerequest } ;

                        var ServicesRequestsCleared = serviceRequestResource.ServicesRequestsCleared({}, toSave);
                        ServicesRequestsCleared.$promise.then(
                            function (data) {
                                //console.log("Service Request Cleared: " + data.toString());
                                if(data.message == 'failure'){
                                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                    LxNotificationService.error($filter('translate')('adminPending.module.sms9'));
                                    return;
                                }
                                $scope.sms7 = $filter('translate')('adminPending.module.sms7');
                                LxNotificationService.success($scope.sms7);
                                $scope.getDeferedList();
                                $scope.getClosedList();
                                //$scope.faircrafts = [];
                                //$location.path("/dashboard");
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                            },
                            function (data) {
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                console.log("Error!!" + data.toString());
                            }
                        );
                    }
                    else
                    {
                        $scope.sms8 = $filter('translate')('adminPending.module.sms8');
                        LxNotificationService.error($scope.sms8);
                        self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                        self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    }
                });

        };
        /********** ClearServiceRequest ********/

              /********** prepareTicket ********/
        $scope.prepareTicket = function prepareTicket($event, fields) {
            $event.preventDefault();
            var self = this;

                $scope.LinearProgress = helperFunc.toogleStatus($scope.LinearProgress);
                $scope.sendbutton = helperFunc.toogleStatus($scope.sendbutton);
            $scope.sms1 = $filter('translate')('adminPending.module.sms1');
            $scope.sms2 = $filter('translate')('adminPending.module.sms2');
            LxNotificationService.confirm($scope.sms1, $scope.sms2,
                {
                    cancel: 'Cancel',
                    ok: 'Create Ticket'
                }, function(answer)
                {
                    if (answer)
                    {
                        LxDialogService.close(self.dialogDeferedpay);
                        var toSave = '{ "servicerequest":"'+fields.servicerequest+'", "ticket":"'+$scope.pending.ticketNumber+'", "items": '+ angular.toJson($scope.checkService) +'}';

                        var generateTicket = serviceRequestResource.generateTicket({}, toSave);
                        generateTicket.$promise.then(
                            function (data) {
                                console.log("Ticket created: " + data);
                                $scope.sms3 = $filter('translate')('adminPending.module.sms3');
                                LxNotificationService.success($scope.sms3);
                                $scope.getDeferedList();
                                $scope.getClosedList();
                                //$scope.faircrafts = [];
                                //$location.path("/dashboard");
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                            },
                            function (data) {
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                console.log("Error!!" + data.toString());
                            }
                        );
                    }
                    else
                    {
                        $scope.sms4 = $filter('translate')('adminPending.module.sms4');
                        LxNotificationService.error($scope.sms4);
                        self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                        self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    }
                });

        };
        /********** prepareTicket ********/

        /********** editPaymentsDefered ********/

        $scope.dialogprepareTicket = "dialogprepareTicket";
        $scope.feditdeferedpay = {};

        /***************** TO RESET EDIT FORMS ********************/

        $scope.editReset = function(id) {
            $scope.editMaster = {
                id: id, paymethod: "", bank: "", relatedref: "", inspaymethod: "", insbank: "", insacctnum: "", insname: "", amount: "", dcreate: "", approved: ""
            };
            $scope.feditdeferedpay = angular.copy($scope.editMaster);
        };
        /***************** TO RESET FORMS ********************/
        //$scope.reset();

        $scope.openDialogprepareTicket = function openDialogprepareTicket(ServReq)
        {
            console.log(ServReq.servicerequest );
            $scope.checkService = [];
            //$scope.prepareTicket(ServReq.servicerequest);
            serviceRequestResource.prepareTicket({servicerequest: ServReq.servicerequest}).$promise.
            then(
                function (data) {
                    console.log("Saved!!" + data.toString());
                    $scope.ticket = data;
                    angular.forEach($scope.ticket.items, function (value) {
                        if(value.checked==true){
                            $scope.sync(true, value)
                        }
                    })
                    LxDialogService.open($scope.dialogprepareTicket);
                },function (data) {
                    /*self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);*/
                    console.log("Error!!" + data);
                }
            );
            /***************** TO RECALL DATA ON EDIT FORMS ********************/
            /*$scope.editmaster = {
                id: ServReq.id, paymethod: ServReq.paymethod, bank: ServReq.bank, relatedref: ServReq.relatedref, inspaymethod: ServReq.inspaymethod, insbank: ServReq.insbank, insacctnum: ServReq.insacctnum, insname: ServReq.insname, amount: ServReq.amount, dcreate: ServReq.dcreate, approved : ServReq.approved
            };
            $scope.feditdeferedpay = angular.copy($scope.editmaster);
            /!***************** TO RECALL DATA ON EDIT FORMS ********************!/*/


        }

        $scope.$on('lx-dialog__open-start', function(_event, _dialogId)
        {
            //var self = this;
            if ($scope.dialogDeferedpay === _dialogId)
            {

            }
        });

        $scope.updatePaymentsDefered = function updatePaymentsDefered($event, fields) {
            $event.preventDefault();
            var self = this;

            console.log(fields.id+ ' / ' + fields);
            $scope.LinearProgress = helperFunc.toogleStatus($scope.LinearProgress);
            $scope.sendbutton = helperFunc.toogleStatus($scope.sendbutton);
            var toSave = {
                payment: fields.id , approved: fields.approved
            }


        }

        /********** editPaymentsDefered ********/

        /********** ReversePaymentsDefered ********/

        $scope.dialogDeferedpay = "dialogDeferedpay";
        $scope.feditdeferedpay = {};
        $scope.totalprice = 0;
        $scope.openDialogReverseTicket = function openDialogReverseTicket(ServReq)
        {
            console.log(ServReq.servicerequest );
            $scope.checkService = [];
            //$scope.prepareTicket(ServReq.servicerequest);
            serviceRequestResource.prepareTicket({servicerequest: ServReq.servicerequest}).$promise.
            then(
                function (data) {
                    console.log("Ticket:" + data.toString());
                    $scope.serviceTotalPrice = 0;
                    $scope.ticket = data;
                    angular.forEach($scope.ticket.items, function (value) {
                        if(value.checked==true){
                            $scope.sync(true, value);
                        }

                        //console.log("Value:" + value.toString());
                        $scope.serviceTotalPrice += value.totalprice;

                    });
                    LxDialogService.open($scope.dialogDeferedpay);
                },function (data) {
                    /*self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                     self.sendbutton = helperFunc.toogleStatus(self.sendbutton);*/
                    console.log("Error!!" + data);
                }
            );


        }

        $scope.$on('lx-dialog__open-start', function(_event, _dialogId)
        {
            //var self = this;
            if ($scope.dialogDeferedpay === _dialogId)
            {

            }
        });

        $scope.reversePaymentsDefered = function reversePaymentsDefered($event, data) {
            $event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
            console.log(data.toString());
            $scope.sms1 = $filter('translate')('defered.module.sms1');
            $scope.sms2 = $filter('translate')('defered.module.sms2');
            $scope.btn1 = $filter('translate')('defered.module.btn1');
            $scope.btn2 = $filter('translate')('defered.module.btn2');
            LxNotificationService.confirm($scope.sms1, $scope.sms2,
                {
                    cancel: $scope.btn1,
                    ok: $scope.btn2
                }, function(answer)
                {
                    if (answer)
                    {
                        serviceRequestResource.reverseServicesRequests({servicerequest: data.servicerequest}).$promise.
                        then(
                            function (data) {
                                console.log("Reversed!!" + data);
                                $scope.sms3 = $filter('translate')('defered.module.sms3');
                                LxNotificationService.success($scope.sms3);
                                $scope.getDeferedList();
                                $scope.getClosedList();
                                //$scope.faircrafts = [];
                                //$location.path("/dashboard");
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                LxDialogService.close($scope.dialogDeferedpay);
                            },function (data) {
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                console.log("Error!!" + data.toString());
                            }
                        );
                    }
                    else
                    {
                        $scope.sms4 = $filter('translate')('defered.module.sms4');
                        LxNotificationService.error($scope.sms4);
                        self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                        self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    }
                });

        };

        /********** ReversePaymentsDefered ********/

    }]);
/**
 * Created by bboyvlad on 9/8/16.
 */
'use strict';

var balancedetails = angular.module('BalanceDetails', ['ngRoute', 'ngMessages', 'ui.utils.masks', 'ngAnimate', 'chart.js']);

balancedetails.controller('BalanceDetailsController', ['$rootScope','$scope', '$filter', '$http', '$location', 'myJdMenu', 'helperFunc', 'LxNotificationService', 'userPaymentResource', 'LxDatePickerService', 'cardPaymentResource', '$translate',
    function AddJdCardController($rootScope, $scope, $filter, $http, $location, myJdMenu, helperFunc, LxNotificationService, userPaymentResource, LxDatePickerService, cardPaymentResource, $translate) {
        $scope.cssClass = 'balancedetails';
        $scope.icon = '../css/icons/chart-areaspline.png';

        var self = this;
        $scope.sendbutton = false;
        $scope.LinearProgress = false;
        $scope.search = { mysearch:'' };
        /***************** TO RESET FORMS ********************/
        /*$scope.master = {
            jdcard: "", dateFrom: null, dateFromPicker: { dateFormated: new Date(), locale: $rootScope.datePicker.locale, format: $rootScope.datePicker.format }, dateToPicker: { dateFormated: new Date(), locale: $rootScope.datePicker.locale, format: $rootScope.datePicker.format }
        };*/
        $scope.listTransactions = "";
        $scope.master = {
            jdcard: "", dateFrom: null, dateFromPicker: { dateFormated: new Date(), locale: 'es', format: 'YYYY-MM-DD' }, dateToPicker: { dateFormated: new Date(), locale: 'es', format: 'YYYY-MM-DD' }
        };
        $scope.reset = function() {
            if(angular.isDefined($rootScope.mainLineChart) && angular.isDefined($rootScope.mainLineChart.show)){
                $rootScope.mainLineChart.show = false;
            }
            $scope.fredeemcard = angular.copy($scope.master);
            $scope.listTransactions = "";
        };
        /***************** TO RESET FORMS ********************/

        /****************** DATEPICKER *********************/
        $scope.dateFromPickerId = 'dateFrom';
        $scope.dateToPickerId = 'dateTo';
        $scope.balance = {
            dateFromPicker: { dateFormated: null, locale: 'es', format: 'YYYY-MM-DD' },
            dateToPicker: { dateFormated: null, locale: 'es', format: 'YYYY-MM-DD' }
        };

        $scope.datePickerCallback = function datePickerCallback(_newdate, option)
        {
            if(option=='from'){
                $scope.balance.dateFromPicker.dateFormated = moment(_newdate).locale('es').format('YYYY-MM-DD');
                LxDatePickerService.close($scope.dateFromPickerId);
            }else if(option=='to'){
                $scope.balance.dateToPicker.dateFormated = moment(_newdate).locale('es').format('YYYY-MM-DD');
                LxDatePickerService.close($scope.dateToPickerId);
            }
        };
        /****************** DATEPICKER *********************/

        /*************** CHARTS *******************/

        helperFunc.jdCardBalance(null, true);


        /*$rootScope.mainLineChart = {labels:[], series:[], payavailable: 0, paylocked:0, paybalance: 0, lineData:[], data:[  ] };

                $scope.calculateBalance = function calculateBalance() {
                    //console.log("payments: "+ $rootScope.userDetail.toString());
                    var detailUser=userResource.detailUser();
                    detailUser.$promise.then( function (data) {
                        //console.log("data userDetails"+data);
                        $rootScope.userDetail = data;
                        $scope.items = $filter('orderBy')($rootScope.userDetail.payments, "payid");
                        var payments = $scope.items;
                        //console.log("data payments"+payments.toString());
                        angular.forEach(payments, function (value, key) {
                            console.log(value.toString());
                            $rootScope.mainLineChart.payavailable +=value.payavailable;
                            $rootScope.mainLineChart.paylocked +=value.paylocked;
                            $rootScope.mainLineChart.paybalance +=value.paybalance;
                            $scope.transactions = $filter('orderBy')(value.transactionspayments, "tranid");
                            var transactions = $scope.transactions;
/!*{tranid:147, trantype:"BANK", transtatus:"SUCCEEDED", tranamount:75.42, trandate:1238472000000, tranupdate:1479182400000, trantoken:"123123"}*!/
                            angular.forEach(transactions, function (value, key) {
                                console.log("valor es number?: "+angular.isNumber(value.tranamount));
                                if(angular.isNumber(value.tranamount)){
                                    console.log("valor es 0?: "+value.tranamount);

                                    if(value.tranamount!='0') {
                                        console.log("valor es negative?: "+value.tranamount.toString().indexOf('-'));
                                        var amount = 0;
                                        if(value.tranamount.toString().indexOf('-') !== -1){
                                            /!************* NEGATIVE VALUE *************!/
                                            console.log($rootScope.mainLineChart.lineData[$rootScope.mainLineChart.lineData.length -1]);

                                            if(angular.isUndefined($rootScope.mainLineChart.lineData[$rootScope.mainLineChart.lineData.length -1])){
                                                amount = value.tranamount;
                                            }else{
                                                amount = $rootScope.mainLineChart.lineData[$rootScope.mainLineChart.lineData.length -1] + value.tranamount;
                                            }
                                            $rootScope.mainLineChart.lineData.push(amount);
                                        }else{
                                            /!************* POSITIVE VALUE *************!/
                                            if(angular.isUndefined($rootScope.mainLineChart.lineData[$rootScope.mainLineChart.lineData.length -1])){
                                                amount = value.tranamount;
                                            }else{
                                                amount = $rootScope.mainLineChart.lineData[$rootScope.mainLineChart.lineData.length -1] + value.tranamount;
                                            }
                                            $rootScope.mainLineChart.lineData.push(amount);
                                        }
                                        $rootScope.mainLineChart.labels.push($filter('dateFromDB')(value.trandate, "YYYY-MM-DD"));
                                    }
                                }
                            });
                            //$rootScope.mainLineChart.lineData.push(value.payavailable);


                        });
                        $rootScope.mainLineChart.series = ["Available Balance"];
                        $rootScope.mainLineChart.data.push($rootScope.mainLineChart.lineData);

                        /!*console.log("TOTAL" + $rootScope.mainLineChart.payavailable);
                         console.log($rootScope.datePicker.toString());*!/
                    });

                };
                $scope.calculateBalance();*/
        /*************** CHARTS *******************/
        //$scope.reset();

        //$scope.paymethod = [];
        $scope.jdcardOpts = [];
        $scope.getPayments = function getPayments(id) {
            var self = this;

            userPaymentResource.get({id: id}).$promise.
                then(
                    function (data) {
                        /*$scope.paymethod = response.data;*/
                        var items = $filter('filter')(data, {paytype:"JDCARD"});
                        $scope.jdcardOpts = $filter('orderBy')(items, "payid");
                        /*angular.forEach(items, function (key) {
                            //alert(key.paytype +':'+val);
                            if(key.paytype=="JDCARD"){
                                self.jdcardOpts.push(key);
                            }/!*else{
                                self.paymethod.push(key);
                            }*!/
                        });*/
                    }
            )
        };

        //alert($rootScope.user.id);
        $scope.getPayments($rootScope.user.id);

        $scope.GetBalance = function GetBalance($event, fields) {
            $event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
            //console.log(fields.toString());
            var toSave = { paymethod: fields.jdcard.payid, fromdate: fields.dateFrom, todate: fields.dateTo };
            helperFunc.jdCardBalance(fields.jdcard.payid, false);
            console.log(toSave.toString());
            var GetBalance = userPaymentResource.datetransactionpay({}, toSave);
            GetBalance.$promise.
            then(
                function (data) {
                    //console.log("Transactions: " + data.toString());
                    $scope.items = $filter('orderBy')(data, "tranid");

                    helperFunc.lineChart($scope.items);
                    $scope.listTransactions = $scope.items;
                    //console.log("Ordered Transactions: " + $scope.listTransactions.toString());
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);

                },function (data) {
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    console.log("Error!!" + data.toString());
                }
            )
        };

    }]);
/**
 * Created by bboyvlad on 9/8/16.
 */
'use strict';

var myaircrafts = angular.module('MyAirCraft', ['ngRoute', 'ngMessages']);

myaircrafts.controller('MyAirCraftsController', ['$rootScope','$scope', '$http', '$location', 'myJdMenu', 'helperFunc', 'aircraftResource', 'LxDialogService', 'LxNotificationService', 'userResource', '$translate', '$filter',
    function MyAirCraftsController($rootScope, $scope, $http, $aircraft, myJdMenu, helperFunc, aircraftResource, LxDialogService, LxNotificationService, userResource, $translate, $filter) {
        $scope.cssClass = 'aircraft';
        $scope.icon = '../css/icons/plane-flying.png';
        var self = this;
        $scope.sendbutton = false;
        $scope.LinearProgress = false;
        $scope.regex = "/^[A-Z,0-9]+$/";
        $scope.search = { mysearch:'' };
        $scope.faircrafts = {};
        $scope.aviationOpts = [
            { key: "1", value: "COMERCIAL" },{ key: "2", value: "GENERAL" }
        ];

        /***************** TO RESET FORMS ********************/
        $scope.master = {
            aircraftmodel: "", tailnumber: "", aviationtype: {key:"", value:""} ,name:"" ,active:false
        };
        $scope.reset = function() {
            $scope.faircrafts = angular.copy($scope.master);
            $scope.editaircrafts = angular.copy($scope.master);
            $scope.AircraftModelId = "";
        };
        /***************** TO RESET FORMS ********************/
        //$scope.reset();

        /****** SetAircraftModelId ********/
        $scope.AircraftModelId = "";
        $scope.setAircraftModelId = function setAircraftModelId(_newValue) {
            console.log(_newValue.toString());
            if(angular.isDefined(_newValue.aircraftype)){
                $scope.AircraftModelId = _newValue.aircraftype;
                return;
            }
            $scope.AircraftModelId = _newValue.id;
        };
        /****** SetAircraftModelId ********/

        /****** Aircraft Search ********/
        $scope.selectAjax = {
            loading: false,
            aircraftOpts: []
        };
        $scope.searchAircrafts = function searchAircrafts(newFilter) {
            //console.log(newFilter);
            if (newFilter && newFilter.length >= 3)
            {
                $scope.selectAjax.loading = true;
                aircraftResource.aircraftByName({ name: newFilter}).$promise.then(
                    function(data)
                    {
                        $scope.selectAjax.aircraftOpts = data;
                        $scope.selectAjax.loading = false;
                    },
                    function()
                    {
                        $scope.selectAjax.loading = false;
                        $scope.selectAjax.aircraftOpts = [];
                    });
            }
            else
            {
                $scope.selectAjax.aircraftOpts = [];
            }
        };
        /****** Aircraft Search ********/

        /********** editAircraft ********/
        $scope.listAircraft = aircraftResource.usersAircraft();

        $scope.dialogAircraft = "dialogAircraft";
        $scope.editaircrafts = {};

        /***************** TO RESET EDIT FORMS ********************/


        $scope.editReset = function(id) {
            $scope.editMaster = {
                id: id, aircraftmodel: "", tailnumber: "", aviationtype: {key:"", value:""} ,name:"" ,active:false
            };
            $scope.AircraftModelId = "";
            $scope.editaircrafts = angular.copy($scope.editMaster);
        };
        /***************** TO RESET FORMS ********************/

        $scope.toEditAvType = function toEditAvType(data) {
            switch (data) {
                case "1":
                    return { key: "1", value: "COMERCIAL" };
                    break;
                case "2":
                    return { key: "2", value: "GENERAL" };
                    break;
                default:
                    return { key: "1", value: "COMERCIAL" };
            }
        };

        $scope.openDialogAircraft = function openDialogAircraft(ef_air)
        {
            LxDialogService.open(this.dialogAircraft);
            console.log(ef_air.toString());

            /***************** TO RECALL DATA ON EDIT FORMS ********************/
            $scope.editmaster = {
                id: ef_air.id, aircraftmodel: ef_air, tailnumber: ef_air.tailnumber, aviationtype: $scope.toEditAvType(ef_air.aviationtype.key) , name:ef_air.name , active:ef_air.active
            };
            $scope.AircraftModelId = ef_air.aircraftype;
            $scope.editaircrafts = angular.copy($scope.editmaster);

            /***************** TO RECALL DATA ON EDIT FORMS ********************/

        }

        $scope.$on('lx-dialog__open-start', function(_event, _dialogId)
        {
            //var self = this;
            if ($scope.dialogAircraft === _dialogId)
            {

            }
        });

        $scope.updateAircraft = function updateAircraft($event, fields) {
            $event.preventDefault();
            var self = this;

            console.log("air id: "+fields.id+ ' / ' + fields.toString());
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);

            var toSave = {
                id: fields.id, aircrafttype: $scope.AircraftModelId , tailnumber: fields.tailnumber, aviationtype:fields.aviationtype.key, name:fields.name , active:fields.active
            };
            console.log(toSave.toString());

            aircraftResource.updateAircraft(toSave).$promise.
            then(
                function (data) {
                    console.log("Updated!!" + data);
                    $scope.sms1 = $filter('translate')('aircraft.module.sms1');
                    LxNotificationService.success($scope.sms1);
                    $scope.listAircraft = aircraftResource.usersAircraft();
                    $scope.reset();
                    //$location.path("/dashboard");
                    LxDialogService.close(self.dialogAircraft);
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                },function (data) {
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    console.log("Error!!" + data);
                }
            );
        }

        /********** editAircraft ********/

        /********** addAircraft ********/
        $scope.addAircraft = function addAircraft($event, fields) {
            $event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
            /*var toSave = '{"aircrafttype":"'+fields.aircraftmodel.id+'","tailnumber":"'+fields.tailnumber+'","name":"'+fields.aircraftmodel.name+'", aviationtype: {key:ef_air.aviationtype, value:ef_air.aviationtype} , name:ef_air.name , active:ef_air.active}';*/

            var toSave = {aircrafttype: fields.aircraftmodel.id, tailnumber: fields.tailnumber, aviationtype:fields.aviationtype.key, name:fields.name , active:fields.active};

            userResource.myaircraft({principal_id: $rootScope.user.id}, toSave).$promise.
            then(
                function (data) {
                    console.log("Saved!!" + data.toString());
                    if(data.message == "Error en la operacion"){
                        $scope.sms2 = $filter('translate')('aircraft.module.sms2');
                        LxNotificationService.error($scope.sms2);
                        self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                        self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                        //self.helperFuncBar();
                        return;
                    }
                    $scope.sms3 = $filter('translate')('aircraft.module.sms3');
                    LxNotificationService.success($scope.sms3);
                    $scope.listAircraft = aircraftResource.usersAircraft();
                    $scope.reset();
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                },function (data) {
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    console.log("Error!!" + data.toString());
                }
            );
        }
        /********** addAircraft ********/

        /********** deleteAircraft ********/

        $scope.deleteAircraft = function deleteAircraft(data) {
            //$event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
            console.log(data.toString());
            $scope.sms4 = $filter('translate')('aircraft.module.sms4');
            LxNotificationService.confirm($scope.sms4, $scope.sms5,
                {
                    cancel: $filter('translate')('aircraft.module.btn1'),
                    ok: $filter('translate')('aircraft.module.btn2')
                }, function(answer)
                {
                    if (answer)
                    {
                        aircraftResource.deleteAircraft({aircraftid: data.id}).$promise.
                        then(
                            function (data) {
                                console.log("Erased!!" + data.toString());
                                if(data.message == "Error en la operation"){
                                    $scope.sms6 = $filter('translate')('aircraft.module.sms6');
                                    LxNotificationService.error($scope.sms6);
                                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                    //self.helperFuncBar();
                                    return;
                                }
                                $scope.sms7 = $filter('translate')('aircraft.module.sms7');
                                LxNotificationService.success($scope.sms7);
                                $scope.listAircraft = aircraftResource.usersAircraft();
                                //$scope.faircrafts = [];
                                //$location.path("/dashboard");
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                            },function (data) {
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                console.log("Error!!" + data.toString());
                            }
                        );
                    }
                    else
                    {
                        $scope.sms8 = $filter('translate')('aircraft.module.sms8');
                        LxNotificationService.error($scope.sms8);
                        this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
                        this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
                    }
                });

        }
        /********** deleteAircraft ********/

    }]);
/**
 * Created by bboyvlad on 9/7/16.
 */
'use strict';

var mycaptain = angular.module('MyCaptain', ['ngRoute', 'jdmenu', 'ngMessages']);

mycaptain.controller('MyCaptainController', ['$rootScope','$scope', '$http', '$location', 'myJdMenu', 'LxNotificationService', 'helperFunc', 'mycaptainResource', 'LxDialogService', 'LxDatePickerService', '$translate', '$filter',
    function MyCaptainController($rootScope, $scope, $http, $location, myJdMenu, LxNotificationService, helperFunc, mycaptainResource, LxDialogService, LxDatePickerService, $translate, $filter) {
        $scope.cssClass = 'captain';
        $scope.icon = '../css/icons/pilot-hat.png';
        var self = this;

        $scope.fmycaptain = {datePicker: { dateFormated: null, locale: 'es', format: 'YYYY-MM-DD' }};
        $scope.sendbutton = false;
        $scope.LinearProgress = false;
        $scope.listCaptain = mycaptainResource.query();
        $scope.search = { mysearch:'' };

        /***************** TO RESET FORMS ********************/
        $scope.master = {
            id: "", name: "", license: "", dateofbirth: "", address: "", city: "", country: "", phone: "", email: "", active: "", datePicker: { dateFormated: new Date(), locale: 'es', format: 'YYYY-MM-DD' }
        };
        $scope.reset = function() {
            $scope.fmycaptain = angular.copy($scope.master);
            $scope.feditcaptain = angular.copy($scope.master);
        };
        /***************** TO RESET FORMS ********************/

        /****************** DATEPICKER *********************/
        $scope.datePickerId = 'dateofbirth';

        $scope.datePickerCallback = function datePickerCallback(_newdate, action)
        {
            if(action=="add"){
                $scope.fmycaptain.datePicker.dateFormated = moment(_newdate).locale($scope.fmycaptain.datePicker.locale).format($scope.fmycaptain.datePicker.format);
            }else if(action=="update"){
                $scope.feditcaptain.datePicker.dateFormated = moment(_newdate).locale($scope.feditcaptain.datePicker.locale).format($scope.feditcaptain.datePicker.format);
            }
            LxDatePickerService.close($scope.datePickerId);
        };
        /****************** DATEPICKER *********************/

        /********** saveMyCaptain ********/

        $scope.myCaptainCreate = function myCaptainCreate($event, fields) {
            $event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);

            var myCaptainSave = mycaptainResource.save({}, fields);
            myCaptainSave.$promise.
            then(
                function (data) {
                    console.log("Saved!!" + data.toString());
                    $scope.listCaptain = mycaptainResource.query();
                    $scope.reset();

                    //$rootScope.userInfo = data;
                    $scope.sms1 = $filter('translate')('captain.module.sms1');
                    LxNotificationService.success($scope.sms1);
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);

                }
            );

        };

        /********** saveMyCaptain ********/


        /********** editCaptain ********/
        //$scope.listCaptain = userResource.myaircraft({principal_id: $rootScope.user.id});

        $scope.dialogCaptain = "dialogCaptain";
        $scope.feditcaptain = {};

        /***************** TO RESET EDIT FORMS ********************/


        $scope.editReset = function(id) {
            $scope.editMaster = {
                id: id, name: "", license: "", dateofbirth: "", address: "", city: "", country: "", phone: "", email: "", active: "", datePicker: { dateFormated: new Date(), locale: 'es', format: 'YYYY-MM-DD' }
            };
            $scope.feditcaptain = angular.copy($scope.editMaster);
        };
        /***************** TO RESET FORMS ********************/
        //$scope.reset();

        $scope.openDialogCaptain = function openDialogCaptain(ef_cap)
        {
            LxDialogService.open(this.dialogCaptain);
            console.log(ef_cap.id );
            /***************** TO RECALL DATA ON EDIT FORMS ********************/
            $scope.editmaster = {
                id: ef_cap.id, name: ef_cap.name, license: ef_cap.license, dateofbirth: ef_cap.dateofbirth, address: ef_cap.address, city: ef_cap.city, country: ef_cap.country, phone: ef_cap.phone, email: ef_cap.email, active: ef_cap.active ? 'true' : 'false', datePicker: { dateFormated: helperFunc.dateFromDB(ef_cap.dateofbirth, "YYYY-MM-DD"), locale: 'es', format: 'YYYY-MM-DD' }
            };
            $scope.feditcaptain = angular.copy($scope.editmaster);
            /***************** TO RECALL DATA ON EDIT FORMS ********************/

        }

        $scope.$on('lx-dialog__open-start', function(_event, _dialogId)
        {
            //var self = this;
            if ($scope.dialogCaptain === _dialogId)
            {

            }
        });

        $scope.updateCaptain = function updateCaptain($event, fields) {
            $event.preventDefault();
            var self = this;

            console.log(fields.id+ ' / ' + fields);
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);

            mycaptainResource.update({}, fields).$promise.
            then(
                function (data) {
                    console.log("Updated!!" + data);
                    $scope.sms2 = $filter('translate')('captain.module.sms2');
                    LxNotificationService.success($scope.sms2);
                    $scope.listCaptain = mycaptainResource.query();
                    $scope.reset();
                    //$location.path("/dashboard");
                    LxDialogService.close(self.dialogCaptain);
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                },function (data) {
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    console.log("Error!!" + data);
                }
            );
        }

        /********** editCaptain ********/


        /********** deleteCaptain ********/

        $scope.deleteCaptain = function deleteCaptain(data) {
            //$event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
            console.log(data.toString());
            $scope.sms3 = $filter('translate')('captain.module.sms3');
            $scope.sms4 = $filter('translate')('captain.module.sms4');
            LxNotificationService.confirm($scope.sms3, $scope.sms4,
                {
                    cancel: 'Cancel',
                    ok: 'Delete'
                }, function(answer)
                {
                    if (answer)
                    {
                        mycaptainResource.deleteMycaptain({captainId: data.id}).$promise.
                        then(
                            function (data) {
                                console.log("Erased!!" + data);
                                $scope.sms5 = $filter('translate')('captain.module.sms5');
                                LxNotificationService.success($scope.sms5);
                                $scope.listCaptain = mycaptainResource.query();
                                //$scope.faircrafts = [];
                                //$location.path("/dashboard");
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                            },function (data) {
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                console.log("Error!!" + data.toString());
                            }
                        );
                    }
                    else
                    {
                        $scope.sms6 = $filter('translate')('captain.module.sms6');
                        LxNotificationService.error($scope.sms6);
                        self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                        self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    }
                });

        }
        /********** deleteCaptain ********/

    }]);

/*TO COMPARE FIELDS VALUES*/
/*
 var compareTo = function() {
 return {
 require: "ngModel",
 scope: {
 otherModelValue: "=compareTo"
 },
 link: function(scope, element, attributes, ngModel) {

 ngModel.$validators.compareTo = function(modelValue) {
 return modelValue == scope.otherModelValue;
 };

 scope.$watch("otherModelValue", function() {
 ngModel.$validate();
 });
 }
 };
 };

 singup.directive("compareTo", compareTo);*/

/**
 * Created by bboyvlad on 9/8/16.
 */
'use strict';

var bankaccount = angular.module('BankAccount', ['ngRoute', 'ngMessages', 'angularPayments']);

bankaccount.controller('BankAccountController', ['$rootScope','$scope', '$http', '$location', 'LxDatePickerService', 'myJdMenu', 'helperFunc', 'LxNotificationService', 'LxDialogService', 'bankManageResource', 'userResource', '$translate', '$filter',
    function BankAccountController($rootScope, $scope, $http, $location, LxDatePickerService, myJdMenu, helperFunc, LxNotificationService, LxDialogService, bankManageResource, userResource, $translate, $filter ) {
        $scope.cssClass = 'bankaccount';
        var self = this;
        $scope.sendbutton = false;
        $scope.LinearProgress = false;
        $scope.search = { mysearch:'' };
        $scope.regex = "[0-9]+";

        /****************** DATEPICKER *********************/
        $scope.datePickerId = 'dcreate';
        $scope.faddbankaccount = {
            datePicker: { dateFormated: null, locale: 'es', format: 'YYYY-MM-DD' }
        };
        $scope.icon = '../css/icons/coin.png';

        $scope.datePickerCallback = function datePickerCallback(_newdate, action)
        {
            if(action=="add"){
                $scope.faddbankaccount.datePicker.dateFormated = moment(_newdate).locale($scope.faddbankaccount.datePicker.locale).format($scope.faddbankaccount.datePicker.format);
            }else if(action=="update"){
                $scope.feditbankaccount.datePicker.dateFormated = moment(_newdate).locale($scope.feditbankaccount.datePicker.locale).format($scope.feditbankaccount.datePicker.format);
            }
            LxDatePickerService.close($scope.datePickerId);
        };
        /****************** DATEPICKER *********************/


        /***************** COORDINATE CARD ********************/
        /*$scope.userDetail = userResource.detailUser().$promise
        .then(
            function (data) {
                if(data.coordinates==null || data.coordinates.id==""){
                    //console.log(data.coordinates.id + " / " + data.coordinates.active);
                    LxNotificationService.confirm('Coordinate Card', 'To add an bank account you must generate a coordinate card.',
                        {
                            cancel: 'Cancel',
                            ok: 'Create'
                        }, function(answer)
                        {
                            if (answer)
                            {
                                window.open('http://jdoilfield.net:8080/users/setcoordinates', '_blank');

                                LxNotificationService.success('Card created successfully !!!.. you\'ll find in your email the instruction for it\'s activation ');
                            }
                            else
                            {
                                LxNotificationService.error('The operation has been canceled');
                            }
                        });
                }else if(data.coordinates.active==false){
                    LxNotificationService.info('You already have a coordinate card, but you need to complete the activation process... check your email and follow the instructions to activated or create a new one from the user menu!...');
                }
            }
        );*/

        /*var randomString = function(type) {
            if(type==true){
                var text = "";
                var possible = "ABCDE";
                for(var i = 0; i < 1; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }else{

                var text = "";
                var possible = "12345";
                for(var i = 0; i < 1; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }
        }*/
        /*************  ASKING FOR CORDINATES **************/
        /*$scope.dialogCoordinates = "dialogCoordinates";
        $scope.openDialogCoordinates = function openDialogCoordinates()
        {
            LxDialogService.open(this.dialogCoordinates);

        }

        $scope.$on('lx-dialog__open-start', function(_event, _dialogId)
        {
            //var self = this;
            if ($scope.dialogCoordinates === _dialogId)
            {
                $scope.coord1 = {
                    key: randomString(true) + randomString(false)
                };
                $scope.coord2 = {
                    key: randomString(true) + randomString(false)
                };

            }
        });*/

        //console.log($scope.userDetail.toString());
        /***************** COORDINATE CARD ********************/

        /***************** TO RESET FORMS ********************/
        $scope.master = {
            bankname: "", bankacctnum: "", dcreate: "", datePicker: { dateFormated: new Date(), locale: 'es', format: 'YYYY-MM-DD' }, notes: "", enabled: ""
        };
        $scope.reset = function() {
            $scope.faddbankaccount = angular.copy($scope.master);
            $scope.feditbankaccount = angular.copy($scope.master);
        };
        /***************** TO RESET FORMS ********************/
        //$scope.reset();

              /********** addBankAccount ********/
        $scope.BankAccountCreate = function BankAccountCreate($event, fields) {
            $event.preventDefault();
            var self = this;

            /*var coordinates = '{"crdOne":"'+$scope.coord1.key+'","valOne":"'+$scope.coord1.val+'","crdTwo":"'+$scope.coord2.key+'","valTwo":"'+$scope.coord2.val+'"}';
            userResource.checkCoordinates({}, coordinates).$promise.then(
                function (data) {
                    console.log(data.toString());
                    if(data.message=="Autorized"){
                        LxDialogService.close($scope.dialogCoordinates);
                        */
            $scope.LinearProgress = helperFunc.toogleStatus($scope.LinearProgress);
            $scope.sendbutton = helperFunc.toogleStatus($scope.sendbutton);

            var toSave = {bankname: fields.bankname, bankacctnum: fields.bankacctnum, dcreate: helperFunc.dateFromDB(fields.dcreate, "YYYY-MM-DD"), notes: fields.notes, enabled: fields.enabled };
            bankManageResource.save({}, toSave).$promise.
            then(
                function (data) {
                    console.log("Saved!!" + data.toString());
                    $scope.listBankAccount = bankManageResource.getAll();
                    $score.sms1 = $filter('translate')('bankmanage.module.sms1');
                    $score.sms2 = $filter('translate')('bankmanage.module.sms2');
                    LxNotificationService.alert($score.sms1,
                        $score.sms2,
                        'Ok',
                        function(answer)
                        {
                            $scope.reset();
                            self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                            self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                            //$location.path("/dashboard");
                        });
                },function (data) {
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    console.log("Error!!" + data);
                }
            );

                    /*}else if(data.message=="Unautorized"){
                        window.alert(" Invalid Data!!! ");
                    }else if(data.message=="Coordinate card inactive"){
                        window.alert(" Please activate your coordinates card first!!! ");
                    }
                }
            );*/


            /**/
        }
        /********** addBankAccount ********/

        /********** editBankAccount ********/
        $scope.listBankAccount = bankManageResource.getAll();

        $scope.dialogBankAccount = "dialogBankAccount";
        $scope.feditbankaccount = {};

        /***************** TO RESET EDIT FORMS ********************/


        $scope.editReset = function(id) {
            $scope.editMaster = {
                id: bankid, bankname: "", bankacctnum: "", dcreate: new Date(), datePicker: { dateFormated: new Date(), locale: 'es', format: 'YYYY-MM-DD' }, notes: "", enabled: ""
            };
            $scope.feditbankaccount = angular.copy($scope.editMaster);
        };
        /***************** TO RESET FORMS ********************/
        //$scope.reset();

        $scope.openDialogBankAccount = function openDialogBankAccount(ef_bankaccount)
        {
            LxDialogService.open(this.dialogBankAccount);
            //console.log(ef_bankaccount.payid );
            /***************** TO RECALL DATA ON EDIT FORMS ********************/
            $scope.editmaster = {
                id: ef_bankaccount.bankid, bankname: ef_bankaccount.bankname, bankacctnum: ef_bankaccount.bankacctnum, dcreate: ef_bankaccount.dcreate,  datePicker: { dateFormated: helperFunc.dateFromDB(ef_bankaccount.dcreate, "YYYY-MM-DD"), locale: 'es', format: 'YYYY-MM-DD' } , notes: ef_bankaccount.notes, enabled: ef_bankaccount.enabled
            };
            $scope.feditbankaccount = angular.copy($scope.editmaster);
            /***************** TO RECALL DATA ON EDIT FORMS ********************/

        }

        $scope.$on('lx-dialog__open-start', function(_event, _dialogId)
        {
            //var self = this;
            if ($scope.dialogBankAccount === _dialogId)
            {

            }
        });

        $scope.updateBankAccount = function updateBankAccount($event, fields) {
            $event.preventDefault();
            var self = this;

            console.log(fields.id+ ' / ' + fields.toString());
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);

            var toSave = {
                id: fields.bankid, bankname: fields.bankname, bankacctnum: fields.bankacctnum, dcreate: fields.dcreate,  datePicker: { dateFormated: helperFunc.dateToDB(fields.dcreate, "YYYY-MM-DD", false), locale: 'es', format: 'YYYY-MM-DD' } , notes: fields.notes, enabled: fields.enabled
            };

            bankManageResource.update({id: fields.id}, toSave).$promise.
            then(
                function (data) {
                    console.log("Updated!!" + data);
                    $score.sms3 = $filter('translate')('bankmanage.module.sms3');
                    LxNotificationService.success($score.sms3);
                    $scope.listBankAccount = bankManageResource.getAll();
                    $scope.reset();
                    //$location.path("/dashboard");
                    LxDialogService.close(self.dialogBankAccount);
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                },function (data) {
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    console.log("Error!!" + data);
                }
            );
        }

        /********** editBankAccount ********/

        /********** deleteBankAccount ********/

        $scope.deleteBankAccount = function deleteBankAccount(data) {
            //$event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
            console.log(data.toString());
            $score.sms4 = $filter('translate')('bankmanage.module.sms4');
            $score.sms5 = $filter('translate')('bankmanage.module.sms5');

            LxNotificationService.confirm($score.sms4, $score.sms5,
                {
                    cancel: $filter('translate')('bankmanage.module.btn1'),
                    ok: $filter('translate')('bankmanage.module.btn2')
                }, function(answer)
                {
                    if (answer)
                    {
                        bankManageResource.delete({id: data.bankid}).$promise.
                        then(
                            function (data) {
                                console.log("Deleted!!" + data);
                                $score.sms6 = $filter('translate')('bankmanage.module.sms6');
                                LxNotificationService.success($score.sms6);
                                $scope.listBankAccount = bankManageResource.getAll();
                                //$location.path("/dashboard");
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                            },function (data) {
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                console.log("Error!!" + data.toString());
                            }
                        );
                    }
                    else
                    {
                        $score.sms7 = $filter('translate')('bankmanage.module.sms7');
                        LxNotificationService.error($score.sms7);
                        this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
                        this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
                    }
                });

        }
        /********** deleteBankAccount ********/

    }]);
/**
 * Created by bboyvlad on 9/8/16.
 */
'use strict';

var cardcheck = angular.module('CardCheck', ['ngRoute', 'ngMessages', 'ui.utils.masks', 'angularPayments']);

cardcheck.controller('CardCheckController', ['$rootScope','$scope', '$http', '$location', 'myJdMenu', 'helperFunc', 'LxNotificationService', 'LxDialogService',  'cardValidateResource', '$translate', '$filter',
    function AddJdCardController($rootScope, $scope, $http, $location, myJdMenu, helperFunc, LxNotificationService, LxDialogService, cardValidateResource, $translate, $filter) {
        $scope.cssClass = 'cardcheck';
        $scope.icon = '../css/icons/cardcheck.png';
        var self = this;
        $scope.sendbutton = false;
        $scope.LinearProgress = false;
        $scope.cardCheckImg = '../css/img/finance-graphic.png';
        $scope.fcardcheck = {};
        $scope.dialogValidate = 'dialogValidate';

        /***************** TO RESET FORMS ********************/
        $scope.master = {
            switches: "false", jdcardcode: ""
        };
            $scope.reset = function() {
            $scope.fcardcheck = angular.copy($scope.master);
        };
        $scope.reset();
        /***************** TO RESET FORMS ********************/

        $scope.CheckCard = function CheckCard($event, validate)
        {
            $event.preventDefault();
            //console.log(validate.toString() );
            if(validate.switches=="false"){
                cardValidateResource.cardStatus({fuelCardCode: validate.jdcardcode}).
                $promise.then(
                    function (data) {
                        $scope.cardBalance = false;
                        $scope.cardStatus = data;
                    }
                );
            }else if(validate.switches=="true"){
                cardValidateResource.cardBalance({fuelCardCode: validate.jdcardcode}).
                $promise.then(
                    function (data) {
                        $scope.cardStatus = false;
                        $scope.cardBalance = data;
                    }
                );
            }
            LxDialogService.open(this.dialogValidate);
        }

        $scope.$on('lx-dialog__open-start', function(_event, _dialogId)
        {
            //var self = this;
            if ($scope.dialogCaptain === _dialogId)
            {

            }
        });


    }]);
/**
 * Created by bboyvlad on 9/8/16.
 */
'use strict';

var addcart = angular.module('AddCart', ['ngRoute', 'ngMessages', 'ui.utils.masks', 'ngAnimate', 'ngMaterialDatePicker']);

addcart.controller('AddCartController', ['$rootScope','$scope', '$http', '$location', 'LxDatePickerService','LxNotificationService', 'myJdMenu', 'helperFunc', 'shopcartResource', 'locationResource', 'aircraftResource', 'mycaptainResource', 'userResource', '$translate', '$filter',
    function AddCartController($rootScope, $scope, $http, $location, LxDatePickerService, LxNotificationService, myJdMenu, helperFunc, shopcartResource, locationResource, aircraftResource, mycaptainResource, userResource, $translate, $filter) {
        $scope.cssClass = 'cart';
        if($body.hasClass('sidebar_secondary_active')) {
            $body.removeClass('sidebar_secondary_active');
        }

        var self = this;
        $scope.sendbutton = false;
        $scope.LinearProgress = false;
        $scope.shopCartsendbutton = false;
        $scope.shopCartLinearProgress = false;
        $scope.startDatePickerId = 'estimateArrival';
        $scope.endDatePickerId = 'estimateDeparture';
        $scope.icon = '../css/icons/airport-flight-info-signal.png';

        /***************** COORDINATE CARD ********************/
        //mycaptains myaircraft
        $scope.userDetail = userResource.detailUser().$promise
            .then(
                function (data) {
                    if(data.myaircrafts.length<=0 || data.mycaptains.length<=0){
                        //console.log(data.coordinates.id + " / " + data.coordinates.active);
                        $scope.sms4 = $filter('translate')('cart.module.sms4');
                        $scope.sms5 = $filter('translate')('cart.module.sms5');
                        LxNotificationService.alert($scope.sms4, $scope.sms5, 'Ok'
                            , function(answer)
                            {
                                if (data.myaircrafts.length<=0)
                                {
                                    $location.path("/dashboard/aircraft/manage");
                                }
                                else if (data.mycaptains.length<=0)
                                {
                                    $location.path("/dashboard/captain/manage");
                                }
                            });
                    }else if(data.coordinates.active==false){
                        $scope.sms4 = $filter('translate')('paymethod.module.sms4');
                        LxNotificationService.info($scope.sms4);
                    }
                }
            );

        //$scope.fcart = {datePicker: { locale: 'es', format: 'YYYY-MM-DD' }, startdatePicker: { dateFormated: null, minDate: moment() }, enddatePicker: { dateFormated: null, minDate:  moment() };
            $scope.fcart = {datePicker: { locale: 'es', format: 'YYYY-MM-DD' }, startdatePicker: { dateFormated: null, minDate: '' }, enddatePicker: { dateFormated: null, minDate:  '' }
        };
        $scope.itemQuantity = "";
        $scope.pPrice = '';

        $scope.$on('lx-date-picker__close-end', function(_event, _dialogId)
        {
            //var self = this;
            if ($scope.endDatePickerId === _dialogId)
            {
                if(moment($scope.fcart.enddatePicker.dateFormated).diff($scope.fcart.startdatePicker.dateFormated, 'days') < 0 ){
                    $scope.fcart.enddatePicker.dateFormated = angular.copy($scope.fcart.startdatePicker.dateFormated);
                    $scope.fcart.estimateDeparture = angular.copy($scope.fcart.startdatePicker.dateFormated);
                    /*console.log($scope.fcart.toString());
                    console.log(moment($scope.fcart.enddatePicker.dateFormated).diff($scope.fcart.startdatePicker.dateFormated, 'days'));*/
                    $scope.sms1 = $filter('translate')('cart.module.sms1');
                    LxNotificationService.error($scope.sms1 );
                }
            }
        });


        $scope.datePickerCallback = function datePickerCallback(_newdate, action)
        {
            if(action==true){
                $scope.fcart.enddatePicker.dateFormated = moment(_newdate).locale($rootScope.dateP.locale).format($rootScope.dateP.format);


                LxDatePickerService.close($scope.endDatePickerId);
                return;
            }
            //console.log("_newdate: "+_newdate);
                $scope.fcart.startdatePicker.dateFormated = moment(_newdate).locale($rootScope.dateP.locale).format($rootScope.dateP.format);
            /*console.log("startdatePicker: "+$scope.fcart.startdatePicker.toString());
            $scope.fcart.enddatePicker.minDate = angular.copy(moment($scope.fcart.startdatePicker.dateFormated));
            console.log("enddatePicker: "+$scope.fcart.enddatePicker.toString());*/

            LxDatePickerService.close($scope.startDatePickerId);
        };

        /***************** TO RESET FORMS ********************/
        $scope.master = {
            location: [], incomingloc: [], estimateArrival: null, time: "", estimateDeparture: null, timeDeparture: "", myaircraft: "", datePicker: { locale: 'es', format: 'YYYY-MM-DD' }, startdatePicker: { dateFormated: new Date()}, enddatePicker: { dateFormated: new Date()}
        };
        $scope.masteritem = "";
        $scope.reset = function() {
            $scope.fcart = angular.copy($scope.master);
            $scope.itemQuantity = angular.copy($scope.masteritem);
            $scope.prepareFligthList = [];
        };

        $scope.$watch('fcart.location', function (newVal, oldVal, scope) {
            /*console.log("newVal:" +newVal+ "oldVal:" +oldVal)
            console.log( angular.isDefined(newVal) );
            console.log(  newVal=="");*/
            if( newVal==""){
                $scope.reset();
            }
        });
        /***************** TO RESET FORMS ********************/

        /***************** OPTIONS LIST ********************/

        $scope.listMyAirCrafts = aircraftResource.usersAircraft();
        $scope.listCaptain = mycaptainResource.query();

        /***************** OPTIONS LIST ********************/

        /****** Location Search ********/
        $scope.selectAjax = {
            loading: false,
            locationOpts: []
        };
        $scope.searchLocation = function searchLocation(newFilter) {
            //console.log(newFilter);
            if (newFilter && newFilter.length >= 3)
            {
                $scope.selectAjax.loading = true;
                locationResource.airportByName({ airportname: newFilter}).$promise.then(
                    function(data)
                    {
                        console.log(data.toString());
                        $scope.selectAjax.locationOpts = data;
                        $scope.selectAjax.loading = false;
                    },
                    function()
                    {
                        $scope.selectAjax.loading = false;
                        $scope.selectAjax.locationOpts = [];
                    });
            }
            else
            {
                $scope.selectAjax.locationOpts = [];
            }
        };

        /******Incoming Location Search ********/
        $scope.incomingAjax = {
            loading: false,
            locationOpts: []
        };
        $scope.searchIncomingLoc = function searchIncomingLoc(newFilter) {
            //console.log(newFilter);
            if (newFilter && newFilter.length >= 3)
            {
                $scope.incomingAjax.loading = true;
                locationResource.allAirportByName({ airportname: newFilter}).$promise.then(
                    function(data)
                    {
                        console.log(data.toString());
                        $scope.incomingAjax.locationOpts = data;
                        $scope.incomingAjax.loading = false;
                    },
                    function()
                    {
                        $scope.incomingAjax.loading = false;
                        $scope.incomingAjax.locationOpts = [];
                    });
            }
            else
            {
                $scope.incomingAjax.locationOpts = [];
            }
        };


        $scope.productInfo = function productInfo(info) {

            $scope.fcart.push(info.description);
            $scope.pPrice = info.prices[0].price;

        };


        $scope.checkService = [];

        $scope.sync = function sync(bool, item, itemQuantity){
            //console.log(bool+"/"+item+"/"+itemQuantity);
            if(bool){
                // add item
                $scope.checkService.push(item);
            } else {
                // remove item
                $scope.servicesTotal = 0;
                for(var i=0 ; i < $scope.checkService.length; i++) {
                    if($scope.checkService[i].id == item.id){
                        if(!itemQuantity){
                            $scope.checkService.splice(i,1);
                        }else{
                            $scope.checkService[i].quantity = itemQuantity;
                            $scope.checkService[i].subtotal = itemQuantity * item.price;
                        }
                    }
                    if(angular.isDefined($scope.checkService[i].subtotal)){
                        $scope.servicesTotal += $scope.checkService[i].subtotal;
                    }
                }
            }
        };

        /* ESTUDIAR COMO MEJORAR */
        /*$scope.$watch("CartForm.$invalid", function(newVal, oldVal, $scope) {
            console.log(newVal+"/"+ oldVal+"/"+ $scope)
            if(newVal==false && oldVal==true){
                $scope.searchServices();
            }
        });*/

        /****************** searchServices ******************/

        $scope.searchServices = function searchServices($event, fields, id) {
            $event.preventDefault();
            var self = this;
            $scope.LinearProgress = helperFunc.toogleStatus($scope.LinearProgress);
            $scope.sendbutton = helperFunc.toogleStatus($scope.sendbutton);

            var toSave = {location : fields.location.id ,  myaircraft : fields.myaircraft.id, landing: fields.estimateArrival,  mycaptain : fields.mycaptain.id };

            var prepareFlight = shopcartResource.prepareFlight({}, toSave);
            prepareFlight.$promise.
            then(
                function (data) {
                    console.log("Productos: " + data.toString());
                    $scope.LinearProgress = helperFunc.toogleStatus($scope.LinearProgress);
                    $scope.sendbutton = helperFunc.toogleStatus($scope.sendbutton);
                    $scope.prepareFligthList = data;
                    $scope.sms2 = $filter('translate')('cart.module.sms2');
                    LxNotificationService.info($scope.sms2);
                    //$location.path("/dashboard");
                },function (data) {
                    console.log("Error!!" + data);
                    $scope.LinearProgress = helperFunc.toogleStatus($scope.LinearProgress);
                    $scope.sendbutton = helperFunc.toogleStatus($scope.sendbutton);
                }
            )
        };
        /****************** searchServices ******************/


        /****************** addShopCart ******************/

        $scope.addShopCart = function addShopCart($event, fields, id) {
            $event.preventDefault();
            var self = this;
            this.shopCartLinearProgress = helperFunc.toogleStatus(this.shopCartLinearProgress);
            this.shopCartsendbutton = helperFunc.toogleStatus(this.shopCartsendbutton);

            /*var toSave = { location: fields.location.id, myaircraft: fields.myaircraft.id, captain: fields.mycaptain.id, landing: helperFunc.dateToDB(fields.estimateArrival), description: fields.description, generated: false, items: angular.toJson($scope.checkService) };*/
            console.log(fields.toString());

            var toSave = '{ "location":"'+fields.location.id+'", "incomingloc":"'+fields.incomingloc.id+'",  "myaircraft":"'+fields.myaircraft.id+'", "captain":"'+fields.mycaptain.id+'", "landing":"'+helperFunc.dateToDB(fields.startdatePicker.dateFormated+" "+fields.time+":00", "YYYY-MM-DD HH:mm:ss", true)+'",  "returndate":"'+helperFunc.dateToDB(fields.enddatePicker.dateFormated+" "+fields.timeDeparture+":00", "YYYY-MM-DD HH:mm:ss", true)+'",  "description":"'+fields.description+'",  "generated":"false",  "items": '+ angular.toJson($scope.checkService) +'}';

            //var addToCart = shopcartResource.addItemCart({}, toSave);
            shopcartResource.addItemCart({}, toSave).$promise.
            then(
                function (data) {
                    console.log("cart: " + data.toString());
                    //$rootScope.cart = data;
                    $rootScope.cart = shopcartResource.getCartUser();
                    $scope.sms3 = $filter('translate')('cart.module.sms3');
                    LxNotificationService.info($scope.sms3, undefined, true);
                    self.shopCartLinearProgress = helperFunc.toogleStatus(self.shopCartLinearProgress);
                    self.shopCartsendbutton = helperFunc.toogleStatus(self.shopCartsendbutton);
                    $location.path("/dashboard");
                },function (data) {
                    console.log("Error!!" + data);
                    self.shopCartLinearProgress = helperFunc.toogleStatus(self.shopCartLinearProgress);
                    self.shopCartsendbutton = helperFunc.toogleStatus(self.shopCartsendbutton);
                }
            )
        };

        /****************** addShopCart ******************/


    }]);
/**
 * d by bboyvlad on 9/8/16.
 */
'use strict';

var checkpay = angular.module('CheckPay', ['ngRoute', 'ngMessages', 'angularPayments', 'ui.utils.masks']);

checkpay.controller('CheckPayController', ['$rootScope','$scope', '$http', '$location', 'LxDatePickerService', 'myJdMenu', 'helperFunc', 'LxNotificationService', 'LxDialogService', 'bankManageResource', 'userResource', 'userPaymentResource', '$translate', '$filter',
    function CheckPayController($rootScope, $scope, $http, $location, LxDatePickerService, myJdMenu, helperFunc, LxNotificationService, LxDialogService, bankManageResource, userResource, userPaymentResource, $translate, $filter ) {
        $scope.cssClass = 'checkpay';
        var self = this;
        $scope.sendbutton = false;
        $scope.LinearProgress = false;
        $scope.search = { mysearch:'' };
        $scope.listPaymentsRecieved = bankManageResource.showreceived();
        $scope.icon = '../css/icons/coin.png';

              /********** CheckPay ********/
        /*$scope.CheckPay = function CheckPay($event, fields) {
            $event.preventDefault();
            var self = this;

                $scope.LinearProgress = helperFunc.toogleStatus($scope.LinearProgress);
                $scope.sendbutton = helperFunc.toogleStatus($scope.sendbutton);

                var toSave = {paymethod: fields.paymethod.payid, bank: fields.bank.bankid, dcreate: helperFunc.dateToDB(fields.dcreate, "YYYY-MM-DD"), relatedref: fields.relatedref, amount: fields.amount };
                bankManageResource.sendpayment({}, toSave).$promise.
                then(
                    function (data) {
                        console.log("Saved!!" + data.toString());
                        LxNotificationService.alert('Payment Sent',
                            "Your Payment has been added successfully,\r\nour customer service will let you know\r\nonce is clear ...",
                            'Ok',
                            function(answer)
                            {
                                $scope.reset();
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                //$location.path("/dashboard");
                            });
                    },function (data) {
                        self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                        self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                        console.log("Error!!" + data);
                    }
                )
        };*/
        /********** CheckPay ********/

        /********** editPaymentsRecieved ********/

        $scope.dialogCheckpay = "dialogCheckpay";
        $scope.feditcheckpay = {};

        /***************** TO RESET EDIT FORMS ********************/
/*[{"id":4,"paymethod":65,"bank":2,"relatedref":"9876542","inspaymethod":0,"insbank":"GISBEL L BRANCHI
 A","insacctnum":"4989333873598794","insname":"BANK RIFEL","amount":65.88,"dcreate":1238472000000,"dupdate"
 :1478750400000,"approved":false}]*/

        $scope.reset = function(id) {
            $scope.editMaster = {
                id: id, paymethod: "", bank: "", relatedref: "", inspaymethod: "", insbank: "", insacctnum: "", insname: "", amount: "", dcreate: "", approved: "", famount: ""
            };
            $scope.feditcheckpay = angular.copy($scope.editMaster);
        };
        /***************** TO RESET FORMS ********************/
        //$scope.reset();

        $scope.openDialogNotifyPay = function openDialogNotifyPay(ef_cpay)
        {

            console.log(ef_cpay.id );
            /***************** TO RECALL DATA ON EDIT FORMS ********************/
            $scope.editmaster = {
                id: ef_cpay.id, paymethod: ef_cpay.paymethod, bank: ef_cpay.bank, relatedref: ef_cpay.relatedref, inspaymethod: ef_cpay.inspaymethod, insbank: ef_cpay.insbank, insacctnum: ef_cpay.insacctnum, insname: ef_cpay.insname, amount: ef_cpay.amount, dcreate: ef_cpay.dcreate, approved : ef_cpay.approved, famount: ef_cpay.famount
            };
            $scope.feditcheckpay = angular.copy($scope.editmaster);
            /***************** TO RECALL DATA ON EDIT FORMS ********************/
            LxDialogService.open(this.dialogCheckpay);

        };

        $scope.$on('lx-dialog__open-start', function(_event, _dialogId)
        {
            //var self = this;
            if ($scope.dialogCheckpay === _dialogId)
            {

            }
        });

        $scope.updatePaymentsRecieved = function updatePaymentsRecieved($event, fields) {
            $event.preventDefault();
            var self = this;

            console.log(fields.id+ ' / ' + fields);
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
            var toSave = {
                payment: fields.id , approved: fields.approved, famount: fields.famount
            }

            bankManageResource.checkpayment({}, toSave).$promise.
            then(
                function (data) {
                    console.log("Updated!!" + data);
                    $scope.sms1 = $filter('translate')('checkpayment.module.sms1');
                    LxNotificationService.success($scope.sms1);
                    $scope.listPaymentsRecieved = bankManageResource.showreceived();
                    $scope.reset();
                    //$location.path("/dashboard");
                    LxDialogService.close(self.dialogCheckpay);
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                },function (data) {
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    console.log("Error!!" + data);
                }
            );
        }

        /********** editPaymentsRecieved ********/

    }]);
/**
 * d by bboyvlad on 9/8/16.
 */
'use strict';

var deferedpay = angular.module('DeferedPay', ['ngRoute', 'ngMessages', 'angularPayments', 'ui.utils.masks']);

deferedpay.controller('DeferedPayController', ['$rootScope','$scope', '$filter', '$http', '$location', 'LxDatePickerService', 'myJdMenu', 'helperFunc', 'LxNotificationService', 'LxDialogService', 'serviceRequestResource', 'userResource', 'userPaymentResource', '$translate',
    function DeferedPayController($rootScope, $scope, $filter, $http, $location, LxDatePickerService, myJdMenu, helperFunc, LxNotificationService, LxDialogService, serviceRequestResource, userResource, userPaymentResource, $translate ) {
        $scope.cssClass = 'transitionView';
        var self = this;
        $scope.icon = '../css/icons/plane-flying.png';
        $scope.sendbutton = false;
        $scope.LinearProgress = false;
        $scope.search = { mysearch:'' };

        $scope.getDeferedList = function getDeferedList() {
            var deferedList = serviceRequestResource.userServicesRequestsPending();
            deferedList.$promise.then(
                function (data) {
                    $scope.items = $filter('orderBy')(data, "servicerequest");
                    $scope.listPaymentsDefered = $scope.items;
                }
            );
            var closedList = serviceRequestResource.ServicesRequestsFinalized();
            closedList.$promise.then(
                function (data) {
                    $scope.items = $filter('orderBy')(data, "servicerequest");
                    $scope.listPaymentsClosed = $scope.items;
                }
            );
        }
        $scope.getDeferedList();


        /*$scope.checkService = [];
        $scope.sync = function sync(bool, item, itemQuantity = false){
            //console.log(bool+"/item: "+item+"/itemQuantity: "+itemQuantity);
            if(bool){
                // add item
                $scope.checkService.push(item);
            } else {
                // remove item

                for(var i=0 ; i < $scope.checkService.length; i++) {
                    if($scope.checkService[i].itemid == item.itemid){
                        if(!itemQuantity){
                            $scope.checkService.splice(i,1);
                        }else{
                            $scope.checkService[i].quantity = itemQuantity;
                        }
                    }
                }
            }
        };*/

              /********** prepareTicket ********/
        /*$scope.prepareTicket = function prepareTicket($event, fields) {
            $event.preventDefault();
            var self = this;

                $scope.LinearProgress = helperFunc.toogleStatus($scope.LinearProgress);
                $scope.sendbutton = helperFunc.toogleStatus($scope.sendbutton);

            LxNotificationService.confirm('Create Ticket', 'Please confirm that your wish to create this ticket, THIS ACTION CAN NOT BE REVERSE!!!.',
                {
                    cancel: 'Cancel',
                    ok: 'Create Ticket'
                }, function(answer)
                {
                    if (answer)
                    {
                        LxDialogService.close(self.dialogDeferedpay);
                        var toSave = '{ "servicerequest":"'+fields.servicerequest+'", "items": '+ angular.toJson($scope.checkService) +'}';

                        var generateTicket = serviceRequestResource.generateTicket({}, toSave);
                        generateTicket.$promise.then(
                            function (data) {
                                console.log("Ticket created: " + data);
                                LxNotificationService.success('Ticket, Created successfully!!!');
                                $scope.getDeferedList();
                                //$scope.faircrafts = [];
                                //$location.path("/dashboard");
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                            },
                            function (data) {
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                console.log("Error!!" + data.toString());
                            }
                        );
                    }
                    else
                    {
                        LxNotificationService.error('Disagree');
                        self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                        self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    }
                });

        };*/


        /********** prepareTicket ********/

        /********** ReversePaymentsDefered ********/

        $scope.dialogDeferedpay = "dialogDeferedpay";
        $scope.feditdeferedpay = {};
        $scope.totalprice = 0;
        $scope.openDialogReverseTicket = function openDialogReverseTicket(ServReq)
        {
            console.log(ServReq.servicerequest );
            $scope.checkService = [];
            //$scope.prepareTicket(ServReq.servicerequest);
            serviceRequestResource.prepareTicket({servicerequest: ServReq.servicerequest}).$promise.
            then(
                function (data) {
                    console.log("Ticket:" + data.toString());
                    $scope.serviceTotalPrice = 0;
                    $scope.ticket = data;
                    angular.forEach($scope.ticket.items, function (value) {
                        if(value.checked==true){
                            $scope.sync(true, value);
                        }

                        //console.log("Value:" + value.toString());
                        $scope.serviceTotalPrice += value.totalprice;

                    });
                    LxDialogService.open($scope.dialogDeferedpay);
                },function (data) {
                    /*self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);*/
                    console.log("Error!!" + data);
                }
            );
            /***************** TO RECALL DATA ON EDIT FORMS ********************/
            /*$scope.editmaster = {
                id: ServReq.id, paymethod: ServReq.paymethod, bank: ServReq.bank, relatedref: ServReq.relatedref, inspaymethod: ServReq.inspaymethod, insbank: ServReq.insbank, insacctnum: ServReq.insacctnum, insname: ServReq.insname, amount: ServReq.amount, dcreate: ServReq.dcreate, approved : ServReq.approved
            };
            $scope.feditdeferedpay = angular.copy($scope.editmaster);
            /!***************** TO RECALL DATA ON EDIT FORMS ********************!/*/


        }

        $scope.$on('lx-dialog__open-start', function(_event, _dialogId)
        {
            //var self = this;
            if ($scope.dialogDeferedpay === _dialogId)
            {

            }
        });

        $scope.reversePaymentsDefered = function reversePaymentsDefered($event, data) {
            $event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
            console.log(data.toString());
            $scope.sms1 = $filter('translate')('defered.module.sms1');
            $scope.sms2 = $filter('translate')('defered.module.sms2');
            $scope.btn1 = $filter('translate')('defered.module.btn1');
            $scope.btn2 = $filter('translate')('defered.module.btn2');
            LxNotificationService.confirm($scope.sms1, $scope.sms2,
                {
                    cancel: $scope.btn1,
                    ok: $scope.btn2
                }, function(answer)
                {
                    if (answer)
                    {
                        serviceRequestResource.reverseServicesRequests({servicerequest: data.servicerequest}).$promise.
                        then(
                            function (data) {
                                console.log("Reversed!!" + data);
                                $scope.sms3 = $filter('translate')('defered.module.sms3');
                                LxNotificationService.success($scope.sms3);
                                $scope.getDeferedList();
                                //$scope.faircrafts = [];
                                //$location.path("/dashboard");
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                LxDialogService.close($scope.dialogDeferedpay);
                            },function (data) {
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                console.log("Error!!" + data.toString());
                            }
                        );
                    }
                    else
                    {
                        LxNotificationService.error('Disagree');
                        self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                        self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    }
                });

        };

        /********** ReversePaymentsDefered ********/


    }]);
/**
 * Created by bboyvlad on 9/8/16.
 */
'use strict';

var addgiftcard = angular.module('AddGiftJdCard', ['ngRoute', 'ngMessages', 'ui.utils.masks', 'angularPayments']);

addgiftcard.controller('AddGiftJdCardController', ['$rootScope','$scope', '$http', '$location', 'myJdMenu', 'helperFunc', 'LxNotificationService', 'giftCardResource', 'userPaymentResource', '$translate', '$filter',
    function AddJdCardController($rootScope, $scope, $http, $location, myJdMenu, helperFunc, LxNotificationService, giftCardResource, userPaymentResource, $translate, $filter) {
        $scope.cssClass = 'addgiftcard';
        $scope.icon = '../css/icons/wallet-giftcard.png';

        var self = this;
        $scope.sendbutton = false;
        $scope.LinearProgress = false;

        $scope.fgiftcard = {};
        $scope.regex = "[A-Z\\s]+";

        $scope.paymethod = [];
        $scope.jdcardOpts = [];

        /***************** TO RESET FORMS ********************/
        $scope.master = {
            switches: "false", idpaymethod: "", paycardsec: "", tdcamount: "", jdcardmethod: "", jdcamount: "", recipient_email: "", recipient_name: "", recipient_message: "" };
            $scope.reset = function() {
            $scope.fgiftcard = angular.copy($scope.master);
        };
        $scope.reset();
        /***************** TO RESET FORMS ********************/

        $scope.getPayments = function getPayments(id) {
            var self = this;

            userPaymentResource.get({id: id}).$promise.
                then(
                    function (data) {
                        /*$scope.paymethod = response.data;*/
                        angular.forEach(data, function (key) {
                            //alert(key.paytype +':'+val);
                            if(key.paytype=="JDCARD"){
                                self.jdcardOpts.push(key);
                            }else{
                                self.paymethod.push(key);
                            }
                        });
                    }
            )
        };

        //alert($rootScope.user.id);
        $scope.getPayments($rootScope.userDetail.id);

        $scope.addGiftCard = function addGiftCard($event, fields) {
            $event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
            console.log(fields.toString());
            if(fields.switches=="false"){

                var toSave = '{ ' +
                '"recipient_email":"'+fields.recipient_email+'", ' +
                '"recipient_message":"'+fields.recipient_message+'", ' +
                '"recipient_name":"'+fields.recipient_name+'", ' +
                '"paymethod":"'+ fields.idpaymethod.payid +'", ' +
                '"amount":'+fields.tdcamount +', ' +
                '"paycardsec":"'+fields.paycardsec +'" ' +
                '}';
            }else{
                var toSave = '{ ' +
                '"recipient_email":"'+fields.recipient_email+'", ' +
                '"recipient_message":"'+fields.recipient_message+'", ' +
                '"recipient_name":"'+fields.recipient_name+'", ' +
                '"paymethod":"'+ fields.jdcardmethod.payid+'", ' +
                '"amount":'+fields.jdcamount+
                '}';
            }

            console.log(toSave.toString());
            var buyGiftCard = giftCardResource.save({}, toSave);
            buyGiftCard.$promise.
            then(
                function (data) {
                    console.log("Saved!!" + data);
                    if (data.message == "conexionError"){
                        $scope.sms1 = $filter('translate')('giftcard.add.module.sms1');
                        LxNotificationService.error($scope.sms1);
                        self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                        self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                        //self.helperFuncBar();
                        return;
                    }else if(data.message == "Saldo insuficiente"){
                        $scope.sms2 = $filter('translate')('giftcard.add.module.sms2');
                        LxNotificationService.error($scope.sms2);
                        self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                        self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                        //self.helperFuncBar();
                        return;
                    }

                    $scope.sms3 = $filter('translate')('giftcard.add.module.sms3');
                    $scope.sms4 = $filter('translate')('giftcard.add.module.sms4');
                    LxNotificationService.alert($scope.sms3,
                        $scope.sms4,
                        'Ok',
                        function(answer)
                        {
                            $scope.reset();
                            self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                            self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                            $location.path("/dashboard");
                        });

                },function (data) {
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    console.log("Saved!!" + data);
                }
            )
        }


    }]);
/**
 * Created by bboyvlad on 9/8/16.
 */
'use strict';

var redeemgiftcard = angular.module('RedeemGiftJdCard', ['ngRoute', 'ngMessages', 'ui.utils.masks']);

redeemgiftcard.controller('RedeemGiftJdCardController', ['$rootScope','$scope', '$http', '$location', 'myJdMenu', 'helperFunc', 'LxNotificationService', 'giftCardResource', 'userPaymentResource', '$translate', '$filter',
    function AddJdCardController($rootScope, $scope, $http, $location, myJdMenu, helperFunc, LxNotificationService, giftCardResource, userPaymentResource, $translate, $filter) {
        $scope.cssClass = 'redeemgiftcard';
        $scope.icon = '../css/icons/wallet-giftcard.png';

        var self = this;
        $scope.sendbutton = false;
        $scope.LinearProgress = false;
        $scope.fredeemcard = {};
        /***************** TO RESET FORMS ********************/
        $scope.master = {
            jdcard: "", claimcode: ""
        };
        $scope.reset = function() {
            $scope.fredeemcard = angular.copy($scope.master);
        };
        /***************** TO RESET FORMS ********************/
        //$scope.reset();

        //$scope.paymethod = [];
        $scope.jdcardOpts = [];
        $scope.getPayments = function getPayments(id) {
            var self = this;

            userPaymentResource.get({id: id}).$promise.
                then(
                    function (data) {
                        /*$scope.paymethod = response.data;*/
                        angular.forEach(data, function (key) {
                            //alert(key.paytype +':'+val);
                            if(key.paytype=="JDCARD"){
                                self.jdcardOpts.push(key);
                            }/*else{
                                self.paymethod.push(key);
                            }*/
                        });
                    }
            )
        };

        //alert($rootScope.user.id);
        $scope.getPayments($rootScope.user.id);

        $scope.redeemGiftCard = function redeemGiftCard($event, fields) {
            $event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
            console.log(fields.toString());
            var toSave = '{ ' +
                '"jdcard":"'+fields.jdcard.payid+'", ' +
                '"claimcode":"'+fields.claimcode+'" ' +
                '}';

            console.log(toSave.toString());
            var redeemGiftCard = giftCardResource.redeem({}, toSave);
            redeemGiftCard.$promise.
            then(
                function (data) {
                    console.log("Saved!!" + data);
                    if (data.message == "conexionError"){
                        $scope.sms1 = $filter('translate')('giftcard.redeem.module.sms1');
                        LxNotificationService.error($scope.sms1);
                        self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                        self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                        //self.helperFuncBar();
                        return;
                    }
                    $scope.sms2 = $filter('translate')('giftcard.redeem.module.sms2');
                    $scope.sms3 = $filter('translate')('giftcard.redeem.module.sms3');
                    LxNotificationService.alert($scope.sms2,
                        $scope.sms3,
                        'Ok',
                        function(answer)
                        {
                            $scope.reset();
                            self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                            self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                            $location.path("/dashboard");
                        });

                },function (data) {
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    console.log("Saved!!" + data);
                }
            )
        };

    }]);
/**
 * Created by bboyvlad on 9/8/16.
 */
'use strict';

var paymethod = angular.module('PayMethod', ['ngRoute', 'ngMessages', 'angularPayments']);

paymethod.controller('PayMethodController', ['$rootScope','$scope', '$http', '$location', 'LxDatePickerService', 'myJdMenu', 'helperFunc', 'LxNotificationService', 'LxDialogService', 'userPaymentResource', 'userResource', 'cardPaymentResource','$translate', '$filter',
    function PayMethodController($rootScope, $scope, $http, $location, $LxDatePickerService, myJdMenu, helperFunc, LxNotificationService, LxDialogService, userPaymentResource, userResource, cardPaymentResource, $translate, $filter) {
        $scope.cssClass = 'paymethod';
        var self = this;
        $scope.sendbutton = false;
        $scope.LinearProgress = false;
        $scope.search = { mysearch:'' };
        $scope.faddpaym = {};
        $scope.icon = '../css/icons/bank.png';


        /***************** COORDINATE CARD ********************/
        $scope.userDetail = userResource.detailUser().$promise
        .then(
            function (data) {
                if(data.coordinates==null || data.coordinates.id==""){
                    //console.log(data.coordinates.id + " / " + data.coordinates.active);
                    $scope.sms1 = $filter('translate')('paymethod.module.sms1');
                    $scope.sms2 = $filter('translate')('paymethod.module.sms2');
                    LxNotificationService.confirm($scope.sms1, $scope.sms2,
                        {
                            cancel: 'Cancel',
                            ok: 'Create'
                        }, function(answer)
                        {
                            if (answer)
                            {
                                window.open('http://jdoilfield.net:8080/users/setcoordinates', '_blank');
                                $scope.sms3 = $filter('translate')('paymethod.module.sms3');
                                LxNotificationService.success($scope.sms3);
                            }
                            else
                            {
                                LxNotificationService.error('Operation Canceled');
                            }
                        });
                }else if(data.coordinates.active==false){
                    $scope.sms4 = $filter('translate')('paymethod.module.sms4');
                    LxNotificationService.info($scope.sms4);
                }
            }
        );

        var randomString = function(type) {
            if(type==true){
                var text = "";
                var possible = "ABCDE";
                for(var i = 0; i < 1; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }else{

                var text = "";
                var possible = "12345";
                for(var i = 0; i < 1; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }
        }
        /*************  ASKING FOR CORDINATES **************/
        $scope.dialogCoordinates = "dialogCoordinates";
        $scope.openDialogCoordinates = function openDialogCoordinates()
        {
            LxDialogService.open(this.dialogCoordinates);

        }

        $scope.$on('lx-dialog__open-start', function(_event, _dialogId)
        {
            //var self = this;
            if ($scope.dialogCoordinates === _dialogId)
            {
                $scope.coord1 = {
                    key: randomString(true) + randomString(false)
                };
                $scope.coord2 = {
                    key: randomString(true) + randomString(false)
                };

            }
        });

        //console.log($scope.userDetail.toString());
        /***************** COORDINATE CARD ********************/

        /***************** TO RESET FORMS ********************/
        $scope.master = {
            paytype: "", payacctnum: "", paycardname: "", payvalid: null /*, paystatus: ""*/
        };
        $scope.reset = function() {
            $scope.faddpaym = angular.copy($scope.master);
            $scope.feditpaym = angular.copy($scope.master);
        };
        /***************** TO RESET FORMS ********************/
        //$scope.reset();

        $scope.regex = "[A-Z\\s]+";
        $scope.methodOpts = [
            {
                key: "CARD",
                name: "CARD"
            }
        ];

        $scope.datePicker = {
            input:
            {
                date: new Date(),
                dateFormated: moment().locale('es').format('LL')
            }
        };


        /********** addpayMethod ********/
        $scope.payMethodCreate = function payMethodCreate($event, fields, id) {
            $event.preventDefault();
            var self = this;

            var coordinates = '{"crdOne":"'+$scope.coord1.key+'","valOne":"'+$scope.coord1.val+'","crdTwo":"'+$scope.coord2.key+'","valTwo":"'+$scope.coord2.val+'"}';
            userResource.checkCoordinates({}, coordinates).$promise.then(
                function (data) {
                    //console.log(data.toString());
                    if(data.message=="Autorized"){
                        LxDialogService.close($scope.dialogCoordinates);
                        $scope.LinearProgress = helperFunc.toogleStatus($scope.LinearProgress);
                        $scope.sendbutton = helperFunc.toogleStatus($scope.sendbutton);

                        var toSave = { paytype:fields.paytype.key, payacctnum:fields.payacctnum, paycardname:fields.paycardname, payvalid:helperFunc.dateToDB(fields.payvalid, "MM/YYYY", false), paystatus:"ACTIVE", paycardtype:fields.type };

                        userPaymentResource.save({id: $rootScope.user.id}, toSave).$promise.
                        then(
                            function (data) {
                                if(angular.isDefined(data.message) && data.message=="Unknown SMTP host: smtp.gmail.com"){
                                    $scope.sms5 = $filter('translate')('paymethod.module.sms5');
                                    LxNotificationService.error($scope.sms5);
                                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                    return;
                                }
                                //console.log("Saved!!" + data.toString());
                                $scope.sms6 = $filter('translate')('paymethod.module.sms6');
                                $scope.sms7 = $filter('translate')('paymethod.module.sms7');
                                LxNotificationService.alert($scope.sms6,
                                    $scope.sms7,
                                    'Ok',
                                    function(answer)
                                    {
                                        $scope.reset();
                                        $scope.LinearProgress = helperFunc.toogleStatus($scope.LinearProgress);
                                        $scope.sendbutton = helperFunc.toogleStatus($scope.sendbutton);
                                        $location.path("/dashboard");
                                    });
                            },function (data) {
                                $scope.LinearProgress = helperFunc.toogleStatus($scope.LinearProgress);
                                $scope.sendbutton = helperFunc.toogleStatus($scope.sendbutton);
                                console.log("Error!!" + data.toString());
                            }
                        )

                    }else if(data.message=="Unautorized"){
                        //window.alert(" Invalid Data!!! ");
                        $scope.sms8 = $filter('translate')('paymethod.module.sms8');
                        LxNotificationService.error($scope.sms8);
                    }else if(data.message=="Coordinate card inactive"){
                        $scope.sms9 = $filter('translate')('paymethod.module.sms9');
                        LxNotificationService.error($scope.sms9);
                        //window.alert(" You haven't activated your card yet!!! ");
                    }
                }
            );


            /**/
        }
        /********** addpayMethod ********/

        /********** editpayMethod ********/
        $scope.listPayMethod = userPaymentResource.get();

        $scope.dialogPayMethod = "dialogPayMethod";
        $scope.feditpaym = {};

        /***************** TO RESET EDIT FORMS ********************/


        $scope.editReset = function(payid) {
            $scope.editMaster = {
                payid: payid, paytype: "", payacctnum: "", paycardname: "", payvalid: null/*, paystatus: ""*/
            };
            $scope.feditpaym = angular.copy($scope.editMaster);
        };
        /***************** TO RESET FORMS ********************/
        //$scope.reset();

        $scope.openDialogPayMethod = function openDialogPayMethod(ef_paym)
        {
            LxDialogService.open(this.dialogPayMethod);
            //console.log(ef_paym.payid );
            /***************** TO RECALL DATA ON EDIT FORMS ********************/
            $scope.editmaster = {
                payid: ef_paym.payid, paytype: { key: ef_paym.paytype, name: ef_paym.paytype }, payacctnum: ef_paym.payacctnum, paycardname: ef_paym.paycardname, payvalid: helperFunc.dateFromDB(ef_paym.payvalid, "MM/YYYY"), type:ef_paym.type
            };
            $scope.feditpaym = angular.copy($scope.editmaster);
            /***************** TO RECALL DATA ON EDIT FORMS ********************/

        }

        $scope.$on('lx-dialog__open-start', function(_event, _dialogId)
        {
            //var self = this;
            if ($scope.dialogPayMethod === _dialogId)
            {

            }
        });

        $scope.updatePayMethod = function updatepayMethod($event, fields) {
            $event.preventDefault();
            var self = this;

            //console.log(fields.payid+ ' / ' + fields);
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);

            var toSave = {
                payid: fields.payid, paytype: fields.paytype.key, payacctnum: fields.payacctnum, paycardname: fields.paycardname, payvalid: helperFunc.dateToDB(fields.payvalid, "MM/YYYY", false), paycardtype:fields.type, paystatus: 'ACTIVE'
            };

            userPaymentResource.update({}, toSave).$promise.
            then(
                function (data) {
                    //console.log("Updated!!" + data);
                    $scope.sms10 = $filter('translate')('paymethod.module.sms10');
                    LxNotificationService.success($scope.sms10);
                    $scope.listPayMethod = userPaymentResource.get();
                    $scope.reset();
                    //$location.path("/dashboard");
                    LxDialogService.close(self.dialogPayMethod);
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                },function (data) {
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    console.log("Error!!" + data.toString());
                }
            );
        }

        /********** editpayMethod ********/

        /********** deletePayMethod ********/

        $scope.deletePayMethod = function deletePayMethod(data) {
            //$event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
            //console.log(data.toString());
            $scope.sms11 = $filter('translate')('paymethod.module.sms11');
            $scope.sms12 = $filter('translate')('paymethod.module.sms12');
            $scope.sms13 = $filter('translate')('paymethod.module.sms13');
            $scope.sms14 = $filter('translate')('paymethod.module.sms14');
            LxNotificationService.confirm($scope.sms11, $scope.sms12,
                {
                    cancel: $scope.sms13,
                    ok: $scope.sms14
                }, function(answer)
                {
                    if (answer)
                    {
                        userPaymentResource.delete({paymethod: data.payid}).$promise.
                        then(
                            function (data) {
                                //console.log("Erased!!" + data);
                                $scope.sms15 = $filter('translate')('paymethod.module.sms15');
                                LxNotificationService.success($scope.sms15);
                                $scope.listPayMethod = userPaymentResource.get();
                                //$scope.faircrafts = [];
                                //$location.path("/dashboard");
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                            },function (data) {
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                console.log("Error!!" + data.toString());
                            }
                        );
                    }
                    else
                    {
                        $scope.sms16 = $filter('translate')('paymethod.module.sms16');
                        LxNotificationService.error($scope.sms16);
                        this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
                        this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
                    }
                });

        }
        /********** deletePayMethod ********/


    }]);
/**
 * Created by bboyvlad on 9/8/16.
 */
'use strict';

var notifypay = angular.module('NotifyPay', ['ngRoute', 'ngMessages', 'angularPayments', 'ui.utils.masks']);

notifypay.controller('NotifyPayController', ['$rootScope','$scope', '$http', '$location', 'LxDatePickerService', 'myJdMenu', 'helperFunc', 'LxNotificationService', 'LxDialogService', 'bankManageResource', 'userResource', 'userPaymentResource', '$translate', '$filter',
    function NotifyPayController($rootScope, $scope, $http, $location, LxDatePickerService, myJdMenu, helperFunc, LxNotificationService, LxDialogService, bankManageResource, userResource, userPaymentResource, $translate, $filter ) {
        $scope.cssClass = 'notifypay';
        var self = this;
        $scope.sendbutton = false;
        $scope.LinearProgress = false;
        $scope.search = { mysearch:'' };
        $scope.regex = "[0-9]+";

        $scope.jdcardOpts = [];
        $scope.getPayments = function getPayments() {
            var self = this;

            userPaymentResource.get().$promise.
            then(
                function (data) {
                    /*$scope.paymethod = response.data;*/
                    angular.forEach(data, function (key) {
                        //alert(key.paytype +':'+val);
                        if(key.paytype=="JDCARD"){
                            $scope.jdcardOpts.push(key);
                        }/*else{
                         self.paymethod.push(key);
                         }*/
                    });
                }
            )
        };
        $scope.getPayments();

        $scope.bankOpts = bankManageResource.query();

        /****************** DATEPICKER *********************/
        $scope.datePickerId = 'dcreate';
        $scope.fnotifypay = {
            datePicker: { dateFormated: null, locale: 'es', format: 'YYYY-MM-DD' }
        };
        $scope.icon = '../css/icons/coin.png';

        $scope.datePickerCallback = function datePickerCallback(_newdate, action )
        {
            if(action=="add"){
                $scope.fnotifypay.datePicker.dateFormated = moment(_newdate).locale($scope.fnotifypay.datePicker.locale).format($scope.fnotifypay.datePicker.format);
            }else if(action=="update"){
                $scope.feditnotifypay.datePicker.dateFormated = moment(_newdate).locale($scope.feditnotifypay.datePicker.locale).format($scope.feditnotifypay.datePicker.format);
            }
            LxDatePickerService.close($scope.datePickerId);
        };
        /****************** DATEPICKER *********************/


        /***************** COORDINATE CARD ********************/
        /*$scope.userDetail = userResource.detailUser().$promise
        .then(
            function (data) {
                if(data.coordinates==null || data.coordinates.id==""){
                    //console.log(data.coordinates.id + " / " + data.coordinates.active);
                    LxNotificationService.confirm('Coordinte Card', 'To add an bank account you must generate a coordinate card.',
                        {
                            cancel: 'Cancel',
                            ok: 'Create'
                        }, function(answer)
                        {
                            if (answer)
                            {
                                window.open('http://jdoilfield.net:8080/users/setcoordinates', '_blank');

                                LxNotificationService.success('Card created successfully !!!.. you\'ll find in your email the instrucction for its activation ');
                            }
                            else
                            {
                                LxNotificationService.error('The operation has been canceled');
                            }
                        });
                }else if(data.coordinates.active==false){
                    LxNotificationService.info('You already have a coordinate card, but you need to complete the activation process... check your email and follow the instructions to activated or create a new one from the user menu!...');
                }
            }
        );

        var randomString = function(type) {
            if(type==true){
                var text = "";
                var possible = "ABCDE";
                for(var i = 0; i < 1; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }else{

                var text = "";
                var possible = "12345";
                for(var i = 0; i < 1; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }
        }*/
        /*************  ASKING FOR CORDINATES **************/
        /*$scope.dialogCoordinates = "dialogCoordinates";
        $scope.openDialogCoordinates = function openDialogCoordinates()
        {
            LxDialogService.open(this.dialogCoordinates);

        }

        $scope.$on('lx-dialog__open-start', function(_event, _dialogId)
        {
            //var self = this;
            if ($scope.dialogCoordinates === _dialogId)
            {
                $scope.coord1 = {
                    key: randomString(true) + randomString(false)
                };
                $scope.coord2 = {
                    key: randomString(true) + randomString(false)
                };

            }
        });

        //console.log($scope.userDetail.toString());*/
        /***************** COORDINATE CARD ********************/

        /***************** TO RESET FORMS ********************/
        $scope.master = {
            paymethod: "", bank: "", insname: "", dcreate: "", relatedref: "", amount: "", datePicker: { dateFormated: moment(new Date()).locale('es').format('YYYY-MM-DD'), locale: 'es', format: 'YYYY-MM-DD' }
        };
        $scope.reset = function() {
            $scope.fnotifypay = angular.copy($scope.master);
        };
        /***************** TO RESET FORMS ********************/
        //$scope.reset();

              /********** addNotifyPay ********/
        $scope.NotifyPayCreate = function NotifyPayCreate($event, fields) {
            $event.preventDefault();
            var self = this;

            $scope.LinearProgress = helperFunc.toogleStatus($scope.LinearProgress);
            $scope.sendbutton = helperFunc.toogleStatus($scope.sendbutton);

            var toSave = {paymethod: fields.paymethod.payid, bank: fields.bank.bankid, insname: fields.bank.bankname, dcreate: helperFunc.dateToDB(fields.dcreate, "YYYY-MM-DD", false), relatedref: fields.relatedref, amount: fields.amount };
            bankManageResource.sendpayment({}, toSave).$promise.
            then(
                function (data) {
                    console.log("Saved!!" + data.toString());
                    $scope.sms1 = $filter('translate')('notifypay.module.sms1');
                    $scope.sms2 = $filter('translate')('notifypay.module.sms2');
                    LxNotificationService.alert($scope.sms1,
                        $scope.sms2,
                        'Ok',
                        function(answer)
                        {
                            $scope.reset();
                            $scope.LinearProgress = helperFunc.toogleStatus($scope.LinearProgress);
                            $scope.sendbutton = helperFunc.toogleStatus($scope.sendbutton);
                            //$location.path("/dashboard");
                        });
                },function (data) {
                    $scope.LinearProgress = helperFunc.toogleStatus($scope.LinearProgress);
                    $scope.sendbutton = helperFunc.toogleStatus($scope.sendbutton);
                    console.log("Error!!" + data);
                }
            );

            /*var coordinates = '{"crdOne":"'+$scope.coord1.key+'","valOne":"'+$scope.coord1.val+'","crdTwo":"'+$scope.coord2.key+'","valTwo":"'+$scope.coord2.val+'"}';
            userResource.checkCoordinates({}, coordinates).$promise.then(
                function (data) {
                    console.log(data.toString());
                    if(data.message=="Autorized"){
                        LxDialogService.close($scope.dialogCoordinates);


                    }else if(data.message=="Unautorized"){
                        //window.alert(" Invalid Data!!! ");
                        LxNotificationService.error('Invalid Data!!!');
                    }else if(data.message=="Coordinate card inactive"){
                        LxNotificationService.error('You haven\'t activated your card yet!!!');
                        //window.alert(" You haven't activated your card yet!!! ");
                    }
                }
            );*/


            /**/
        };
        /********** addNotifyPay ********/

        /********** editNotifyPay ********/
        /*$scope.listNotifyPay = bankManageResource.query();

        $scope.dialogNotifyPay = "dialogNotifyPay";
        $scope.feditnotifypay = {};

        /!***************** TO RESET EDIT FORMS ********************!/


        $scope.editReset = function(id) {
            $scope.editMaster = {
                id: bankid, bankname: "", bankacctnum: "", dcreate: new Date(), datePicker: { dateFormated: new Date(), locale: 'es', format: 'YYYY-MM-DD' }, notes: "", enabled: ""
            };
            $scope.feditnotifypay = angular.copy($scope.editMaster);
        };
        /!***************** TO RESET FORMS ********************!/
        //$scope.reset();

        $scope.openDialogNotifyPay = function openDialogNotifyPay(ef_notifypay)
        {
            LxDialogService.open(this.dialogNotifyPay);
            //console.log(ef_notifypay.payid );
            /!***************** TO RECALL DATA ON EDIT FORMS ********************!/
            $scope.editmaster = {
                id: ef_notifypay.bankid, bankname: ef_notifypay.bankname, bankacctnum: ef_notifypay.bankacctnum, dcreate: ef_notifypay.dcreate,  datePicker: { dateFormated: helperFunc.dateFromDB(ef_notifypay.dcreate, "YYYY-MM-DD"), locale: 'es', format: 'YYYY-MM-DD' } , notes: ef_notifypay.notes, enabled: ef_notifypay.enabled
            };
            $scope.feditnotifypay = angular.copy($scope.editmaster);
            /!***************** TO RECALL DATA ON EDIT FORMS ********************!/

        }

        $scope.$on('lx-dialog__open-start', function(_event, _dialogId)
        {
            //var self = this;
            if ($scope.dialogNotifyPay === _dialogId)
            {

            }
        });

        $scope.updateNotifyPay = function updateNotifyPay($event, fields) {
            $event.preventDefault();
            var self = this;

            console.log(fields.id+ ' / ' + fields.toString());
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);

            var toSave = {
                id: fields.bankid, bankname: fields.bankname, bankacctnum: fields.bankacctnum, dcreate: fields.dcreate,  datePicker: { dateFormated: helperFunc.dateToDB(fields.dcreate, "YYYY-MM-DD"), locale: 'es', format: 'YYYY-MM-DD' } , notes: fields.notes, enabled: fields.enabled
            };

            bankManageResource.update({id: fields.id}, toSave).$promise.
            then(
                function (data) {
                    console.log("Updated!!" + data);
                    LxNotificationService.success('Update successful!!!');
                    $scope.listNotifyPay = bankManageResource.query();
                    $scope.reset();
                    //$location.path("/dashboard");
                    LxDialogService.close(self.dialogNotifyPay);
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                },function (data) {
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    console.log("Error!!" + data);
                }
            );
        }*/

        /********** editNotifyPay ********/

        /********** deleteNotifyPay ********/

        /*$scope.deleteNotifyPay = function deleteNotifyPay(data) {
            //$event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
            console.log(data.toString());
            LxNotificationService.confirm('Delete bank account', 'Please confirm to delete this bank account .',
                {
                    cancel: 'Cancel',
                    ok: 'Delete'
                }, function(answer)
                {
                    if (answer)
                    {
                        bankManageResource.delete({id: data.bankid}).$promise.
                        then(
                            function (data) {
                                console.log("Deleted!!" + data);
                                LxNotificationService.success('Bank account, Deleted successfully!!!');
                                $scope.listNotifyPay = bankManageResource.query();
                                //$location.path("/dashboard");
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                            },function (data) {
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                console.log("Error!!" + data.toString());
                            }
                        );
                    }
                    else
                    {
                        LxNotificationService.error('Disagree');
                        this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
                        this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
                    }
                });

        }*/
        /********** deleteNotifyPay ********/

    }]);
/**
 * Created by bboyvlad on 9/8/16.
 */
'use strict';

var addjdcard = angular.module('AddJdCard', ['ngRoute', 'ngMessages', 'ui.utils.masks', 'angularPayments']);

addjdcard.controller('AddJdCardController', ['$rootScope','$scope', '$http', '$location', 'myJdMenu', 'helperFunc', 'LxNotificationService', 'jdCardResource', 'userPaymentResource', '$translate', '$filter',
    function AddJdCardController($rootScope, $scope, $http, $location, myJdMenu, helperFunc, LxNotificationService, jdCardResource, userPaymentResource, $translate, $filter) {
        $scope.cssClass = 'addjdcard';
        var self = this;
        $scope.sendbutton = false;
        $scope.LinearProgress = false;
        $scope.icon = '../css/icons/two-credit-cards.png';



        /***************** TO RESET FORMS ********************/
        $scope.master = {
            idpaymethod: "", pay_ccsec: "", cardname: "", amount: ""
        };
        $scope.reset = function() {
            $scope.fjdcard = angular.copy($scope.master);
        };
        /***************** TO RESET FORMS ********************/
        $scope.reset();

        $scope.regex = "[A-Z\\s]+";

        $scope.paymethod = [];
        $scope.getPayments = function getPayments(id) {
            var self = this;

            userPaymentResource.get({id: id}).$promise.
                then(
                    function (data) {
                        /*$scope.paymethod = response.data;*/
                        angular.forEach(data, function (key) {
                            //alert(key.pay_type +':'+val);
                            if(key.paytype=="JDCARD"){
                                //self.jdcardOpts.push(key);
                            }else{
                                self.paymethod.push(key);
                            }
                        });
                    }
            )
        };

        $scope.getPayments($rootScope.user.id);

        $scope.addjdCard = function addjdCard($event, fields) {
            $event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);

            var toSave = '{"idpaymethod":"'+fields.idpaymethod.payid+'","pay_ccsec":"'+fields.pay_ccsec+'","cardname":"'+fields.cardname+'","amount":"'+fields.amount+'"}';

            var buyJdCard = jdCardResource.save({id: $rootScope.user.id}, toSave);
            buyJdCard.$promise.
            then(
                function (data) {
                    console.log("Saved!!" + data.toString());
                    if (data.message == "conexionError"){
                        $scope.sms1 = $filter('translate')('jdcard.add.module.sms1');
                        LxNotificationService.error($scope.sms1);
                        self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                        self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                        //self.helperFuncBar();
                        return;
                    }
                    if (data.message == "Invalid Card"){
                        $scope.sms2 = $filter('translate')('jdcard.add.module.sms2');
                        LxNotificationService.error($scope.sms2);
                        self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                        self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                        //self.helperFuncBar();
                        return;
                    }

                    $scope.sms3 = $filter('translate')('jdcard.add.module.sms3');
                    $scope.sms4 = $filter('translate')('jdcard.add.module.sms4');
                    LxNotificationService.alert("J&D Card "+$scope.sms3,
                        $scope.sms4+" J&D Card!",
                        'Ok',
                        function(answer)
                        {
                            $scope.reset();
                            self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                            self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                            $location.path("/dashboard");
                        });

                },function (data) {
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    console.log("Saved!!" + data);
                }
            )
        }


    }]);
/**
 * Created by bboyvlad on 9/8/16.
 */
'use strict';

var refilljdcard = angular.module('reFillJdCard', ['ngRoute', 'ui.utils.masks', 'angularPayments']);

refilljdcard.controller('RefillJdCardController', ['$rootScope','$scope', '$http', '$location', 'myJdMenu', 'LxNotificationService', 'helperFunc','jdCardResource', 'userPaymentResource', 'cardPaymentResource', '$translate', '$filter',
    function AddJdCardController($rootScope, $scope, $http, $location, myJdMenu, LxNotificationService, helperFunc, jdCardResource, userPaymentResource, cardPaymentResource, $translate, $filter ) {
        $scope.cssClass = 'refilljdcard';
        var self = this;
        $scope.sendbutton = false;
        $scope.LinearProgress = false;
        $scope.icon = '../css/icons/two-credit-cards.png';

        $scope.frfilljdcard = {};
        /***************** TO RESET FORMS ********************/
        $scope.master = {
            jdcardSelected:"", idpaymethod:"", pay_ccsec:"", amount:"",
        };
        $scope.reset = function() {
            $scope.frfilljdcard = angular.copy($scope.master);
        };
        /***************** TO RESET FORMS ********************/
        //$scope.reset();

        $scope.paymethod = [];
        $scope.jdcardOpts = [];
        $scope.getPayments = function getPayments(id) {
            var self = this;

            userPaymentResource.get({id: id}).$promise.
            then(
                function (data) {
                    /*$scope.paymethod = response.data;*/
                    angular.forEach(data, function (key) {
                        //alert(key.paytype +':'+val);
                        if(key.paytype=="JDCARD"){
                            self.jdcardOpts.push(key);
                        }else{
                            self.paymethod.push(key);
                        }
                    });
                }
            )
        };

        $scope.getPayments($rootScope.user.id);

        $scope.refilljdCard = function refilljdCard($event, fields) {
            $event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);

            //console.log(fields);
            var toSave = '{"idpaymethod":"'+fields.idpaymethod.payid+'","pay_ccsec":"'+fields.pay_ccsec+'","amount":"'+fields.amount+'"}';

            cardPaymentResource.refill({card_id: fields.jdcardSelected.payid}, toSave).$promise.
            then(
                function (data) {
                    console.log("Saved!!" + data);
                    if (data.message == "conexionError"){
                        $scope.sms1 = $filter('translate')('jdcard.refill.module.sms1');
                        LxNotificationService.error($scope.sms1);
                        self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                        self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                        //self.helperFuncBar();
                        return;
                    }

                    $scope.sms2 = $filter('translate')('jdcard.refill.module.sms2');
                    $scope.sms3 = $filter('translate')('jdcard.refill.module.sms3', fields);
                    LxNotificationService.alert("J&D Card "+$scope.sms2,
                        $scope.sms3+" J&D Card",
                        'Ok',
                        function(answer)
                        {
                            $scope.reset();
                            self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                            self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                            $location.path("/dashboard");
                        });

                },function (data) {
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    console.log("error!!" + data);
                }
            )
        }


    }]);
/**
 * Created by bboyvlad on 9/8/16.
 */
'use strict';

var addproduct = angular.module('AddProduct', ['ngRoute', 'ngMessages', 'ui.utils.masks']);

addproduct.controller('AddProductController', ['$rootScope','$scope', '$http', '$location', 'LxDatePickerService','LxNotificationService', '$anchorScroll', 'myJdMenu', 'helperFunc', 'grpServResource', 'productsResource', 'LxDialogService', 'locationResource', '$translate', '$filter',
    function AddProductController($rootScope, $scope, $http, $location, LxDatePickerService, LxNotificationService, $anchorScroll, myJdMenu, helperFunc, grpServResource, productsResource, LxDialogService, locationResource, $translate, $filter) {

        var self = this;

        /*********** AddProductAndPrice ************/

        /* toggleOnSubmit variables */
        $scope.sendbutton = false;
        $scope.LinearProgress = false;
        $scope.sendbutton2 = false;
        $scope.LinearProgress2 = false;
        $scope.validtoDatePickerId = "validtoDatePickerId";
        $scope.fromdateDatePickerId = "fromdateDatePickerId";
        $scope.todateDatePickerId = "todateDatePickerId";

        /* form variable */
        $scope.fproduct = {
            validtodatePicker: { dateFormated: null, minDate: '' }, fromdatedatePicker: { dateFormated: null, minDate: '' }, todatedatePicker: { dateFormated: null, minDate:  '' }
        };
        $scope.fprice = {};


        $scope.datePickerCallback = function datePickerCallback(_newdate, id)
        {
            if(id=='validtoDatePickerId'){
                $scope.fproduct.validtodatePicker.dateFormated = moment(_newdate).locale($rootScope.dateP.locale).format($rootScope.dateP.format);
                LxDatePickerService.close($scope.validtoDatePickerId);
                return;
            }
            if(id=='fromdateDatePickerId'){
                $scope.fproduct.fromdatedatePicker.dateFormated = moment(_newdate).locale($rootScope.dateP.locale).format($rootScope.dateP.format);
                LxDatePickerService.close($scope.fromdateDatePickerId);
                return;
            }
            if(id=='todateDatePickerId'){
                $scope.fproduct.todatedatePicker.dateFormated = moment(_newdate).locale($rootScope.dateP.locale).format($rootScope.dateP.format);
                LxDatePickerService.close($scope.todateDatePickerId);
                return;
            }
        };
        /***************** TO RESET FORMS ********************/
        $scope.fproductMaster = {
            productcode: "", description: "", detaildesc: "", location: "", currency: "", datecreate: ""
        };
        $scope.fpriceMaster = {
            description:"", fromdate:"", todate:"", price:""
        };
        $scope.editFieldsProductMaster = {
            id: "", productcode: "", description: "", detaildesc: "", currency: "", datecreate: "", location: ""
        };

        $scope.reset = function() {
            $scope.fproduct = angular.copy($scope.fproductMaster);
            $scope.fprice = angular.copy($scope.fpriceMaster);
            $scope.editFieldsProduct = angular.copy($scope.editFieldsProductMaster);
        };

        $scope.fpriceReset = function() {
            $scope.fprice = angular.copy($scope.fpriceMaster);
        };
        /***************** TO RESET FORMS ********************/
        //$scope.reset();

        $scope.regex = "/[A-Z,\s]+/";

        /* toggleOnProductSave*/
        $scope.disablePrice=false;

        /* var send product Id on price Save*/
        $scope.productId= {};

        /* CurrencyList */
        $scope.currencyOpts = [
            { key: "usd", name: "usd" },
            { key: "bsf", name: "bsf" }
        ];

        /* pricetypeOpts */
        $scope.pricetypeOpts = [
            { key: "D", name: "Date" },
            { key: "P", name: "Pound" },
            { key: "U", name: "Unit" }
        ];

        /****** Location Search ********/
        $scope.selectAjax = {
            loading: false,
            locationOpts: []
        };
        $scope.searchLocation = function searchLocation(newFilter) {
            //console.log(newFilter);
            if (newFilter && newFilter.length >= 4)
            {
                $scope.selectAjax.loading = true;
                locationResource.airportByName({ airportname: newFilter}).$promise.then(
                    function(data)
                    {
                        $scope.selectAjax.locationOpts = data;
                        $scope.selectAjax.loading = false;
                    },
                    function()
                    {
                        $scope.selectAjax.loading = false;
                        $scope.selectAjax.locationOpts = false;
                    });
            }
            else
            {
                $scope.selectAjax.locationOpts = false;
            }
        };

        /* aviationOpts */
        $scope.aviationOpts = [
            { key: "1", value: "COMERCIAL" },{ key: "2", value: "GENERAL" }
        ];


        /* SaveingNewProduct */
        $scope.addProduct = function addProduct($event, fields, id) {
            $event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
            var toSave = {productname: fields.productname , detail: fields.detail , productunit: fields.productunit , productunitdesc: fields.productunitdesc , active: fields.active , pricetype: fields.pricetype.key , prices:[ { location: fields.location.id , provider: '60' , aviation: fields.aviationtype.key , pricename: fields.pricename , prepaid: fields.prepaid , validto: fields.validtodatePicker.dateFormated , frompound: fields.frompound , topound: fields.topound , fromdate: fields.fromdatedatePicker.dateFormated , todate: fields.todatedatePicker.dateFormated , currency: fields.currency.key , measure: fields.measure , unit: fields.unit , unitdesc: fields.unitdesc , price1: fields.price1 , cost1: fields.cost1 , diff: fields.diff , feesenable: fields.feesenable}] };

            //var toSave = '{"productcode":"'+fields.productcode+'","description":"'+fields.description+'","detaildesc":"'+fields.detaildesc+'","currency":"'+fields.currency.key+'","datecreate":"'+fields.datecreate+'", "location":"'+fields.location.id+'"}';
            productsResource.save({}, toSave).$promise.
            then(
                function (data) {
                    self.productId = helperFunc.mainSetter(data.products);
                    $scope.productId = helperFunc.mainSetter(data.products);
                    self.disablePrice = helperFunc.toogleStatus(self.disablePrice);
                    console.log("Guardado!!" + $scope.productId.toString());
                    //$scope.listProduct = productsResource.query();
                    /*self.productId = data;
                     self.togglePricetab();*/
                    $scope.sms1 = $filter('translate')('products.module.sms1');
                    LxNotificationService.info($scope.sms1);
                    //$location.hash('page_content_inner');
                    //$anchorScroll();
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                     /*self.sendbutton = helperFunc.toogleStatus(self.sendbutton);*/
                    //$location.path("/dashboard");
                },function (data) {
                    console.log("Error!!" + data);
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                }
            )
        };

        /* SavingPriceforNewProduct */
        $scope.addPrice = function addPrice($event, fields, id) {
            $event.preventDefault();
            var self = this;
            this.LinearProgress2 = helperFunc.toogleStatus(this.LinearProgress2);
            this.sendbutton2 = helperFunc.toogleStatus(this.sendbutton2);

            //$http.post(url, fields).
            productsResource.addProductPrice({productid: id[0].id}, fields).$promise.
            then(
                function (data) {
                    console.log("Guardado!!" + data);
                    self.LinearProgress2 = helperFunc.toogleStatus(self.LinearProgress2);
                    self.sendbutton2 = helperFunc.toogleStatus(self.sendbutton2);
                    self.disablePrice = helperFunc.toogleStatus(self.disablePrice);

                    $scope.listProduct = productsResource.query();
                    $scope.reset();
                },function (data) {
                    self.LinearProgress2 = helperFunc.toogleStatus(self.LinearProgress2);
                    self.sendbutton2 = helperFunc.toogleStatus(self.sendbutton2);
                    console.log("Error!!" + data);
                }
            )
        };
        /*********** AddProductAndPrice ************/

        /********** editProduct ********/

        /* toggleOnSubmit variables */
        $scope.updatebutton = false;
        $scope.updateLinearProgress = false;
        $scope.updatebutton2 = false;
        $scope.updateLinearProgress2 = false;

        /* ListProducts */
        //$scope.listProduct = productsResource.query();

        /* DialogVariables */
        $scope.dialogProduct = "dialogProduct";
        $scope.dialogPrice = "dialogPrice";

        /* FormVariables */
        $scope.editFieldsProduct = {};
        $scope.editFieldsPrice = {};

        /* TogglHiddenRowOnPriceTable */
        $scope.toggleRow = '';
        $scope.toggleHiddenForm = function toggleHiddenForm(i) {
            console.log(i);
            this.toggleRow = helperFunc.mainSetter(i);
        }

        /* OpenDialogProduct */
        $scope.openDialogProduct = function openDialogProduct(prod)
        {
            LxDialogService.open(this.dialogProduct);

            /***************** TO RECALL DATA ON EDIT FORMS ********************/
            $scope.rLoc = locationResource.get({ airport_id: prod.location});

            $scope.editFieldsProductMaster = {
                id: prod.id, productcode: prod.productcode, description: prod.description, detaildesc: prod.detaildesc, currency: {key: prod.currency,name: prod.currency}, datecreate: prod.datecreate, location: {id: rLoc.id ,city: rLoc.city ,region: rLoc.region ,notes: rLoc.notes ,airport: rLoc.airport ,country: rLoc.country ,iata: rLoc.iata ,icao: rLoc.icao }
            };
            $scope.editFieldsProduct = angular.copy($scope.editFieldsProductMaster);
            /***************** TO RECALL DATA ON EDIT FORMS ********************/
            /*self.editFieldsProduct = [
                 {
                    id: prod.id,
                    productcode: prod.productcode,
                    description: prod.description,
                    detaildesc: prod.detaildesc,
                    currency: prod.currency,
                    datecreate: prod.datecreate,
                    location: prod.location

                }
            ];*/

            /*angular.forEach(prod, function(value) {
                $scope.editFieldsProduct.push(value);
            });*/

            /* ListPrices */
            $scope.listPrices = [];
            angular.forEach(prod.prices, function(value, key) {
                $scope.listPrices.push(value);
            });

        };

        /* OpenDialogPrice */
        /*$scope.openDialogPrices = function openDialogPrices(price)
        {
            LxDialogService.open(this.dialogPrice);
            /!***************** TO RECALL DATA ON EDIT FORMS ********************!/
            $scope.editFieldsPriceMaster = {
                id: price.id, description: price.description, fromdate: price.fromdate, todate: price.todate, price: price.price
            };
            $scope.editFieldsPrice = angular.copy($scope.editFieldsPriceMaster);
            /!***************** TO RECALL DATA ON EDIT FORMS ********************!/
            /!*self.editFieldsPrice = [
                {
                    id: price.id,
                    description: price.description,
                    fromdate: price.fromdate,
                    todate: price.todate,
                    price: price.price
                }
            ];*!/
        };*/

        /* OndialogsStartEvent */
        $scope.$on('lx-dialog__open-start', function(_event, _dialogId)
        {
            //var self = this;
            if ($scope.dialogProduct === _dialogId)
            {

            }

            if ($scope.dialogPrice === _dialogId)
            {

            }
        });

        /* OnDialogCloseEvent */
        $scope.$on('lx-dialog__close-start', function(_event, _dialogId)
        {
            //var self = this;
            if ($scope.dialogProduct === _dialogId)
            {
                //LxDialogService.close(self.dialogProduct);
                $scope.listPrices = [];
            }

            if ($scope.dialogPrice === _dialogId)
            {
                //LxDialogService.close(self.dialogPrice);
            }
        });

        /* UpdatingExistingProduct */

        $scope.editFieldsProduct = {};
        /***************** TO RESET FORMS ********************/

        $scope.editFieldsProductReset = function(id, productcode) {
            $scope.editFieldsProductMaster = {
                id: id, productcode: productcode, description: "", detaildesc: "", currency: "", datecreate: "", location: ""
            };
            $scope.editFieldsProduct = angular.copy($scope.editFieldsProductMaster);
        };
        /***************** TO RESET FORMS ********************/
        //$scope.reset();

        $scope.updateProduct = function updateProduct($event, fields) {
            $event.preventDefault();
            var self = this;

            console.log(fields[0].id+ ' / ' + fields[0]);
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);

            grpServResource.update({id: fields[0].id}, fields[0]).$promise.
            then(
                function (data) {
                    console.log("Actualizado!!" + data);
                    LxNotificationService.success('Actualización realizada!!!');
                    $scope.listProduct = productsResource.query();
                    $scope.reset();
                    //$location.path("/dashboard");
                    LxDialogService.close(self.dialogProduct);
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                },function (data) {
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    console.log("Error!!" + data);
                }
            )
        };

        /* UpdatingOnExistingProductPrices */
        $scope.updatePrice = function updatePrice($event, fields) {
            $event.preventDefault();
            $rootScope.$broadcast('updatePrice');
            var self = this;

            console.log(fields.id+ ' / ' + fields);
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);

            productsResource.updateProductPrice({id: fields.id}, fields).$promise.
            then(
                function (data) {
                    console.log("Actualizado!!" + data);
                    LxNotificationService.success('Actualización realizada!!!');
                    //$scope.listPrice = productsResource.getProductPrices(id_product??);
                    //$scope.editFormPrice = [];
                    //$location.path("/dashboard");
                    //LxDialogService.close(self.dialogPrice);
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                },function (data) {
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    console.log("Error!!" + data);
                }
            )
        };

        /********** editProduct ********/


        /****** Location Search ********/
        $scope.selectAjax = {
            loading: false,
            locationOpts: []
        };
        $scope.searchLocation = function searchLocation(newFilter) {
            //console.log(newFilter);
            if (newFilter && newFilter.length > 3)
            {
                $scope.selectAjax.loading = true;
                locationResource.airportByName({ airportname: newFilter}).$promise.then(
                    function(data)
                    {
                        $scope.selectAjax.locationOpts = data;
                        $scope.selectAjax.loading = false;
                    },
                    function()
                    {
                        $scope.selectAjax.loading = false;
                        $scope.selectAjax.locationOpts = false;
                    });
            }
            else
            {
                $scope.selectAjax.locationOpts = false;
            }
        };


        /*$scope.locationList = [];
        $scope.location = [];
        $scope.$watch('vm.fproduct.location', function (newVal, oldVal, scope) {
            //console.log(newVal.toString());
            if(angular.isDefined(newVal)){
                locationResource.airportByName({airportname: newVal}).$promise.then(
                    function (data) {
                        $scope.locationList = data;

                    },
                    function (data) {
                        $scope.locationList = false;
                        $scope.location = helperFunc.mainSetter([]);
                    }
                );
                return;
            }

            console.log($scope.location);
            $scope.location = helperFunc.mainSetter([]);
            $scope.locationList = helperFunc.mainSetter(false);
            //$scope.location = false;
            console.log($scope.location);

        });

        /!* Choosing the location *!/
        $scope.setLocation = function setLocation(loc) {
            console.log('location: '+loc.toString());
            /!* from the obj im getting *!/
            $scope.location = helperFunc.mainSetter([]);
            $scope.locationList = helperFunc.mainSetter(false);
            $scope.location.push(loc);
            $scope.fproduct.location = loc.airport;
            $scope.fproduct.location.$setViewValue(loc.airport);
            angular.element('#location').controller('ngModel').$render();
            //$scope.fproduct.push(loc);
            //console.log('fproduct: '+$scope.fproduct.toString());
            console.log('location: '+$scope.location.toString());
            /!* setting locationlist to false so it will disappear *!/
            //$scope.locationList = false;
        }*/


    }]);
/**
 * Created by bboyvlad on 9/8/16.
 */
var menu = angular.module('jdmenu', []);
menu.factory('myJdMenu', function($filter, $translate) {
    //var myJdMenu = {};
    var myJdMenu = {
        "usermenu":[
            {
                "link":"/users/sing-up",
                "text": 'menu.usermenu.opt1',
                tooltip:'menu.usermenu.tooltip',
            },
            {
                "link":"/loginpage",
                "text": 'menu.usermenu.opt2'
            }
        ],
        "useradmin":[
            {
                "link":"/users/admin",
                "text":'menu.useradmin.opt1',
                tooltip:'menu.useradmin.tooltip',

            }
        ],
        "jdcard":[
            {
                "link":"/dashboard/buy/jdcard",
                "text":'menu.jdcard.opt1',
                tooltip:'menu.jdcard.tooltip',
            },
            {
                "link":"/dashboard/refill/jdcard",
                "text":'menu.jdcard.opt2'
            }
        ],
        "giftcard":[
            {
                "link":"/dashboard/giftcard/buy",
                "text":'menu.giftcard.opt1',
                tooltip:'menu.giftcard.tooltip',
            },
            {
                "link":"/dashboard/giftcard/redeem",
                "text":'menu.giftcard.opt2'
            }
        ],
        "payments":[
            {
                "link":"/dashboard/paymentmethod-form",
                "text":'menu.payments.opt1',
                tooltip:'menu.payments.tooltip',
            },
            {
                "link":"/dashboard/sendpayment",
                "text":'menu.payments.opt2'
            }
        ],
        "bankmanage":[
            {
                "link":"/dashboard/bankmanage",
                "text":'menu.bankmanage.opt1',
                tooltip:'menu.bankmanage.tooltip',
            },
            {
                "link":"/dashboard/showreceived",
                "text":'menu.bankmanage.opt2'
            }
        ],
        "defgen":[
            /*{
                "link":"/dashboard/groupserv/add",
                "text":"Group Service"
            },*/
            {
                "link":"/dashboard/products/add",
                "text":'menu.defgen.opt1',
                tooltip:'menu.defgen.tooltip',
            }
        ],
        "aircraft":[
            {
                "link":"/dashboard/aircraft/manage",
                "text":'menu.aircraft.opt1',
                tooltip:'menu.aircraft.tooltip',
            }
        ],
        "captain":[
            {
                "link":"/dashboard/captain/manage",
                "text":'menu.captain.opt1',
                tooltip:'menu.captain.tooltip',
            }
        ],
        "cardvalidate":[
            {
                "link":"/dashboard/cardstatus",
                "text":'menu.cardvalidate.opt1',
                tooltip:'menu.cardvalidate.tooltip',
            }
        ],
        "balance":[
            {
                "link":"/dashboard/balance_details",
                "text":'menu.balance.opt1',
                tooltip:'menu.balance.tooltip',
            }
        ],
        "servrequest":[
            {
                "link":"/dashboard/defered_payments",
                "text":'menu.servrequest.opt1',
                tooltip:'menu.servrequest.tooltip',
            },
            {
                "link":"/dashboard/admin_pending_payments",
                "text":'menu.servrequest.opt2'
            }
        ],
        "cart":[
            {
                "link":"/dashboard/cart",
                "text":'menu.cart.opt1',
                tooltip:'menu.cart.tooltip'
            }
        ],
        "mainmenu":{
            "main":[
                {
                    "link":"/",
                    "text":'menu.mainmenu.opt1'
                },
                /*{
                    "link":"/",
                    "text":"Services"
                },
                {
                    "link":"/",
                    "text":"Products"
                },
                {
                    "link":"/",
                    "text":"Promotions"
                },*/
                {
                    "link":'menu.mainmenu.opt2link',
                    "text":'menu.mainmenu.opt2'
                }
            ]
        }
    };


    myJdMenu.userSection = function(menuOpt){
        myJdMenu.usermenu = menuOpt;
    };
    myJdMenu.userAdminSection = function(menuOpt){
        myJdMenu.useradmin = menuOpt;
    };
    myJdMenu.mainSection = function(menuOpt){
        myJdMenu.mainmenu = menuOpt;
    };
    myJdMenu.jdcardSection = function(menuOpt){
        myJdMenu.jdcard = menuOpt;
    };
    myJdMenu.giftcardSection = function(menuOpt){
        myJdMenu.giftcard = menuOpt;
    };
    myJdMenu.paymentsSection = function(menuOpt){
        myJdMenu.payments = menuOpt;
    };
    myJdMenu.bankmanageSection = function(menuOpt){
        myJdMenu.bankmanage = menuOpt;
    };
    myJdMenu.defgenSection = function(menuOpt){
        myJdMenu.defgen = menuOpt;
    };
    myJdMenu.aircraftSection = function(menuOpt){
        myJdMenu.aircraft = menuOpt;
    };
    myJdMenu.captainSection = function(menuOpt){
        myJdMenu.captain = menuOpt;
    };
    myJdMenu.cardvalidateSection = function(menuOpt){
        myJdMenu.cardvalidate = menuOpt;
    };
    myJdMenu.balanceSection = function(menuOpt){
        myJdMenu.balance = menuOpt;
    };
    myJdMenu.servrequestSection = function(menuOpt){
        myJdMenu.servrequest = menuOpt;
    };
    myJdMenu.cartSection = function(menuOpt){
        myJdMenu.cart = menuOpt;
    };

    return myJdMenu;
});
menu.controller('MyJdMenuController', [ '$scope', '$rootScope', '$filter', 'myJdMenu', '$http', 'shopcartResource', 'userResource', '$location', 'LxNotificationService', 'LxDialogService', 'userPaymentResource', 'helperFunc', '$translate', function($scope, $rootScope, $filter, myJdMenu, $http, shopcartResource, userResource, $location, LxNotificationService, LxDialogService, userPaymentResource, helperFunc, $translate) {
    var self = this;
    $scope.sharedMenu = myJdMenu;
    //console.log("menu: "+$scope.sharedMenu.toString());
    $scope.states = {};
    $scope.search ='';
    $scope.productlist = [];
    $scope.jdcardOpts = [];

    $scope.sendbutton = false;
    $scope.LinearProgress = false;

    /*$rootScope.$on('rootScope:emit', function (event, data) {
        console.log(data); // 'Emit!'
        $scope.updateMenu();
    });*/

    $scope.changeLanguage = function changeLanguage(_newValue) {
        //console.log(_newValue);
        $translate.use(_newValue);
    };

    $scope.checkRole = function checkRole(roles) {
        helperFunc.hasRole(roles);
    };

    /* check user for credentials on page refresh */
    var loggedUser=userResource.loggedUser();
    loggedUser.$promise.then(function(data) {
        //console.log("in data: " + data.toString());
        if (!angular.isDefined(data.principal)) {
            $location.path("/");
        } else {
            /* retrieve shop cart, Principal and User details */
            $rootScope.cart = shopcartResource.getCartUser();
            $rootScope.user = data;
            var detailUser=userResource.detailUser();
            detailUser.$promise.then( function (data) {
                //console.log("data userDetails"+data);
                $rootScope.userDetail = data;
            });
            //$location.path("/dashboard");
        }
    });

    $scope.logout = function() {
        $http.post('/logout', {}).then(function() {
            $rootScope.cart = {};
            $rootScope.user = {};
            $rootScope.userDetail = {};
            $location.path("/");
        });
    }

    $scope.newCoordinates = function newCoordinates() {
        $scope.sms1 = $filter('translate')('menu.module.sms1');
        $scope.sms2 = $filter('translate')('menu.module.sms2');
        $scope.btn1 = $filter('translate')('menu.module.btn1');
        $scope.btn2 = $filter('translate')('menu.module.btn2');

        LxNotificationService.confirm($scope.sms1, $scope.sms2,
            {
                cancel: $scope.btn1,
                ok: $scope.btn2
            }, function(answer)
            {
                if (answer)
                {
                    window.open('http://jdoilfield.net:8080/users/setcoordinates', '_blank');
                    $scope.sms3 = $filter('translate')('menu.module.sms3');
                    LxNotificationService.success($scope.sms3);
                }
                else
                {
                    $scope.sms4 = $filter('translate')('menu.module.sms4');
                    LxNotificationService.error($scope.sms4);
                }
            });
    }
    $scope.orderTotal = function orderTotal() {
        $scope.total = 0;
        //console.log("items" + $scope.sCart.items.toString());
        angular.forEach($scope.sCart.items, function(value){
            //console.log("value" + value.toString());
            $scope.total= value.totalprice + $scope.total;
            //console.log("total" + $scope.total);
        });
    };


    /* OpenDialogProduct */
    $scope.shopCartDialogId = "shopCartDialogId";
    $scope.shopCartDialog = function shopCartDialog(shopCart)
    {
        $body.removeClass('sidebar_secondary_active');
        //console.log("shopCart" + shopCart.toString());
        $scope.sCart = shopCart;
        $scope.orderTotal();
        LxDialogService.open($scope.shopCartDialogId);
    };

    /* checkoutDialog */
    $scope.checkoutDialogId = "checkoutDialogId";
    $scope.checkoutDialog = function checkoutDialog(shopCart)
    {
        $body.removeClass('sidebar_secondary_active');
        //console.log("shopCart" + shopCart.toString());
        $scope.sCart = shopCart;
        $scope.orderTotal();
        $scope.jdcardOpts = [];
            userPaymentResource.get().$promise.
            then(
                function (data) {
                    /*$scope.paymethod = response.data;*/
                    angular.forEach(data, function (key) {
                        //alert(key.paytype +':'+val);
                        if(key.paytype=="JDCARD"){
                            $scope.jdcardOpts.push(key);
                        }/*else{
                         self.paymethod.push(key);
                         }*/
                    });
                }
            )

        LxDialogService.open($scope.checkoutDialogId);
    };

    /*$scope.calculateBalance = function calculateBalance() {
        //console.log("payments: "+ $rootScope.userDetail.toString());
        var detailUser=userResource.detailUser();
        detailUser.$promise.then( function (data) {
            //console.log("data userDetails"+data);
            $rootScope.userDetail = data;
            $scope.items = $filter('orderBy')($rootScope.userDetail.payments, "payid");
            var payments = $scope.items;
            //console.log("data payments"+payments.toString());
            angular.forEach(payments, function (value, key) {
                console.log(value.payavailable);
                $rootScope.mainPieChart.payavailable +=value.payavailable;
                $rootScope.mainPieChart.paylocked +=value.paylocked;
                $rootScope.mainPieChart.paybalance +=value.paybalance;

            })
            $rootScope.mainPieChart.labels = ["Available Balance", "Balance Blocked"];
            $rootScope.mainPieChart.data = [$rootScope.mainPieChart.payavailable, $rootScope.mainPieChart.paylocked];
            console.log("TOTAL" + $rootScope.mainPieChart.payavailable);
            console.log($rootScope.datePicker.toString());
        });

    };*/


    $scope.fcheckout={}
    $scope.checkoutShopCart = function checkoutShopCart($event, fields) {
        $event.preventDefault();
        var self = this;
        this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
        this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
        console.log($scope.fcheckout.toString());
        var toSave = '{ ' +
            '"shopcart_id":"'+$scope.sCart.id+'", ' +
            '"paymethod_id":"'+$scope.fcheckout.jdcard.payid+'" ' +
            '}';

        console.log(toSave.toString());
        var checkoutShopCart = shopcartResource.checkOut({ paymethod_id: $scope.fcheckout.jdcard.payid, shopcart_id: $scope.sCart.id});
        checkoutShopCart.$promise.
        then(
            function (data) {
                //console.log("Guardado!!" + data);
                if(data.message=="Saldo insuficiente"){
                    $scope.sms5 = $filter('translate')('menu.module.sms5');
                    $scope.sms6 = $filter('translate')('menu.module.sms6');
                    $scope.sms7 = $filter('translate')('menu.module.sms7');
                    LxNotificationService.alert($scope.sms5,
                        $scope.sms6+" J&D Card "+ $scope.sms7,
                        'Ok',
                        function(answer)
                        {
                            self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                            self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                            return;
                        });
                };


                shopcartResource.hardDelete({shopcart_id: $scope.sCart.id}).$promise.
                then(
                    function (data) {
                        $rootScope.cart = shopcartResource.getCartUser();

                    },function (data) {
                        //console.log("Error!!" + data.toString());
                    }
                );

                $scope.sms8 = $filter('translate')('menu.module.sms8');
                LxNotificationService.alert('Service Request',
                    $scope.sms8,
                    'Ok',
                    function(answer)
                    {
                        //$scope.reset();
                        helperFunc.jdCardBalance(null, true);
                        self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                        self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                        LxDialogService.close($scope.checkoutDialogId);
                        //$location.path("/dashboard");
                    });

            },function (data) {
                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                console.log("Error!!" + data);
            }
        )
    };
    /*$scope.$watch('vm.search', function () {
        $scope.retrievelist();
    });

    $scope.retrievelist = function retrievelist() {
        if(self.search!=""){
            $http.post("/products/productbytag/" + self.search)
                .then(
                    function (response) {
                        console.log(response.data);
                        $scope.productlist= response.data;
                    }
                )
        }
    };*/

    /*$scope.deleteShopCart = function deleteShopCart(item) {
        $rootScope.cart.splice(item);
        if(self.search!=""){
            $http.post("/products/productbytag/" + self.search)
                .then(
                    function (response) {
                        console.log(response.data);
                        $scope.productlist= response.data;
                    }
                )
        }
    };*/
       /********** deleteItem ********/

    $scope.deleteItem = function deleteItem(cartId, itemId) {
        var self = this;

        //console.log(cartId+"/"+itemId);
        $scope.sms9 = $filter('translate')('menu.module.sms9');
        $scope.sms10 = $filter('translate')('menu.module.sms10');
        $scope.btn3 = $filter('translate')('menu.module.btn3');
        $scope.btn4 = $filter('translate')('menu.module.btn4');
        LxNotificationService.confirm($scope.sms9, $scope.sms10,
            {
                cancel: $scope.btn3,
                ok:  $scope.btn4
            }, function(answer)
            {
                if (answer)
                {
                    //console.log("Borrado!!" + data.toString());
                    shopcartResource.deleteCartItem({shopcart_id: cartId, itemcartid: itemId}).$promise.
                    then(
                        function (data) {
                            //console.log("Borrado!!" + data);
                            $scope.sCart.items.splice(itemId);
                            LxDialogService.close($scope.shopCartDialogId);
                            $scope.sms11 = $filter('translate')('menu.module.sms11');

                            LxNotificationService.success($scope.sms11);
                            //$rootScope.cart = shopcartResource.getCartUser();

                        },function (data) {
                            //console.log("Error!!" + data.toString());
                        }
                    );
                }
                else
                {
                    $scope.sms12 = $filter('translate')('menu.module.sms12');
                    LxNotificationService.error($scope.sms12);
                }
            });

    }
    /********** deleteItem ********/

    /********** deleteShopCart ********/

    $scope.deleteShopCart = function deleteShopCart(data) {
        var self = this;

        //console.log(data.toString());
        $scope.sms13 = $filter('translate')('menu.module.sms13');
        $scope.sms14 = $filter('translate')('menu.module.sms14');
        $scope.btn5 = $filter('translate')('menu.module.btn5');
        $scope.btn6 = $filter('translate')('menu.module.btn6');
        LxNotificationService.confirm($scope.sms13, $scope.sms14,
            {
                cancel: $scope.btn5,
                ok: $scope.btn6
            }, function(answer)
            {
                if (answer)
                {
                    console.log("Borrado!!" + data.toString());
                    shopcartResource.hardDelete({shopcart_id: data.id}).$promise.
                    then(
                        function (data) {
                            //console.log("Borrado!!" + data);
                            $scope.sms15 = $filter('translate')('menu.module.sms15');
                            LxNotificationService.success($scope.sms15);
                            $rootScope.cart = shopcartResource.getCartUser();

                        },function (data) {
                            //console.log("Error!!" + data.toString());
                        }
                    );
                }
                else
                {
                    $scope.sms16 = $filter('translate')('menu.module.sms16');
                    LxNotificationService.error($scope.sms16);
                }
            });

    }
    /********** deleteShopCart ********/

    //$scope.sharedMenu = myJdMenu;

    $scope.updateMenu = function updateMenu() {
        //alert(this.Opts.item1);
        console.log(myJdMenu.toString());
        myJdMenu.userSection(myJdMenu.usermenu);
        myJdMenu.userAdminSection(myJdMenu.useradmin);
        myJdMenu.mainSection(myJdMenu.mainmenu);
        myJdMenu.jdcardSection(myJdMenu.jdcard);
        myJdMenu.giftcardSection(myJdMenu.giftcard);
        myJdMenu.paymentsSection(myJdMenu.payments);
        myJdMenu.bankmanageSection = (myJdMenu.bankmanage);
        myJdMenu.defgenSection(myJdMenu.defgen);
        myJdMenu.aircraftSection(myJdMenu.aircraft);
        myJdMenu.captainSection(myJdMenu.captain);
        myJdMenu.cardvalidateSection(myJdMenu.cardvalidate);
        myJdMenu.balanceSection(myJdMenu.balance);
        myJdMenu.servrequestSection(myJdMenu.servrequest);
        myJdMenu.cartSection(myJdMenu.cart);
    };
}]);
/**
 * Created by bboyvlad on 9/7/16.
 */
'use strict';

var login = angular.module('login', ['ngRoute', 'ngResource', 'ngMessages']);


    login.controller('LoginController', ['$rootScope','$scope', '$http', '$location', 'LxNotificationService', '$interval', 'myJdMenu', 'helperFunc', 'userResource', 'shopcartResource', '$translate', '$filter',
        function LoginController($rootScope, $scope, $http, $location, LxNotificationService, $interval, myJdMenu, helperFunc, userResource, shopcartResource, $translate, $filter) {
            //$translate.use('en');
            $scope.cssClass = 'loginpage';
            var self = this;

            $scope.flogin = {};
            $scope.sendbutton = false;
            $scope.LinearProgress = false;
            $scope.loginFormImg = '../css/img/design/login/AzulBACK.png';
            $scope.loginFormImgCards = '../css/img/design/login/tarjetas.png';

            $scope.datePickerFromRoot = $rootScope.rootdatePicker;

            /***************** TO RESET FORMS ********************/
            $scope.master = {
                email:"", pass:""
            };
            $scope.reset = function() {
                $scope.flogin = angular.copy($scope.master);
            };
            /***************** TO RESET FORMS ********************/
            //$scope.reset();


            //helperFunc.authenticate();
            /*$scope.credentials = {};
            $scope.login = function() {
                console.log(self.credentials.toString());
                helperFunc.authenticate(self.credentials, function() {
                    if ($rootScope.authenticated) {
                        $location.path("/");
                        self.error = false;
                    } else {
                        $location.path("/loginpage");
                        self.error = true;
                    }
                });
            };*/

            $scope.userLogin = function userLogin($event, fields) {
                $event.preventDefault();

                var self = this;
                this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
                this.sendbutton = helperFunc.toogleStatus(this.sendbutton);

                /*helperFunc.authenticate(fields, function() {
                    if ($rootScope.authenticated) {
                        $location.path("/dashboard");
                        self.error = false;
                    } else {
                        $location.path("/users/log-in");
                        self.error = true;
                    }
                });*/

                var userLogIn = userResource.logIn({}, fields);
                userLogIn.$promise.
                    then(
                        function (data) {
                            //self.helperFuncBar();
                            if (data.message == "Usuario no registrado"){
                                $scope.sms1 = $filter('translate')('login.module.sms1');
                                LxNotificationService.error($scope.sms1);
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                //self.helperFuncBar();
                                return;
                            }
                            var loggedUser=userResource.loggedUser();
                            loggedUser.$promise.then(function(data) {
                                //console.log("in data: "+data.toString());
                                if( !angular.isDefined(data.name) || data.name==""){
                                    $scope.sms1 = $filter('translate')('login.module.sms1');
                                    LxNotificationService.error($scope.sms1);
                                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                }else {
                                    $rootScope.cart = shopcartResource.getCartUser();
                                    $rootScope.user = data;
                                    var detailUser=userResource.detailUser();
                                    detailUser.$promise.then( function (data) {
                                        $rootScope.userDetail = data;
                                        /*console.log("$rootScope.userDetail from loginController userDetails: "+$rootScope.userDetail.toString());*/
                                        $location.path("/dashboard");
                                    });

                                }

                            }, function() {
                                //console.log(response.toString());
                            });

                            /*console.log(data.toString());
                            $rootScope.user = data;
                            $location.path("/dashboard");*/

                            //self.helperFuncBar();
                        },function (data) {
                            console.log("Error!!:"/*+data.toString()*/);
                        }
                    );
            }
        }]);
/**
 * Created by bboyvlad on 9/7/16.
 */
'use strict';

var singup = angular.module('singup', ['ngRoute', 'jdmenu', 'ngMessages']);

    singup.controller('singupController', ['$rootScope','$scope', '$http', '$location', 'myJdMenu', 'LxNotificationService', 'helperFunc', 'userResource', '$translate', '$filter',
        function singupController($rootScope, $scope, $http, $location, myJdMenu, LxNotificationService, helperFunc, userResource, $translate, $filter) {
            $scope.cssClass = 'singup';
            var self = this;

            $scope.fsingup = {};
            $scope.sendbutton = false;
            $scope.LinearProgress = false;
            $scope.emailExistance = true;
            $scope.icon = '../css/icons/id-card.png';
            $scope.signupFormImg = '../css/img/design/index/AzulBACK.png';
            $scope.passRegex = "/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/";


            /***************** TO RESET FORMS ********************/
            $scope.master = {
                firstname:"", lastname:"", email:"", pass:"", chkpass:""
            };
            $scope.reset = function() {
                $scope.fsingup = angular.copy($scope.master);
            };
            /***************** TO RESET FORMS ********************/

            /*$scope.emailCheck = function (email) {
                console.log("Check Email "+email);
                var chkemail = {
                    email: email
                };
                console.log("Check Email "+chkemail.toString());

                userResource.checkEmail(chkemail).$promise.then(
                    function (data) {
                        if (data.message == "validEmail") {
                            $scope.emailExistance = false;
                            return;
                        }
                        if (data.message == "invalidEmail") {
                            $scope.emailExistance = true;
                            return;
                        }
                    },
                    function (data) {
                        console.log(data);
                    }
                );
            };*/

            $scope.userCreate = function userCreate($event, fields) {
                $event.preventDefault();
                var self = this;
                this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
                this.sendbutton = helperFunc.toogleStatus(this.sendbutton);

                var userSave = userResource.singUp({}, fields);
                userSave.$promise.
                    then(
                        function (data) {
                            //console.log("Guardado!!" + data.toString());
                            if (data.message == "Este email ya se encuentra registrado"){
                                $scope.sms1 = $filter('translate')('singup.module.sms1');
                                LxNotificationService.error($scope.sms1);
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                //self.helperFuncBar();
                                return;
                            }
                            $scope.reset();

                            //$rootScope.userInfo = data;
                            $scope.sms2 = $filter('translate')('singup.module.sms2');
                            $scope.sms3 = $filter('translate')('singup.module.sms3',data);
                            LxNotificationService.alert($scope.sms2,
                                $scope.sms3,
                                'Ok',
                                function(answer)
                            {
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                $location.path("/loginpage");
                            });

                        }
                );

            };


}]);
/*

/!*TO COMPARE FIELDS VALUES*!/
var compareTo = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
};

singup.directive("compareTo", compareTo);*/

/**
 * Created by bboyvlad on 9/7/16.
 */
'use strict';

var user = angular.module('ManageUser', ['ngRoute', 'jdmenu', 'ngMessages']);

user.controller('ManageUserController', ['$rootScope','$scope', '$http', '$location', 'myJdMenu', 'LxNotificationService', 'helperFunc', 'userResource', 'LxDialogService',
    function ManageUserController($rootScope, $scope, $http, $location, myJdMenu, LxNotificationService, helperFunc, userResource, LxDialogService) {
        $scope.cssClass = 'manage';
        var self = this;

        $scope.fuser = {};
        $scope.search = { mysearch:'' };
        $scope.sendbutton = false;
        $scope.LinearProgress = false;

        /*$scope.resetSearch = function (Val) {
            if(Val===""){
                $scope.search = { mysearch:'Buscar Usuario' };
            }
        }*/

        /***************** TO RESET FORMS ********************/
        $scope.master = {
            name:"", lastname:"", email:"", role:""
        };
        $scope.reset = function() {
            $scope.fuser = angular.copy($scope.master);
            $scope.fuseredit = angular.copy($scope.master);
        };
        /***************** TO RESET FORMS ********************/

        $scope.profileOpts = [
            { key: "U", name: "USER" },
            { key: "A", name: "ADMIN" },
            { key: "S", name: "SYSADMIN" },
            { key: "P", name: "PROVIDER" },
            { key: "G", name: "GUEST" },
            { key: "M", name: "MANAGER" },
            { key: "O", name: "OPER" },
            { key: "PA", name: "PARTNER" },
            { key: "SU", name: "SUPER" }
        ];

        /********** addUser ********/
        $scope.userCreate = function userCreate($event, fields) {
            $event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);

            var userSave = userResource.singUp({}, fields);
            userSave.$promise.
            then(
                function (data) {
                    //console.log("Guardado!!" + data.toString());
                    LxNotificationService.success('Usuario creado satisfactoriamente!!!');
                    $scope.listUser = userResource.query();
                    $scope.reset();
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);

                }
            );

        };
        /********** addUser ********/


        /********** editUser ********/
        $scope.listUser = userResource.query();

        $scope.dialogUser = "dialogUser";
        $scope.fuseredit = {};

        /***************** TO RESET EDIT FORMS ********************/


        $scope.editReset = function(id) {
            $scope.editMaster = {
                id: id, name:"", lastname:"", email:"", role:""
            };
            $scope.fuseredit = angular.copy($scope.editMaster);
        };
        /***************** TO RESET FORMS ********************/
        //$scope.reset();
        $scope.toEditRole = function toEditRole(data) {
            console.log(data);
            switch (data) {
                case "ROLE_USER":
                    return { key: "U", name: "USER" };
                    break;
                case "ROLE_ADMIN":
                    return { key: "A", name: "ADMIN" };
                    break;
                case "ROLE_SYSADMIN":
                    return { key: "S", name: "SYSADMIN" };
                    break;
                case "ROLE_PROVIDER":
                    return { key: "P", name: "PROVIDER" };
                    break;
                case "ROLE_GUEST":
                    return { key: "G", name: "GUEST" };
                    break;
                case "ROLE_MANAGER":
                    return { key: "M", name: "MANAGER" };
                    break;
                case "ROLE_OPER":
                    return { key: "O", name: "OPER" };
                    break;
                case "ROLE_PARTNER":
                    return { key: "PA", name: "PARTNER" };
                    break;
                case "ROLE_SUPER":
                    return { key: "SU", name: "SUPER" };
                    break;
                default:
                    return { key: "G", name: "GUEST" };
            }
        };

        $scope.openDialogUser = function openDialogUser(ef_user)
        {
            LxDialogService.open(this.dialogUser);
            //console.log("ef_user: "+ ef_user.roles[0].code );
            /***************** TO RECALL DATA ON EDIT FORMS ********************/

            $scope.editmaster = {
                id: ef_user.id, name:ef_user.name, lastname:ef_user.lastname, email:ef_user.email, role: $scope.toEditRole(ef_user.roles[0].code)
            };
            $scope.fuseredit = angular.copy($scope.editmaster);
            /***************** TO RECALL DATA ON EDIT FORMS ********************/

        }

        $scope.$on('lx-dialog__open-start', function(_event, _dialogId)
        {
            //var self = this;
            if ($scope.dialogUser === _dialogId)
            {

            }
        });

        $scope.updateUser = function updateUser($event, fields) {
            $event.preventDefault();
            var self = this;

            //console.log(fields[0].id+ ' / ' + fields[0]);
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
            var toSave = {
                name:fields.name, lastname:fields.lastname, password:fields.password, role: fields.role.key
            };

            userResource.manageUpdate({principalid: fields.id},  toSave).$promise.
            then(
                function (data) {
                    console.log("Actualizado!!" + data);
                    LxNotificationService.success('Actualización realizada!!!');
                    $scope.listUser = userResource.query();
                    $scope.reset();
                    //$location.path("/dashboard");
                    LxDialogService.close($scope.dialogUser);
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                },function (data) {
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    console.log("Error!!" + data);
                }
            );
        }
        /********** editUser ********/

        /********** deleteUser ********/

        $scope.deleteUser = function deleteUser(data) {
            //$event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
            //console.log(data.toString());
            LxNotificationService.confirm('Eliminar Usuario', 'Por favor confirme que desea eliminar este Usuario.',
                {
                    cancel: 'Cancelar',
                    ok: 'Eliminar'
                }, function(answer)
                {
                    if (answer)
                    {
                        userResource.delete({id: data.id}).$promise.
                        then(
                            function (data) {
                                //console.log("Borrado!!" + data);
                                LxNotificationService.success('Usuario, Eliminado satisfactoriamente!!!');
                                $scope.listUser = userResource.query();
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                            },function (data) {
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                //console.log("Error!!" + data.toString());
                            }
                        );
                    }
                    else
                    {
                        LxNotificationService.error('Disagree');
                        this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
                        this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
                    }
                });

        }
        /********** deleteUser ********/


    }]);