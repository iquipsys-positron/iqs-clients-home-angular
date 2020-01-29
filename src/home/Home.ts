import { filter } from 'lodash';

export const HomeStateName: string = 'app';

class HomeController implements ng.IController {
    public $onInit() { }

    /**
     * Guide for the carousel
     */
    public guide: pip.guidance.Guide;

    /**
     * Complete categories list
     */
    public categories: iqs.shell.ApplicationCategory[];
    /**
     * Filtered categories list
     */
    public filteredCategories: iqs.shell.ApplicationCategory[];
    /**
     * Current language
     */
    public language: string;
    /**
     * Width of mansory tiles panel
     */
    public mansoryhWidth: number;
    /**
     * Focused flag for filter input
     */
    public searchFocused: boolean;
    /**
     * Placeholder for filter input
     */
    public searchPlaceholder: string = 'HOME_SEARCH';
    /**
     * Filter text
     */
    public searchText: string = '';
    /**
     * Loaded flag
     */
    public isLoaded: boolean = false;
    /**
     * Cleanup function
     */
    private cf: Function[] = [];

    constructor(
        $injector: angular.auto.IInjectorService,
        $scope: ng.IScope,
        pipTranslate: pip.services.ITranslateService,
        private pipMedia: pip.layouts.IMediaService,
        private $rootScope: ng.IRootScopeService,
        private pipGuideData: pip.guidance.IGuideDataService,
        private pipNavService: pip.nav.INavService,
        private iqsApplicationsViewModel: iqs.shell.IApplicationsViewModel
    ) {
        "ngInject";

        this.language = pipTranslate.language;
        this.pipGuideData.readGuide('e98866226742485698bc13ecb0900053', (guide: pip.guidance.Guide) => {
            this.guide = guide;
        });

        const runWhenReady = () => {
            this.categories = this.iqsApplicationsViewModel.categories;
            this.filterTiles(this.searchText);
            this.isLoaded = true;
        }

        if (this.isPreloaded) {
            runWhenReady();
        }

        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => {
            if (!this.isPreloaded) return;
            runWhenReady();
        }));

        this.cf.push(this.$rootScope.$on(pip.layouts.LayoutResizedEvent, ($event, newSize) => {
            if (newSize) this.mansoryhWidth = newSize;
        }));

        this.appHeader();
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    public get isPreloaded(): boolean {
        return this.iqsApplicationsViewModel.state === iqs.shell.States.Data;
    }

    public onTileClick(app: iqs.shell.ApplicationTile) {
        if (app.url) {
            window.location.href = window.location.origin + app.url;
        }
    }

    public toggleTileFavourite(app: iqs.shell.ApplicationTile) {
        this.iqsApplicationsViewModel.toggleFavourite(app);
        this.filterTiles(this.searchText);
    }

    public filterTiles(searchText: string) {
        const search = searchText.trim().toLowerCase();
        if (search.length) {
            const r = new RegExp(search, 'i');
            this.filteredCategories = [];
            for (const category of this.categories) {
                const filteredTiles = filter(category.tiles, it => r.test(it.name[this.language]));
                if (filteredTiles.length) {
                    this.filteredCategories.push({
                        key: category.key,
                        tiles: filteredTiles
                    });
                }
            }
        } else {
            this.filteredCategories = this.categories;
        }
    }

    private appHeader(): void {
        this.pipNavService.appbar.parts = { 'icon': true, 'menu': true, 'actions': 'primary', 'title': 'breadcrumb', 'organizations': this.pipMedia('gt-sm') };
        this.pipNavService.breadcrumb.text = 'LANDING_NAME';
        this.pipNavService.actions.hide();
        this.pipNavService.appbar.removeShadow();
        this.pipNavService.icon.showMenu();
    }
}

function configureHomeRoute(
    $injector: angular.auto.IInjectorService,
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(HomeStateName, {
            url: '/app',
            auth: true,
            views: {
                '@': {
                    controller: HomeController,
                    controllerAs: '$ctrl',
                    templateUrl: 'home/Home.html'
                }
            }
        });
}

angular
    .module('iqsHome', ['iqsGuideCarousel'])
    .config(configureHomeRoute);