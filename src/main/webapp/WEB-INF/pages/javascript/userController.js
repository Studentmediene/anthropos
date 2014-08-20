/**
 * Created by Kristian on 05/03/14.
 */
app.controller("UserCtrl", function($scope, $resource, $http, $modal) {


    $scope.mailsSelected = [];
    $scope.myGroups = [];

    var tmpObj = $resource("mailingLists.json", {}, {
            get:{
                isArray:true,
                method:"GET"
            }
        }
    );
    $scope.mailingList = tmpObj.get();

    var tmpObj = $resource("groups.json", {}, {
            get:{
                isArray:true,
                method:"GET"
            }
        }
    );
    $scope.allGroups = tmpObj.get();



    /** MAILING LIST **/
    $scope.checkAll = function() {
        $scope.mailsSelected = $scope.mailingList.concat();
    };
    $scope.uncheck = function() {
        $scope.mailsSelected = [];
    };
    $scope.isChecked = function(mail) {

        if (_.contains($scope.mailsSelected, mail)) {
            console.log("HEI");
            return 'icon-ok pull-right';
        }
        return false;
    };

    $scope.mailSelection = function(mail) {
        if(!_.contains($scope.mailsSelected, mail)) {
            $scope.mailsSelected.push(mail);
        }
        else {
            var index = $scope.mailsSelected.indexOf(mail);
            $scope.mailsSelected.splice(index, 1);
        }
    }


    /** ADD GROUPS **/

    $scope.groupIsChecked = function(group) {
        if (_.contains($scope.myGroups, group)) {
            return 'icon-ok pull-right';
        }
        return false;
    };

    $scope.groupSelection = function(group) {
        if(!_.contains($scope.myGroups, group)) {
            $scope.myGroups.push(group);
        }
        else {
            var index = $scope.myGroups.indexOf(group);
            $scope.myGroups.splice(index, 1);
        }
    }

    $scope.hoverable = false;
    $scope.test = "HEI";

    $scope.editGroups = function() {
        if(!$scope.edit) {
            $scope.edit = true;
            $scope.hoverable = true;
            return;
        }
        $scope.edit = false;
        $scope.hoverable = false;
    }

    $scope.createHover = function() {
        if($scope.hoverable) {
            return'tableSelection'
        }
        return null;
    }

    $scope.editable = function() {
        if($scope.edit) {
            return "icon-remove-sign pull-right";
        }
        return null;
    }


    $scope.validateNumber = function() {
        console.log("val");
        var fieldInput = document.getElementById('mobile').value;
        console.log(fieldInput);
        for (var i = 0; i < fieldInput.length; i++) {
            if (fieldInput.charCodeAt(i) < 47 || fieldInput.charCodeAt(i) > 58) {
                console.log("Ikke gyldig input");
                document.getElementById('mobile').value = document.getElementById('mobile').value.substring(0, fieldInput.length-1);
                return false;
            }
            else {

            }
        }
    }


    $scope.explanation = "Følgende felter er ikke utfylt: "
    $scope.showExplanation = "";
    $scope.save = function() {
        $scope.insufficientList = [];
        if ( document.getElementById('name').value.length < 2 ) {
            $scope.insufficientList.push('Fornavn');
        }
        if ( document.getElementById('surname').value.length < 2 ) {
            $scope.insufficientList.push('Etternavn');
        }
        if ( document.getElementById('username').value.length < 2 ) {
            $scope.insufficientList.push('Brukernavn');
        }
        if ( document.getElementById('email').value.length < 6 ) {
            $scope.insufficientList.push('Email');
        }
        if ( document.getElementById('mobile').value.length < 8 ) {
            $scope.insufficientList.push('Mobilnummer');
        }
        if($scope.insufficientList.length > 0) {
            $scope.showExplanation = $scope.explanation;
        }
        else {
            $scope.showExplanation = "";
            <!-- TODO: create json and send to backend -->
            if(confirm("Er du sikker på at du vil lagre endringer?")) {
                console.log("JA");
                var user =  {

                    "firstName":document.getElementById('name').value,
                    "lastName":document.getElementById('surname').value,
                    "username":document.getElementById('username').value,
                    "email":document.getElementById('email').value,
                    "mobil e":document.getElementById('mobile').value,
                    "groups":$scope.myGroups,
                    "mailingList":$scope.mailsSelected

                };
                <!-- TODO: send dette til backend -->
<!--
                $http({
                    method: 'POST',
                    url: 'add',
                    data: "message=" +"HEISANN",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
-->
<!--
                $resource("add", user, {
                        save:{
                            method:"POST"
                        }
                    }
                );
-->

                $http.post('add', '{ "firstName": "moi"}');
                history.go(-1);

            }
        }
    }
    var modalInstance;
    $scope.editPassword = function() {
            modalInstance = $modal.open({
            templateUrl: 'editPw.html',
            controller: 'UserCtrl'

        });

    }



    $scope.changePassword = function() {
        var oldpass = document.getElementById('oldpass').value;
        var newpass = document.getElementById('newpass').value;
        var confpass = document.getElementById('confpass').value;
        console.log(newpass);
        console.log(confpass);

        if ( newpass == confpass && newpass.length >7) {
            console.log("Equals and greater than 7");
            modalInstance.close("OK");
        }
    }



    $scope.cancel = function () {
        modalInstance.dismiss('cancel');

    };

    $scope.remove = function(group) {
        if($scope.edit) {
            var index = $scope.groups.indexOf(group);
            $scope.groups.splice(index, 1);
        }
    }


    mailSort = function(mailingList) {
        mailingList.sort(function(a, b){   /** By first sorting by forname, people with same surname will get sorted automatically #latskap **/
            if(a.name < b.name) return -1;
            if(a.name > b.name) return 1;
            return 0;
        });
    };



});