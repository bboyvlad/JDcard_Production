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