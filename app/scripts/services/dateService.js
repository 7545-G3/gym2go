'use strict'

angular
  .module('exposureBusinessApp')
  .factory('dateService', dateService);

function dateService() {

  return {
    getMonths: getMonths,
    getYears: getYears,
    getYesterday: getYesterday,
    format: format
  }

  function getMonths() {

    var months = [
      {number: "01", name: "January"},
      {number: "02", name: "February"},
      {number: "03", name: "March"},
      {number: "04", name: "April"},
      {number: "05", name: "May"},
      {number: "06", name: "June"},
      {number: "07", name: "July"},
      {number: "08", name: "August"},
      {number: "09", name: "September"},
      {number: "10", name: "October"},
      {number: "11", name: "November"},
      {number: "12", name: "December"}
    ];

    return months;
  }

  function getYears(start, length, reverse) {

    if (!start) {
      start = parseInt(new Date().getFullYear());
    }

    var years = [];

    for (var i = start; i < start + length; i++) {
      years.push(i);
    }

    return reverse ? years.reverse() : years;
  }

  function getYesterday() {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() -1);
    return new Date(yesterday);
  }

  function format(date) {
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear().toString().substr(-2);
  }
}