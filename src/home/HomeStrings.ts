{
    function declareHomeTranslateResources(pipTranslateProvider: pip.services.ITranslateProvider) {
        pipTranslateProvider.translations('en', {
            HOME_SEARCH: 'Search...',

            HOME_CATEGORY_FAVOURITES: 'Favorites',
            HOME_CATEGORY_APPS: 'Applications',
            HOME_CATEGORY_ANALYTICS: 'Analytics',
            HOME_CATEGORY_ADMINISTRATION: 'Administration',
            HOME_CATEGORY_CONFIG: 'Configurations',
            HOME_CATEGORY_OTHER: 'Other',
        });
        pipTranslateProvider.translations('ru', {
            HOME_SEARCH: 'Найти...',

            HOME_CATEGORY_FAVOURITES: 'Избранное',
            HOME_CATEGORY_APPS: 'Приложения',
            HOME_CATEGORY_ANALYTICS: 'Аналитика',
            HOME_CATEGORY_ADMINISTRATION: 'Администрирование',
            HOME_CATEGORY_CONFIG: 'Конфигурации',
            HOME_CATEGORY_OTHER: 'Прочее',
        });
    }

    angular
        .module('iqsHome')
        .config(declareHomeTranslateResources);
}