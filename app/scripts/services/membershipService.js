'use strict'

angular
  .module('exposureBusinessApp')
  .factory('membershipService', membershipService)


/** @ngInject */
function membershipService(apiResolver, npService) {
  var that = this
  that.membership = {}
  return {
    createMembership: createMembership,
    getAds: getAds,
    createAd: createAd,
    activeNextAd: activeNextAd,
    getCategories: getCategories,
    getAdsLibrary: getAdsLibrary,
    replaceAd: replaceAd,
    removeAdFromLibrary: removeAdFromLibrary,
    setMembership: setMembership,
    getCurrentMembership: getCurrentMembership,
    updateAd: updateAd,
    updateAutorenewFlag: updateAutorenewFlag
  }

  function createMembership(nonProfitId, planId, autoRenew) {
    return apiResolver.resolve('memberships.create@post', {
      non_profit_id: nonProfitId,
      plan_id: planId,
      auto_renew: autoRenew
    })
  }

  function createAd(membershipId, adData) {
    adData.membershipId = membershipId
    return apiResolver.resolve('memberships.createAd@post', adData)
  }

  function getAds(membershipId, scheduled) {
    return apiResolver.resolve('memberships.getAds@get', {membershipId: membershipId, scheduled: scheduled})
  }

  function getAdsLibrary() {
    return apiResolver.resolve('adsLibrary@get')
  }

  function removeAdFromLibrary(adId) {
    return apiResolver.resolve('removeAd@delete', {adId: adId})
  }

  function activeNextAd(membershipId) {
    return apiResolver.resolve('memberships.activeNextAd@post', {membershipId: membershipId})
  }

  function getCategories() {
    return apiResolver.resolve('categories@get')
  }
  
  function replaceAd(membershipId, adId) {
    return apiResolver.resolve('memberships.replaceAd@post', {membershipId: membershipId, template_id: adId})
  }

  function setMembership(membership) {
    that.membership = membership
  }

  function getCurrentMembership() {
    return that.membership
  }

  function updateAd(membershipId, adData) {
    adData.membershipId = membershipId
    return apiResolver.resolve('memberships.updateAd@put', adData)
  }

  function updateAutorenewFlag(membershipId, autoRenew) {
    return apiResolver.resolve('memberships.updateAutoRenew@put', {membershipId: membershipId, auto_renew: autoRenew})
  }
}