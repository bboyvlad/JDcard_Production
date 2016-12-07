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