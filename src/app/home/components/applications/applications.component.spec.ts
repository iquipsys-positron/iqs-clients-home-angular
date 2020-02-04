import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { ApplicationTile, ApplicationGroup, WINDOW, WindowWrapper } from 'iqs-libs-clientshell2-angular';

import { ApplicationsComponent } from './applications.component';
import { AppModule } from '../../../app.module';
import { HomeModule } from '../../home.module';

describe('ApplicationsComponent', () => {
    let component: ApplicationsComponent;
    let fixture: ComponentFixture<ApplicationsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule,
                HomeModule
            ],
            providers: [
                {
                    provide: WINDOW,
                    useValue: {
                        location: {
                            origin: '',
                            href: ''
                        }
                    },
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should trigger animated flag', fakeAsync(() => {
        component.ngOnChanges({ groups: new SimpleChange(undefined, [0], true) });
        expect(component.isAnimated).toBeFalsy();
        component.ngOnChanges({ groups: new SimpleChange(undefined, [0, 1], true) });
        tick(1001);
        expect(component.isAnimated).toBeTruthy();
    }));

    it('should track items', () => {
        expect(component.trackByName(<ApplicationGroup>{ name: 'name'})).toEqual('name');
        expect(component.trackByName(<ApplicationGroup>{})).toEqual(null);
        expect(component.trackByName(null)).toEqual(null);
        expect(component.trackByName(undefined)).toEqual(null);

        expect(component.trackById(<ApplicationTile>{ id: 'id'})).toEqual('id');
        expect(component.trackById(<ApplicationTile>{})).toEqual(null);
        expect(component.trackById(null)).toEqual(null);
        expect(component.trackById(undefined)).toEqual(null);
    });

    it('should open application', () => {
        const w: WindowWrapper = TestBed.get(WINDOW);
        let currentHref: string;
        expect(w.location.href).toEqual(w.location.origin);
        component.openApplication(<ApplicationTile>{ url: '/test' });
        currentHref = w.location.origin + '/test';
        expect(w.location.href).toEqual(currentHref);
        component.openApplication(<ApplicationTile>{});
        expect(w.location.href).toEqual(currentHref);
        component.openApplication(null);
        expect(w.location.href).toEqual(currentHref);
        component.openApplication(undefined);
        expect(w.location.href).toEqual(currentHref);
        component.openApplication(<ApplicationTile>{ url: '/another' });
        currentHref = w.location.origin + '/another';
        expect(w.location.href).toEqual(currentHref);
    });

    it('should check custom icons', () => {
        const icons = ['default', 'non-default', undefined, null];
        const expected = [false, true, false, false];
        for (let i = 0; i < icons.length; i++) {
            expect(component.isCustomIcon(icons[i])).toEqual(expected[i]);
        }
    });

    it('should call toggleFavorite from service', () => {
        const tfSpy = spyOn((<any>component)['applicationsService'], 'toggleFavorite');
        component.toggleFavorite(new MouseEvent(''), <ApplicationTile>{});
        expect(tfSpy).toHaveBeenCalledTimes(1);
        expect(tfSpy).toHaveBeenCalledWith(<ApplicationTile>{});
        component.toggleFavorite(new MouseEvent(''), null);
        expect(tfSpy).toHaveBeenCalledTimes(1);
        expect(tfSpy).toHaveBeenCalledWith(<ApplicationTile>{});
    });

    it('should capture resize events and emit own', () => {
        const resizedSpy = spyOn(component.resized, 'emit');
        const widths = [0, 200, undefined, null];
        const expected = [0, 200, 200, 200];
        const resizedCalled = [true, true, false, false];
        for (let i = 0; i < widths.length; i++) {
            component.onResize(widths[i]);
            expect(component.width).toEqual(expected[i]);
            if (resizedCalled[i]) {
                expect(resizedSpy).toHaveBeenCalled();
                expect(resizedSpy).toHaveBeenCalledWith(widths[i]);
            }
        }
    });
});
