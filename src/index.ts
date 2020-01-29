/// <reference path="../typings/tsd.d.ts" />
class PositronHomeAppController implements ng.IController {
	public $onInit() {}
    public isChrome: boolean;

    constructor(
        pipSystemInfo: pip.services.ISystemInfo,
    ) {
        "ngInject";

        this.isChrome = pipSystemInfo.browserName == 'chrome' && pipSystemInfo.os == 'windows';
    }
}

angular
    .module('iqsPositronHomeApp', [
        'iqsPositronHome.Config',
        'iqsPositronHome.Templates',
        'iqsOrganizations.Service',
		'iqsHome'
    ])
    .controller('iqsPositronHomeAppController', PositronHomeAppController);


