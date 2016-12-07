/**
 * d by bboyvlad on 9/8/16.
 */
'use strict';

var admindeferedpay = angular.module('AdminDeferedPay', ['ngRoute', 'ngMessages', 'angularPayments', 'ui.utils.masks']);

admindeferedpay.controller('AdminDeferedPayController', ['$rootScope','$scope', '$filter', '$http', '$location', 'LxDatePickerService', 'myJdMenu', 'helperFunc', 'LxNotificationService', 'LxDialogService', 'serviceRequestResource', 'userResource', 'userPaymentResource','$translate',
    function DeferedPayController($rootScope, $scope, $filter, $http, $location, LxDatePickerService, myJdMenu, helperFunc, LxNotificationService, LxDialogService, serviceRequestResource, userResource, userPaymentResource, $translate) {
        $scope.cssClass = 'transitionView';
        var self = this;
        $scope.icon = '../css/icons/plane-flying.png';
        $scope.sendbutton = false;
        $scope.LinearProgress = false;
        $scope.search = { mysearch:'' };
        $scope.pending = {};

        $scope.getDeferedList = function getDeferedList() {
            var deferedList = serviceRequestResource.showServicesRequestsPending();
            deferedList.$promise.then(
                function (data) {
                    $scope.items = $filter('orderBy')(data, "servicerequest");
                    $scope.listPaymentsDefered = $scope.items;
                }
            );
        }
        $scope.getDeferedList();


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