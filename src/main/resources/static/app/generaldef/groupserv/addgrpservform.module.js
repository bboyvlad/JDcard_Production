/**
 * Created by bboyvlad on 9/8/16.
 */
'use strict';

var addgrpserv = angular.module('AddGrpServ', ['ngRoute', 'ngMessages', 'ui.utils.masks']);

addgrpserv.controller('AddGrpServController', ['$rootScope','$scope', '$http', '$location', 'myJdMenu', 'helperFunc', 'grpServResource', 'LxDialogService', 'LxNotificationService',
    function AddGrpServController($rootScope, $scope, $http, $location, myJdMenu, helperFunc, grpServResource, LxDialogService, LxNotificationService) {

        var self = this;
        $scope.sendbutton = false;
        $scope.LinearProgress = false;

        $scope.fgrpserv = {};

        /***************** TO RESET FORMS ********************/
        $scope.master = {
            groupcode: "", description: "", detailsdesc: ""
        };
        $scope.reset = function() {
            $scope.fgrpserv = angular.copy($scope.master);
            $scope.editFieldsGS = angular.copy($scope.master);
        };
        /***************** TO RESET FORMS ********************/
        //$scope.reset();

        $scope.regex = "/[A-Z,\s]+/";



        /********** editGrpServ ********/
        $scope.listGS = grpServResource.query();

        $scope.dialogGrpServ = "dialogGrpServ";
        $scope.editFieldsGS = {};

        /***************** TO RESET EDIT FORMS ********************/


        $scope.editReset = function(id, groupcode) {
            $scope.editMaster = {
                id: id, groupcode: groupcode, description: "", detailsdesc: ""
            };
            $scope.editFieldsGS = angular.copy($scope.editMaster);
        };
        /***************** TO RESET FORMS ********************/
        //$scope.reset();

        $scope.openDialogGrpServ = function openDialogGrpServ(gs)
        {
            LxDialogService.open(this.dialogGrpServ);
            console.log(gs.id );
            /***************** TO RECALL DATA ON EDIT FORMS ********************/
            $scope.editmaster = {
                id: gs.id, groupcode: gs.groupcode, description: gs.description, detailsdesc: gs.detailsdesc
            };
            $scope.editFieldsGS = angular.copy($scope.editmaster);
            /***************** TO RECALL DATA ON EDIT FORMS ********************/
            //$scope.reset();
            /*self.editFieldsGS = [
                {
                    id: gs.id,
                    groupcode: gs.groupcode,
                    description: gs.description,
                    detailsdesc: gs.detailsdesc
                }
            ];*/
            /*this.editFieldsGS = [
                {
                    key: gs.key,
                    name: gs.name
                }
            ];*/
        }

        $scope.$on('lx-dialog__open-start', function(_event, _dialogId)
        {
            //var self = this;
            if ($scope.dialogGrpServ === _dialogId)
            {

            }
        });

        $scope.updateGrpServ = function updateGrpServ($event, fields) {
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
                    $scope.listGS = grpServResource.query();
                    $scope.reset();
                    //$location.path("/dashboard");
                    LxDialogService.close(self.dialogGrpServ);
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                },function (data) {
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    console.log("Error!!" + data);
                }
            )
        }

        /********** editGrpServ ********/

        /********** addGrpServ ********/
        $scope.addGrpServ = function addGrpServ($event, fields) {
            $event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);

            grpServResource.save({}, fields).$promise.
            then(
                function (data) {
                    console.log("Guardado!!" + data);
                    LxNotificationService.success('Grupo de servicio, creado satisfactoriamente!!!');
                    $scope.listGS = grpServResource.query();
                    $scope.reset();
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                },function (data) {
                    self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                    self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                    console.log("Error!!" + data.toString());
                }
            )
        }
        /********** addGrpServ ********/

        /********** deleteGrpServ ********/

        $scope.deleteGrpServ = function deleteGrpServ(data) {
            //$event.preventDefault();
            var self = this;
            this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
            this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
            console.log(data.toString());
            LxNotificationService.confirm('Eliminar Grupo de Servicio', 'Por favor confirme que desea eliminar este grupo de servicio.',
                {
                    cancel: 'Cancelar',
                    ok: 'Eliminar'
                }, function(answer)
                {
                    if (answer)
                    {
                        grpServResource.delete({id: data.id}).$promise.
                        then(
                            function (data) {
                                console.log("Borrado!!" + data);
                                LxNotificationService.success('Grupo de servicio, Eliminado satisfactoriamente!!!');
                                $scope.listGS = grpServResource.query();
                                $scope.fgrpserv = [];
                                //$location.path("/dashboard");
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                            },function (data) {
                                self.LinearProgress = helperFunc.toogleStatus(self.LinearProgress);
                                self.sendbutton = helperFunc.toogleStatus(self.sendbutton);
                                console.log("Error!!" + data.toString());
                            }
                        )
                    }
                    else
                    {
                        LxNotificationService.error('Disagree');
                        this.LinearProgress = helperFunc.toogleStatus(this.LinearProgress);
                        this.sendbutton = helperFunc.toogleStatus(this.sendbutton);
                    }
                });

        }
        /********** deleteGrpServ ********/


    }]);