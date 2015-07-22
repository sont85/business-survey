'use strict';
var app = angular.module('Survey', ['ui.router']);
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('questions', {
    url: '/',
    templateUrl: '../html/surveyQuestion.html',
    controller: 'MainCtrl'
  })
  .state('hypothesis', {
    url: '/hypothesis/:code',
    templateUrl: '../html/hypothesis.html',
    controller: 'MainCtrl'
  })
  .state('answers', {
    url: '/answer/:code',
    templateUrl: '../html/surveyAnswer.html',
    controller: 'AnswerCtrl'
  });
});

app.service('httpService', function($http, $stateParams, $location) {
  let self = this;
  this.question = null;
  this.getQuestion = function() {
    return $http.get('getQuestion/'+$stateParams.code);
  };
  this.postAnswer = function(answer) {
    $http.post('submitAnswer/'+$stateParams.code, answer)
    .success(function(response){
      console.log(response);
    }).catch(function(err){
      console.log(err);
    });
  };
  this.submitQuestion = function(question) {
    $http.post('submitQuestion/', question)
    .success(function(response){
      self.question = response;
      $location.url('/hypothesis/'+response.code);
    }).catch(function(err){
      console.log(err);
    });
  };
});
app.controller('MainCtrl', function($scope, httpService){
  httpService.getQuestion()
  .success(function(data){
    $scope.idea = data;
  }).catch(function(err){
    console.log(err);
  });
  $scope.submitQuestion = function() {
    httpService.submitQuestion($scope.question);
  };

});
app.controller('AnswerCtrl', function($scope, httpService, $stateParams){
  console.log($stateParams.code);
  httpService.getQuestion()
  .success(function(data){
    $scope.question = data;
    console.log(data);
  }).catch(function(err){
    console.log(err);
  });
  $scope.submitAnswers =function () {
    console.log($scope.answer);
    httpService.postAnswer($scope.answer);
    $scope.answer = '';
    $scope.thankyou = !$scope.thankyou;
  };
});
