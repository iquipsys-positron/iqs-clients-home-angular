import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EntityState, IqsApplicationsService, ApplicationGroup, ApplicationTile } from 'iqs-libs-clientshell2-angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { HomeContainerComponent } from './home-container.component';
import { AppModule } from '../../../app.module';
import { HomeModule } from '../../home.module';

class MockApplicationsService {

    private _error$ = new BehaviorSubject<any>(null);
    private _groups$ = new BehaviorSubject<ApplicationGroup[]>([]);
    private _state$ = new BehaviorSubject<EntityState>(EntityState.Empty);

    public get error$(): Observable<any> {
        return this._error$.asObservable();
    }

    public get error(): any {
        return this._error$.getValue();
    }

    public set error(val: any) {
        this._error$.next(val);
    }

    public get groups$(): Observable<ApplicationGroup[]> {
        return this._groups$.asObservable();
    }

    public get groups(): ApplicationGroup[] {
        return this._groups$.getValue();
    }

    public set groups(val: ApplicationGroup[]) {
        this._groups$.next(val);
    }

    public get state$(): Observable<EntityState> {
        return this._state$.asObservable();
    }

    public get state(): EntityState {
        return this._state$.getValue();
    }

    public set state(val: EntityState) {
        this._state$.next(val);
    }

    public init() { }
}

describe('HomeContainerComponent', () => {
    let component: HomeContainerComponent;
    let fixture: ComponentFixture<HomeContainerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule,
                HomeModule
            ],
            providers: [
                {
                    provide: IqsApplicationsService,
                    useClass: MockApplicationsService
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create and init', () => {
        const applicationsService: MockApplicationsService = TestBed.get(IqsApplicationsService);
        const initSpy = spyOn(applicationsService, 'init');
        expect(component).toBeTruthy();
        component.ngOnInit();
        expect(initSpy).toHaveBeenCalled();
    });

    it('should watch for language changes', () => {
        const translate: TranslateService = TestBed.get(TranslateService);
        translate.use('ru');
        expect(component.language).toEqual('ru');
    });

    it('should resize', () => {
        const widths = [0, 200, undefined, null];
        const expected = [0, 200, 200, 200];
        for (let i = 0; i < widths.length; i++) {
            component.onResize(widths[i]);
            expect(component.width).toEqual(expected[i]);
        }
    });

    it('should update groups', fakeAsync(() => {
        const applicationsService: MockApplicationsService = TestBed.get(IqsApplicationsService);
        applicationsService.groups = [
            <ApplicationGroup>{
                name: 'fav',
                applications: [
                    <ApplicationTile>{ id: 'test_1', name: { 'en': 'test 1' }, isHidden: false, product: 'iq' }
                ],
                isHidden: false
            }
        ];
        tick(100);
        let componentGroups: ApplicationGroup[];
        component.filteredGroups$.subscribe(g => componentGroups = g);
        expect(componentGroups).toEqual(applicationsService.groups);
        component.language = 'en';
        component.search$.next('te');
        component.filteredGroups$.subscribe(g => componentGroups = g);
        expect(componentGroups).toEqual(applicationsService.groups);
        component.search$.next('tu');
        component.filteredGroups$.subscribe(g => componentGroups = g);
        expect(componentGroups).toEqual([
            <ApplicationGroup>{
                name: 'fav',
                applications: [
                    <ApplicationTile>{ id: 'test_1', name: { 'en': 'test 1' }, isHidden: true, product: 'iq' }
                ],
                isHidden: true
            }
        ]);
    }));

    it('should catch errors', () => {
        const applicationsService: MockApplicationsService = TestBed.get(IqsApplicationsService);
        const snackbarSpy = spyOn((<any>component)['snackBar'], 'open');
        applicationsService.error = 'test';
        expect(snackbarSpy).toHaveBeenCalled();
        expect(snackbarSpy).toHaveBeenCalledWith(
            'test',
            undefined,
            { horizontalPosition: 'left', verticalPosition: 'bottom', duration: 2000, panelClass: 'pip-error-snackbar' }
        );
    });
});
