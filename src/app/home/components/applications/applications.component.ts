import { Component, OnChanges, Input, Output, EventEmitter, SimpleChanges, Inject } from '@angular/core';
import { ApplicationGroup, IqsApplicationsService, ApplicationTile, WINDOW, WindowWrapper } from 'iqs-libs-clientshell2-angular';
import { TranslateService } from '@ngx-translate/core';
import { PipMediaService } from 'pip-webui2-layouts';

import { homeApplicationsTranslations } from './applications.strings';

@Component({
    selector: 'iqs-applications',
    templateUrl: './applications.component.html',
    styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnChanges {

    public keys = Object.keys;
    public width = 0;
    public isAnimated = false;

    @Input() groups: ApplicationGroup[];
    @Input() language: string;

    @Output() resized = new EventEmitter<number>();

    constructor(
        @Inject(WINDOW) private window: WindowWrapper,
        private translate: TranslateService,
        private applicationsService: IqsApplicationsService,
        public media: PipMediaService,
    ) {

        this.translate.setTranslation('en', homeApplicationsTranslations.en, true);
        this.translate.setTranslation('ru', homeApplicationsTranslations.ru, true);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['groups'] && Array.isArray(changes['groups'].currentValue) && changes['groups'].currentValue.length > 1) {
            setTimeout(() => {
                this.isAnimated = true;
            }, 1000);
        }
    }

    public trackByName(group: ApplicationGroup) {
        return group && group.name || null;
    }

    public trackById(app: ApplicationTile) {
        return app && app.id || null;
    }

    public openApplication(app: ApplicationTile) {
        if (!app || !app.url) { return; }
        this.window.location.href = this.window.location.origin + app.url;
    }

    public isCustomIcon(name: string) {
        return name && name.includes('-') ? true : false;
    }

    public toggleFavorite(event: Event, app: ApplicationTile) {
        event.stopPropagation();
        if (app) {
            this.applicationsService.toggleFavorite(app);
        }
    }

    public onResize(tilesLayoutSize: number) {
        if (typeof tilesLayoutSize !== 'undefined' && tilesLayoutSize !== null) {
            this.width = tilesLayoutSize;
            this.resized.emit(this.width);
        }
    }

}
