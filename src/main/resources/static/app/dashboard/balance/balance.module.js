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