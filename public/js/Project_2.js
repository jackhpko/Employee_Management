var module = angular.module('myApp', ['angularUtils.directives.dirPagination','ngRoute','infinite-scroll','flow']);

module.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/Create', {
                    templateUrl: 'create.html',
                    controller: 'createCtrl'
                }).
                when('/Edit/:id', {
                    templateUrl: 'edit.html',
                    controller: 'editCtrl'
                }).
                when('/getDetail/:id', {
                    templateUrl: 'userDetail.html',
                    controller: 'detailCtrl'
                }).
                when('/getReport/:id', {
                    templateUrl: 'employee.html',
                    controller: 'reportCtrl'
                }).
                when('/getManager/:id', {
                    templateUrl: 'employee.html',
                    controller: 'managerCtrl'
                }).

                when('/', {
                    templateUrl: 'employee.html',
                    controller: 'userCtrl'
                }).
                otherwise({
                    redirectTo: '/'
                });
        }]);



module.service('userService', function($http){
    this.createUser = function($scope){
        if($scope.managerId == '-1'){
                managerId = null;
        }
        else{
                managerId = $scope.managerId;
        }
        var newUser = {
            id: Number($scope.maxId)+1,
            fName : $scope.fName,
            lName : $scope.lName, 
            title : $scope.title,
            age : $scope.age,
            sex : $scope.sex,
            phone : $scope.phone,
            email : $scope.email,
            managerId: $scope.managerId
        };
        $http.post('/employee', newUser).success(function (response){
            console.log(response);
        });
    };

    this.deleteUser = function(id){
        $http.delete('/employee/' + id).success(function (response){
            console.log(response);
        });
    }; 

    this.editUser = function($scope){
        if( $scope.managerId == '-1'){
                managerId = null;
            }
        else {
                managerId = $scope.managerId;
            }
        var editInfo = {
            //id: $scope.id,
            fName : $scope.fName,
            lName : $scope.lName, 
            title : $scope.title,
            age : $scope.age,
            sex : $scope.sex,
            phone : $scope.phone,
            email : $scope.email,
            managerId: $scope.managerId
        };
        $http.put('/employee/' + $scope.id, editInfo).success(function (response){
            console.log(response);
        });
    };

    this.getById = function($scope){
        $http.get('/employee/' + $scope.id).then(function (response){
            console.log(response.data);
            $scope.currentUser = response.data[0];
            $scope.fName = $scope.currentUser.fName;
            $scope.lName = $scope.currentUser.lName; 
            $scope.title = $scope.currentUser.title;
            $scope.age = $scope.currentUser.age;
            $scope.sex = $scope.currentUser.sex;
            $scope.phone = $scope.currentUser.phone;
            $scope.email = $scope.currentUser.email;
            $scope.managerId = $scope.currentUser.managerId;
            $scope.managerName = $scope.currentUser.managerName;
            $scope.report = $scope.currentUser.report;
            $scope.imgPath = $scope.currentUser.imgPath;
        });
    };

    this.getList = function($scope){
        $http.get('/employee').success(function (response){
            console.log(response);
            $scope.users = response;
            $scope.maxId = $scope.users[$scope.users.length - 1].id;
        });
    };

    this.getManagerList = function($scope){
        $http.get('/manager/' + $scope.id).success(function (response){
            console.log(response);
            $scope.users = response;
        });
    };

    this.getReportTo = function($scope){
        $http.get('/getReport/' + $scope.id).success(function (response){
            console.log(response);
            $scope.users = response;
        });
    }; 

    this.getManager = function($scope){
        $http.get('/employee/' + $scope.id).success(function (response){
            console.log(response);
            $scope.users = response;
        });
    };

    this.uploadImg = function(img, $scope){
        var id = Number($scope.maxId) + 1;
        var fd = new FormData();
        fd.append('img', img.file);
        $http.post('/upload/' + id, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(response){
            console.log(response);
        })
        .error(function(){
        });
    };

    this.changeImg = function(img, $scope){
        var fd = new FormData();
        fd.append('img', img.file);
        $http.post('/upload/' + $scope.id, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
            console.log(response);
        })
        .error(function(){
        });
    };

});     

module.controller("userCtrl", function($scope,$location,userService) {
    userService.getList($scope); 

    $scope.deleteUser= function(id){
        userService.deleteUser(id);
        $scope.users = userService.getList($scope);
    }

    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.backto = function(){
        window.history.back();
    }

    $scope.limitNum = 5;
    $scope.loadMore = function(limitNum){
        $scope.limitNum += 5;
    }

    $scope.goTop = function(){
        window.scrollTo(0, 0);
    }
});

module.controller("detailCtrl", function($scope,$routeParams,$location,userService) {
    $scope.id = $routeParams.id;
    userService.getById($scope);  

    $scope.backto = function(){
        window.history.back();
    }

    $scope.mailfunction = function(email){
        window.location.href = "mailto:" + email;
    }

    $scope.cellfunction = function(phone){
        window.location.assign("facetime://+1" + phone);
    }
});


module.controller("reportCtrl", function($scope,$routeParams,$location,userService) {
    $scope.id = $routeParams.id;
    $scope.users = userService.getReportTo($scope);  

    $scope.deleteUser= function(id){
        userService.deleteUser(id);
        $scope.users = userService.getList($scope);
    }

    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.backto = function(){
        window.history.back();
    }

    $scope.goTop = function(){
        window.scrollTo(0, 0);
    }
});

module.controller("managerCtrl", function($scope,$routeParams,$location,userService) {
    $scope.id = $routeParams.id;
    $scope.users = userService.getManager($scope);  

    $scope.deleteUser= function(id){
        userService.deleteUser(id);
        $scope.users = userService.getList($scope);
    }

    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.backto = function(){
        $location.path('/');
    }
});


module.controller("createCtrl", function($scope, $location, userService) {  
    $scope.users = userService.getList($scope);
    $scope.fName = '';
    $scope.lName = '';
    $scope.title = '';
    $scope.age = '';
    $scope.sex = '';
    $scope.phone = '';
    $scope.email = '';
    $scope.managerId = '';
    $scope.notconfirm = true;
    $scope.nofile = true;

    $scope.$watch('fName',function() {$scope.test();});
    $scope.$watch('lName',function() {$scope.test();});
    $scope.$watch('title',function() {$scope.test();});
    $scope.$watch('age',function() {$scope.test();});
    $scope.$watch('sex',function() {$scope.test();});
    $scope.$watch('phone',function() {$scope.test();});
    $scope.$watch('email',function() {$scope.test();});
    $scope.$watch('managerId', function() {$scope.test();});

    $scope.test = function() {
        $scope.phoneCheck = checkMobile($scope.phone);
        $scope.emailCheck = checkMail($scope.email);
        if($scope.phoneCheck || $scope.phone.length == 0 ){
            $scope.phoneError = false;
        } else $scope.phoneError = true;
        if($scope.emailCheck || $scope.email.length == 0 ){
            $scope.emailError = false;
        } else $scope.emailError = true;
        if( $scope.fName.length > 0 && $scope.lName.length > 0 && $scope.title.length > 0 && $scope.age.length > 0 
            && $scope.sex.length > 0 && $scope.phone.length > 0 && $scope.email.length > 0 
            && $scope.phoneCheck && $scope.emailCheck)
        $scope.notconfirm = false;
    };

    $scope.addfile = function() {
        $scope.nofile = false;
    }

    $scope.saveChanges = function (img){
        userService.uploadImg(img, $scope);
        userService.createUser($scope);
        $location.path('/');
    }

    $scope.cancel = function(){
        $location.path('/');
    }
});


module.controller("editCtrl", function($scope,$location,$routeParams,userService) {
    $scope.id = $routeParams.id;
    $scope.users = userService.getManagerList($scope); 
    userService.getById($scope);     

    $scope.fName = '';
    $scope.lName = '';
    $scope.title = '';
    $scope.age = '';
    $scope.sex = '';
    $scope.phone = '';
    $scope.email = '';
    $scope.managerId = '';
    $scope.notconfirm = true;
    // $scope.nofile =true;

    $scope.$watch('fName',function() {$scope.test();});
    $scope.$watch('lName',function() {$scope.test();});
    $scope.$watch('title',function() {$scope.test();});
    $scope.$watch('age',function() {$scope.test();});
    $scope.$watch('sex',function() {$scope.test();});
    $scope.$watch('phone',function() {$scope.test();});
    $scope.$watch('email',function() {$scope.test();});
    $scope.$watch('managerId', function() {$scope.test();});

    $scope.test = function() {
        $scope.phoneCheck = checkMobile($scope.phone);
        $scope.emailCheck = checkMail($scope.email);
        if($scope.phoneCheck || $scope.phone.length == 0 ){
            $scope.phoneError = false;
        } else $scope.phoneError = true;
        if($scope.emailCheck || $scope.email.length == 0 ){
            $scope.emailError = false;
        } else $scope.emailError = true;
        if( $scope.fName.length > 0 && $scope.lName.length > 0 && $scope.title.length > 0 && $scope.age.length > 0 
            && $scope.sex.length > 0 && $scope.phone.length > 0 && $scope.email.length > 0 
            && $scope.managerId.length > 0 && $scope.phoneCheck && $scope.emailCheck)
        $scope.notconfirm = false;
    };

    $scope.editChange = function(img){
        userService.changeImg(img, $scope);
        userService.editUser($scope);
        $location.path('/');
    }

    $scope.cancel = function(){
        $location.path('/');
    }
});


function checkMobile(str) {
    RegularExp=/^[0-9]{10}$/
    if (RegularExp.test(str)) {
        return true;
    }
    else {
        return false;
    }
};

function checkMail(str){
    RegularExp = /[a-z0-9]*@[a-z0-9]*\.[a-z0-9]+/gi
    if (RegularExp.test(str)){
        return true;
    }else{
        return false;
    }
};

function limitImage(ImgD){    
    var areaWidth = 50;    
    var areaHeight = 50;   
    var image=new Image();    
    image.src=ImgD.src;    
    if(image.width>0 && image.height>0){       
        if(image.width/image.height>= areaWidth/areaHeight){    
            if(image.width>areaWidth){    
                ImgD.width=areaWidth;    
                ImgD.height=(image.height*areaWidth)/image.width;    
            }else{    
                ImgD.width=image.width;    
                ImgD.height=image.height;    
            }    
            ImgD.alt=image.width+"×"+image.height;    
        }else{    
            if(image.height>areaHeight){    
                ImgD.height=areaHeight;    
                ImgD.width=(image.width*areaHeight)/image.height;    
            }else{    
                ImgD.width=image.width;    
                ImgD.height=image.height;    
            }    
            ImgD.alt=image.width+"×"+image.height;    
        }    
    }    
};

function limituploadImage(ImgD){    
    var areaWidth = 200;    
    var areaHeight = 200;   
    var image=new Image();    
    image.src=ImgD.src;    
    if(image.width>0 && image.height>0){       
        if(image.width/image.height>= areaWidth/areaHeight){    
            if(image.width>areaWidth){    
                ImgD.width=areaWidth;    
                ImgD.height=(image.height*areaWidth)/image.width;    
            }else{    
                ImgD.width=image.width;    
                ImgD.height=image.height;    
            }    
            ImgD.alt=image.width+"×"+image.height;    
        }else{    
            if(image.height>areaHeight){    
                ImgD.height=areaHeight;    
                ImgD.width=(image.width*areaHeight)/image.height;    
            }else{    
                ImgD.width=image.width;    
                ImgD.height=image.height;    
            }    
            ImgD.alt=image.width+"×"+image.height;    
        }    
    }    
};
