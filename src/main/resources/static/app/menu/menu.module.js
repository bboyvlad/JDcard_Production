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