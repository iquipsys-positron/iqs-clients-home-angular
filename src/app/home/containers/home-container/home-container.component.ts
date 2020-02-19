import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import cloneDeep from 'lodash/cloneDeep';
import { ApplicationGroup, IqsApplicationsService, EntityState } from 'iqs-libs-clientshell2-angular';
import { Observable, BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PipMediaService } from 'pip-webui2-layouts';
import { PipNavService } from 'pip-webui2-nav';

import { HomeContainerTranslations } from './home-container.strings';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'iqs-home-container',
    templateUrl: './home-container.component.html',
    styleUrls: ['./home-container.component.scss']
})
export class HomeContainerComponent implements OnInit, OnDestroy {

    private subs: Subscription = new Subscription();

    public language: string;
    public searchControl = new FormControl();
    public width = 0;

    public filteredGroups$: Observable<ApplicationGroup[]>;
    public search$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public state$: Observable<EntityState>;

    constructor(
        private applicationsService: IqsApplicationsService,
        private snackBar: MatSnackBar,
        private translate: TranslateService,
        private navService: PipNavService,
        public media: PipMediaService
    ) {
        this.navService.showTitle('Home');
        this.state$ = this.applicationsService.state$;

        this.language = this.translate.currentLang;
        this.subs.add(this.translate.onLangChange.subscribe(payload => this.language = payload.lang));

        this.translate.setTranslation('en', HomeContainerTranslations.en, true);
        this.translate.setTranslation('ru', HomeContainerTranslations.ru, true);
        this.subs.add(this.applicationsService.error$
            .pipe(filter(error => error !== null))
            .subscribe(error => {
                this.snackBar.open(
                    error.message || error,
                    undefined,
                    { horizontalPosition: 'left', verticalPosition: 'bottom', duration: 2000, panelClass: 'pip-error-snackbar' }
                );
            }));
    }

    ngOnInit() {
        // this.applicationsService.init();
        this.filteredGroups$ = combineLatest(
            this.applicationsService.groups$,
            this.search$
        ).pipe(
            map(([groups, search]) => this.filterGroups(groups, search))
        );
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    filterGroups(groups: ApplicationGroup[], search: string) {
        search = search.trim().toLowerCase();
        if (search.length) {
            const r = new RegExp(search, 'i');
            const filtered = cloneDeep(groups);
            for (const group of filtered) {
                let hided = 0;
                for (const app of group.applications) {
                    app.isHidden = !r.test(app.name[this.language]);
                    if (app.isHidden) {
                        hided++;
                    }
                }
                group.isHidden = hided === group.applications.length;
            }
            return filtered;
        } else {
            return groups;
        }
    }

    onResize(tileLayoutWidth: number) {
        if (typeof tileLayoutWidth !== 'undefined' && tileLayoutWidth !== null) {
            this.width = tileLayoutWidth;
        }
    }

}
