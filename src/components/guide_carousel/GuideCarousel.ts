interface IGuideCarouselBindings {
    [key: string]: any;

    ngDisabled: any;
    guide: any;
    page: any;
    duration: any;
    maxWidth: any;
    navigation: any;
    pagination: any;
}

const GuideCarouselBindings: IGuideCarouselBindings = {
    ngDisabled: '<?',
    guide: '<?guide',
    page: '=?page',
    duration: '<?duration',
    maxWidth: '<?maxWidth',
    navigation: '<?',
    pagination: '<?'
}

class GuideCarouselController implements ng.IController {
    public $onInit() { }

    public ngDisabled: boolean;
    public guide: pip.guidance.Guide;
    public page: number;
    public duration: number;
    public maxWidth: number;
    public navigation: boolean;
    public pagination: boolean;

    public language: string;

    private timerId: any;
    private timeoutPromise: any;

    constructor(
        pipPictureData: pip.pictures.IPictureDataService,
        pipTranslate: pip.services.ITranslateService,
        $element: JQuery,
        public pipMedia: pip.layouts.IMediaService,
        private $timeout: ng.ITimeoutService
    ) {
        this.page = this.page || 0;
        if (this.guide && Array.isArray(this.guide.pages)) {
            for (const page of this.guide.pages) {
                if (page.pic_id) {
                    page.pic_uri = pipPictureData.getPictureUrl(page.pic_id);
                }
            }
        }
        this.duration = this.duration || 5000;
        this.language = pipTranslate.language || 'en';
        this.navigation = typeof this.navigation === 'undefined' ? true : this.navigation;
        this.pagination = typeof this.pagination === 'undefined' ? true : this.pagination;
        $element.addClass('iqs-guide-carousel');
        $element.on('mouseover', () => {
            if(this.timeoutPromise) this.$timeout.cancel(this.timeoutPromise);
        });
        $element.on('mouseleave', this.setNextSlideTimeout.bind(this));
        this.setNextSlideTimeout();
    }

    public resetTimeout() {
        if (this.timerId) clearTimeout(this.timerId);
        this.timerId = setTimeout(function run() {
            this.onNextPage();
            this.timerId = setTimeout(run.bind(this), this.duration);
        }.bind(this), this.duration);
    }

    private setNextSlideTimeout() {
        if(!this.duration || !this.guide || !Array.isArray(this.guide.pages) || this.guide.pages.length < 2) return;
        if(this.timeoutPromise) this.$timeout.cancel(this.timeoutPromise);
        this.timeoutPromise = this.$timeout(function() {
            this.onNextPage();
            this.setNextSlideTimeout();
        }.bind(this), this.duration);
    }

    public onNextPage() {
        this.onSetPage(this.page + 1);
    }

    public onPrevPage() {
        this.onSetPage(this.page - 1);
    }

    public onSetPage(page: number) {
        if (!this.guide || !Array.isArray(this.guide.pages) || !this.guide.pages.length) return;
        this.page = page < 0 ? this.guide.pages.length - 1 : page % this.guide.pages.length;
    }
}

(() => {
    function declareGuideCarouselStringResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            'GUIDE_CAROUSEL_DETAILS': 'Details... >'
        });
        pipTranslateProvider.translations('ru', {
            'GUIDE_CAROUSEL_DETAILS': 'Узнать больше... >'
        });
    }

    angular.module('iqsGuideCarousel', [])
        .component('iqsGuideCarousel', {
            bindings: GuideCarouselBindings,
            templateUrl: 'components/guide_carousel/GuideCarousel.html',
            controller: GuideCarouselController,
            controllerAs: '$ctrl'
        })
        .config(declareGuideCarouselStringResources);
})();