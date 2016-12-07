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